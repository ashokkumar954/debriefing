/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
    'knockout',
    'utils/dom',
    'utils/labor-time-utils',
    'constants',
    'ojs/ojcore',
    'ojs/ojarraydataprovider',
    'ojs/ojselectcombobox',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojmessages',
    'ojs/ojvalidationgroup',
    'ojs/ojformlayout'
], function (
    ko,
    dom,
    LaborTimeUtils,
    Constants,
    oj,
    ArrayDataProvider
) {
    let constructScreen = function () {
        return new AddLaborViewModel();
    };

    class AddLaborViewModel {
        constructor() {
            this.activityId = ko.observable('');
            this.laborItemId = ko.observable('');
            this.startTime = ko.observable('');
            this.endTime = ko.observable('');
            this.defaultStartTime = '';
            this.defaultEndTime = '';

            this.selectMessagesCustomBillingType = ko.observable([]);
            this.selectMessagesCustomBillingItem = ko.observable([]);
            this.dataValidation = {
                detail: "Enter a valid value.",
                summary: "",
                severity: "error",
            };
            this.isStartTimeValid = ko.observable(true);
            this.isEndTimeValid = ko.observable(true);
            this.laborTimeUtils = new LaborTimeUtils();
            this.initializeComputedProperties();

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

                const mapEnumCollection = (collection, valueKey, labelKey) =>
                    collection.map((model) => ({
                        value: model.get(valueKey),
                        label: model.get(labelKey),
                    }));

                    this.laborActivityEnumCollection = mapEnumCollection(
                        this._controller.laborActivityEnumCollection,
                        'id',
                        'text'
                    );
                    this.laborItemEnumCollection = mapEnumCollection(
                        this._controller.laborItemEnumCollection,
                        'id',
                        'label'
                    );
                    this.DEFAULT_LABOR_ACTIVITY_SERVICE = Constants.DEFAULT_LABOR_ACTIVITY_SERVICE;
                    this.DEFAULT_LABOR_ACTIVITY = this._controller.defaultLaborItem;
                    this.DEFAULT_TRAVEL_ACTIVITY = this._controller.defaultTravelItem;

                this.dateTimeConverter = this._controller.dateTimeConverter;

                this.initializePreselectedValues();
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

            /*
             * Optional ViewModel method invoked after the View is removed from the
             * document DOM.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            this.handleDetached = function (info) {
                // Implement if needed
                this.activityId('');
                this.laborItemId('');
            };

            this.startTime.subscribe(() => {
                if(document.getElementById('endTimeEl')) {
                    document.getElementById('endTimeEl').validate();
                }
            });
            this.laborItemChanged = (event) => {
                this._populateDefaultDate(event);
            };
            this.appMessages = ko.observable();
            this.initializeValidators();
            this.onStartTimeValidChanged = event => {
                this.isStartTimeValid(event.detail.value === 'valid');
            }

            this.onEndTimeValidChanged = event => {
                this.isEndTimeValid(event.detail.value === 'valid');
            }
            this.onValueChanged = event => {
                this._validateChangedValue(event);
            }
        }

        getValueOrDefault(obj, key, fallback) {
            return (obj && obj[key]) || fallback;
        }

        findDefaultValue(collection, defaultValue) {
            return collection.find((item) => item.value === defaultValue);
        }

        createObservableDefault(defaultVal) {
            return ko.observable(defaultVal ? { value: defaultVal.value, label: defaultVal.label } : { value: "", label: "" });
        }

        getValueOrDefault(observable, key, defaultValue) {
            return observable[key] || defaultValue;
        }

        initializePreselectedValues() {
            const defaultLabSvcActVal = this.findDefaultValue(this.laborActivityEnumCollection, this.DEFAULT_LABOR_ACTIVITY_SERVICE);
            const defaultLabItemVal = this.findDefaultValue(this.laborItemEnumCollection, this.DEFAULT_LABOR_ACTIVITY);

            this.preselectLabSvcActVal = this.createObservableDefault(defaultLabSvcActVal);
            this.preselectLabItemVal = this.createObservableDefault(defaultLabItemVal);

            this.activityEnumArray = new ArrayDataProvider(this.laborActivityEnumCollection, { keyAttributes: "value" });
            this.laborItemEnumArray = new ArrayDataProvider(this.laborItemEnumCollection, { keyAttributes: "value" });

            this.activityId(this.getValueOrDefault(this.preselectLabSvcActVal(), 'value',
                    this.activityEnumArray.data[0]? this.activityEnumArray.data[0].value: ""));
            this.laborItemId(this.getValueOrDefault(this.preselectLabItemVal(), 'value',
                    this.laborItemEnumArray.data[0]? this.laborItemEnumArray.data[0].value: ""));

            if (this.preselectLabItemVal().value === this.DEFAULT_LABOR_ACTIVITY) {
                this._autoPopulateLaborTime();
            }
        }

        initializeComputedProperties() {
            this.isSubmitDisabled = ko.pureComputed(() => {
                return !(this.isStartTimeValid() && this.isEndTimeValid());
            });

            this.durationHours = ko.pureComputed(() => {
                if (!this.startTime() || !this.endTime()) {
                    return '';
                }
                return this.laborTimeUtils._calculateDuration(this.dateTimeConverter, this.startTime(), this.endTime());
            });

            this.laborItemDescription = ko.pureComputed(() => {
                const selectedItem = this.laborItemEnumCollection.find(
                    (item) => item.value === this.laborItemId()
                );
                return selectedItem && selectedItem.label? selectedItem.label : '';
            });
        }

        initializeValidators() {
            this.durationValidator = {
                validate: (value) => {
                    if (!value && !this.startTime()) {
                        throw new oj.ValidatorError("Time should be indicated", "Please, input time.");
                    } else if (value < this.startTime()) {
                        this.appMessages([{
                            summary: 'Info',
                            detail: 'Overnight',
                            severity: oj.Message.SEVERITY_TYPE.INFO,
                        }]);
                    }
                }
            };
        }

        addLabor() {
            const valid = this._controller.checkValidationGroup();
            const validBillingType = this._validateBillingType(this.activityId);
            const validBillingItem = this._validateBillingItem(this.laborItemId);

            if (valid && !validBillingType)
                this.selectMessagesCustomBillingType([this.dataValidation]);
            if (valid && !validBillingItem)
                this.selectMessagesCustomBillingItem([this.dataValidation]);

            if (valid && validBillingType && validBillingItem) {
                const startTime = this.startTime()? this.startTime().split('+')[0]: '';
                const endTime = this.endTime()? this.endTime().split('+')[0]: '';
                this._controller.addLabor({
                    activityId: this.activityId(),
                    itemId: this.laborItemId(),
                    startTime: startTime,
                    endTime: endTime,
                    defaultStartTime: this.defaultStartTime,
                    defaultEndTime: this.defaultEndTime
                });

                this._controller.router.go('dashboard', {historyUpdate: 'replace'});
            }
        }

        _validateChangedValue(event){
            if (this.DEFAULT_LABOR_ACTIVITY === this.laborItemId() ) {
                let value  = event.detail.value;
                let compareTo = this.startTime();
                if(value && compareTo && value < compareTo) {
                    this.appMessages([{
                        summary: 'Info', detail: 'Overnight', severity: oj.Message.SEVERITY_TYPE['INFO']
                    }]);
                }
            }
        }

        _populateDefaultDate(event){
            const selectedLaborItemObject = event.detail.value;
            const selectedLaborItem = selectedLaborItemObject.value;
            if(this.DEFAULT_LABOR_ACTIVITY === selectedLaborItem){
                this._autoPopulateLaborTime();
            } else if(this.DEFAULT_TRAVEL_ACTIVITY === selectedLaborItem) {
                this._autoPopulateTravelTime();
            } else {
                this.startTime("");
                this.endTime("");
            }
        }

        _autoPopulateLaborTime(){
            let activityStartTime = this._controller.activityDetails.get(Constants.START_TIME);
            let activityEndTime = this._controller.activityDetails.get(Constants.END_TIME);
            let resourceCurrentTime = this._controller.activityDetails.get(Constants.RES_CURRENT_TIME);
            let durationInMinutes = this._controller.activityDetails.get(Constants.DURATION);
            let defaultStartTime = this.laborTimeUtils._autoPopulateLaborStartTime(activityStartTime);
            let defaultEndTime = this.laborTimeUtils._autoPopulateLaborEndTime(activityStartTime, activityEndTime,
                                        resourceCurrentTime, durationInMinutes);
            this.startTime(defaultStartTime);
            this.endTime(defaultEndTime);
            this.defaultStartTime = defaultStartTime;
            this.defaultEndTime = defaultEndTime;
        }

        _autoPopulateTravelTime(){
            let activityStartTime = this._controller.activityDetails.get(Constants.START_TIME);
            let travelTime = this._controller.activityDetails.get(Constants.TRAVEL_TIME);
            let travelStartTime = this.laborTimeUtils._autoPopulateTravelStartTime(activityStartTime, travelTime);
            let travelEndTime = this.laborTimeUtils._autoPopulateTravelEndTime(activityStartTime, travelTime);
            this.defaultStartTime = travelStartTime;
            this.defaultEndTime = travelEndTime;
            this.startTime(travelStartTime);
            this.endTime(travelEndTime);
        }

        _validateBillingType() {
            return !!this.activityEnumArray.data.find(e => e.value === this.activityId())
        }

        _validateBillingItem() {
            return !!this.laborItemEnumArray.data.find(e => e.value === this.laborItemId())
        }

        onCloseButtonClick() {
            this._controller.router.go('dashboard', {historyUpdate: 'replace'});
        }

    }

    return constructScreen;
});
