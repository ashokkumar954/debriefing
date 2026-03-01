/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

/*
 * Your dashboard ViewModel code goes here
 */
define([
    'knockout',
    'jquery',
    'utils/dom',
    'constants',
    'ojs/ojcore',
    'ojs/ojarraydataprovider',
    'ojs/ojcollectiontabledatasource',
    'ojs/ojlistview',
    'ojs/ojlistitemlayout',
    'ojs/ojbutton',
    'ojs/ojoption',
    'ojs/ojcollapsible',
    'ojs/ojdialog',
    'ojs/ojpopup'
    
], function (
    ko,
    $,
    dom,
    Constants,
    oj,
    ArrayDataProvider
) {
    let constructScreen = function () {
        let screen = new DashboardViewModel();
        return screen;
    };

    class DashboardViewModel {
        constructor() {
            // Below are a subset of the ViewModel methods invoked by the ojModule binding
            // Please reference the ojModule jsDoc for additional available methods.

            /**
             * Optional ViewModel method invoked when this ViewModel is about to be
             * used for the View transition.  The application can put data fetch logic
             * here that can return a Promise which will delay the handleAttached function
             * call below until the Promise is resolved.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
             * the promise is resolved
             */
            this.handleActivated = function (info) {
                this._controller = info.valueAccessor().params.app;
                this.timeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
                this.isViewable = ko.observable(false);
                this.laborItems = this._controller.laborItems.sort((a, b) => a.itemId.localeCompare(b.itemId));
               
                this.expenseItems = this._controller.expenseItems.sort((a, b) => a.itemId.localeCompare(b.itemId));;
                this.usedPartsCollection = this._controller.usedPartsCollection;
                this.returnedPartsCollection = this._controller.returnedPartsCollection;

                this.defaultStartTime = ko.observable('');
                this.defaultEndTime = ko.observable('');
                this.startTime = ko.observable('');
                this.endTime = ko.observable('');
                this.deletePopUpMessage = "You won't be able to recover it.";
                

                this.laborDataProvider = new ArrayDataProvider(this.laborItems, {'idAttribute': 'id'});
                this.expenseDataProvider = new ArrayDataProvider(this.expenseItems, {'idAttribute': 'id'});

                this.usedPartsObservableArray = ko.observableArray(this._getUsedPartsArray());
                this.usedPartsDataSource = new ArrayDataProvider(this.usedPartsObservableArray, {idAttribute: 'id'});

                this.returnedPartsObservableArray = ko.observableArray(this._getReturnedPartsArray());
                this.returnedPartsDataSource = new ArrayDataProvider(this.returnedPartsObservableArray, {idAttribute: 'id'});

                this._activityModel = this._controller.ofscActivityModel;
                this.dialogHeading = ko.observable('');
                this.currentItemId = ko.observable('');

                this.isEmptyLaborSec = ko.pureComputed(() => ( this.laborItems().length > 0 ) );
                this.isEmptyExpSec = ko.pureComputed(() => ( this.expenseItems().length > 0 ) );
                this.isEmptyUsedPartsSec = ko.pureComputed(() => ( this.usedPartsObservableArray().length > 0 ) );
                this.isEmptyReturnPartsSec = ko.pureComputed(() => ( this.returnedPartsObservableArray().length > 0 ) );
                
                this.menuItemAction = (event) => {
                        this.selectedMenuItem(event.detail.selectedValue);
                };
                this.selectedMenuItem = ko.observable('');  
                this.selectedMenuItem.subscribe(menuItem => {
                    if(menuItem === 'labor') {
                        //this._controller.router.go('add-labor');
                        this._controller.router.go('test-flow');
                    } else if(menuItem === 'addParts') {
                        return this._controller.router.go('add-used-part');
                    } else if(menuItem === 'returnParts') {
                        return this._controller.router.go('add-returned-part');
                    } else if(menuItem === 'expenses') {
                        return this._controller.router.go('add-expense');
                    }
                });
            };

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
             */
            this.handleAttached = function (info) {
                // Implement if needed
            };


            /**
             * Optional ViewModel method invoked after the bindings are applied on this View.
             * If the current View is retrieved from cache, the bindings will not be re-applied
             * and this callback will not be invoked.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             */
            this.handleBindingsApplied = function (info) {
                dom.resetScrolling();
            };

            /**
             * Optional ViewModel method invoked after the View is removed from the
             * document DOM.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            this.handleDetached = function (info) {
                // Implement if needed
            };
        }

        closeDialog() {
            document.getElementById("modalDialog").close();
        }
        openDialog(source, event, currentObj) {
            let popupMssg = '';
            if(source === 'labor' || source === 'expenses') {
                popupMssg = currentObj.data.item_label;
            } else if(source === 'usedParts' || source === 'returnParts') {
                popupMssg = this.getpopupMessage(currentObj);
            }
            this.dialogHeading("Delete " + popupMssg + "?");
            if(currentObj.data.inventory && currentObj.data.inventory.get('invsn') !== '') {
                this.currentItemId(event.currentTarget.id + ',' + currentObj.data.inventory.attributes.invsn);
            } else {
                this.currentItemId(event.currentTarget.id);
            }
            document.getElementById("modalDialog").open();
        }

        getpopupMessage(currentObj) {
            let popupMssg = '';
            if (currentObj.data.inventory.get('invsn') != null && currentObj.data.inventory.get('invsn') != '') {
                popupMssg = currentObj.data.id.concat(" (", currentObj.data.inventory.get('invsn'), ")");
            } else {
                popupMssg = currentObj.data.id.concat(" (", currentObj.data.measuredQuantity, ")");
            }
            return popupMssg;
        }

        deleteSelectedItem(event) {
            let currentItem = event.currentTarget.id;
            
            let itemArray = currentItem.split(',');
            let currentItemId = itemArray[0];
            let type = itemArray[1];
            let invsn = itemArray[2];
            
            if(type === 'labor') {
                this.removeSelectedLabors(+currentItemId);
            } else if(type === 'expenses') {
                this.removeSelectedExpenses(+currentItemId);
            } else if(type === 'usedParts') {
                if(invsn && invsn !== 'null') {
                    this.removeSelectedUsedParts(currentItemId, invsn);
                } else {
                    this.removeSelectedUsedParts(currentItemId, null);
                }
            } else if(type === 'returnParts') {
                if(invsn && invsn !== 'null') {
                    this.removeSelectedReturnedParts(currentItemId, invsn);
                } else {
                    this.removeSelectedReturnedParts(currentItemId, null);
                }
            }
            this.closeDialog();
            
        }

        _getUsedPartsArray() {
            return this.usedPartsCollection
                .filter(inventoryModel => (parseInt(inventoryModel.get('quantity', 10)) || 0) >= 1)
                .map(inventoryModel => this.getInventoryViewModel(inventoryModel));
        }

        _getReturnedPartsArray() {
            return this.returnedPartsCollection
                .filter(inventoryModel => (parseInt(inventoryModel.get('quantity', 10)) || 0) >= 1)
                .map(inventoryModel => this.getInventoryViewModel(inventoryModel));
        }

        getInventoryViewModel(inventory) {
            let uomText = '';

            if (this._controller._attributeDescription.part_uom_code && this._controller._attributeDescription.part_uom_code.enum && this._controller._attributeDescription.part_uom_code.enum[inventory.get('part_uom_code')]) {
                uomText = this._controller._attributeDescription.part_uom_code.enum[inventory.get('part_uom_code')].text;
            }

            if (uomText !== '') {
                uomText = ' ' + uomText;
            }

            return {
                id: inventory.get('part_item_number_rev'),
                inventory: inventory,
                serviceActivityUsed: inventory.get('part_service_activity_used') && this._controller._attributeDescription.part_service_activity_used.enum[inventory.get('part_service_activity_used')] && this._controller._attributeDescription.part_service_activity_used.enum[inventory.get('part_service_activity_used')].text,
                serviceActivityReturned: inventory.get('part_service_activity_returned') && this._controller._attributeDescription.part_service_activity_returned.enum[inventory.get('part_service_activity_returned')] && this._controller._attributeDescription.part_service_activity_returned.enum[inventory.get('part_service_activity_returned')].text,
                measuredQuantity: `${inventory.get('quantity')}${uomText}`,
                dispositionText: inventory.get('part_disposition_code') &&
                    this._controller._attributeDescription.part_disposition_code &&
                    this._controller._attributeDescription.part_disposition_code.enum &&
                    this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')] &&
                    this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')].text
            };
        }

        removeSelectedUsedParts(id, serialNum) {
            this._controller.removeUsedPart(id, serialNum)
                .then(() => {
                    this.usedPartsObservableArray(this._getUsedPartsArray());
                })
                .catch((error) => {
                    console.error("Error removing added part:", error);
                });
        }

        removeSelectedReturnedParts(id, serialNum) {
            this._controller.removeReturnedPart(id, serialNum)
                .then(() => {
                    this.returnedPartsObservableArray(this._getReturnedPartsArray());
                })
                .catch((error) => {
                    console.error("Error removing returned part:", error);
                });
        }

        onCloseButtonClick() {
            this._controller.terminatePlugin();
        }

        onPreviewInvoiceButtonClick() {
            this._controller.router.go('invoice');
        }

        

        onSaveButtonClick() {
          // this._activityModel.unset('csign');
          // this._activityModel.unset('invoice');
          this._controller.submitPluginData();
        }

        addLabor({activityId, itemId, startTime, endTime}) {
            return this._controller.addLabor({activityId, itemId, startTime, endTime});
        }

        removeSelectedLabors(id) {
            this._controller.removeLabor(id);
        }

        removeSelectedExpenses(id) {
            this._controller.removeExpense(id);
        }
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return constructScreen;
});
