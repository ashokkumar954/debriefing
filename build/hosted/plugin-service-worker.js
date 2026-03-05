/*
** Oracle Field Service Sample plugin
**
** Copyright (c) 2023 Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

const CACHE_IDENTIFIER_SEPARATOR = '#v'
const FETCH_RETRY_ATTEMPTS_NUMBER = 10;
const FETCH_RETRY_PAUSE = 1000;

// IMPORTANT: DON'T FORGET TO INCREASE SERVICE WORKER'S VERSION ON EACH CHANGE. OTHERWISE IT WON'T BE LOADED.
let VERSION = '240801';

if (!isNaN(VERSION)) {
    VERSION = parseInt(VERSION, 10);
}

addEventListener('message', async event => {
    const data = event.data || {};

    if (!data.type) {
        console.log("PLUGIN SERVICE WORKER: incorrect post message received", event.source.url, data);
        return;
    }

    if (!event.ports[0]) {
        console.log("PLUGIN SERVICE WORKER: post message without response port is received", event.source.url, data);
        return;
    }

    let result;

    switch (data.type) {
        case 'GET_VERSION':
            console.log(`PLUGIN SERVICE WORKER: Processing ${data.type}`, event.source.url, data);
            event.ports[0].postMessage({type: 'GET_VERSION_RESPONSE', result: VERSION});
            break;
        case 'CACHE_VIA_CACHE_MANIFEST':
            console.log(`PLUGIN SERVICE WORKER: Processing ${data.type}`, event.source.url, data);
            result = await cacheViaCacheManifestOrResourcesList(event.source.url, data.path, data.cacheName, data.cacheVersion);
            event.ports[0].postMessage({type: 'CACHE_VIA_CACHE_MANIFEST_RESPONSE', result});
            break;
        case 'CACHE_RESOURCES_LIST':
            console.log(`PLUGIN SERVICE WORKER: Processing ${data.type}`, event.source.url, data);
            result = await cacheViaCacheManifestOrResourcesList(event.source.url, data.resourcesList, data.cacheName, data.cacheVersion);
            event.ports[0].postMessage({type: 'CACHE_VIA_CACHE_MANIFEST_RESPONSE', result});
            break;
        default:
            console.log("PLUGIN SERVICE WORKER: unknown post message type received", event.source.url, data);
            break;
    }
});

addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('PLUGIN SERVICE WORKER INSTALLED: ' + location.href);
});

addEventListener('activate', (event) => {
    console.log('SERVICE WORKER ACTIVATED: ' + location.href);
});

addEventListener('fetch', e => {
    e.respondWith(
        (async function () {
            const fetchStrategy = chooseFetchStrategy(e.request);

            return fetchStrategy(e.request);
        }())
    );
});

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * @param assetUrl
 * @param params
 * @returns {Promise<{response: Response || null, asset: string, success: boolean, statusCode: integer, statusText: string}>}
 */
async function fetchAsset(assetUrl, params = {}) {
    let latestResponse;
    for (let retryCount = 0; retryCount < FETCH_RETRY_ATTEMPTS_NUMBER; ++retryCount) {
        try {
            const response = latestResponse = await fetch(assetUrl, params);

            switch (response.status) {
                case 200:
                    return {
                        response: response,
                        asset: assetUrl,
                        success: true,
                        statusCode: response.status,
                        statusText: response.statusText
                    }
                case 502:
                case 503:
                    // the server is not ready yet, retry after a pause:
                    await wait(FETCH_RETRY_PAUSE);
                    console.warn(`PLUGIN SERVICE WORKER: Retrying to fetch '${assetUrl}' (retry ${retryCount + 1})`);
                    break;

                default:
                    return {
                        response: response,
                        asset: assetUrl,
                        success: false,
                        statusCode: response.status,
                        statusText: response.statusText
                    }
            }
        } catch (e) {
            return {
                response: null,
                asset: assetUrl,
                success: false,
                statusCode: 0,
                statusText: e.message
            };
        }
    }

    // all the retries weren't successful, return the last one
    return {
        response: latestResponse,
        asset: assetUrl,
        success: false,
        statusCode: latestResponse && latestResponse.status || 0,
        statusText: latestResponse && latestResponse.statusText || 'Unexpected error'
    }
}

