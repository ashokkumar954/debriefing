/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/


/**
 * @licence
 * Plugin Debriefing
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
"use strict";

// Set minimum required version of the service worker. If the version of the service worker is lower - it will be updated.
// The service worker version should be increased on each service worker change, otherwise the service worker script won't be updated.
const MINIMAL_SERVICE_WORKER_VERSION = '240801';

// If the plugin is hosted externally (not by OFS plugin hosting) - fill in cacheName and cacheVersion.
// Update cacheVersion on each resources change - it will be re-cached.
// If the plugin is hosted by OFS platform - leave cacheName and cacheVersion as null.
const CACHE_NAME = null; // string, override for externally hosted plugin
const CACHE_VERSION = null; // number, override for externally hosted plugin

// OFS hosted plugins can use root scope '/' with a single (root-level) service worker.
// Change scope to './' to use local service worker (a service worker for each plugin).
// In order to use non-local scope ('/' or '/some-path/') the hosting service has to provide "Service-Worker-Allowed" HTTP header. Read more: https://www.w3.org/TR/service-workers/#path-restriction
const SERVICE_WORKER_SCOPE = '/';

const SERVICE_WORKER_SCRIPT_PATH = './plugin-service-worker.js';
const CACHE_MANIFEST_PATH = './manifest.appcache';

requirejs.config(
    {
        baseUrl: 'js',

        // Path mappings for the logical module names
        // Update the main-release-paths.json for release mode when updating the mappings
        paths:
        //injector:mainReleasePaths
            {
                "ojs": "libs/oj/18.1.0/debug",
                "ojL10n": "libs/oj/18.1.0/ojL10n",
                "ojtranslations": "libs/oj/18.1.0/resources/root",
                'knockout': 'libs/knockout/knockout-3.5.1.debug',
                'jquery': 'libs/jquery/jquery-3.7.1',
                "jqueryui-amd": "libs/jquery/jqueryui-amd-1.14.1",
                'text': 'libs/require/text',
                'signals': 'libs/js-signals/signals',
                "promise": "libs/es6-promise/es6-promise",
                "hammerjs": "libs/hammer/hammer-2.0.8",
                "ojdnd": "libs/dnd-polyfill/dnd-polyfill-1.0.2",
                'customElements': 'libs/webcomponents/custom-elements.min',
                'proj4': 'libs/proj4js/dist/proj4-src',
                'css': 'libs/require-css/css',
                'preact': 'libs/preact/dist/preact.umd',
                'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
                'preact/compat': 'libs/preact/compat/dist/compat.umd',
                'preact/devtools': 'libs/preact/devtools/dist/devtools.umd.js'
            }
        //endinjector
        ,
        // Shim configurations for modules that do not expose AMD
        shim:
            {
                'jquery':
                    {
                        exports: ['jQuery', '$']
                    }
            }
    }
);

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore', 'knockout', 'appController', 'plugin-service-worker-interface', './errors/application-critical-error', 'ojs/ojcontext', 'ojs/ojknockout',
        'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
    function (oj, ko, ControllerViewModel, PluginServiceWorkerInterface, ApplicationCriticalError, Context) { // this callback gets executed when all required modules are loaded

        $(function () {

            function prepareOfflineMode() {
                PluginServiceWorkerInterface.setRequiredRootServiceWorkerVersion(MINIMAL_SERVICE_WORKER_VERSION);
                PluginServiceWorkerInterface.setServiceWorkerScope(SERVICE_WORKER_SCOPE);

                // Override log function for debug purposes.
                PluginServiceWorkerInterface.setLogMessageFunction(logServiceWorkerMessage);

                // Cache plugin's files via appcache manifest.
                // Alternatively PluginServiceWorkerInterface.cacheResourcesList() method can be used.
                return PluginServiceWorkerInterface.cacheViaCacheManifest(
                    SERVICE_WORKER_SCRIPT_PATH,
                    CACHE_MANIFEST_PATH,
                    CACHE_NAME,
                    CACHE_VERSION
                ).then(result => {
                    return true;
                }).catch(e => {
                    console.error("Service Worker error: ", e);
                    return false;
                });
            }

            function init() {
                prepareOfflineMode().then(() => {
                    let app = new ControllerViewModel();

                    oj.Router.sync().then(function () {
                        app.load()
                            .then(() => {
                                // normal start:
                                ko.applyBindings(app, document.getElementById('globalBody'));
                            }, error => {
                                if (error instanceof ApplicationCriticalError) {
                                    let node = document.getElementById('alertDialog');
                                    let busyContext = oj.Context.getContext(node).getBusyContext();
                                    busyContext.whenReady().then(function () {
                                        app.errorAlertPopup(error.heading, error.message).then(() => {
                                            app._pluginApiTransport.terminatePlugin();
                                        });
                                    });
                                    ko.applyBindings(app, document.getElementById('globalBody'));
                                }
                                console.error(error);
                            });
                    }, function (error) {
                        oj.Logger.error('Error in root start: ' + error.message);
                    });
                });
            }


            // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
            // event before executing any code that might interact with Cordova APIs or plugins.
            if ($(document.body).hasClass('oj-hybrid')) {
                document.addEventListener("deviceready", init);
            } else {
                init();
            }

        });

    }
);
