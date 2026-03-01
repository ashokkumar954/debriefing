/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
        'knockout',
        'utils/dom',
        // non-referenced:
        'ojs/ojarraydataprovider',
        'ojs/ojselectcombobox',
        'ojs/ojinputtext',
        'ojs/ojselectcombobox',
        'ojs/ojinputnumber',
        'ojs/ojvalidationgroup',
        'ojs/ojformlayout'
    ], function (ko, dom, ArrayDataProvider) {

        let constructScreen = function () {
            return new AddExpenseViewModel();
        };

        class AddExpenseViewModel {

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

                this.expenseActivityEnumCollection = this._controller.expenseActivityEnumCollection;
                this.expenseItemEnumCollection = this._controller.expenseItemEnumCollection;
                this.expenseCurrencyEnumCollection = this._controller.expenseCurrencyEnumCollection;

                this.activityId = ko.observable('');
                this.expenseItemId = ko.observable('');
                this.amount = ko.observable(0);
                this.currencyKey = ko.observable('');

                this.selectMessagesCustomBillingType = ko.observable([]);
                this.selectMessagesCustomBillingItem = ko.observable([]);
                this.selectMessagesCustomCurrency = ko.observable([]);

                this.dataValidation = {
                    detail: "Enter a valid value.",
                    summary: "",
                    severity: "error",
                };

                this.activityEnumArray = new ArrayDataProvider(this.expenseActivityEnumCollection.map((model) => {
                    return {
                        value: model.get('id'),
                        label: model.get('text')
                    }
                }), {keyAttributes: "value"});
                this.activityId(this.activityEnumArray.data[0].value);

                this.expenseCurrencyEnumArray = new ArrayDataProvider(this.expenseCurrencyEnumCollection.map((currencyModel) => {
                    return {
                        value: currencyModel.get('id'),
                        label: currencyModel.get('text')
                    }
                }), {keyAttributes: "value"});
                this.currencyKey(this.expenseCurrencyEnumArray.data[0].value);

                this.expenseItemEnumArray = new ArrayDataProvider(this.expenseItemEnumCollection.map((expenseItemModel) => {
                    return {
                        value: expenseItemModel.get('id'),
                        label: expenseItemModel.get('label')
                    }
                }), {keyAttributes: "value"});
                this.expenseItemId(this.expenseItemEnumArray.data[0].value);

                this.expenseItemDescription = ko.pureComputed(() =>
                    this.expenseItemId()
                        ? this.expenseItemEnumCollection.get(this.expenseItemId()).get('label')
                        : ''
                );
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

            submit() {
                const valid = this._controller.checkValidationGroup();
                const validBillingType = this._validateBillingType(this.activityId);
                const validBillingItem = this._validateBillingItem(this.expenseItemId);
                const validCurrency = this._validateCurrency(this.currencyKey);

                if (valid && !validBillingType)
                    this.selectMessagesCustomBillingType([this.dataValidation]);
                if (valid && !validBillingItem)
                    this.selectMessagesCustomBillingItem([this.dataValidation]);
                if (valid && !validCurrency)
                    this.selectMessagesCustomCurrency([this.dataValidation]);

                if (valid && validBillingType && validBillingItem && validCurrency) {
                    // submit the form would go here
                    this._controller.addExpense({
                        activityId: this.activityId(),
                        itemId: this.expenseItemId(),
                        amount: this.amount(),
                        currencyKey: this.currencyKey()
                    });

                    this._controller.router.go('dashboard', {historyUpdate: 'replace'});
                }
            }

            _validateBillingType() {
                return !!this.activityEnumArray.data.find(e => e.value === this.activityId())
            }

            _validateBillingItem() {
                return !!this.expenseItemEnumArray.data.find(e => e.value === this.expenseItemId())
            }

            _validateCurrency() {
                return !!this.expenseCurrencyEnumArray.data.find(e => e.value === this.currencyKey())
            }

            dispose() {
                this._controller.router.go('dashboard', {historyUpdate: 'replace'});
            }
        }

        return constructScreen;
    }
);
