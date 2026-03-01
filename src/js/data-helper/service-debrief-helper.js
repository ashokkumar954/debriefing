/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define(['knockout',
        '../data-services/service-logistics-data-service',
        '../data-services/activity-data-service',
        '../models/debrief-model',
        '../storage/persistent-storage',
        '../utils/labor-time-utils',
        '../constants'
    ],
    function (ko,
              ServiceLogisticsDataService,
              ActivityDataService,
              DebriefModel,
              PersistentStorage,
              LaborTimeUtils,
              Constants
    ) {
        class ServiceDebriefHelper {

            constructor(fusionApiTransport, ofsApiTransport) {
                this._fusionDataService = new ServiceLogisticsDataService(fusionApiTransport);
                this._ofsDataService = new ActivityDataService(ofsApiTransport);
                this.laborTimeUtils = new LaborTimeUtils();
            }

            async processDebriefHeader(svcWorkOrderId, resourceId) {
                let debriefId = await this._fusionDataService.createDebriefHeader(svcWorkOrderId, resourceId);
                return debriefId;
            }

            async processDebriefLineItems(svcWorkOrderId, resourceId, lineItemsArray) {
                return await this._fusionDataService.createDebriefLineItems(svcWorkOrderId, resourceId, lineItemsArray);
            }

            async saveDebriefData(actDetails) {
                const laborItems = [], expenseItems = [], usedParts = [];
                let activityId = actDetails.activityId;


                const res = this._ofsDataService.getInstalledInventoriesFromActivity(activityId);
                const deinstalledList = this._ofsDataService.getDeinstalledInventoriesFromActivity(activityId);
                const [installedItems, deinstalledItems] = await Promise.all([res, deinstalledList]);
                if (installedItems && installedItems.items && installedItems.items.length > 0) {
                    for (const item of installedItems.items) {
                        switch (item.inventoryType) {
                            case Constants.INVENTORY_TYPE_LABOR:
                                let date = actDetails.date;
                                let resTimeDiff = actDetails.resourceTimeZoneDiff;
                                const localTimeStart = `${date}${item.labor_start_time}`;
                                const localTimeEnd = `${date}${item.labor_end_time}`;
                                item.labor_start_time = this.laborTimeUtils._convertToUTC(localTimeStart, resTimeDiff);
                                item.labor_end_time = this.laborTimeUtils._convertToUTC(localTimeEnd, resTimeDiff);
                                laborItems.push(item);
                                break;
                            case Constants.INVENTORY_TYPE_EXPENSE:
                                expenseItems.push(item);
                                break;
                            case Constants.INVENTORY_TYPE_PART:
                            case Constants.INVENTORY_TYPE_PART_SN:
                                let resourceId = item.resourceId;
                                let resourceDetails = await this._ofsDataService.getResourceDetails(resourceId);
                                if (resourceDetails && resourceDetails.resourceType) {
                                    item.resourceType = resourceDetails.resourceType;
                                }
                                usedParts.push(item);
                                break;
                        }
                    };
                }
                let workOrderId;
                if(actDetails.svcWorkOrderId) {
                    console.log("This is a Fusion Field Service WO: : :" + actDetails.svcWorkOrderId);
                    workOrderId = actDetails.svcWorkOrderId;
                } else {
                    console.log("This is an Oracle Field Service WO: : :" + actDetails.wo_number);
                    workOrderId = await this._fusionDataService.getCustomerWorkOrderByWONUmber(actDetails.wo_number);
                }
                if(workOrderId) {
                    const debriefHeaderId = await this.processDebriefHeader(workOrderId, actDetails.resourceId);
                    if (!debriefHeaderId) throw new Error('Error creating Debrief header for WOId : : :' + workOrderId);
                    const lineItemsArray = await this._createLineItems(laborItems, expenseItems, usedParts, deinstalledItems);
                    if (lineItemsArray.length === 0) throw new Error('No line items to post. So retry the posting.');
                    const success = await this.processDebriefLineItems(workOrderId, actDetails.resourceId, lineItemsArray);
                    if (!success) {
                        throw new Error('All postLineItems calls failed. So retry the posting.');
                    }
                } else {
                    throw new Error('Error fetching WO details for the activity : : :' + actDetails.activityId);
                }

            }

            async _createLineItems(laborItems, expenseItems, usedParts, deinstalledItems) {
                const payloadPromises = [];

                if (laborItems.length) {
                    payloadPromises.push(this._fusionDataService.createLaborItemsPayload(laborItems));
                }

                if (expenseItems.length) {
                    payloadPromises.push(this._fusionDataService.createExpenseItemsPayload(expenseItems));
                }

                if (usedParts.length) {
                    let roles = PersistentStorage.loadData(Constants.ROLES_LIST);
                    if(!roles || Object.keys(roles).length === 0) {
                        roles = await this._ofsDataService.getResourceRoles();
                        PersistentStorage.saveData(Constants.ROLES_LIST, roles);
                    }
                    payloadPromises.push(this._fusionDataService.createUsedPartsPayload(usedParts, roles));
                }

                if (deinstalledItems.totalResults) {
                    payloadPromises.push(this._fusionDataService.createReturnPartsPayload(deinstalledItems));
                }

                const allPayloadArrays = await Promise.all(payloadPromises);
                return allPayloadArrays
                    .filter(payloadArray => Array.isArray(payloadArray) && payloadArray.length > 0)
                    .flat();
            }


            loadDebriefDefaultOrg() {
                this._fusionDataService.loadDefaultOrg();
            }

        }

        return ServiceDebriefHelper;
    });