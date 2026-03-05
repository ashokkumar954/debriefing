/*
** Oracle Field Service Plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
"use strict"

define([
    'knockout',
    '../errors/application-critical-error',
    'text!required-properties.json',
    'ofsc-connector',
    'storage/persistent-storage',
    'constants'
], (
    ko,
    ApplicationCriticalError,
    requiredProperties,
    OfscConnector,
    PersistentStorage,
    Constants
) => {

    class OfscPluginApiTransport {

        constructor() {
            this.ofscConnector = new OfscConnector();
            this.openData = ko.observable('');
            this.attributeDescriptionParam = ko.observable('');
            this._pluginApiMessage = {};

            this.ofscConnector.debugMessageReceivedSignal.add((data) => {
                console.info('-> Plugin: ', data);
            });

            this.ofscConnector.debugMessageSentSignal.add((data) => {
                console.info('<- Plugin: ', data);
            });

            this.ofscConnector.debugIncorrectMessageReceivedSignal.add((error, data) => {
                console.error('-> Plugin: incorrect message: ', error, data);
            });
        }

        terminatePlugin() {
            this.ofscConnector.sendMessage({
                method: 'close'
            }).then((data) => {
                console.log('RESPONSE DATA: ', data);
            }).catch(e => {
                console.error(e);
            });
        }

        load() {
            return new Promise((resolve, reject) => {
                this.ofscConnector.sendMessage({
                    method: 'ready',
                    sendInitData: true
                }).then((message) => {
                    switch (message.method) {
                        case 'init':
                            let attributeDescription = message.attributeDescription;
                            PersistentStorage.saveData('plugin_attributeDescription', attributeDescription);
                            this.ofscConnector.sendMessage({
                                method: 'initEnd',
                                wakeupNeeded: false
                            });
                            break;
                        case 'open':
                            this.openData(message);
                            this._pluginApiMessage = message;
                            this.attributeDescription = JSON.parse(window.localStorage.getItem('plugin_attributeDescription'));
                            this.attributeDescriptionParam(this.attributeDescription);
                            let errorsMsg = this._verifyProperties(requiredProperties, this.attributeDescription);
                            if (errorsMsg !== '') {
                                throw new ApplicationCriticalError(Constants.CRITICAL_ERROR, errorsMsg);
                            }
                            resolve();
                            break;
                    }
                }).catch((e) => {
                    if (e instanceof ApplicationCriticalError) {
                        return reject(e);
                    }
                    console.error(Constants.UNABLE_TO_START, e);
                });
            });
        }

        _verifyProperties(requiredPropertiesJSON, attributeDescription) {
            let config = JSON.parse(requiredPropertiesJSON).properties;
            let errorsArray = [];

            Object.values(config).forEach(property => {
                if (!attributeDescription[property.label]) {
                    errorsArray.push(property.label);
                }
            });

            if (!errorsArray.length) {
                return '';
            } else if (errorsArray.length === 1) {
                return Constants.PROPERTY_MUST_BE_CONFIGURED + errorsArray[0] + '.';
            } else {
                return Constants.PROPERTIES_MUST_BE_CONFIGURED + errorsArray.join(', ') + '.';
            }
        }

    }

    return OfscPluginApiTransport;
})
