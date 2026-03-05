/*
** Oracle Field Service Plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
"use strict";
define(['signals','constants'], (Signal, Constants) => {
    const OFSC_API_VERSION = 1;
    const DEFAULT_COMMUNICATION_KEY = 'default';

    class OfscConnector {
        constructor() {
            window.addEventListener("message", this.onPostMessage.bind(this), false);

            this.debugMessageSentSignal = new Signal();
            this.debugMessageReceivedSignal = new Signal();
            this.debugIncorrectMessageReceivedSignal = new Signal();

            this.messageFromOfscSignal = new Signal();

            this._currentCommunicationCallbacks = {};
            this._currentCommunicationPromises = {};
        }

        /**
         * @param {Object} data
         * @returns {Promise.<*>}
         */
        sendMessage(data) {

            const originUrl = this._getOriginUrl();
            let arrayKey = this._getKey(data);
            let _currentCommunicationPromise = '';
            if(data.method != Constants.CALL_PROC && this._currentCommunicationPromises[DEFAULT_COMMUNICATION_KEY]) {
                return Promise.reject(new Error('Communication chanel is busy'));
            } else {
                _currentCommunicationPromise = this._processDataAndReturn(data, originUrl, arrayKey);
                this._currentCommunicationPromises[arrayKey] = (_currentCommunicationPromise);
            }
            return _currentCommunicationPromise;
        }

        _getOriginUrl() {
            return document.referrer || (document.location.ancestorOrigins && document.location.ancestorOrigins[0]) || '';
        }

        _processDataAndReturn(data, originUrl, key) {
            return new Promise((resolve, reject) => {
                let _currentCommunicationCallback = (responseData) => {
                    this._deleteCallbacksAndPromises(key)
                    if (responseData instanceof Error || (responseData.method && responseData.method === 'error')) {
                        return reject(responseData);
                    }
                    return resolve(responseData);
                };
                this._currentCommunicationCallbacks[key] = _currentCommunicationCallback;
                data.apiVersion = OFSC_API_VERSION;
                let targetOrigin = originUrl ? this.constructor._getOrigin(originUrl) : '*';
                parent.postMessage(data, targetOrigin);
                this.debugMessageSentSignal.dispatch(data);
            });
        }

        _deleteCallbacksAndPromises(key) {
            if (this._currentCommunicationCallbacks[key]) {
                delete this._currentCommunicationCallbacks[key];
            }
            if (this._currentCommunicationPromises[key]) {
                delete this._currentCommunicationPromises[key];
            }
        }

        _getKey(data) {
            let key = DEFAULT_COMMUNICATION_KEY;
            if(data.method === 'callProcedure' || data.method === 'callProcedureResult' || (data.method === 'error' && data.callId)) {
                key = (data && data.callId)? data.callId.toString(): '';
            }
            return key;
        }


        onPostMessage(event) {
            // Ignore internal JET messages
            if (event.source === window) {
                return;
            }
            if (typeof event.data === 'undefined') {
                this.debugIncorrectMessageReceivedSignal.dispatch("No data");
                this.setError();
                return false;
            }
            let data = "";
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                this.setError();
                this.debugIncorrectMessageReceivedSignal.dispatch("Incorrect JSON", event.data);
                return false;
            }
            this.debugMessageReceivedSignal.dispatch(data);
            this.processResult(data);
        }

        setError() {
            if (this._currentCommunicationCallbacks[DEFAULT_COMMUNICATION_KEY]) {
                this._currentCommunicationCallbacks[DEFAULT_COMMUNICATION_KEY](new Error('No data'));
            }
        }

        processResult(data) {
            let key = this._getKey(data)
            if (this._currentCommunicationCallbacks[key]) {
                this._currentCommunicationCallbacks[key](data);
            } else {
                this.messageFromOfscSignal.dispatch(data);
            }
        }

        static generateCallId() {
            return btoa(String.fromCharCode.apply(null, window.crypto.getRandomValues(new Uint8Array(16))));
        }

        static _getOrigin(url) {
            if (typeof url === 'string' && url !== '') {
                if (url.indexOf("://") > -1) {
                    return (window.location.protocol || 'https:') + url.split('/')[2];
                } else {
                    return (window.location.protocol || 'https:') + url.split('/')[0];
                }
            }

            return '';
        }

        obtainToken(key) {
            return new Promise((resolve, reject) => {
                let currentCallId = this.constructor.generateCallId();
                this.sendMessage({
                    method: 'callProcedure',
                    callId: currentCallId,
                    procedure: 'getAccessToken',
                    params: {
                        applicationKey: key
                    }
                }).then((data) => {
                    if (!data.resultData) {
                        console.error('No data.resultData in callProcedure response');
                        return Promise.reject(data);
                    }
                    return resolve (data.resultData);
                }).catch((data) => {
                    return reject(data.errors);
                });

            })
        }

        obtainTokenByScope(scope) {
            return new Promise((resolve, reject) => {
                let currentCallId = this.constructor.generateCallId();
                this.sendMessage({
                    method: 'callProcedure',
                    callId: currentCallId,
                    procedure: 'getAccessTokenByScope',
                    params: {
                        scope: scope
                    }
                }).then((data) => {
                    if (!data.resultData) {
                        console.error('No data.resultData in callProcedure response');
                        return Promise.reject(data);
                    }
                    return resolve (data.resultData);
                }).catch((data) => {
                    if (data.method === 'error') {
                        return reject(data.errors);
                    }
                });

            })
        }

        shareFile(file) {
            return new Promise((resolve, reject) => {
                let currentCallId = this.constructor.generateCallId();
                this.sendMessage({
                    method: 'callProcedure',
                    callId: currentCallId,
                    procedure: 'share',
                    params: {
                        "title": "File",
                        "fileObject": file,
                        "text": "Sharing File"
                    }
                }).then((data) => {
                    if (!data.resultData) {
                        console.error('No data.resultData in callProcedure response');
                        return reject(data);
                    }
                    return resolve (data.resultData);
                }).catch((data) => {
                    return reject(data.errors);
                });

            })
        }

    }

    return OfscConnector;
});