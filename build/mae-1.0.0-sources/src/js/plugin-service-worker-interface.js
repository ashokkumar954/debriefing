/*
** Oracle Field Service Sample plugin
**
** Copyright (c) 2023 Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

let logServiceWorkerMessage = () => {
};
let serviceWorkerRegistrationMutexName = 'mutex-root-service-worker-registration';
let requiredRootServiceWorkerVersion = 'NA';
let serviceWorkerScriptPath = 'plugin-service-worker.js';
let serviceWorkerScope = '/';

let GET_SERVICE_WORKER_VERSION_TIME_LIMIT = 5000;
let CACHE_RESOURCES_TIME_LIMIT = 30000;
let SW_ACTIVATION_TIME_LIMIT = 10000;
let REGISTRATION_WAITING_TIME_LIMIT = 10000;

class PluginServiceWorkerInterface {
    /**
     * If parameters cacheName and cacheVersion are null (by default) - the hosted plugin's id and version will be used.
     * Do not use custom cacheName and cacheVersion for plugins hosted at OFS platform.
     *
     * @param {string} serviceWorkerScriptPath Relative path to the service worker script.
     * @param {string} cacheManifestPath Relative path to the .appcache manifest file.
     * @param {string|null} [cacheName] Plugin identifier for cache storage. Can't contain # symbol. Do not use for OFS hosted plugin.
     * @param {number|null} [cacheVersion] Plugin version for cache storage. Do not use for OFS hosted plugin.
     * @returns {Promise<{
     * cache: {
     *  status: string,
     *  cacheName: string,
     *  cacheVersion: string,
     *  cachedItems: string[],
     *  failedItems: {asset: string, error: number, errorText: string}[],
     *  [failReason]: string,
     *  serviceWorkerVersion: string
     * },
     * serviceWorkerRegistration: ServiceWorkerRegistration,
     * serviceWorker: ServiceWorker
     * }>}
     */
    static async cacheViaCacheManifest(serviceWorkerScriptPath, cacheManifestPath, cacheName=null, cacheVersion=null) {
        if (!navigator.locks) {
            throw new Error("Web Locks API is not supported");
        }

        return await navigator.locks.request(serviceWorkerRegistrationMutexName, async (lock) => {
            const {
                serviceWorker,
                serviceWorkerRegistration
            } = await this.getActualServiceWorkerAndRegistration(serviceWorkerScriptPath);

            // cache plugin's resources via cache manifest:

            const cacheResultData = await postMessageToServiceWorkerViaMessageChannel(serviceWorker, createCacheRequest({
                type: 'CACHE_VIA_CACHE_MANIFEST',
                path: cacheManifestPath
            }, cacheName, cacheVersion), CACHE_RESOURCES_TIME_LIMIT);

            const cacheResult = cacheResultData.result;

            return {cache: cacheResult, serviceWorkerRegistration, serviceWorker};
        });
    }

    /**
     * If parameters cacheName and cacheVersion are null (by default) - the hosted plugin's id and version will be used.
     * Do not use custom cacheName and cacheVersion for plugins hosted at OFS platform.
     *
     * @param {string} serviceWorkerScriptPath Relative path to the service worker script.
     * @param {string} resourcesList List of resources to be cached.
     * @param {string|null} [cacheName] Plugin identifier for cache storage. Can't contain # symbol. Do not use for OFS hosted plugin.
     * @param {number|null} [cacheVersion] Plugin version for cache storage. Do not use for OFS hosted plugin.
     * @returns {Promise<{
     * cache: {
     *  status: string,
     *  cacheName: string,
     *  cacheVersion: string,
     *  cachedItems: string[],
     *  failedItems: {asset: string, error: number, errorText: string}[],
     *  [failReason]: string,
     *  serviceWorkerVersion: string
     * },
     * serviceWorkerRegistration: ServiceWorkerRegistration,
     * serviceWorker: ServiceWorker
     * }>}
     */
    static async cacheResourcesList(serviceWorkerScriptPath, resourcesList, cacheName=null, cacheVersion=null) {
        if (!navigator.locks) {
            throw new Error("Web Locks API is not supported");
        }

        return await navigator.locks.request(serviceWorkerRegistrationMutexName, async (lock) => {
            const {
                serviceWorker,
                serviceWorkerRegistration
            } = await this.getActualServiceWorkerAndRegistration(serviceWorkerScriptPath);

            // cache plugin's resources:

            const cacheResultData = await postMessageToServiceWorkerViaMessageChannel(serviceWorker, createCacheRequest({
                type: 'CACHE_RESOURCES_LIST',
                resourcesList
            }, cacheName, cacheVersion), CACHE_RESOURCES_TIME_LIMIT);

            const cacheResult = cacheResultData.result;

            return {cache: cacheResult, serviceWorkerRegistration, serviceWorker};
        });
    }

    /**
     * @param serviceWorkerScriptPath
     * @returns {Promise<{serviceWorker: ServiceWorker, serviceWorkerRegistration: ServiceWorkerRegistration}>}
     */
    static async getActualServiceWorkerAndRegistration(serviceWorkerScriptPath) {
        if (!navigator.serviceWorker) {
            throw new Error("Service workers are not supported");
        }

        let serviceWorker = await this.registerOrGetRootServiceWorker(serviceWorkerScriptPath);
        const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration();

        logServiceWorkerMessage(`Active service worker: ${serviceWorker.scriptURL}, state: ${serviceWorker.state}, scope: ${serviceWorkerRegistration.scope}`);

        serviceWorker = await this.actualizeServiceWorker(serviceWorker, serviceWorkerScriptPath);
        logServiceWorkerMessage(`Actualized service worker state: ${serviceWorker.state}`);

        return {serviceWorker, serviceWorkerRegistration};
    }

    /**
     * @returns {Promise<ServiceWorker>}
     */
    static async registerOrGetRootServiceWorker(serviceWorkerScriptPath) {
        let registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
            logServiceWorkerMessage('Service worker registration is obtained');
            return this.waitUntilServiceWorkerIsActivated(registration);
        }

        logServiceWorkerMessage('Service worker registration is absent');

        // no service worker is registered - check mutex in localStorage and if it isn't locked - register one
        const newRegistration = await this.registerServiceWorker(serviceWorkerScriptPath);
        if (!newRegistration) {
            logServiceWorkerMessage(`Waiting registration of the service worker by another plugin`);
            // some another plugin is already registering root service worker, wait till it's registered:
            const registration = await this.waitForServiceWorkerRegistration();
            return registration.active;
        }
        logServiceWorkerMessage(`Service worker is registered`);
        return this.waitUntilServiceWorkerIsActivated(newRegistration);
    }

    static async actualizeServiceWorker(serviceWorker, serviceWorkerScriptPath) {
        logServiceWorkerMessage(`Requesting service worker version...`);
        const serviceWorkerVersionData = await postMessageToServiceWorkerViaMessageChannel(serviceWorker, {
            type: 'GET_VERSION'
        }, GET_SERVICE_WORKER_VERSION_TIME_LIMIT);
        const serviceWorkerVersion = serviceWorkerVersionData.result;
        logServiceWorkerMessage(`Required service worker version: ${requiredRootServiceWorkerVersion}`);
        logServiceWorkerMessage(`Current service worker version: ${serviceWorkerVersion}`);

        if (this.isServiceWorkerVersionNeedsToBeUpdated(serviceWorkerVersion)) {
            logServiceWorkerMessage(`The service worker has to be updated`);
            // service worker has to be updated
            let newRegistration;
            try {
                newRegistration = await this.registerServiceWorker(serviceWorkerScriptPath);
            } catch (e) {
                // an error has happened when trying to update service worker.
                if (e && e.message === 'Job rejected for non app-bound domain') {
                    // fix for iOS webview
                    // the service worker already exists but it can't be updated.
                    // let's remove existing service worker and register it again.
                    logServiceWorkerMessage(`Unable to update Service Worker. ${e.message}.`);
                    logServiceWorkerMessage(`Attempting to remove Service Worker and register it again.`);

                    const registrations = await navigator.serviceWorker.getRegistrations();
                    if (!registrations) {
                        throw e;
                    }

                    await Promise.all(
                        registrations.map(
                            registration => {
                                logServiceWorkerMessage(`Removing Service Worker Registration for scope "${registration.scope}"`);
                                return registration.unregister();
                            }
                        )
                    );

                    newRegistration = await this.registerServiceWorker(serviceWorkerScriptPath);
                } else {
                    throw e;
                }
            }

            if (!newRegistration) {
                logServiceWorkerMessage(`Waiting registration of the service worker by another plugin`);
                // some other plugin is already updating service worker, wait till it's ready
                newRegistration = await this.waitForServiceWorkerRegistration();
                logServiceWorkerMessage(`Obtained service worker registration`);
                return this.actualizeServiceWorker(await this.waitUntilServiceWorkerIsActivated(newRegistration), serviceWorkerScriptPath);
            } else {
                return this.waitUntilServiceWorkerIsActivated(newRegistration);
            }
        }

        logServiceWorkerMessage(`The service worker version is actual`);

        return serviceWorker;
    }

    /**
     * If null is returned then the service worker is being registered by another plugin.
     * @returns {Promise<null|ServiceWorkerRegistration>}
     */
    static async registerServiceWorker(serviceWorkerScriptPath) {
        logServiceWorkerMessage('Registering new service worker');
        const options = {};
        if (serviceWorkerScope) {
            options.scope = serviceWorkerScope;
        }
        const newRegistration = await navigator.serviceWorker.register(serviceWorkerScriptPath, options);
        logServiceWorkerMessage(`New service worker is registered. Scope: ${newRegistration.scope}`);
        return newRegistration;
    }

    /**
     * @returns {Promise<ServiceWorkerRegistration>}
     */
    static waitForServiceWorkerRegistration() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Registration waiting time limit is reached'));
            }, REGISTRATION_WAITING_TIME_LIMIT);
            navigator.serviceWorker.ready.then((registration) => {
                clearTimeout(timeout);
                return resolve(registration);
            });
        });
    }

    /**
     * @param {number|string} version
     * @returns {boolean}
     */
    static isServiceWorkerVersionNeedsToBeUpdated(version) {
        if (isNaN(requiredRootServiceWorkerVersion) && requiredRootServiceWorkerVersion !== version) {
            return true;
        }

        if (!isNaN(requiredRootServiceWorkerVersion) && !isNaN(version)) {
            const intVersion = parseInt(version, 10);
            const intRequiredVersion = parseInt(requiredRootServiceWorkerVersion, 10);

            if (intVersion < intRequiredVersion) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {ServiceWorker} serviceWorker
     * @returns {Promise<ServiceWorker>}
     */
    static async waitServiceWorkerToBecomeActive(serviceWorker) {
        if (serviceWorker.state === "activated") {
            return serviceWorker;
        }

        logServiceWorkerMessage(`Service worker: ${serviceWorker.scriptURL}, state: ${serviceWorker.state}. Waiting for Service Worker to be activated`);

        let previousState = serviceWorker.state;

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                serviceWorker.onstatechange = null;
                reject(new Error('Service Worker activation time limit is reached'));
            }, SW_ACTIVATION_TIME_LIMIT);

            serviceWorker.onstatechange = () => {
                logServiceWorkerMessage(`Service Worker state change ${previousState} -> ${serviceWorker.state}`);

                if (serviceWorker.state === 'activated') {
                    clearTimeout(timeout);
                    serviceWorker.onstatechange = null;
                    return resolve(serviceWorker);
                }

                if (serviceWorker.state === 'redundant') {
                    serviceWorker.onstatechange = null;
                    return reject('Service Worker became redundant');
                }
            };
        });
    }

    /**
     * @param registration
     * @returns {Promise<void>}
     */
    static async waitUntilServiceWorkerIsActivated(registration) {
        let serviceWorker = registration.active;

        if (registration.installing) {
            return this.waitServiceWorkerToBecomeActive(registration.installing);
        } else if (registration.waiting) {
            return this.waitServiceWorkerToBecomeActive(registration.waiting);
        }

        logServiceWorkerMessage(`Service worker is ready: ${serviceWorker.scriptURL}, state: ${serviceWorker.state}`);

        return serviceWorker;
    }

    static getServiceWorkerRegistrationMutexName() {
        return serviceWorkerRegistrationMutexName;
    }

    static setServiceWorkerRegistrationMutexName(name) {
        serviceWorkerRegistrationMutexName = name;
    }

    static getRequiredRootServiceWorkerVersion() {
        return requiredRootServiceWorkerVersion;
    }

    static setRequiredRootServiceWorkerVersion(version) {
        requiredRootServiceWorkerVersion = version;
    }

    static setLogMessageFunction(fn) {
        logServiceWorkerMessage = fn;
    }

    static getServiceWorkerVersionTimeLimit() {
        return GET_SERVICE_WORKER_VERSION_TIME_LIMIT;
    }

    static setServiceWorkerVersionTimeLimit(value) {
        GET_SERVICE_WORKER_VERSION_TIME_LIMIT = value;
    }

    static getCacheResourcesTimeLimit() {
        return CACHE_RESOURCES_TIME_LIMIT;
    }

    static setCacheResourcesTimeLimit(value) {
        CACHE_RESOURCES_TIME_LIMIT = value;
    }

    static getServiceWorkerActivationTimeLimit() {
        return SW_ACTIVATION_TIME_LIMIT;
    }

    static setServiceWorkerActivationTimeLimit(value) {
        SW_ACTIVATION_TIME_LIMIT = value;
    }

    static getRegistrationWaitingTimeLimit() {
        return REGISTRATION_WAITING_TIME_LIMIT;
    }

    static setRegistrationWaitingTimeLimit(value) {
        REGISTRATION_WAITING_TIME_LIMIT = value;
    }

    static getRootServiceWorkerScriptPath() {
        return serviceWorkerScriptPath;
    }

    static setRootServiceWorkerScriptPath(path) {
        serviceWorkerScriptPath = path;
    }

    static getServiceWorkerScope() {
        return serviceWorkerScope;
    }

    static setServiceWorkerScope(value) {
        serviceWorkerScope = value;
    }
}

