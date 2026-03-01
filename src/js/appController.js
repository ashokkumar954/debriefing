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
define([
    'ojs/ojcore',
    'knockout',
    './services/ofsc-plugin-api-transport',
    './services/fusion-rest-api-transport',
    './services/ofsc-rest-api-transport',
    './services/inventory-search-service',
    './utils/labor-time-utils',
    'text!required-properties.json',
    'ojs/ojmodel',
    'constants',
    './data-helper/data-debrief-helper',
    // non-referenced:
    './components/index',
    'ojs/ojrouter',
    'ojs/ojvalidation-datetime',
    'viewModels/add-expense', 'viewModels/add-labor', 'viewModels/add-returned-part', 'viewModels/add-used-part', 'viewModels/dashboard', 'viewModels/invoice',
    'text!views/add-expense.html', 'text!views/add-labor.html', 'text!views/add-returned-part.html', 'text!views/add-used-part.html', 'text!views/dashboard.html',
    'text!views/invoice.html','viewModels/test-flow','text!views/test-flow.html'
], function (
    oj,
    ko,
    OfscPluginApiTransport,
    FusionRestApiTransport,
    OfscRestApiTransport,
    InventorySearchService,
    LaborTimeUtils,
    requiredProperties,
    ojmodel,
    Constants,
    DataDebriefHelper
) {

    class ControllerViewModel {

        constructor() {
            /*
             * Set up router
             */
            this.router = this.getRouterInstance();
            this.router.configure({
                'dashboard': {label: 'Dashboard', isDefault: true},
                'add-labor': {label: 'Add Labor'},
                'add-expense': {label: 'Add Expense'},
                'add-used-part': {label: 'Add Used Part'},
                'add-returned-part': {label: 'Add Returned Part'},
                'invoice': {label: 'Invoice'},
                'test-flow': {label: 'Test Flow'}
            });

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            this.router.moduleConfig.params.app = this;

            /*
             * Initialize instance fields
             */
            this.dateTimeConverter = oj.Validation.converterFactory('datetime').createConverter();

            this._initModels();
            this.dialogHeading = ko.observable('');
            this.dialogMessage = ko.observable('');

            /*
             * OFSC Plugin API integration
             */
            this._pluginApiTransport = new OfscPluginApiTransport();
            this._fusionApiTransport = null;
            this._ofsRestApiTransport = null;
            this.ofscConnector = this._pluginApiTransport.ofscConnector;
            this._pluginApiApps = this._pluginApiTransport._pluginApplicationMessage;
            this._attributeDescription = this._pluginApiTransport.attributeDescription;
            this.partsCatalogDataService = this._pluginApiTransport.partsCatalogDataService;
            this.catalogCollection = this._pluginApiTransport.catalogCollection;
            this._laborTimeUtils = new LaborTimeUtils();
            this.defaultLaborItem = '';
            this.defaultTravelItem = '';
            this.ffsInstance = '';
        }

        getRouterInstance() {
            return oj.Router.rootInstance;
        }

        load() {
            return new Promise((resolve, reject) => {
                this._pluginApiTransport.load().then(() => {
                    this._openData = this._pluginApiTransport.openData();
                    this.ffsInstance = this._pluginApiTransport.ffsInstance;
                    this._pluginApiApps = this._pluginApiTransport._pluginApplicationMessage;
                    this._attributeDescription = this._pluginApiTransport.attributeDescriptionParam();
                    this._partsCatalogDataService = this._pluginApiTransport.partsCatalogDataService;
                    this._catalogCollection = this._pluginApiTransport.catalogCollection;
                    this.invokeTokens();
                    this.open();
                }).catch((error) => {
                    reject(error);
                }).then(resolve);
            });
        }

        _initModels() {
            // Items collections
            this.laborItems = ko.observableArray([]);
            this.expenseItems = ko.observableArray([]);
            this.serialNums = ko.observableArray([]);
            this.logoUrl = ko.observable('');
            this.currentActivityId = '';
            this.resourceId = '';


            this.partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            this.resourcePartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });


            this.createdDeinstalledPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });

            this.customerPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });

            this.usedPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });

            this.returnedPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });

            this.partsInventoryActionsCollection = new ojmodel.Collection();
            this.partsInventoryUpdateActionsCollection = new ojmodel.Collection();
        }

        open() {

            // Pre-fill the models and collections

            // Resource
            let resourceOpenData = this._openData.resource;

            this.resource = this.getResource(resourceOpenData);
            this.username = this._openData.user.ulogin;
            this.dateTimeFormat = this._openData.user.format.datetime;

            // Activity
            let activityOpenData = this._openData.activity;
            this.currentActivityId = activityOpenData.aid;
            this.resourceId = resourceOpenData.pid;
            this.resCurrentTime = resourceOpenData.currentTime;
            this.customer = this.getCustomer(activityOpenData);

            let securedData = this._openData.securedData;
            if(securedData) {
                this.logoUrl(securedData.logoUrl);
                this.defaultLaborItem = securedData[Constants.LABOR_ITEM];
                this.defaultTravelItem = securedData[Constants.TRAVEL_ITEM];
            }
            this.strategy = DataDebriefHelper.getStrategy('serviceWO',this._fusionApiTransport, this._ofsRestApiTransport);
            this.processLaborActivities();
            this.processExpenseActivities();

            // Activity codes for added parts
            let partActivityUsed = [];
            Object.entries(this._attributeDescription.part_service_activity_used.enum).forEach(([id, {text, inactive}]) => {
                if (inactive) {
                    return;
                }

                partActivityUsed.push({id, text});
            });

            this.partActivityUsedEnumCollection = new ojmodel.Collection(partActivityUsed);

            // Activity codes for returned parts
            let partActivityReturned = [];

            Object.entries(this._attributeDescription.part_service_activity_returned.enum).forEach(([id, {text, inactive}]) => {
                if (inactive) {
                    return;
                }

                partActivityReturned.push({id, text});
            });

            this.partActivityReturnedEnumCollection = new ojmodel.Collection(partActivityReturned);


            this.ofscActivityModel = new (oj.Model.extend({
                idAttribute: Constants.ACT_ID
            }))({
                aid: activityOpenData.aid
            });
            this.activityDetails = this.getActivityDetails(activityOpenData, resourceOpenData);


            // Parts, Labor and Expenses
            let inventoryOpenData = this._openData.inventoryList;

            this.installedInventoriesSummary = {};
            this.deinstalledInventoriesSummary = {};
            this.installedUpdateInventoriesSummary = {};
            this.deinstalledUpdateInventoriesSummary = {};
            Object.entries(inventoryOpenData).forEach(([invid, inventory]) => {
                if (activityOpenData.aid && inventory.inv_aid && activityOpenData.aid !== String(inventory.inv_aid)) {
                    return;
                }
                if (Constants.INVENTORY_TYPE_PART === inventory.invtype || Constants.INVENTORY_TYPE_PART_SN === inventory.invtype) {
                    this.processInventoryPool(inventory, invid);
                }
                else if (Constants.INVENTORY_TYPE_LABOR === inventory.invtype) {
                    this.addLabor({
                        activityId: inventory.labor_service_activity,
                        itemId: inventory.labor_item_number,
                        startTime: inventory.labor_start_time,
                        endTime: inventory.labor_end_time,
                        defaultStartTime: inventory.labor_default_start_time,
                        defaultEndTime: inventory.labor_default_end_time,
                        recordId: invid
                    });
                }
                else if (Constants.INVENTORY_TYPE_EXPENSE === inventory.invtype) {
                    this.addExpense({
                        activityId: inventory.expense_service_activity,
                        itemId: inventory.expense_item_number,
                        amount: inventory.expense_amount,
                        currencyKey: inventory.expense_currency_code,
                        recordId: invid
                    });
                }
            });
            this.timeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            this.populateDefaultLaborItem(activityOpenData.aid);

            /** @type InventorySearchService */
            this.initializeInventorySearchService();
        }

        initializeInventorySearchService() {
            /** @type InventorySearchService */
            this.inventorySearchService = new InventorySearchService(
                this.resourcePartsCollection,
                this._attributeDescription,
                // searchable properties:
                ['part_item_number_rev', 'part_item_desc', 'invsn'],
                // order by:
                'part_item_number_rev'
            );
        }

        populateDefaultLaborItem(activityId) {

            const defLabActItem = window.localStorage.getItem(`${activityId}:${this.defaultLaborItem}`);
            const defLabTravelItem = window.localStorage.getItem(`${activityId}:${this.defaultTravelItem}`);
            const activityDetails = this.activityDetails;

            if (!this._canPopulateDefaultLabor(defLabActItem, defLabTravelItem)) return;

            const activityStartTime = activityDetails.get(Constants.START_TIME);
            const activityEndTime = activityDetails.get(Constants.END_TIME);
            const travelTime = activityDetails.get(Constants.TRAVEL_TIME);
            const resourceCurrentTime = activityDetails.get(Constants.RES_CURRENT_TIME);
            const durationInMinutes = activityDetails.get(Constants.DURATION);

            this._populateDefaultLabor(activityStartTime, activityEndTime, resourceCurrentTime, durationInMinutes, defLabActItem);
            this._populateDefaultTravel(activityStartTime, travelTime, defLabTravelItem);
        }

        _canPopulateDefaultLabor(defLabActItem, defLabTravelItem) {
            const isLaborConfigured = this.isLaborPropertyConfigured(this.defaultLaborItem);
            const isTravelConfigured = this.isLaborPropertyConfigured(this.defaultTravelItem);

            const areDefaultHoursPresent = this._isDefaultLaborHrsPresent() && this._isDefaultTravelHrsPresent();

            if (!isLaborConfigured && !isTravelConfigured) return false;
            if (areDefaultHoursPresent) return false;

            const isDefaultLabActItemRemoved = defLabActItem? defLabActItem === this.defaultLaborItem: false;
            const isDefaultLabTrvItemRemoved = defLabTravelItem? defLabTravelItem === this.defaultTravelItem: false;

            return !(isDefaultLabActItemRemoved && isDefaultLabTrvItemRemoved);
        }

        _populateDefaultLabor(startTime, endTime, currentTime, duration, defLabActItem) {
            if (this.isLaborHrsConfigured && !this._isDefaultLaborHrsPresent()
                && this._isDefaultValDeleted(defLabActItem, this.defaultLaborItem)) {
                this._addLaborEntry(
                    this.defaultLaborItemNumber,
                    this.defaultSvcActivityName,
                    this._laborTimeUtils._autoPopulateLaborStartTime(startTime),
                    this._laborTimeUtils._autoPopulateLaborEndTime(startTime, endTime, currentTime, duration)
                );
            }
        }

        _isDefaultValDeleted(defLabActItem, defaultBillingItem) {
            if(!defLabActItem || (defLabActItem && !defLabActItem === defaultBillingItem)) {
                return true;
            }
            return false;
        }

        _populateDefaultTravel(startTime, travelTime, defLabActItem) {
            if (this.isLaborTravelHrsConfigured && !this._isDefaultTravelHrsPresent() && travelTime
                && this._isDefaultValDeleted(defLabActItem, this.defaultTravelItem)) {
                this._addLaborEntry(
                    this.defaultLaborTravelHrs,
                    this.defaultSvcActivityName,
                    this._laborTimeUtils._autoPopulateTravelStartTime(startTime, travelTime),
                    this._laborTimeUtils._autoPopulateTravelEndTime(startTime, travelTime)
                );
            }
        }

        _addLaborEntry(itemId, activityName, startTime, endTime) {
            this.addLabor({
                activityId: activityName,
                itemId: itemId,
                startTime: startTime,
                endTime: endTime,
                defaultStartTime: startTime,
                defaultEndTime: endTime,
                recordId: null
            });
        }

        isLaborPropertyConfigured(property) {
            return (this._attributeDescription.labor_item_number.enum[property])? true: false;
        }

        _isDefaultLaborHrsPresent() {
            return (this.laborItems().filter(a => a.itemId === this.defaultLaborItem).length > 0)? true: false;
        }

        _isDefaultTravelHrsPresent() {
            return (this.laborItems().filter(a => a.itemId === this.defaultTravelItem).length > 0)? true: false;
        }

        processInventoryPool(inventory, invid) {
            let invpool = inventory.invpool;
            inventory.part_item_number = inventory.part_item_number_rev + "~" + inventory.invsn;
            if (inventory.quantity === null) {
                inventory.quantity = 0;
            }
            switch (invpool) {
                case 'provider':
                    this.resourcePartsCollection.add(inventory);
                    break;
                case 'customer':
                    this.customerPartsCollection.add(inventory);
                    break;
                case 'install':
                    let id = inventory.part_item_number_rev;
                    if (inventory.invsn) {
                        id = id + '~' + inventory.invsn;
                    }
                    this.installedInventoriesSummary[id] = {
                        invid: inventory.invid,
                        model: inventory.part_item_number_rev,
                        quantity_delta: 0,
                        invsn: inventory.invsn,
                        activityId: inventory.part_service_activity_used
                    };
                    this.usedPartsCollection.add(inventory);
                    break;
                case 'deinstall':
                    let identifier = inventory.part_item_number_rev;
                    if (inventory.invsn) {
                        identifier = identifier + '~' + inventory.invsn;
                    }
                    this.deinstalledInventoriesSummary[identifier] = {
                        invid: inventory.invid,
                        model: inventory.part_item_number_rev,
                        quantity_delta: 0,
                        activityId: inventory.part_service_activity_returned,
                        invsn: inventory.invsn
                    };
                    this.returnedPartsCollection.add(inventory);
                    break;
                default:
                    throw new Error(`Unknown inventory pool: '${invpool}' (invid = '${invid}')`);
            }
        }

        processExpenseActivities() {

            // Expense activities enumeration
            let expenseActivities = [];

            Object.entries(this._attributeDescription.expense_service_activity.enum).forEach(([id, {
                text,
                inactive
            }]) => {
                if (inactive) {
                    return;
                }

                expenseActivities.push({id, text});
            });

            this.expenseActivityEnumCollection = new ojmodel.Collection(expenseActivities);

            // Expense items enumeration
            let expenseItems = [];

            Object.entries(this._attributeDescription.expense_item_number.enum).forEach(([id, {text, inactive}]) => {
                if (inactive) {
                    return;
                }

                expenseItems.push({
                    id,
                    label: text,
                    text: (this._attributeDescription.expense_item_desc.enum[id] ? this._attributeDescription.expense_item_desc.enum[id].text : '')
                });
            });

            this.expenseItemEnumCollection = new ojmodel.Collection(expenseItems);

            // Expense currency enumeration
            let expenseCurrencies = [];

            Object.entries(this._attributeDescription.expense_currency_code.enum).forEach(([id, {text, inactive}]) => {
                if (inactive) {
                    return;
                }

                let textFields = text.match(/^(.+?)\|(.+)/);

                expenseCurrencies.push({
                    id,
                    sign: textFields[1],
                    text: textFields[2]
                });
            });

            this.expenseCurrencyEnumCollection = new ojmodel.Collection(expenseCurrencies);
        }

        processLaborActivities() {
            this.laborActivityEnumCollection = this.createCollection(
                this._attributeDescription.labor_service_activity.enum,
                this.processLaborActivityEntry.bind(this)
            );

            this.laborItemEnumCollection = this.createCollection(
                this._attributeDescription.labor_item_number.enum,
                this.processLaborItemEntry.bind(this)
            );
        }

        createCollection(enumData, processEntryCallback) {
            const items = [];
            Object.entries(enumData).forEach(([id, details]) => {
                const item = processEntryCallback(id, details);
                if (item) {
                    items.push(item);
                }
            });
            return new ojmodel.Collection(items);
        }

        processLaborActivityEntry(id, { text, inactive }) {
            if (inactive) {
                return null;
            }

            if (id === Constants.DEFAULT_LABOR_ACTIVITY_SERVICE) {
                this.defaultSvcActivityName = id;
            }

            return { id, text };
        }

        processLaborItemEntry(id, { text, inactive }) {
            if (inactive) {
                return null;
            }

            if (!this.isLaborHrsConfigured) {
                this.isLaborHrsConfigured = id === this.defaultLaborItem;
                this.defaultLaborItemNumber = this.isLaborHrsConfigured ? id : "";
            }

            if (!this.isLaborTravelHrsConfigured) {
                this.isLaborTravelHrsConfigured = id === this.defaultTravelItem;
                this.defaultLaborTravelHrs = this.isLaborTravelHrsConfigured ? id : "";
            }

            return {
                id,
                label: text,
                text: this._attributeDescription.labor_item_desc.enum[id]? this._attributeDescription.labor_item_desc.enum[id].text: '',
            };
        }


        getCustomer(activityOpenData) {
            return new oj.Model({
                name: activityOpenData.cname || '',
                address: activityOpenData.caddress || '',
                city: activityOpenData.ccity || '',
                state: activityOpenData.cstate || '',
                zip: activityOpenData.czip || '',
                workorder: activityOpenData.appt_number || '',
                company: activityOpenData.ccompany || ''
            });
        }

        getActivityDetails(activityOpenData, resourceOpenData) {
            return new oj.Model({
                startTime: activityOpenData.ETA || '',
                endTime: activityOpenData.end_time || '',
                resourceCurrentTime: resourceOpenData.currentTime || '',
                duration: activityOpenData.length || '',
                travelTime: activityOpenData.travel
            });
        }

        getResource(resourceOpenData){
            return new oj.Model({
                id: resourceOpenData.pid || '',
                name: resourceOpenData.pname || ''
            });
        }

        getIdFromArray(array) {
            let id = 0;

            if (array.length === 0) {
                id = 1;
            } else {
                array.forEach(item => {
                    id = id <= item.id ? item.id : id;
                });
                id++;
            }

            return id;
        }

        addLabor({ activityId, itemId, startTime, endTime,defaultStartTime=null,defaultEndTime=null, travelTime, recordId = null }) {

            const props = {
                id: this.getIdFromArray(this.laborItems()),
                activityId,
                itemId,
                startTime,
                endTime,
                defaultStartTime,
                defaultEndTime,
                travelTime,
                recordId
            };
            const mergeEnumData = (collection, id, prefix) => {
                const enumData = collection.get(id)?collection.get(id).toJSON(): {};
                Object.entries(enumData).forEach(([key, value]) => {
                    props[`${prefix}_${key}`] = value;
                });
            };
            mergeEnumData(this.laborItemEnumCollection, itemId, "item");
            mergeEnumData(this.laborActivityEnumCollection, activityId, "activity");

            props.duration = this._laborTimeUtils._calculateDuration(this.dateTimeConverter, startTime, endTime);

            this.laborItems.push(props);
        }

        removeLabor (id) {
            const index = this.laborItems().findIndex(labor => labor.id === id);
            const deletedList = this.laborItems().filter(labor => labor.id === id && !!labor.recordId);
            const softDeletedItem = this.laborItems().find(labor => labor.id === id);
            this.addDataInCache(softDeletedItem? softDeletedItem.itemId: "");
            if (deletedList.length > 0) {
                this.addInventoryListToDeleted(deletedList);
                this.ofscConnector.sendMessage(this._getOfscUpdateData())
                    .then((data) => {
                        console.log('RESPONSE DATA: ', data);
                        this.laborItems.splice(index, 1);
                        this.setDeleteInventoryList(null);
                    })
                    .catch((error) => {
                        this.errorAlertPopup(Constants.CRITICAL_ERROR, 'Error processing your request');
                        console.error(error);
                        this.installedUpdateInventoriesSummary = {};
                        this.deinstalledUpdateInventoriesSummary = {};
                        this.setDeleteInventoryList([]);
                    });

            } else {
                this.laborItems.splice(index, 1);
            }
        }

        addDataInCache(itemId) {
            if (itemId === this.defaultLaborItem || itemId === this.defaultTravelItem) {
                let item = window.localStorage.getItem(`${this._openData.activity.aid}:${itemId}`);
                if (!item) {
                    window.localStorage.setItem(`${this._openData.activity.aid}:${itemId}`, itemId);
                }
            }
        }

        addExpense({activityId, itemId, amount, currencyKey, recordId}) {
            let props = {id: this.getIdFromArray(this.expenseItems()), activityId, itemId, amount, currencyKey};

            if (recordId) {
                props.recordId = recordId;
            }

            Object.entries(this.expenseItemEnumCollection.get(itemId).toJSON()).forEach(([key, value]) => {
                props[`item_${key}`] = value;
            });

            Object.entries(this.expenseActivityEnumCollection.get(activityId).toJSON()).forEach(([key, value]) => {
                props[`activity_${key}`] = value;
            });

            Object.entries(this.expenseCurrencyEnumCollection.get(currencyKey).toJSON()).forEach(([key, value]) => {
                props[`currency_${key}`] = value;
            });

            this.expenseItems.push(props);
        }

        removeExpense(id) {
            const index = this.expenseItems().findIndex(expense => expense.id === id);
            const deletedList = this.expenseItems().filter(expense => expense.id === id && !!expense.recordId);
            if (deletedList.length > 0) {
                this.addInventoryListToDeleted(deletedList);
                this.ofscConnector.sendMessage(this._getOfscUpdateData())
                    .then((data) => {
                        console.log('RESPONSE DATA: ', data);
                        this.expenseItems.splice(index, 1);
                        this.setDeleteInventoryList(null);
                    })
                    .catch((error) => {
                        this.errorAlertPopup(Constants.CRITICAL_ERROR, 'Error processing your request');
                        console.error(error);
                        this.installedUpdateInventoriesSummary = {};
                        this.deinstalledUpdateInventoriesSummary = {};
                        this.setDeleteInventoryList([]);
                    });
            } else {
                this.expenseItems.splice(index, 1);
            }
        }
        checkValidationGroup() {
            const tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
                return true;
            } else {
                // show messages on all the components that are invalidHiddden, i.e., the
                // required fields that the user has yet to fill out.
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
                return false;
            }
        }

        submitPluginData() {
            const handleSuccess = (data) => {
                console.log('RESPONSE DATA: ', data);
                this.installedUpdateInventoriesSummary = {};
                this.deinstalledUpdateInventoriesSummary = {};
                this.setDeleteInventoryList([]);
            };

            const handleError = (error) => {
                this._showErrorAlert(error);
                console.error(error);
                this.installedUpdateInventoriesSummary = {};
                this.deinstalledUpdateInventoriesSummary = {};
                this.setDeleteInventoryList([]);
            };

            this.ofscConnector.sendMessage(this._getOfscCloseData())
                .then(handleSuccess)
                .catch(handleError);
        }


        invokeShareFile(file) {
            this.ofscConnector.shareFile(file);
        }


        /*
         * Inventory actions
         *
         * - Updates possible only for install and deinstall pools (customer and provider ones aren't shown in the list)
         * - Update changes fields and properties of previous install/deinstall action. No real update.
         * - Remove from used/returned parts does undo_install/undo_deinstall. No property update, no update action possible (they become hidden). Previous update is removed from list.
         * - Add to used/returned removes undo_install/undo_deinstall action if any, but updates properties and quantity.
         */

        addUsedPart(model, activityId, quantity, serialNum) {
            let sourcePart = this.resourcePartsCollection.findWhere({part_item_number_rev: model, invsn: serialNum});
            let index = '';
            let invid = null;
            if(serialNum) {
                index = `${model}~${serialNum}`;
            } else {
                index = model;
            };
            if (!sourcePart) {
                return false;
            };
            let targetPart = this.usedPartsCollection.findWhere({part_item_number_rev: model, invsn: serialNum});
            if (!targetPart) {
                let copiedProperties = sourcePart.toJSON();
                delete copiedProperties.invid;
                copiedProperties.quantity = 0;
                copiedProperties.invpool = Constants.INSTALL_POOL;
                copiedProperties.invsn = serialNum;
                targetPart = new this.partModelConstructor(copiedProperties);
                this.usedPartsCollection.add(targetPart);
            }

            sourcePart.set('quantity', (parseInt(sourcePart.get('quantity'), 10) || 0) - quantity);
            targetPart.set('quantity', (parseInt(targetPart.get('quantity'), 10) || 0) + quantity);
            targetPart.set('part_service_activity_used', activityId);
            let metadata = this.installedInventoriesSummary[index];

            if (!metadata) {
                metadata = this.installedInventoriesSummary[index] = {
                    invid: invid,
                    model: model,
                    activityId: activityId,
                    quantity_delta: 0,
                    quantity: quantity,
                    serialNum: serialNum
                };
            }
            metadata.quantity_delta += quantity;
            metadata.quantity = quantity;

            metadata.activityId = activityId;
        }

        removeUsedPart(model, serialNum) {

            return new Promise((resolve, reject) => {
                let resourcePart = this.resourcePartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
                let installedPart = this.usedPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
                let activityId = this._openData.activity.aid;
                if (!installedPart) {
                    resolve();
                    return false;
                }
                let index = '';
                if (serialNum) {
                    index = `${model}~${serialNum}`;
                } else {
                    index = model;
                };
                let quantity = parseInt(installedPart.get(Constants.QUANTITY), 10) || 0;
                if (!resourcePart) {
                    let copiedProperties = installedPart.toJSON();

                    delete copiedProperties.invid;

                    copiedProperties.quantity = 0;
                    copiedProperties.invpool = 'provider';
                    resourcePart = new this.partModelConstructor(copiedProperties);

                    this.resourcePartsCollection.add(resourcePart);
                }
                resourcePart.set(Constants.QUANTITY, (parseInt(resourcePart.get(Constants.QUANTITY), 10) || 0) + quantity);
                installedPart.set(Constants.QUANTITY, (parseInt(installedPart.get(Constants.QUANTITY), 10) || 0) - quantity);
                let metadata = this.installedInventoriesSummary[index];
                if (!metadata) {
                    metadata = this.installedInventoriesSummary[index] = {
                        invid: installedPart.get(Constants.INV_ID),
                        model: model,
                        quantity_delta: 0
                    };
                }
                if (metadata.quantity_delta == 0) {
                    this.installedUpdateInventoriesSummary[index] = {
                        invid: metadata.invid,
                        model: model,
                        activityId: activityId,
                        quantity_delta: quantity,
                        quantity: quantity,
                        serialNum: serialNum
                    };
                    this.ofscConnector.sendMessage(this._getOfscUpdateData())
                        .then((data) => {
                            console.log('RESPONSE DATA: ', data);
                            this.installedUpdateInventoriesSummary = {};
                            this.partsInventoryUpdateActionsCollection.reset();
                            resolve(data);
                        })
                        .catch((error) => {
                            this.errorAlertPopup(Constants.CRITICAL_ERROR, 'Error processing your request');
                            console.error(error);
                            resourcePart.set(Constants.QUANTITY, (parseInt(resourcePart.get(Constants.QUANTITY), 10) || 0) - quantity);
                            installedPart.set(Constants.QUANTITY, (parseInt(installedPart.get(Constants.QUANTITY), 10) || 0) + quantity);
                            this.installedUpdateInventoriesSummary = {};
                            this.partsInventoryUpdateActionsCollection.reset();
                            this.setDeleteInventoryList([]);
                        });
                } else {
                    resolve();
                }
                this.initializeInventorySearchService();
                delete this.installedInventoriesSummary[index]

            });

        }

        addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
            let id = inventoryModel.get('part_item_number_rev');
            let sourcePart = this.customerPartsCollection.findWhere({part_item_number_rev: id, invsn : serialNum});
            let targetPart = this.returnedPartsCollection.findWhere({part_item_number_rev: id, invsn : serialNum});
            if(serialNum) {
                id = id + '~' + serialNum;
            }
            if (!targetPart) {
                let copiedProperties = inventoryModel.toJSON();
                delete copiedProperties.invid;
                copiedProperties.quantity = 0;
                copiedProperties.invpool = 'deinstall';
                copiedProperties.invsn = serialNum;
                targetPart = new this.partModelConstructor(copiedProperties);
                targetPart.set('part_item_number', id);
                this.returnedPartsCollection.add(targetPart);
            }
            if (sourcePart) {
                sourcePart.set(Constants.QUANTITY, (parseInt(sourcePart.get(Constants.QUANTITY), 10) || 0) - quantity);
            } else {
                let foundCreatedPart = this.createdDeinstalledPartsCollection.findWhere({part_item_number_rev: inventoryModel.get('part_item_number_rev'), invsn: serialNum});
                if (!foundCreatedPart) {
                    inventoryModel.set(Constants.QUANTITY, parseInt(quantity, 10) || 0);
                    inventoryModel.set('part_item_number', id);
                    this.createdDeinstalledPartsCollection.add(inventoryModel);
                } else {
                    foundCreatedPart.set(Constants.QUANTITY, (parseInt(foundCreatedPart.get(Constants.QUANTITY), 10) || 0) + quantity);
                }
            }
            targetPart.set(Constants.QUANTITY, (parseInt(targetPart.get(Constants.QUANTITY), 10) || 0) + quantity);
            targetPart.set('part_service_activity_returned', activityId);
            let metadata = this.deinstalledInventoriesSummary[id];
            if (!metadata) {
                metadata = this.deinstalledInventoriesSummary[id] = {
                    invid: null,
                    model: inventoryModel.get('part_item_number_rev'),
                    activityId: activityId,
                    quantity_delta: 0,
                    quantity: quantity,
                    invsn: serialNum
                };
            }
            metadata.quantity_delta += quantity;
            metadata.quantity = quantity;


            metadata.activityId = activityId;
        }

        removeReturnedPart(model, serialNum) {
            return new Promise((resolve, reject) => {
                let id = model;
                let customerPart = this.customerPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
                let deinstalledPart = this.returnedPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
                if (!deinstalledPart) {
                    resolve();
                    return false;
                }
                let activityId = this._openData.activity.aid
                let quantity = parseInt(deinstalledPart.get(Constants.QUANTITY), 10) || 0;
                if (!customerPart) {
                    let copiedProperties = deinstalledPart.toJSON();
                    delete copiedProperties.invid;
                    copiedProperties.quantity = 0;
                    copiedProperties.invpool = 'customer';
                    copiedProperties.invsn = serialNum;
                    customerPart = new this.partModelConstructor(copiedProperties);
                    this.customerPartsCollection.add(customerPart);
                }
                customerPart.set(Constants.QUANTITY, (parseInt(customerPart.get(Constants.QUANTITY), 10) || 0) + quantity);
                deinstalledPart.set(Constants.QUANTITY, (parseInt(deinstalledPart.get(Constants.QUANTITY), 10) || 0) - quantity);
                if (serialNum) {
                    id = `${id}~${serialNum}`;
                }
                let metadata = this.deinstalledInventoriesSummary[id];
                if (!metadata) {
                    metadata = this.deinstalledInventoriesSummary[id] = {
                        invid: deinstalledPart.get(Constants.INV_ID),
                        model: model,
                        quantity_delta: 0,
                        activityId: deinstalledPart.get('part_service_activity_returned'),
                        invsn: serialNum
                    };
                }

                if (metadata.quantity_delta == 0) {
                    this.deinstalledUpdateInventoriesSummary[id] = {
                        invid: deinstalledPart.get(Constants.INV_ID),
                        model: model,
                        activityId: activityId,
                        quantity_delta: 0,
                        quantity: quantity,
                        invsn: serialNum
                    };
                    this.ofscConnector.sendMessage(this._getOfscUpdateData())
                        .then((data) => {
                            console.log('RESPONSE DATA: ', data);
                            this.deinstalledUpdateInventoriesSummary = {};
                            this.partsInventoryUpdateActionsCollection.reset();
                            resolve(data);
                        })
                        .catch((error) => {
                            this.errorAlertPopup(Constants.CRITICAL_ERROR, 'Error processing your request');
                            console.error(error);
                            customerPart.set(Constants.QUANTITY, (parseInt(customerPart.get(Constants.QUANTITY), 10) || 0) - quantity);
                            deinstalledPart.set(Constants.QUANTITY, (parseInt(deinstalledPart.get(Constants.QUANTITY), 10) || 0) + quantity);
                            this.deinstalledUpdateInventoriesSummary = {};
                            this.partsInventoryUpdateActionsCollection.reset();
                            this.setDeleteInventoryList([]);
                        });
                } else {
                    resolve();
                }
                delete this.deinstalledInventoriesSummary[id]
            });

        }

        _addInstallUpdateInventoryAction({invid, inv_aid, invsn, quantity, properties}) {
            this.partsInventoryUpdateActionsCollection.add({
                action: 'undo_install',
                invid,
                inv_aid,
                invsn,
                quantity,
                properties: properties || {}
            });
        }

        _addInstallInventoryAction({invid, inv_aid, invsn, quantity, properties}) {
            this.partsInventoryActionsCollection.add({
                action: 'install',
                invid,
                inv_aid,
                invsn,
                quantity,
                properties: properties || {}
            });
        }

        _addDeinstallInventoryAction({invid, inv_pid, quantity, properties}) {
            this.partsInventoryActionsCollection.add({
                action: 'deinstall',
                invid,
                inv_pid,
                quantity,
                properties: properties || {}
            });
        }


        _createDeinstallInventoryAction(inventoryModel, additionalProperties = {}) {
            let properties = inventoryModel.toJSON();

            delete properties.invid;
            delete properties.inv_aid;
            delete properties.inv_pid;
            delete properties.quantity;
            delete properties.invpool;
            delete properties.invtype;
            delete properties.invsn;

            if(inventoryModel.get(Constants.INV_TYPE) === Constants.INVENTORY_TYPE_PART_SN) {
                this.partsInventoryActionsCollection.add({
                    action: 'create',
                    entity: 'inventory',
                    inv_aid: inventoryModel.get('inv_aid'),
                    inv_pid: inventoryModel.get('inv_pid'),
                    invtype: inventoryModel.get(Constants.INV_TYPE),
                    invpool: inventoryModel.get('invpool'),
                    properties: Object.assign(properties || {}, additionalProperties)
                });
            } else {
                this.partsInventoryActionsCollection.add({
                    action: 'create',
                    entity: 'inventory',
                    inv_aid: inventoryModel.get('inv_aid'),
                    inv_pid: inventoryModel.get('inv_pid'),
                    invtype: inventoryModel.get(Constants.INV_TYPE),
                    quantity: inventoryModel.get(Constants.QUANTITY),
                    invpool: inventoryModel.get('invpool'),
                    properties: Object.assign(properties || {}, additionalProperties)
                });
            }

        }

        _addUndoInstallInventoryAction({invid, quantity, invsn, properties}) {
            this.partsInventoryActionsCollection.add({
                action: 'undo_install',
                invid,
                quantity,
                invsn,
                properties: properties || {}
            });
        }

        _addUndoDeinstallInventoryAction({invid, quantity, properties}) {
            this.partsInventoryActionsCollection.add({
                action: 'undo_deinstall',
                invid,
                quantity,
                properties: properties || {}
            });
        }

        _addUndoDeinstallUpdateInventoryAction({invid, quantity, properties}) {
            this.partsInventoryUpdateActionsCollection.add({
                action: 'undo_deinstall',
                invid,
                quantity,
                properties: properties || {}
            });
        }

        _generateUpdatedPartsActions() {
            const handleInventoryAction = (model, summary, collection, addAction, errorMsg, isUndo = false) => {
                let serialNum = null;
                if (model.includes("~")) {
                    [model, serialNum] = model.split("~");
                }
                let sourceInventory = collection.findWhere({ part_item_number_rev: model, invsn: serialNum });
                if (!sourceInventory || !sourceInventory.get(Constants.INV_ID)) {
                    console.error(errorMsg + model);
                    return;
                }
                const actionData = {
                    invid: sourceInventory.get(Constants.INV_ID),
                    inv_aid: this.ofscActivityModel.get(Constants.ACT_ID),
                    properties: {
                        invsn : summary.serialNum
                    }
                };
                if (Constants.INVENTORY_TYPE_PART_SN === sourceInventory.get(Constants.INV_TYPE)) {
                    actionData.properties.invsn = summary.serialNum;
                    if (isUndo) {
                        this._addUndoDeinstallUpdateInventoryAction(actionData);
                    } else {
                        addAction(actionData);
                    }
                } else {
                    this.processQuantityForDeinstall(isUndo, actionData, summary, addAction);
                }
            };
            // Parts added
            Object.entries(this.installedUpdateInventoriesSummary).forEach(([model, summary]) => {
                handleInventoryAction(model, summary, this.usedPartsCollection, this._addInstallUpdateInventoryAction.bind(this), "Unable to locate resource part, part_item_number_rev = ");
            });

            // Parts deinstalled
            Object.entries(this.deinstalledUpdateInventoriesSummary).forEach(([model, summary]) => {
                handleInventoryAction(model, summary, this.returnedPartsCollection, this._addUndoDeinstallUpdateInventoryAction.bind(this), "Unable to undo deinstall of inventory, part_item_number_rev = ", true);
            });
        }

        processQuantityForDeinstall(isUndo, actionData, summary, addAction) {
            if (!isUndo) actionData.quantity = summary.quantity;
            if (isUndo) {
                actionData.quantity = Math.abs(summary.quantity);
                this._addUndoDeinstallUpdateInventoryAction(actionData);
            } else {
                addAction(actionData);
            }
        }

        _generatePartsActions() {
            // parts added:
            Object.entries(this.installedInventoriesSummary).forEach(([model, summary]) => {
                let serialNum = null;
                if(model.indexOf("~") !== -1) {
                    let splitArray = [];
                    splitArray = model.split("~");
                    model = splitArray[0];
                    serialNum = splitArray[1];
                }
                this.processSourceInventory(summary, model, serialNum);
            });

            // parts returned:
            Object.entries(this.deinstalledInventoriesSummary).forEach(([model, summary]) => {
                let serialNum = null;
                if(model.indexOf("~") !== -1) {
                    let splitArray = [];
                    splitArray = model.split("~");
                    model = splitArray[0];
                    serialNum = splitArray[1];
                }
                if (summary.quantity_delta > 0) {
                    // deinstall action:
                    this.processDeinstallForPartsReturned(model, serialNum, summary);
                }
            });
        }

        processUndoDeinstallForPartsReturned(model, serialNum, summary) {
            let sourceInventory = this.returnedPartsCollection.findWhere({
                part_item_number_rev: model,
                invsn: serialNum
            });

            if (!sourceInventory || !sourceInventory.get(Constants.INV_ID)) {
                console.error(Constants.UNABLE_TO_UNDO_DEINSTALL_MESSAGE + model);
                return;
            }

            if (sourceInventory.get("invtype") === Constants.INVENTORY_TYPE_PART_SN) {
                this._addUndoDeinstallInventoryAction({
                    invid: sourceInventory.get(Constants.INV_ID)
                });
            } else {
                this._addUndoDeinstallInventoryAction({
                    invid: sourceInventory.get(Constants.INV_ID),
                    quantity: Math.abs(summary.quantity_delta)
                });
            }
        }

        processDeinstallForPartsReturned(model, serialNum, summary) {
            let sourceInventory = this.customerPartsCollection.findWhere({
                part_item_number_rev: model,
                invsn: serialNum
            });
            let inventoryFound = false;

            let additionalProperties = {
                part_service_activity_returned: summary.activityId,
                invsn: summary.invsn
            };

            if (!sourceInventory || !sourceInventory.get(Constants.INV_ID)) {
                this.locateCustomerPart(model, serialNum, summary, additionalProperties);
            } else {
                inventoryFound = true;
            }

            if (inventoryFound) {
                if (sourceInventory.get("invtype") === Constants.INVENTORY_TYPE_PART_SN) {
                    this._addDeinstallInventoryAction({
                        invid: sourceInventory.get(Constants.INV_ID),
                        inv_pid: this.resource.GetId(),
                        properties: additionalProperties
                    });

                } else {
                    this._addDeinstallInventoryAction({
                        invid: sourceInventory.get(Constants.INV_ID),
                        inv_pid: this.resource.GetId(),
                        quantity: this.deinstalledUpdateInventoriesSummary[model] ? summary.quantity : summary.quantity_delta,
                        properties: additionalProperties
                    });
                }
            }
        }



        locateCustomerPart(model, serialNum, summary, additionalProperties) {
            let createdInventoryModel = this.createdDeinstalledPartsCollection.findWhere({
                part_item_number_rev: model,
                invsn: serialNum
            });

            if (createdInventoryModel) {
                if (summary.invsn) {
                    createdInventoryModel.set(Constants.INV_TYPE, Constants.INVENTORY_TYPE_PART_SN);
                }
                this._createDeinstallInventoryAction(createdInventoryModel, additionalProperties);
            } else {
                console.error(Constants.UNABLE_TO_LOCATE_PART_MESSAGE + model);
            }
        }

        processSourceInventory(summary, model, serialNum) {
            if (summary.quantity_delta > 0) {
                // install action:
                let sourceInventory = this.resourcePartsCollection.findWhere({
                    part_item_number_rev: model,
                    invsn: serialNum
                });
                this.processInstalledInventory(sourceInventory, model, summary);
            }
        }

        processUninstallInventory(sourceInventory, model, summary) {
            if (!sourceInventory || !sourceInventory.get(Constants.INV_ID)) {
                console.error(Constants.UNABLE_TO_INSTALL_INV_MESSAGE + model);
                return;
            }
            if (Constants.INVENTORY_TYPE_PART_SN === sourceInventory.get(Constants.INV_TYPE)) {
                this._addUndoInstallInventoryAction({
                    invid: summary.invid,
                    invsn: summary.serialNum
                });
            }
            else { this._addUndoInstallInventoryAction({
                invid: sourceInventory.get(Constants.INV_ID),
                quantity: Math.abs(summary.quantity_delta),
                invsn: summary.serialNum
            });}
        }

        processInstalledInventory(sourceInventory, model, summary) {
            if (!sourceInventory || !sourceInventory.get(Constants.INV_ID)) {
                console.error("Unable to locate resource part, part_item_number_rev = " + model);
                return;
            }
            if (Constants.INVENTORY_TYPE_PART_SN === sourceInventory.get(Constants.INV_TYPE)) {
                this._addInstallInventoryAction({
                    invid: sourceInventory.get(Constants.INV_ID),
                    inv_aid: this.ofscActivityModel.get(Constants.ACT_ID),
                    properties: {
                        part_service_activity_used: summary.activityId,
                        invsn: summary.serialNum
                    }
                });
            } else {
                this._addInstallInventoryAction({
                    invid: sourceInventory.get(Constants.INV_ID),
                    inv_aid: this.ofscActivityModel.get(Constants.ACT_ID),
                    quantity: this.installedUpdateInventoriesSummary[model] ? summary.quantity : summary.quantity_delta,
                    properties: {
                        part_service_activity_used: summary.activityId,
                    }
                });
            }
        }

        _getOfscUpdateData() {
            // generate installed\deinstalled parts actions:
            this._generateUpdatedPartsActions();
            return {
                method: Constants.ACTION_UPDATE,
                activity: this.ofscActivityModel.toJSON(),
                inventoryList: this._getOfscInventoryListUpdates(),
                actions: [].concat(
                    this._getOfscPartsInventoryUpdateActions(),
                    this._getOfscDeleteInventoryActions()
                )
            };
        }

        _getOfscCloseData() {
            console.log("_getOfscCloseData")
            this._generatePartsActions();
            return {
                method: Constants.ACTION_CLOSE,
                wakeupNeeded: true,
                wakeOnEvents: {
                    online: { wakeupDelay: 120 },
                    timer: { wakeupDelay: 120, sleepTimeout: 600 }
                },
                activity: this.ofscActivityModel.toJSON(),
                inventoryList: this._getOfscInventoryListUpdates(),
                actions: [].concat(
                    this._getOfscPartsInventoryActions(),
                    this._getOfscCreateLaborInventoryActions(),
                    this._getOfscCreateExpenseInventoryActions()
                )
            };
        }

        _getOfscInventoryListUpdates() {
            let inventoryList = {};

            this.partsInventoryActionsCollection.where({action: Constants.ACTION_UPDATE}).forEach((action) => {
                inventoryList[action.get(Constants.INV_ID)] = Object.assign({
                    invid: action.get(Constants.INV_ID),
                    invtype: action.get(Constants.INV_TYPE),
                    inv_aid: action.get('inv_aid'),
                    inv_pid: action.get('inv_pid'),
                    quantity: action.get(Constants.QUANTITY)
                }, action.properties);
            });

            return inventoryList;
        }

        _getOfscPartsInventoryUpdateActions() {
            return this.partsInventoryUpdateActionsCollection.filter(action => Constants.ACTION_UPDATE !== action.get('action')).map((action) => {
                return Object.assign({entity: 'inventory'}, action.toJSON());
            });
        }

        _getOfscPartsInventoryActions() {
            return this.partsInventoryActionsCollection.filter(action => Constants.ACTION_UPDATE !== action.get('action')).map((action) => {
                return Object.assign({entity: 'inventory'}, action.toJSON());
            });
        }

        _getOfscCreateLaborInventoryActions() {
            return this.laborItems().filter(labor => !labor['recordId']).map((labor) => {
                return {
                    entity: 'inventory',
                    action: 'create',
                    invpool: 'install',
                    invtype: Constants.INVENTORY_TYPE_LABOR,
                    inv_aid: this.ofscActivityModel.GetId(),
                    inv_pid: this.resource.GetId(),
                    properties: {
                        labor_service_activity: labor['activityId'],
                        labor_item_number: labor['itemId'],
                        labor_item_desc: labor['itemId'],
                        labor_start_time: labor['startTime'],
                        labor_end_time: labor['endTime'],
                        labor_default_start_time: labor['defaultStartTime'],
                        labor_default_end_time: labor['defaultEndTime']
                    }
                }
            });
        }

        _getOfscCreateExpenseInventoryActions() {
            return this.expenseItems().filter(expense => !expense['recordId']).map((expense) => {
                return {
                    entity: 'inventory',
                    action: 'create',
                    invpool: 'install',
                    invtype: Constants.INVENTORY_TYPE_EXPENSE,
                    inv_aid: this.ofscActivityModel.GetId(),
                    inv_pid: this.resource.GetId(),
                    properties: {
                        expense_service_activity: expense['activityId'],
                        expense_item_number: expense['itemId'],
                        expense_item_desc: expense['itemId'],
                        expense_amount: '' + expense['amount'],
                        expense_currency_code: expense['currencyKey']
                    }
                }
            });
        }

        /**
         *
         * @returns {Array}
         * @private
         */
        _getOfscDeleteInventoryActions() {
            const deletedInventoryList = this.getDeletedInventoryList();

            if (deletedInventoryList.length) {
                return deletedInventoryList.map(mapInventoryToDeleteAction);
            } else {
                return [];
            }
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

        _showErrorAlert(data) {
            let errorArray = data.errors.map((error) => {
                switch (error.code) {
                    case 'CODE_ACTION_INVENTORY_ACTIVITY_STATUS_INVALID':
                        return Constants.ACTIVITY_START_MESSAGE;

                    case 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED':
                        return Constants.ACTIVITY_NOT_PAST_MESSAGE;

                    default:
                        return error;
                }
            });

            if (errorArray.length === 0) {
                return;
            }
            errorArray = errorArray.filter((v,i,a)=>a.findIndex(v2=>['code'].every(k=>v2[k] ===v[k]))===i)
            if (errorArray.length === 1 && typeof(errorArray[0]) === 'string') {
                this.errorAlertPopup(Constants.CRITICAL_ERROR, errorArray.join(), '');
            }
            else {
                this.errorAlertPopup(Constants.CRITICAL_ERROR, JSON.stringify(errorArray, null, 4),'');
            }
        }

        errorAlertPopup(heading, message) {
            this.resolveAlertCallback = null;
            this.dialogHeading(heading);
            this.dialogMessage(message);
            document.getElementById('alertDialog').open();
            return new Promise((resolve, reject) => {
                this.resolveAlertCallback = resolve;
            });
        }

        closeDialog(event) {
            document.getElementById("alertDialog").close();
            if (this.resolveAlertCallback instanceof Function) {
                this.resolveAlertCallback();
            }
        }


        /**
         * @param {Array} list
         */
        addInventoryListToDeleted(list) {
            this.setDeleteInventoryList(list);
        }

        /**
         * @param {Array} list
         */
        setDeleteInventoryList(list) {
            this.deleteInventoryList = list;
        }

        /**
         * @returns {Array}
         */
        getDeletedInventoryList() {
            return this.deleteInventoryList || [];
        }

        async invokeTokens() {
            try {
                this._pluginApiTransport._initializeConnectors();
                this._fusionApiTransport = this._pluginApiTransport._fusionApiTransport;
                this._ofsRestApiTransport = this._pluginApiTransport._ofsApiTransport;
                await Promise.all([this._fusionApiTransport._renewToken(), this._ofsRestApiTransport._renewToken()]);
                this.invokeDebriefDefaultOrg();
            } catch(error) {
                this.errorAlertPopup(Constants.CRITICAL_ERROR, Constants.APP_TOKEN_ERROR_MESSAGE);
                console.error("Critical token error: ", error);
            }

        }

        invokeDebriefDefaultOrg() {
            this.strategy.loadDebriefDefaultOrg();
        }

    }

    /**
     * @param {Object} inventory
     * @returns {{invid: string | *, action: string, entity: string}}
     */
    function mapInventoryToDeleteAction(inventory) {
        return {
            entity: Constants.INVENTORY_ENTITY_NAME,
            action: Constants.DELETE_ACTION_NAME,
            invid: inventory.recordId
        }
    }

    return ControllerViewModel;
});