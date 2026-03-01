define(['knockout', 'viewModels/add-returned-part', 'data-services/parts-catalog-data-service', 'ofsc-connector','models/part-model'], (ko, AddReturnedPartViewModel, PartsCatalogDataService, OfscConnector, PartModel) => {

    suite('AddReturnedPartViewModel', () => {
        let attributeDesc;
        suiteSetup(async () => {
            attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('AddReturnedPartViewModel is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                customerPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                _attributeDescription: JSON.parse(attributeDesc),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                _nextSearchRequest: ''
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller._attributeDescription =  JSON.parse(attributeDesc);
                
                screen.handleActivated(info);
                screen.noResults();
            }).should.not.throw();
        }));

        test('AddReturnedPartViewModel handleDetached is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                customerPartsCollection: new oj.Collection([]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller._attributeDescription =  JSON.parse(attributeDesc);
                screen.handleDetached();
            }).should.not.throw();
        }));

        test('AddReturnedPartViewModel subscribe is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                customerPartsCollection: new oj.Collection([]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                isSearchInProgress: true
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller._attributeDescription =  JSON.parse(attributeDesc);
                screen.handleActivated(info)
                screen.searchRequestFiltered.subscribe();
                screen.isSerialized.subscribe();
                screen.isSearchContinueAvailable();
                screen.isSearchInProgress();
                screen.isSearchInProgress = ko.observable(true);
                screen.showSearchResults();
            }).should.not.throw();
        }));

        test('AddReturnedPartViewModel showSearchResults - branch 2 is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                customerPartsCollection: new oj.Collection([]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                isSearchInProgress: true
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller._attributeDescription =  JSON.parse(attributeDesc);
                screen.handleActivated(info)
                screen.searchRequestFiltered.subscribe();
                screen.isSerialized.subscribe();
                screen.isSearchContinueAvailable();
                screen.isSearchInProgress();
                screen.isSearchInProgress = ko.observable(false);
                screen.showSearchResults();
            }).should.not.throw();
        }));

        test('AddReturnedPartViewModel handleBindingsApplied is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleBindingsApplied(info);
            }).should.not.throw();
        }));

        test('AddReturnedPartViewModel continueSearch is working', (() => {

            var screen = new AddReturnedPartViewModel();
            var continueSearchStub = sinon.spy();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }])
                            }
                        }
                    };
                }
            };
            screen.isSearchContinueAvailable = ko.observable(false);
            screen._controller = info.valueAccessor().params.app;




            screen.continueSearch();
            continueSearchStub.should.have.been.calledOnce;

        }));

        test('AddReturnedPartViewModel - continueSearch - is working', (() => {

            var screen = new AddReturnedPartViewModel();
            screen.isSearchContinueAvailable = function () {return true};
            screen.currentSearchId = function (){return true};
            screen.searchContinueLoading = function (){return false};
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                partsCatalogDataService: partCata,
                                //router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            screen.partsCatalogDataService = partCata;

            screen.partsCatalogDataService.searchPartsContinue = function () {
                                return new Promise((resolve, reject) => {
                                    return resolve({
                                        result: {
                                            items : [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                                            isContinueAvailable: false,
                                            searchId : 'ECM100001'
                                        }
                                    });
                                });
                            }
            screen.searchResultItems = function () {
                return ([{
                    'id': '5',
                    'quantity': 1,
                    'part_item_number': 'ECM2001',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }, {
                    'id': '6',
                    'quantity': 1,
                    'part_item_number': 'ECM30015',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }]);
            }

                screen.partsCatalogDataService.searchPartsContinue()
                screen.continueSearch();

        }));

        test('AddReturnedPartViewModel - partSelected - is working', (() => {

            var screen = new AddReturnedPartViewModel();
            screen.isSearchContinueAvailable = function () {return true};
            screen.currentSearchId = function (){return true};
            screen.searchContinueLoading = function (){return false};
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                partsCatalogDataService: partCata,
                                _attributeDescription: JSON.parse(attributeDesc),
                                partModelConstructor: oj.Model.extend({
                                    idAttribute: 'part_item_number'
                                })
                            }
                        }
                    };
                }
            };
            screen.partsCatalogDataService = partCata;
            screen._controller = info.valueAccessor().params.app;
            screen.selectedInventory = ko.observable("abc");
            screen._controller._attributeDescription =  JSON.parse(attributeDesc);
            screen._controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            screen._controller.resource = new oj.Model({
                id: 12345 || '', name: 'Anton' || ''
            });
            screen.partsCatalogDataService.searchPartsContinue = function () {
                return new Promise((resolve, reject) => {
                    return resolve({
                        result: {
                            items : [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                            isContinueAvailable: false,
                            searchId : 'ECM100001'
                        }
                    });
                });
            }
            screen.searchResultItems = function () {
                return ([{
                    'id': '5',
                    'quantity': 1,
                    'part_item_number': 'ECM2001',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }, {
                    'id': '6',
                    'quantity': 1,
                    'part_item_number': 'ECM30015',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }]);
            }

            let part1 = new oj.Model({
                "fields" : {
                    "part_uom_code": "ea",
                    "part_disposition_code" : "N",
                    "part_item_number" : "ECM1000001",
                    "part_item_revision" : "ECM1000001",
                    "part_item_desc" : "Description"
                }
            })
            let part = new PartModel({ itemId: 'ECM100001', fields:  {
                    "part_uom_code": "ea",
                    "part_disposition_code" : "N",
                    "part_item_number" : "ECM1000001",
                    "part_item_revision" : "ECM1000001",
                    "part_item_desc" : "Description"
                }})
            screen.partSelected(part);

        }));




        test('selectedInventoryMeasuringUnit is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                },
                                selectedIventoryMeasureUnit(){}
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            screen.quantity = ko.observable(1);
            screen.activityId = ko.observable('');
            screen.selectedInventory = ko.observable({
                id: 'ECM100BELTA',
                inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                measuredQuantity: '1 ea',
                dispositionText: 'No Return'
            });
            screen.serialNum = ko.observable('')
            screen.handleActivated(info)
            screen.selectedIventoryMeasureUnit();
        }));

        test('submit - branch 1 is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                },
                                selectedIventoryMeasureUnit(){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.quantity = ko.observable(1);
            screen.activityId = ko.observable('');
            screen.serialNum = ko.observable('')
            screen.selectedInventory = ko.observable({
                id: 'ECM100BELTA',
                inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                measuredQuantity: '1 ea',
                dispositionText: 'No Return'
            });
            (() => {
                screen.serialNum('');
                screen._validateBillingType = function (){
                    return true;
                }
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomSerial = ko.observable('');
                screen.submit();
            }).should.not.throw();
        }));

        test('submit - branch 2 is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                },
                                selectedIventoryMeasureUnit(){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.quantity = ko.observable(1);
            screen.activityId = ko.observable('');
            screen.serialNum = ko.observable('')
            screen.selectedInventory = ko.observable({
                id: 'ECM100BELTA',
                inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                measuredQuantity: '1 ea',
                dispositionText: 'No Return'
            });
            (() => {
                screen.serialNum('ASNK234');
                screen._validateBillingType = function (){
                    return true;
                }
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomSerial = ko.observable('');
                screen.submit();
            }).should.not.throw();
        }));

        test('submit - branch 3 is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                },
                                selectedIventoryMeasureUnit(){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.quantity = ko.observable(1);
            screen.activityId = ko.observable('');
            screen.serialNum = ko.observable('')
            screen.selectedInventory = ko.observable({
                id: 'ECM100BELTA',
                inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                measuredQuantity: '1 ea',
                dispositionText: 'No Return'
            });
            (() => {
                screen.serialNum('ASNK234');
                screen.quantity(1)
                screen._validateBillingType = function (){
                    return false;
                }
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomSerial = ko.observable('');
                screen.submit();
            }).should.not.throw();
        }));

        test('dismiss - branch 1 - is working', (() => {
            let screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),

                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;

            screen.handleActivated(info)
            screen.dismiss();
        }));

        test('dismiss - branch 2 - is working', (() => {
            let screen = new AddReturnedPartViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),

                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info)
                screen.selectedInventory = ko.observable(true);
                screen.dismiss();
            }).should.not.throw();

        }));

        test('subscribe - path for listViewSelection is working', (() => {
            let screen = new AddReturnedPartViewModel();
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                partsCatalogDataService: partCata,
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;

            screen.handleActivated(info)
            screen.searchRequestFiltered.subscribe('searchRequestFiltered');
            screen.partsCatalogDataService = partCata;
            screen.partsCatalogDataService.searchParts = function () {
                return new Promise((resolve, reject) => {
                    return resolve({isContinueAvailable: false, searchId: '', items: {name: 'abc'}});
                });
            }
            screen.listViewSelection('listViewSelection');
        }));

        test('subscribe for listViewSelection is working', (() => {
            let screen = new AddReturnedPartViewModel();
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                partsCatalogDataService: partCata,
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;

            screen.handleActivated(info)
            screen.searchRequestFiltered();
            screen.partsCatalogDataService = partCata;
            screen.partsCatalogDataService.searchParts = function () {
                return new Promise((resolve, reject) => {
                    return resolve({isContinueAvailable: false, searchId: '', items: {name: 'abc'}});
                });
            }
            screen.listViewSelection('l');
        }));

        test('subscribe for searchRequest is working', (() => {
            let screen = new AddReturnedPartViewModel();
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                partsCatalogDataService: partCata,
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;

            screen.handleActivated(info)
            screen.searchRequestFiltered();
            screen.partsCatalogDataService = partCata;
            screen.serialNum =
                screen.partsCatalogDataService.searchParts = function () {
                    return new Promise((resolve, reject) => {
                        return resolve({isContinueAvailable: false, searchId: '', items: {name: 'abc'}});
                    });
                }
            screen.searchRequest();
        }));

        test('subscribe for searchRequest is working', (() => {
            let screen = new AddReturnedPartViewModel();
            let ofscConnector = new OfscConnector();
            let partCata = new PartsCatalogDataService(ofscConnector);
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                partsCatalogDataService: partCata,
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;

            screen.handleActivated(info)
            screen.searchRequestFiltered();
            screen.partsCatalogDataService = partCata;
            screen.serialNum =
                screen.partsCatalogDataService.searchParts = function () {
                    return new Promise((resolve, reject) => {
                        return resolve({isContinueAvailable: false, searchId: 'itemSearch', items: {name: 'abc'}});
                    });
                }
            screen.searchRequest('itemSearch');
        }));

        test('searchAtPartsCatalog is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.searchResultItems = function () {
                return ([{
                    'id': '5',
                    'quantity': 1,
                    'part_item_number': 'ECM2001',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }, {
                    'id': '6',
                    'quantity': 1,
                    'part_item_number': 'ECM30015',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M'
                }]);
            }
            screen.searchRequest = ko.observable('ECM100');
            screen.isSearchByPartsCatalog = ko.observable(false);
            screen.listViewSelection = ko.observable([]);
            screen.searchAtPartsCatalog();
        }));

        test('back - branch 1 - is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                selectedInventory: null,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info)
                screen.selectedInventory = ko.observable(true);
                screen.isSearchByPartsCatalog = ko.observable(true);
                screen.back();
            }).should.not.throw();
        }));

        test('back - branch 2 - is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                selectedInventory: null,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info)
                screen.selectedInventory = ko.observable(false);
                screen.isSearchByPartsCatalog = ko.observable(true);
                screen.back();
            }).should.not.throw();
        }));

        test('back - branch 3 - is working', (() => {
            let screen = new AddReturnedPartViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                _attributeDescription: JSON.parse(attributeDesc),
                                customerPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': 'ECM2001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': 'ECM30015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                partActivityReturnedEnumCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                router: oj.Router.rootInstance,
                                selectedInventory: null,
                                addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info)
                screen.back();
            }).should.not.throw();
        }));

    });

});