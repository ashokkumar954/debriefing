/*
** Oracle Field Service BHM - Bulk Health Metrics plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
'use strict';

define(['constants'], (Constants) => {

    class FusionRestApiTransport {

        /**
         * @param {string} baseUrl  - Fusion REST API base URL (e.g. https://host.fa.oraclecloud.com)
         * @param {object} ofscConnector - OfscConnector instance (must have obtainToken method)
         */
        constructor(baseUrl, ofscConnector) {
            if (!baseUrl || typeof baseUrl !== 'string') {
                throw new Error('FusionRestApiTransport: baseUrl must be a non-empty string');
            }
            if (!ofscConnector || typeof ofscConnector.obtainToken !== 'function') {
                throw new Error('FusionRestApiTransport: ofscConnector must have an obtainToken method');
            }
            this._baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
            this._ofscConnector = ofscConnector;
        }

        /**
         * Make an authenticated REST request to Fusion.
         * Obtains a fresh OAuth Bearer token via KEY_EXT before each call.
         *
         * @param {string} path         - Path relative to baseUrl (e.g. '/fscmRestApi/resources/...')
         * @param {string} method       - HTTP method (use FusionRestApiTransport.HTTP_METHOD_*)
         * @param {object} [queryParams] - Key/value pairs appended as query string
         * @param {object} [headers]    - Additional headers (Authorization is added automatically)
         * @param {string} [bodyData]   - Request body string (for POST/PATCH)
         * @returns {Promise<object>}   - Parsed JSON response
         */
        async request(path, method, queryParams, headers, bodyData) {
            let tokenResult;
            try {
                tokenResult = await this._ofscConnector.obtainToken(Constants.KEY_EXT);
            } catch (e) {
                throw new Error(Constants.ERR_AUTHENTICATION);
            }
            // obtainToken resolves with resultData which is an object { token: '...' }
            const token = (tokenResult && typeof tokenResult === 'object')
                ? (tokenResult.token || tokenResult.accessToken || tokenResult.access_token || '')
                : String(tokenResult || '');

            const mergedHeaders = Object.assign({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }, headers, {
                'Authorization': 'Bearer ' + token
            });

            return this._doRequest(path, method, queryParams, bodyData, mergedHeaders);
        }

        /**
         * Internal: performs the actual fetch call and handles status codes.
         *
         * @param {string} path
         * @param {string} method
         * @param {object} [queryParams]
         * @param {string} [bodyData]
         * @param {object} [headers]
         * @returns {Promise<object>} Parsed JSON
         */
        async _doRequest(path, method, queryParams, bodyData, headers) {
            const url = this._buildUrl(path, queryParams);

            const options = { method, headers };
            if (bodyData && method !== FusionRestApiTransport.HTTP_METHOD_GET) {
                options.body = bodyData;
            }

            const response = await fetch(url, options);

            if (response.status >= 200 && response.status < 300) {
                if (response.status === 204) return {};
                return response.json();
            }

            throw new Error(Constants.ERR_SERVER + response.status);
        }

        /**
         * Internal: same as _doRequest but returns the raw Response (for non-JSON endpoints).
         *
         * @param {string} path
         * @param {string} method
         * @param {object} [queryParams]
         * @param {string} [bodyData]
         * @param {object} [headers]
         * @returns {Promise<Response>}
         */
        async _doRequestForNonJsonResponse(path, method, queryParams, bodyData, headers) {
            const url = this._buildUrl(path, queryParams);

            const options = { method, headers };
            if (bodyData && method !== FusionRestApiTransport.HTTP_METHOD_GET) {
                options.body = bodyData;
            }

            const response = await fetch(url, options);

            if (response.status >= 200 && response.status < 300) {
                return response;
            }

            throw new Error(Constants.ERR_SERVER + response.status);
        }

        /**
         * @param {string} path
         * @param {object} [queryParams]
         * @returns {string} Full URL with query string
         */
        _buildUrl(path, queryParams) {
            let url = this._baseUrl + path;
            if (queryParams && Object.keys(queryParams).length > 0) {
                // URLSearchParams encodes '=' as '%3D', breaking Fusion's q=Field=Value syntax.
                // Encode each value with encodeURIComponent then restore literal '=' signs.
                const qs = Object.keys(queryParams)
                    .map(k => encodeURIComponent(k) + '=' +
                              encodeURIComponent(queryParams[k]).replace(/%3D/gi, '='))
                    .join('&');
                url += '?' + qs;
            }
            return url;
        }

        static get HTTP_METHOD_GET()  { return 'GET';   }
        static get HTTP_METHOD_POST() { return 'POST';  }
        static get HTTP_METHOD_PATCH(){ return 'PATCH'; }
        static get POST_DATA_TYPE_JSON() { return 'json'; }
        static get POST_DATA_TYPE_FORM() { return 'form'; }
    }

    return FusionRestApiTransport;
});
