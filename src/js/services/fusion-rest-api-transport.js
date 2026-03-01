/*
** Oracle Field Service Debrief plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
define([
    '../constants'
], (
    Constants
) => {
    'use strict';

    class FusionRestApiTransport {

        static get HTTP_METHOD_POST() { return 'POST'; }
        static get HTTP_METHOD_PATCH() { return 'PATCH'; }
        static get HTTP_METHOD_GET() { return 'GET'; }
        static get HTTP_METHOD_DELETE() { return 'DELETE'; }
        static get POST_DATA_TYPE_JSON() { return 'json'; }
        static get POST_DATA_TYPE_FORM() { return 'form'; }


        constructor(url, connector, scope) {

            if (!url || (typeof url !== 'string')) {
                throw new Error('endpoint must be a non-empty string' + 401);
            }

            /**
             * @type {String}
             * @private
             */
            while (url.endsWith('/')) {
                url = url.slice(0, -1);
            }
            this._endpoint = url;



            this._connector = connector;
            /**
             * @type {String}
             * @private
             */
            this._token = null;

            this._scope = scope;

        }

        request(path, method= this.constructor.HTTP_METHOD_GET, getParams = null,
                bodyData = null, headers = {}) {
            let headersWithAuth = null;
            return this._renewToken().then(() => {
                headersWithAuth = Object.assign({}, headers, {
                    'Authorization': 'Bearer ' + this._token
                });
                return path.indexOf("http") >= 0 || path.indexOf("https") >= 0 ?
                    this._doRequestForNonJsonResponse(path, method, getParams, bodyData, headersWithAuth) :
                    this._doRequest(path, method, getParams, bodyData, headersWithAuth);
            });
        }

        /**
         *
         * @param params
         * @returns {string}
         * @private
         */
        static __serializeFormParams(params) {
            let paramsArray = [];

            Object.entries(params).forEach(([paramName, paramValue]) => {
                paramsArray.push(encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue));
            });

            return paramsArray.join('&');
        }

        _doRequest(path, method, getParams, bodyData, headers) {

            return new Promise((resolve, reject) => {

                let url = this._endpoint + '/' + path;
                let xhr = this._getXhr();

                url = this.getUrlWithParams(getParams, url);
                xhr.open(method, url, true);

                Object.entries(headers).forEach(([headerName, headerValue]) => {
                    xhr.setRequestHeader(headerName, headerValue);
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200 || xhr.status === 201) {
                            try {
                                return resolve(JSON.parse(xhr.responseText));
                            } catch (e) {
                                return reject(e);
                            }
                        }
                        else if(xhr.status === 204)
                            resolve();
                        else if (xhr.status === 400)
                            return reject(new Error(xhr.responseText));

                        return reject(new Error(
                            'Server returned an error. HTTP Status: ' + xhr.status
                        ));
                    }
                };
                xhr.send(bodyData);
            });
        }


        _doRequestForNonJsonResponse(path, method, getParams, bodyData, headers) {

            return new Promise((resolve, reject) => {

                let url = path;
                let xhr = this._getXhr();

                url = this.getUrlWithParams(getParams, url);
                xhr.open(method, url, true);

                Object.entries(headers).forEach(([headerName, headerValue]) => {
                    xhr.setRequestHeader(headerName, headerValue);
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            try {
                                return resolve(xhr.responseText);
                            } catch (e) {
                                return reject(e);
                            }
                        }

                        return reject(new Error(
                            Constants.ERR_SERVER + xhr.status
                        ));
                    }
                };
                xhr.send(bodyData);
            });
        }

        _renewToken() {
            return new Promise((resolve, reject) => {
                const isTokenExpired = (this._token && this._token.toString().includes(".")) ? Date.now() >= (JSON.parse(atob(this._token.split('.')[1]))).exp * 1000 : true;
                if (!isTokenExpired) {
                    return resolve();
                }
                const scope = this._scope;
                const obtainTokenMethod = scope ? 'obtainTokenByScope' : 'obtainToken';
                const tokenParams = scope ? scope : Constants.KEY_OAUTH_USER_ASSERTION_APP;

                this._connector[obtainTokenMethod](tokenParams).then((data) => {
                    this._token = data.token;
                    return resolve();
                }).catch(() => {
                    return reject(Constants.ERR_AUTHENTICATION);
                });
            });
        }

        getUrlWithParams(getParams, url) {
            if (getParams) {
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

        /**
         *
         * @returns {XMLHttpRequest}
         * @private
         */
        _getXhr() {
            return new XMLHttpRequest();
        }

    }



    return FusionRestApiTransport;
});