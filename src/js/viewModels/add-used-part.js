/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

"use strict";
define([
        'knockout',
        'utils/dom',
        'constants',
        // non-referenced:
        'ojs/ojarraydataprovider',
        'ojs/ojinputsearch',
        'ojs/ojinputnumber',
        'ojs/ojlistview',
        'ojs/ojformlayout',
        'ojs/ojselectcombobox',
        'ojs/ojvalidationgroup',
        'utils/ko-text-highlighted-binding'
    ], function (ko
        , dom
        ,Constants
        , ArrayDataProvider) {

        let constructScreen = function () {
            return new AddUsedPartViewModel();
        };

        class AddUsedPartViewModel {
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
            handleActivated(info) {
                this._controller = info.valueAccessor().params.app;

                this.partActivityUsedEnumCollection = this._controller.partActivityUsedEnumCollection;
                this.activityId = ko.observable('');
                this.searchSubstring = ko.observable('');
                this.serialNum = ko.observable('');
                this.selectedSerialInvId = ko.observable();
                this.selectMessagesCustomSerial = ko.observable([]);
                this.selectMessagesCustomBillingType = ko.observable([]);
                this.searchSubstringDebounced = ko.pureComputed(() => this.searchSubstring()).extend({rateLimit: 250});
                this.searchSubstringIsEmpty = ko.pureComputed(() => this.searchSubstringDebounced().length <= 0);

                this.searchResults = ko.computed(() =>
                    this._controller.inventorySearchService.searchBySubstring(this.searchSubstringDebounced())
                        .map(inventory => this.getInventoryViewModel(inventory))
                        .slice(0, 20)
                );

                this.invTypePart = Constants.INVENTORY_TYPE_PART;
                this.invTypePartSN = Constants.INVENTORY_TYPE_PART_SN;

                // converting computed array to observable array:
                this.searchResultsObservableArray = ko.observableArray();
                this.searchResultsSubscription = this.searchResults.subscribe((newValue) => {
                    this.searchResultsObservableArray(newValue);
                });
                this.searchResultsDataProvider = new oj.ArrayDataProvider(this.searchResultsObservableArray, {keyAttributes: ['id', 'invsn']});
                this.listViewSelection = ko.observable([]);
                this.listViewSelection.subscribe((newValue) => {
                    if (newValue && newValue.length === 1) {
                        let id = newValue[0][0];
                        let selSerialNum = newValue[0][1];
                        let inventoryViewModel = this.searchResults().find(viewModel => viewModel.id === id && viewModel.invsn === selSerialNum);
                        if (inventoryViewModel.inventory.get('invtype') === this.invTypePartSN) {
                            return this.processData(inventoryViewModel, id, selSerialNum);
                        }
                    }
                });


                this.listViewSelection.subscribe((newValue) => {
                    if (newValue && newValue.length === 1) {
                        let id = newValue[0][0];
                        let selSerialNum = newValue[0][1];
                        let inventoryViewModel = this.searchResults().find(viewModel => viewModel.id === id && viewModel.invsn === selSerialNum);
                        if (inventoryViewModel.inventory.get('invtype') === this.invTypePartSN) {
                            if (inventoryViewModel.inventory.get('quantity') > 0) {
                                this.invSerialNumArray = new ArrayDataProvider(this._controller.resourcePartsCollection
                                    .filter(model => (model.get('part_item_number_rev') === id && model.get('quantity') > 0 && model.get('invsn') !== null))
                                    .map(model => ({
                                        value: model.get('invsn'),
                                        label: model.get('invsn')
                                    })), {keyAttributes: "value"});
                                this.serialNum(selSerialNum);
                                if (this.invSerialNumArray.data.length === 0) {
                                    this._controller.errorAlertPopup('Critical Error', id + ' is not available in your inventory. Please update your inventory with this item and proceed.');
                                    return;
                                } else {
                                    this.invSerialNumArray.data.sort((a, b) => a.value.localeCompare(b.value));
                                }
                            } else {
                                this._controller.errorAlertPopup('Critical Error', id + '(' + selSerialNum + ') is not available in your inventory. Please update your inventory with this item and proceed.');
                                return;
                            }

                        }
                        if (inventoryViewModel) {
                            this.selectedInventory(inventoryViewModel);
                        }
                    }
                });



                this.dataValidation = {
                    detail: "Enter a valid value.",
                    summary: "",
                    severity: "error",
                };

                this.selectedInventory = ko.observable(null);
                this.selectedIventoryMeasureUnit = ko.pureComputed(() => {
                    let inventoryViewModel = this.selectedInventory();
                    if (!inventoryViewModel) {
                        return '';
                    }

                    if (!this._controller._attributeDescription.part_uom_code ||
                        !this._controller._attributeDescription.part_uom_code.enum ||
                        !inventoryViewModel.inventory.get('part_uom_code') ||
                        !this._controller._attributeDescription.part_uom_code.enum[inventoryViewModel.inventory.get('part_uom_code')]
                    ) {
                        return '';
                    }

                    return this._controller._attributeDescription.part_uom_code.enum[inventoryViewModel.inventory.get('part_uom_code')].text;
                });
                this.activityEnumArray = new ArrayDataProvider(this.partActivityUsedEnumCollection.map((model) => {
                    return {
                        value: model.get('id'),
                        label: model.get('text')
                    }
                }), {keyAttributes: "value"});
                this.activityId(this.activityEnumArray.data[0].value);
                this.quantity = ko.observable(1);

            }

            processData(inventoryViewModel, id, selSerialNum) {
                if (inventoryViewModel.inventory.get('quantity') > 0) {
                    this.invSerialNumArray = new ArrayDataProvider(this._controller.resourcePartsCollection
                        .filter(model => (model.get('part_item_number_rev') === id && model.get('quantity') > 0 && model.get('invsn') !== null))
                        .map(model => ({
                            value: model.get('invsn'),
                            label: model.get('invsn')
                        })), {keyAttributes: "value"});
                    this.serialNum(selSerialNum);
                    if (this.invSerialNumArray.data.length === 0) {
                        this._controller.errorAlertPopup('Critical Error', id + ' is not available in your inventory. Please update your inventory with this item and proceed.');
                        return;
                    } else {
                        this.invSerialNumArray.data.sort((a, b) => a.value.localeCompare(b.value));
                    }
                } else {
                    this._controller.errorAlertPopup('Critical Error', id + '(' + selSerialNum + ') is not available in your inventory. Please update your inventory with this item and proceed.');
                    return;
                }
                if (inventoryViewModel) {
                    this.selectedInventory(inventoryViewModel);
                }
            }

            findInventoryViewModel(id, serialNum) {
                return this.searchResults().find(viewModel => viewModel.id === id && viewModel.invsn === serialNum);
            }
            
            isPartSerialNumberType(inventoryViewModel) {
                return inventoryViewModel.inventory.get('invtype') === this.invTypePartSN;
            }
            handlePartSerialNumberType(id, selSerialNum, inventoryViewModel) {
                if (inventoryViewModel.inventory.get('quantity') <= 0) {
                    this.showErrorPopup(id, selSerialNum);
                    return;
                }
            
                this.invSerialNumArray = this.createSerialNumberDataProvider(id);
                this.serialNum(selSerialNum);
            
                if (this.invSerialNumArray.data.length === 0) {
                    this.showErrorPopup(id);
                    return;
                }
            
                this.sortSerialNumbers();
            }
            createSerialNumberDataProvider(id) {
                const filteredModels = this._controller.resourcePartsCollection.filter(model => 
                    model.get('part_item_number_rev') === id && 
                    model.get('quantity') > 0 && 
                    model.get('invsn') !== null
                );
            
                return new ArrayDataProvider(
                    filteredModels.map(model => ({
                        value: model.get('invsn'),
                        label: model.get('invsn')
                    })), 
                    { keyAttributes: "value" }
                );
            }

            showErrorPopup(id, selSerialNum = '') {
                const itemIdentifier = selSerialNum ? `${id}(${selSerialNum})` : id;
                this._controller.errorAlertPopup(
                    'Critical Error', 
                    `${itemIdentifier} is not available in your inventory. Please update your inventory with this item and proceed.`
                );
            }
            
            sortSerialNumbers() {
                this.invSerialNumArray.data.sort((a, b) => a.value.localeCompare(b.value));
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
                    invsn: inventory.get('invsn'),
                    inventory: inventory,
                    measuredQuantity: `${inventory.get('quantity')}${uomText}`,
                    dispositionText: inventory.get('part_disposition_code') &&
                        this._controller._attributeDescription.part_disposition_code &&
                        this._controller._attributeDescription.part_disposition_code.enum &&
                        this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')] &&
                        this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')].text
                };
            }

            submit() {
                const valid = this._controller.checkValidationGroup();
                const validSerialNum = !this._isSerializedInventory() || this._validateSerialNum(this.serialNum);
                const validBillingType = this._validateBillingType(this.activityId);

                if (valid && !validBillingType)
                    this.selectMessagesCustomBillingType([this.dataValidation]);
                if (valid && !validSerialNum)
                    this.selectMessagesCustomSerial([this.dataValidation]);
                if (valid && validSerialNum && validBillingType) {
                    let inventory = this.selectedInventory().inventory;
                    let quantity = this.quantity();
                    let invsn = null;
                    if (this.serialNum() != '') {
                        invsn = this.serialNum();
                    }
                    this._controller.addUsedPart(
                        inventory.get('part_item_number_rev'),
                        this.activityId(),
                        quantity,
                        invsn
                    );

                    this._controller.router.go('dashboard', {historyUpdate: 'replace'});
                }
            }

            _validateSerialNum() {
                return !!this.invSerialNumArray.data.find(e => e.value === this.serialNum())
            }

            _validateBillingType() {
                return !!this.activityEnumArray.data.find(e => e.value === this.activityId())
            }

            _isSerializedInventory() {
                return this.selectedInventory().inventory.get('invtype') === Constants.INVENTORY_TYPE_PART_SN;
            }

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
             */
            handleAttached(info) {
                // Implement if needed
            }


            /**
             * Optional ViewModel method invoked after the bindings are applied on this View.
             * If the current View is retrieved from cache, the bindings will not be re-applied
             * and this callback will not be invoked.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             */
            handleBindingsApplied(info) {
                dom.resetScrolling();
            }

            /*
             * Optional ViewModel method invoked after the View is removed from the
             * document DOM.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            handleDetached(info) {
                // Implement if needed
                this.searchResultsSubscription && this.searchResultsSubscription.dispose && this.searchResultsSubscription.dispose();
                this.searchResultsSubscription = null;
                this.activityId('');
            }


            dismiss() {
                if (this.selectedInventory()) {
                    this.listViewSelection([]);
                    this.selectedInventory(null);
                } else {
                    this._controller.router.go('dashboard', {historyUpdate: 'replace'});
                }
            }
        }

        return constructScreen;
    }
);