function createCacheRequest(request, cacheName, cacheVersion) {
    if (cacheName !== null && cacheVersion !== null && !isNaN(cacheVersion) && cacheName.indexOf('#') < 0) {
        request.cacheName = cacheName;
        request.cacheVersion = parseInt(cacheVersion, 10);
    }
    return request;
}

/**
 * @param {ServiceWorker} serviceWorker
 * @param {Object} content
 * @param {number} [timeLimit=5000]
 * @returns {Promise<Object>}
 */
function postMessageToServiceWorkerViaMessageChannel(serviceWorker, content, timeLimit = 5000) {
    return new Promise((resolve, reject) => {
        if (content && content.type) {
            logServiceWorkerMessage(`Sending ${content.type} message to service worker ${serviceWorker.scriptURL} ...`);
        }
        let isProcessed = false;
        const timeLimitTimeout = setTimeout(() => {
            if (!isProcessed) {
                reject(new Error(`Time limit of ${timeLimit}ms is reached`));
            }
        }, timeLimit);

        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            clearTimeout(timeLimitTimeout);
            const data = event && event.data;
            logServiceWorkerMessage(`Received response for ${content.type} message from service worker ${serviceWorker.scriptURL}`);
            isProcessed = true;
            resolve(data);
        };
        serviceWorker.postMessage(content, [messageChannel.port2]);
    });
}

if (window.define && window.define.amd) {
    // amd anonymous module
    define([], () => PluginServiceWorkerInterface);
} else if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS/Node.js
    module.exports = PluginServiceWorkerInterface;
} else {
    // global namespace
    window.PluginServiceWorkerInterface = PluginServiceWorkerInterface;
}