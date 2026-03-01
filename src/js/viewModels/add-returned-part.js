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
        // non-referenced:
        'ojs/ojarraydataprovider',
        'ojs/ojinputtext',
        'ojs/ojinputnumber',
        'ojs/ojlistview',
        'ojs/ojformlayout',
        'ojs/ojselectcombobox',
        'ojs/ojvalidationgroup',
        'ojs/ojinputsearch',
        'utils/ko-text-highlighted-binding'
    ], function (ko, dom, ArrayDataProvider) {

        let constructScreen = function () {
            return new AddReturnedPartViewModel();
        };

        class AddReturnedPartViewModel {
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
                this.partActivityReturnedEnumCollection = this._controller.partActivityReturnedEnumCollection;
                this.activityId = ko.observable('');
                this.serialNum = ko.observable('');
                this.isSerialized = ko.observable(false);
                this.displayMoreButton = ko.observable(false);
                this.inventories = this._controller.customerPartsCollection
                    .map(inventory => this.getInventoryViewModel(inventory))
                    .sort((first, second) => {
                        let firstName = first.inventory.get('part_item_number') || '';
                        let secondName = second.inventory.get('part_item_number') || '';
                        return firstName.toString().localeCompare(secondName);
                    });

                this.inventoriesDataProvider = new oj.ArrayDataProvider(
                    this.inventories,
                    {'idAttribute': 'id'}
                );

                this.selectMessagesCustomBillingType = ko.observable([]);

                this.isSearchByPartsCatalog = ko.observable(false);

                this.listViewSelection = ko.observable([]);

                this.listViewSelection.subscribe((newValue) => {
                    this.populateSelectedInventory(newValue);
                });

                this.dataValidation = {
                    detail: "Enter a valid value.",
                    summary: "",
                    severity: "error",
                };

                this.selectedInventory = ko.observable(null);
                this.selectedIventoryMeasureUnit = ko.pureComputed(() => {
                    let inventoryViewModel = this.selectedInventory();
                    return this.processSelectedInventoryMeasuringUnit(inventoryViewModel);
                });
                this.activityEnumArray = new ArrayDataProvider(this.partActivityReturnedEnumCollection.map((model) => {
                    return {
                        value: model.get('id'),
                        label: model.get('text')
                    }
                }), {keyAttributes: "value"});
                this.activityId(this.activityEnumArray.data[0].value);

                this.quantity = ko.observable(1);

                this.searchRequest = ko.observable('');

                this.isSearchContinueAvailable = ko.observable(false);
                this.currentSearchId = ko.observable(null);
                this.searchContinueLoading = ko.observable(false);

                this.isLoading = ko.observable(false);
                this.isSearchInProgress = ko.observable(false);
                this.searchResultItems = ko.observableArray([]);

                this.currentSearchPromise = Promise.resolve();

                this.noResults = ko.pureComputed(() => {
                    return this.searchResultItems().length <= 0;
                });

                this._nextSearchRequest = null;

                this.searchRequestFiltered = ko.pureComputed(() => {
                    return this.filterSearchRequest();
                });

                this.partsCatalogDataService = this._controller._partsCatalogDataService;
                this.catalogCollection = this._controller._catalogCollection;

                this.searchRequestFiltered.subscribe(newValue => {
                    if (!newValue) {
                        // the search request has been cleared - cancel any requests.
                        this._nextSearchRequest = null;
                        this.clearSearchResults();
                        this.isLoading(false);
                        this.isSearchInProgress(false);
                        this.isSearchContinueAvailable(false);
                        this.searchContinueLoading(false);
                        this.currentSearchId(null);
                        return;
                    }
                    this.isLoading(true);
                    this.isSearchInProgress(true);
                    if (this._nextSearchRequest === null) {
                        this._nextSearchRequest = newValue;
                        this.currentSearchPromise.then(() => {
                            let request = this._nextSearchRequest;
                            if (!request) {
                                return Promise.resolve();
                            }
                            this._nextSearchRequest = null;


                            let promises = [];

                            promises.push(
                                this.partsCatalogDataService.searchParts(request, 10).then(
                                    result => {
                                        this.isSearchContinueAvailable(result.isContinueAvailable);
                                        this.searchContinueLoading(false);
                                        this.currentSearchId(result.searchId);
                                        this.searchResultItems(result.items);
                                        return Promise.resolve();
                                    }
                                )
                            );

                            this.currentSearchPromise = Promise.all(promises)
                                .then(() => {
                                    this.isLoading(false);
                                })
                                .catch(error => {
                                    console.error(error);
                                    this.isLoading(false);
                                });
                            return this.currentSearchPromise;
                        });
                    } else {
                        this._nextSearchRequest = newValue; // the promise already exists, just replace it's searchRequest
                    }

                });

                this.showSearchResults = ko.pureComputed(() => {
                    let isSearchInProgress = this.isSearchInProgress();
                    let isLoading = this.isLoading();
                    if (!isSearchInProgress) {
                        return false;
                    }
                    return !(isLoading && this.searchResultItems().length <= 0 && !this.noResults());
                });
                this.isSerialized = ko.pureComputed(() => this.serialNum().length > 0);
                this.isSerialized.subscribe(newValue => {
                    this.quantity(1);
                });

            }

            filterSearchRequest() {
                let request = this.searchRequest();
                request = request.trim();
                return request.length < 3 ? '' : request;
            }

            processSelectedInventoryMeasuringUnit(inventoryViewModel) {
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
            }

            populateSelectedInventory(newValue) {
                if (newValue && newValue.length === 1) {
                    let id = newValue[0];
                    let inventoryViewModel = this.inventories.find(viewModel => viewModel.id === id);
                    if (inventoryViewModel) {
                        this.selectedInventory(inventoryViewModel);
                    }
                }
            }

            clearSearchResults() {
                this.searchResultItems([]);
            }

            continueSearch() {
                if (!this.isSearchContinueAvailable() || !this.currentSearchId() || this.searchContinueLoading()) {
                    return false;
                }
                this.searchContinueLoading(true);
                let searchId = this.currentSearchId();
                this.partsCatalogDataService.searchPartsContinue(searchId).then(result => {
                    if (this._disposed) {
                        return;
                    }
                    if (this.currentSearchId() !== searchId) {
                        return;
                    }
                    this.searchContinueLoading(false);
                    this.searchResultItems(this.searchResultItems().concat(result.items));
                    this.isSearchContinueAvailable(result.isContinueAvailable);
                    this.currentSearchId(result.searchId);
                });
            }

            /**
             * @param {PartModel} part
             */
            partSelected(part) {
                let uom_code = part.fields['part_uom_code'] || 'ea';
                if (!this._controller._attributeDescription.part_uom_code || !this._controller._attributeDescription.part_uom_code.enum[uom_code]) {
                    uom_code = 'ea';
                }

                let disposition_code = part.fields['part_disposition_code'] || 'N';
                if (!this._controller._attributeDescription.part_disposition_code.enum[disposition_code]) {
                    disposition_code = 'N';
                }

                let inventory = new this._controller.partModelConstructor({
                    part_item_number: ('' + part.fields['part_item_number']) || '',
                    part_item_revision: ('' + part.fields['part_item_revision']) || '',
                    part_item_number_rev: part.label,
                    part_item_desc: part.fields['part_item_desc'] || '',
                    part_uom_code: uom_code,
                    part_disposition_code: disposition_code,
                    invtype: 'part',
                    invpool: 'deinstall',
                    inv_aid: this._controller.ofscActivityModel.get('aid'),
                    inv_pid: this._controller.resource.get('id')
                });


                this.selectedInventory(this.getInventoryViewModel(inventory));
                console.log('PART SELECTED: ', part);
            }

            searchAtPartsCatalog() {
                this.clearSearchResults();
                this.searchRequest('');
                this.isSearchByPartsCatalog(true);
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
                    measuredQuantity: inventory.get('quantity') ? `${inventory.get('quantity')}${uomText}` : '',
                    dispositionText: inventory.get('part_disposition_code') &&
                        this._controller._attributeDescription.part_disposition_code &&
                        this._controller._attributeDescription.part_disposition_code.enum &&
                        this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')] &&
                        this._controller._attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')].text
                };
            }

            submit() {
                const valid = this._controller.checkValidationGroup();
                const validBillingType = this.activityId !== '' && this._validateBillingType(this.activityId);

                if (valid && !validBillingType)
                    this.selectMessagesCustomBillingType([this.dataValidation]);

                if (valid && validBillingType) {
                    let inventory = this.selectedInventory().inventory;
                    let quantity = this.quantity();
                    let invsn = null;
                    if (this.serialNum() != '') {
                        invsn = this.serialNum();
                        quantity = 1;
                        let item = this._controller.returnedPartsCollection.findWhere({
                            part_item_number_rev: inventory.get('part_item_number_rev'),
                            invsn: invsn
                        });
                        if (item && item.get('quantity') == 1) {
                            this._controller.errorAlertPopup('Critical Error', inventory.get('part_item_number_rev') + '(' + invsn + ') is already added.');
                            return;
                        }
                    }
                    inventory.set('invsn', invsn);
                    this._controller.addReturnedPart(
                        inventory,
                        this.activityId(),
                        quantity,
                        invsn
                    );

                    this._controller.router.go('dashboard', {historyUpdate: 'replace'});
                }
            }

            _validateBillingType() {
                return !!this.activityEnumArray.data.find(e => e.value === this.activityId())
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
            }

            back() {
                if (this.selectedInventory()) {
                    this.selectedInventory(null);
                    return;
                }
                if (this.isSearchByPartsCatalog()) {
                    this.isSearchByPartsCatalog(false);
                    return;
                }
                this.dismiss();
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
 