async function cacheViaCacheManifestOrResourcesList(sourcePath, manifestPathOrResourcesList, cacheName = undefined, cacheVersion = undefined) {
    if (cacheName === undefined || cacheVersion === undefined) {
        const resolvedCacheNameAndVersion = resolveCacheNameAndVersion(sourcePath);
        if (resolvedCacheNameAndVersion) {
            if (cacheName === undefined) {
                cacheName = resolvedCacheNameAndVersion[0];
            }
            if (cacheVersion === undefined) {
                cacheVersion = resolvedCacheNameAndVersion[1];
            }
        }
    }

    if (cacheName === null || cacheName === undefined || cacheName === '' || cacheName === false || (cacheName && cacheName.indexOf && cacheName.indexOf('#') >= 0)) {
        return {
            status: 'failed',
            failReason: 'Cache name is undefined',
            cachedItems: [],
            failedItems: [],
            cacheName,
            cacheVersion,
            serviceWorkerVersion: VERSION
        };
    }

    if (cacheVersion === null || cacheVersion === undefined || cacheVersion === '' || cacheVersion === false) {
        return {
            status: 'failed',
            failReason: 'Cache version is undefined',
            cachedItems: [],
            failedItems: [],
            cacheName,
            cacheVersion,
            serviceWorkerVersion: VERSION
        };
    }

    const cacheList = await getCacheList();
    const cacheId = getCacheId(cacheName, cacheVersion);

    if (cacheList[cacheName] && cacheList[cacheName][cacheVersion]) {
        console.log("PLUGIN SERVICE WORKER: Continue to use cache " + cacheId);
        const existingCache = await caches.open(cacheId);
        const existingCacheKeys = await existingCache.keys();
        return {
            status: 'notChanged',
            cachedItems: existingCacheKeys.map(request => request.url),
            failedItems: [],
            cacheName,
            cacheVersion,
            serviceWorkerVersion: VERSION
        };
    }

    let cacheAssets;

    if (manifestPathOrResourcesList instanceof Array) {
        cacheAssets = manifestPathOrResourcesList;
    } else {
        try {
            const absoluteManifestPath = new URL(manifestPathOrResourcesList, sourcePath).href;
            const manifestFetchResult = await fetch(absoluteManifestPath);
            const manifestText = await manifestFetchResult.text();
            cacheAssets = getCacheAssetsFromManifest(manifestText);
        } catch (e) {
            console.error(e);
            return {
                status: 'failed',
                failReason: 'Unable to fetch appcache manifest',
                cachedItems: [],
                failedItems: [],
                cacheName,
                cacheVersion,
                serviceWorkerVersion: VERSION
            };
        }
    }

    const cache = await caches.open(cacheId);

    if (!cacheList[cacheName]) {
        cacheList[cacheName] = {};
    }

    cacheList[cacheName][cacheVersion] = {
        id: cacheId,
        name: cacheName,
        version: cacheVersion
    };

    console.log("PLUGIN SERVICE WORKER: Storing cache " + cacheId + "");

    let cachedItems = [];
    let failedItems = [];

    await Promise.all(cacheAssets.map(cacheAsset => new URL(cacheAsset, sourcePath).href)
        .map(asset => fetchAsset(asset, {cache: "no-store"}).then(result => {
            if (result.success) {
                cachedItems.push(result.asset);
                console.log("PLUGIN SERVICE WORKER: Cached " + result.asset + " for " + cacheId);
                return cache.put(result.asset, result.response);
            } else {
                failedItems.push({asset: result.asset, error: result.statusCode, errorText: result.statusText});
                console.error("PLUGIN SERVICE WORKER: Unable to cache " + result.asset + ": " + result.statusCode + " " + result.statusText);
            }
        })));

    if (failedItems.length > 0) {
        console.log("PLUGIN SERVICE WORKER: Removing inconsistent cache for " + cacheId);
        await caches.delete(cacheList[cacheName].id);
        delete cacheList[cacheName][cacheVersion];

        return {
            status: 'failed',
            failReason: 'Unable to fetch all resources',
            cachedItems: [],
            failedItems,
            cacheName,
            cacheVersion,
            serviceWorkerVersion: VERSION
        };
    }

    console.log('PLUGIN SERVICE WORKER: Cache is closed successfully for ' + cacheId);

    if (cacheList[cacheName]) {
        const allCacheVersions = Object.values(cacheList[cacheName]);
        for (let versionedCacheData of allCacheVersions) {
            if (versionedCacheData.version !== cacheVersion) {
                console.log("PLUGIN SERVICE WORKER: Removing obsolete cache " + versionedCacheData.id);
                await caches.delete(versionedCacheData.id);
            }
        }
    }

    return {
        status: 'success',
        cacheName,
        cacheVersion,
        cachedItems,
        failedItems: [],
        serviceWorkerVersion: VERSION
    };
}

