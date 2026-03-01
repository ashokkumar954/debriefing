/**
 * @licence
 * Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
 * Oracle Technology Network Developer License Terms (http://www.oracle.com/technetwork/licenses/production-modify-license-2162709.html)
 */
define([

    '../utils/transport-error-type-constants',
    '../utils/parser',
    '../constants'
], (

    TRANSPORT_ERROR_TYPE,
    parser,
    Constants
) => {
    'use strict';

    const TRANSPORT_ERROR_CODES_MAP = {
        400: TRANSPORT_ERROR_TYPE.BAD_REQUEST,
        401: TRANSPORT_ERROR_TYPE.UNAUTHORIZED,
        403: TRANSPORT_ERROR_TYPE.LOW_ACCESS,
        409: TRANSPORT_ERROR_TYPE.CONFLICT,
        0: TRANSPORT_ERROR_TYPE.NO_NETWORK
    };

    const OFS_REST_ERROR_MESSAGES = {
        END_POINT_EMPTY: "endpoint must be a non-empty string",
    }

    class OfscRestApiTransport {

        static get HTTP_METHOD_POST() { return 'POST'; }
        static get HTTP_METHOD_PATCH() { return 'PATCH'; }
        static get HTTP_METHOD_PUT() { return 'PUT'; }
        static get HTTP_METHOD_GET() { return 'GET'; }

        static get POST_DATA_TYPE_JSON() { return 'json'; }
        static get POST_DATA_TYPE_FORM() { return 'form'; }

        constructor(endpoint, connector, scope) {

            if (!endpoint || (typeof endpoint !== 'string')) {
                throw new Error(OFS_REST_ERROR_MESSAGES.END_POINT_EMPTY + 401);
            }

            /**
             * @type {String}
             * @private
             */
            while (endpoint.endsWith('/')) {
                endpoint = endpoint.slice(0, -1);
            }
            this._endpoint = endpoint;
            this._connector = connector;
            /**
             * @type {String}
             * @private
             */
            this._token = null;

            this._scope = scope;

        }

        /**
         * @param path
         * @param getParams
         * @param method
         * @param {Object} [postData]
         * @param {String} [postDataType]
         * @returns {Promise.<Object>}
         */
        request(path, method = OfscRestApiTransport.HTTP_METHOD_GET, getParams = null, postData = null, postDataType = OfscRestApiTransport.POST_DATA_TYPE_JSON) {
            return this._renewToken().then(() => {
                return this.__doRequest(path, method, getParams, postData, {
                    'Authorization': 'Bearer ' + this._token
                }, postDataType);
            });
        }

        __doRequest(path, method, getParams, postData, headers, postDataType) {

            return new Promise((resolve, reject) => {
                let url = this._endpoint + '/' + path;
                let xhr = this._getXhr();
                url = this._constructUrl(method, getParams, url);
                xhr.open(method, url, true);

                Object.entries(headers).forEach(([headerName, headerValue]) => {
                    xhr.setRequestHeader(headerName, headerValue);
                });

                xhr.onreadystatechange = () => {
                    return this._getResolution.call(this, xhr, resolve, reject);
                };
                this._sendData(method, postDataType, postData, xhr);
            });
        }

        _getResolution(xhr, resolve, reject) {
            if (xhr.readyState === xhr.DONE) {
                if (this._isValidXhrStatus(xhr)) {
                    if (!xhr.responseText) {
                        return resolve('');
                    }

                    const json = parser.parseJSON(xhr.responseText, null);

                    if (json === null) {
                        return resolve('');
                    } else {
                        return resolve(json);
                    }
                }
                const errorInst = getTransportErrorInstance(xhr);

                return reject(errorInst);
            }
        }

        _renewToken() {
            return new Promise((resolve, reject) => {
                const isTokenExpired = (this._token && this._token.toString().includes(".")) ? Date.now() >= (JSON.parse(atob(this._token.split('.')[1]))).exp * 1000 : true;
                if (!isTokenExpired) {
                    return resolve();
                }
                const scope = this._scope;
                const obtainTokenMethod = scope ? 'obtainTokenByScope' : 'obtainToken';
                const tokenParams = scope ? scope : Constants.KEY_OFS_API_APP;

                this._connector[obtainTokenMethod](tokenParams).then((data) => {
                    this._token = data.token;
                    return resolve();
                }).catch(() => {
                    return reject("Auth Error");
                });
            });
        }


        _sendData(method, postDataType, postData, xhr) {
            if (this._isValidHttpMethod(method)) {
                if (postDataType === this.constructor.POST_DATA_TYPE_JSON) {
                    xhr.send(JSON.stringify(postData));
                } else {
                    xhr.send(this.constructor.__serializeFormParams(postData));
                }
            } else {
                xhr.send();
            }
        }

        _isValidXhrStatus(xhr) {
            return 200 === xhr.status || 201 === xhr.status || 204 === xhr.status;
        }

        _isValidHttpMethod(method) {
            return OfscRestApiTransport.HTTP_METHOD_POST === method ||
                OfscRestApiTransport.HTTP_METHOD_PATCH === method ||
                OfscRestApiTransport.HTTP_METHOD_PUT === method;
        }

        _constructUrl(method, getParams, url) {
            if (OfscRestApiTransport.HTTP_METHOD_GET === method && getParams) {
                let params = this.constructor.__serializeFormParams(getParams);

                if (-1 === url.indexOf('?')) {
                    url += '?';
                } else {
                    url += '&';
                }

                url += params;
            }
            return url;
        }

        _getXhr() {
            return new XMLHttpRequest();
        }

        static __serializeFormParams(params) {
            let paramsArray = [];

            Object.entries(params).forEach(([paramName, paramValue]) => {
                paramsArray.push(encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue));
            });

            return paramsArray.join('&');
        }
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @returns {TransportError}
     */
    function getTransportErrorInstance(xhr) {
        const errorCode = Number(xhr.status);
        const errorType = TRANSPORT_ERROR_CODES_MAP[errorCode] || TRANSPORT_ERROR_TYPE.UNKNOWN_ERROR;

        const errorJson = parser.parseJSON(xhr.responseText, null);

        if (errorJson) {
            return new Error(errorType + errorJson.detail + errorCode);
        } else {
            return new Error(errorType + errorCode);
        }
    }

    return OfscRestApiTransport;
});