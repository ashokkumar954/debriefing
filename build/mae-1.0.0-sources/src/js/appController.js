define([
    'ojs/ojcore',
    'knockout',
    './services/ofsc-plugin-api-transport',
    'ojs/ojrouter',
    'ojs/ojvalidation-datetime',
    'viewModels/asset',
    'text!views/asset.html',
    'viewModels/asset-detail',
    'text!views/asset-detail.html',    
    'viewModels/all-asset-details',
    'text!views/all-asset-details.html'    
], function (
    oj,
    ko,
    OfscPluginApiTransport
) {

    class ControllerViewModel {

        constructor() {
            this.router = oj.Router.rootInstance;
            this.router.configure({
                'asset': { label: 'asset', isDefault: true },
                'asset-detail': { label: 'asset-detail'},
                'all-asset-details': { label: 'all-asset-details'}
            });

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            this.router.moduleConfig.params.app = this;

            this._openData = null;
            this._attributeDescription = null;

            this._pluginApiTransport = new OfscPluginApiTransport();
            this.ofscConnector = this._pluginApiTransport.ofscConnector;

            // Promise that resolves when data is ready
            this._loadedResolve = null;
            this.loaded = new Promise((resolve) => {
                this._loadedResolve = resolve;
            });
        }

        load() {
            return new Promise((resolve) => {
                this._pluginApiTransport.load()
                    .then(() => {
                        this._openData = this._pluginApiTransport.openData();
                        this._attributeDescription = this._pluginApiTransport.attributeDescriptionParam();
                        console.log('[AppController] loaded successfully');
                        console.log('[AppController] _openData:', this._openData);
                        console.log('[AppController] _attributeDescription:', this._attributeDescription);
                        this._loadedResolve();
                        resolve();
                    })
                    .catch((error) => {
                        console.warn('[AppController] Transport error, trying to get data anyway:', error);

                        // Even when transport throws, try to get whatever data loaded
                        try {
                            this._openData = this._pluginApiTransport.openData();
                            this._attributeDescription = this._pluginApiTransport.attributeDescriptionParam();
                            console.log('[AppController] Got data despite error:', this._openData);
                            console.log('[AppController] _attributeDescription despite error:', this._attributeDescription);
                        } catch(e) {
                            console.warn('[AppController] Could not get data from transport:', e);
                        }

                        this._loadedResolve();
                        resolve(); // always resolve so app loads
                    });
            });
        }
    }

    return ControllerViewModel;
});