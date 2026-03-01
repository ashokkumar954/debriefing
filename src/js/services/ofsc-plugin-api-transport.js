/*
** Oracle Field Service Debrief plugin
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
    'models/catalog-collection',
    'data-services/parts-catalog-data-service',
    'data-services/activity-data-service',
    'data-helper/data-debrief-helper',
    'services/fusion-rest-api-transport',
    'services/ofsc-rest-api-transport',
    'storage/persistent-storage',
    'constants'
], (
    ko,
    ApplicationCriticalError,
    requiredProperties,
    OfscConnector ,
    CatalogCollection,
    PartsCatalogDataService,
    ActivityDataService,
    DataDebriefHelper,
    FusionRestApiTransport,
    OfscRestApiTransport,
    PersistentStorage,
    Constants
) => {

    class OfscPluginApiTransport {

        /**
         * @param ofscConnector
         */
        constructor() {
            this.ofscConnector = new OfscConnector();
            this.openData = ko.observable('');
            this.ffsInstance = "";
            this.attributeDescriptionParam = ko.observable('');
            this.dialogHeading = ko.observable('');
            this.dialogMessage = ko.observable('');
            this._pluginApiMessage = {};
            this._pluginApplicationMessage = {};
            this._pluginFaEnvironment = {};

            this.ofscConnector.debugMessageReceivedSignal.add((data) => {
                console.info('-> DEBRIEFING: ', data);
            });

            this.ofscConnector.debugMessageSentSignal.add((data) => {
                console.info('<- DEBRIEFING: ', data);
            });

            this.ofscConnector.debugIncorrectMessageReceivedSignal.add((error, data) => {
                console.error('-> DEBRIEFING: incorrect message: ', error, data);
            });
        }

        terminatePlugin() {
            this.ofscConnector.sendMessage({
                method: 'close',
                wakeupNeeded: true,
                wakeOnEvents: {
                    online: { wakeupDelay: 120 },
                    timer: { wakeupDelay: 120, sleepTimeout: 300 }
                }
            }).then((data) => {
                console.log('RESPONSE DATA: ', data);
            }).catch(e => {
                console.error(e);
            });
        }

        sharePDFOnMobDevices() {
            this.ofscConnector.sendMessage({
                method: 'close',
                wakeupNeeded: true,
                wakeOnEvents: {
                    online: { wakeupDelay: 120 },
                    timer: { wakeupDelay: 120, sleepTimeout: 300 }
                }
            }).then((data) => {
                console.log('RESPONSE DATA: ', data);
            }).catch(e => {
                console.error(e);
            });
        }

        /**
         *
         */
        load() {
            return new Promise((resolve, reject) => {
                this.ofscConnector.sendMessage({
                    method: 'ready',
                    sendInitData: true
                }).then((message) => {
                    switch (message.method) {
                        case 'init':
                            let attributeDescription = message.attributeDescription;
                            PersistentStorage.saveData('debriefing_attributeDescription', attributeDescription);
                            this._updateFfsInstance(message.applications, message.environment);
                            this.ofscConnector.sendMessage({
                                method: 'initEnd',
                                wakeupNeeded: true,
                                wakeOnEvents: {
                                    online: { wakeupDelay: 120 },
                                    timer: { wakeupDelay: 120, sleepTimeout: 300 }
                                }
                            });
                            break;
                        case 'open':
                            this.openData(message);
                            this._pluginApiMessage = message;
                            this._setEnvironmentDetails();
                            this.attributeDescription = JSON.parse(window.localStorage.getItem('debriefing_attributeDescription'));
                            this.attributeDescriptionParam(this.attributeDescription);
                            let errorsMsg = this._verifyProperties(requiredProperties, this.attributeDescription);

                            if (errorsMsg !== '') {
                                throw new ApplicationCriticalError(Constants.CRITICAL_ERROR, errorsMsg);

                            } else if (message.activity.astatus !== Constants.STARTED) {
                                throw new ApplicationCriticalError(Constants.CRITICAL_ERROR,
                                    Constants.ACTIVATE_QUEUE_MESSAGE);
                            } else if (message.entity !== Constants.ACTIVITY) {
                                throw new ApplicationCriticalError(Constants.CRITICAL_ERROR,
                                    Constants.OPEN_FROM_ACTIVITY_MESSAGE);
                            } else if (this._isValidConnectorUrl()) {
                                throw new ApplicationCriticalError(Constants.ACCESS_PENDING,
                                    Constants.APP_CONFIG_ERROR_MESSAGE);
                            } else {
                                let activityList = this._pluginApiMessage.activityList;
                                this._cacheActivityList(activityList);
                                this.loadData();
                            }
                            resolve();
                            break;
                        case 'wakeup':
                            console.log("Wakeup initiated!!!");
                            this._setEnvironmentDetails();
                            this._initializeConnectors();
                            this._fetchCachedActivityListAndProcess();
                    }
                }).catch((e) => {
                    if (e instanceof ApplicationCriticalError) {
                        return reject(e);
                    }
                    console.error(Constants.UNABLE_TO_START, e);
                });
            });
        }

        loadData() {

            this.partsCatalogDataService = new PartsCatalogDataService(this.ofscConnector);
            this.catalogCollection = new CatalogCollection();

            return this.partsCatalogDataService.getPartsCatalogsStructure().then(
                (catalogModelList) => {
                    catalogModelList.forEach(catalogModel => {
                        this.catalogCollection.add(catalogModel);
                    });
                });
        }

        _getOfscSleepMessage() {
            const actList = PersistentStorage.loadData(Constants.DEBRIEF_ACTIVITY_LIST);
            let isWakeupNeeded = (actList && actList.length > 0)? true: false;
            this.ofscConnector.sendMessage({
                method: Constants.ACTION_SLEEP,
                wakeupNeeded: isWakeupNeeded,
                wakeOnEvents: {
                    online: { wakeupDelay: 120 },
                    timer: { wakeupDelay: 120, sleepTimeout: 600 }
                }
            }).then((data) => {
                console.log('RESPONSE DATA: ', data);
            }).catch(e => {
                console.error(e);
            });
        }

        async _fetchCachedActivityListAndProcess() {
            const actList = PersistentStorage.loadData(Constants.DEBRIEF_ACTIVITY_LIST);
            if (!actList || actList.length === 0) this._getOfscSleepMessage();

            this._activityDataService = new ActivityDataService(this._ofsApiTransport);
            const activityPromises = actList.map(async (id) => {
                const actDetails = await this._activityDataService.getActivityDetailsById(id);
                if (actDetails && actDetails.status === 'completed') {
                    const strategy = DataDebriefHelper.getStrategy('serviceWO', this._fusionApiTransport, this._ofsApiTransport);
                    await strategy.saveDebriefData(actDetails);
                    return id;
                }
                return null;
            });

            const results = await Promise.allSettled(activityPromises);
            const processedIds = results
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);

            // Remove processed activity ids from local storage
            const remainingIds = actList.filter(id => !processedIds.includes(id));
            PersistentStorage.saveData(Constants.DEBRIEF_ACTIVITY_LIST, remainingIds);
            this._getOfscSleepMessage();
        }

        _cacheActivityList(activityList){
            let existingActList = PersistentStorage.loadData(Constants.DEBRIEF_ACTIVITY_LIST);
            existingActList = Array.isArray(existingActList) ? existingActList : [];

            const activityIds = Object.values(activityList)
                .filter(activity => activity.astatus !== 'complete' && !existingActList.includes(activity.aid))
                .map(activity => activity.aid);
            const updatedList = existingActList.concat(activityIds);
            PersistentStorage.saveData(Constants.DEBRIEF_ACTIVITY_LIST, updatedList);
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

            }  else if (errorsArray.length === 1) {
                return Constants.PROPERTY_MUST_BE_CONFIGURED + errorsArray[0] + '.';

            } else {
                return Constants.PROPERTIES_MUST_BE_CONFIGURED + errorsArray.join(', ') + '.';
            }

        }

        /**
         * Determine whether it is OFS/FFS Instance based on environment properties in init method.
         * If it is not FFS instance, store the configured applications in local storage.
         *
         * @param {Object} applications - Applications data to be stored in local storage.
         * @param {Object} environment - Fusion environment data to be stored in local storage
         */

        _updateFfsInstance(applications, environment) {
            this.ffsInstance = environment?.faUrl !== undefined;
            if (!this.ffsInstance) {
                PersistentStorage.saveData(Constants.APPLICATIONS, applications);
            } else {
                PersistentStorage.saveData(Constants.FUSION_ENVIRONMENT, environment);
            }
            console.log('Fusion environment: ', this.ffsInstance);
        }

        _setEnvironmentDetails() {
            this._pluginFaEnvironment = window.localStorage.getItem(Constants.FUSION_ENVIRONMENT)?
                JSON.parse(window.localStorage.getItem(Constants.FUSION_ENVIRONMENT)): "";
            this._pluginApplicationMessage = window.localStorage.getItem(Constants.APPLICATIONS)?
                JSON.parse(window.localStorage.getItem(Constants.APPLICATIONS)): "";

            this.ffsInstance = this._pluginFaEnvironment !== "";
            console.log('Fusion environment: ', this.ffsInstance);
        }

        _isValidConnectorUrl() {
            if (this.ffsInstance) {
                const env = this._pluginFaEnvironment;
                return !(env && env.fsUrl && env.faUrl);
            } else {
                const ofsApp = this._pluginApplicationMessage[Constants.KEY_OFS_API_APP];
                const oauthApp = this._pluginApplicationMessage[Constants.KEY_OAUTH_USER_ASSERTION_APP];
                return !(ofsApp && ofsApp.resourceUrl && oauthApp && oauthApp.resourceUrl);
            }
        }

        _initializeConnectors() {
            let faUrl, fsUrl;

            if (this.ffsInstance) {
                const envData = this._pluginFaEnvironment;
                faUrl = envData.faUrl;
                fsUrl = envData.fsUrl;
                this.faScope = Constants.APPLICATION_SCOPE_FUSION_SERVICE.replace('instance', envData.environmentName.toUpperCase());
                this.fsScope = Constants.APPLICATION_SCOPE_FIELD_SERVICE.replace('instance', envData.environmentName.toLowerCase());
            } else {
                faUrl = this._pluginApplicationMessage[Constants.KEY_OAUTH_USER_ASSERTION_APP].resourceUrl;
                fsUrl = this._pluginApplicationMessage[Constants.KEY_OFS_API_APP].resourceUrl;
            }

            this._fusionApiTransport = new FusionRestApiTransport(faUrl, this.ofscConnector, this.faScope);
            this._ofsApiTransport = new OfscRestApiTransport(fsUrl, this.ofscConnector, this.fsScope);
        }

    }

    return OfscPluginApiTransport;
})