const fetchStrategies = {
    /**
     * @param {Request} request
     * @returns {Response}
     */
    cacheFirstThenNetwork: async (request) => {
        const cacheMatch = await caches.match(request);

        if (cacheMatch) {
            return cacheMatch;
        }

        return fetchStrategies.networkOnly(request);
    },

    /**
     * @param {Request} request
     * @returns {Response}
     */
    networkOnly: async (request) => {
        const result = await fetchAsset(request);
        return result.response;
    }
};

/**
 * @returns {Promise.<Object.<String, Object.<String, {version: number, name: string, id: string}>>>}
 */
async function getCacheList() {
    const cacheNames = await caches.keys();

    let loadedCacheList = {};
    cacheNames.forEach(cacheIdentifier => {
        if (cacheIdentifier.indexOf(CACHE_IDENTIFIER_SEPARATOR) < 0) {
            return;
        }

        const identifierParts = cacheIdentifier.split(CACHE_IDENTIFIER_SEPARATOR);

        if (identifierParts.length !== 2) {
            return;
        }

        const cacheName = identifierParts[0];
        const cacheVersion = identifierParts[1];

        if (isNaN(cacheVersion) && !cacheVersion.match(/^[0-9.]+$/)) {
            return;
        }

        if (!loadedCacheList[cacheName]) {
            loadedCacheList[cacheName] = {};
        }

        loadedCacheList[cacheName][cacheVersion] = {
            id: `${cacheIdentifier}`,
            name: `${cacheName}`,
            version: `${cacheVersion}`
        };
    });

    return loadedCacheList;
}

function getCacheId(name, version) {
    return `${name}${CACHE_IDENTIFIER_SEPARATOR}${version}`;
}

/**
 * @param {Request} request
 * @returns {Function}
 */
function chooseFetchStrategy(request) {
    if (request.method === 'GET') {
        return fetchStrategies.cacheFirstThenNetwork;
    } else if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        return fetchStrategies.networkOnly;
    }
    return fetchStrategies.networkOnly;
}

/**
 * Extract pluginId and pluginVersion from the plugin's path (hosted by OFS or a standard plugin)
 * @param sourcePath
 * @returns {null|(string|number)[]}
 */
function resolveCacheNameAndVersion(sourcePath) {
    const hostedPluginResult = sourcePath.match(/\/hosted-plugins\/([\w-_.]+)\/([0-9]+)-\w{16}\/([0-9]+)-\w{64}\/.*/);
    if (hostedPluginResult) {
        const instanceName = hostedPluginResult[1];
        const pluginId = hostedPluginResult[2];
        const pluginVersion = parseInt(hostedPluginResult[3], 10);
        const pluginName = `${instanceName}_p${pluginId}`;
        return [pluginName, pluginVersion];
    }
    const standardPluginResult = sourcePath.match(/\/plugins\/([\w-_.]+)\/([0-9.]+)\/.*/);
    if (standardPluginResult) {
        const pluginName = standardPluginResult[1];
        const pluginVersion = standardPluginResult[2];
        return [pluginName, pluginVersion];
    }
    return null;
}

function getCacheAssetsFromManifest(manifestContent) {
    const parsedManifest = parseAppCacheManifest(manifestContent);
    return parsedManifest.cache;
}

function parseAppCacheManifest(manifestContent) {
    let currentSection = 'cache';

    let result = {
        cache: [],
        network: [],
        fallback: {},
        settings: []
    };

    const lines = manifestContent.split(/\n|\r|\r\n/);
    // first line should be a header "CACHE MANIFEST"
    for (let lineNumber = 1; lineNumber < lines.length; ++lineNumber) {
        let line = lines[lineNumber].trim();

        if (!line || line[0] === '#') {
            // skip empty lines or comments
            continue;
        }

        if (['CACHE:', 'NETWORK:', 'FALLBACK:', 'SETTINGS:'].includes(line)) {
            currentSection = line.substr(0, line.length - 1).toLowerCase();
        } else if (line.substr(line.length - 1) !== ':') {
            // section content:
            if (currentSection === 'fallback') {
                const contentParts = line.split(/ +/);
                result.fallback[contentParts[0]] = contentParts[1];
            } else {
                result[currentSection].push(line);
            }
        }
    }

    return result;
}