define(['knockout', 'viewModels/add-used-part', 'services/inventory-search-service', 'ojs/ojmodel', 'ojs/ojarraydataprovider'],
    (ko, AddUsedPartViewModel, InventorySearchService, ojmodel, ArrayDataProvider) => {

        suite('AddUsedPartViewModel', () => {
            let routerConfigureStub;
            let invSnArray;
            suiteSetup(async () => {
                routerConfigureStub = sinon.stub();
                let serailArray = [{invsn: '1234'},{invsn: '2345'},{invsn: 'ASNK234'}];
                invSnArray=new ArrayDataProvider(serailArray,{keyAttributes:'invsn'});
            });

            suiteTeardown(async () => {

            });

            setup(() => {

            });

            teardown(() => {

            });

            test('AddUsedPartViewModel - handleActivated is working', (() => {
                var screen = new AddUsedPartViewModel();
                var info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {
                                            'id': '2',
                                            'text': 'example2'
                                        },
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{'id': '2', 'text': 'example2'}])
                                }
                            }
                        };
                    }
                };

                (() => {
                    screen.handleActivated(info);
                }).should.not.throw();

            }));

            test('AddUsedPartViewModel - getInventoryModel is working', (() => {
                var screen = new AddUsedPartViewModel();
                let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";

                var info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    _attributeDescription : attributeDesc,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {
                                            'id': '2',
                                            'text': 'example2'
                                        },
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{'id': '2', 'text': 'example2'}])
                                }
                            }
                        };
                    }
                };

                (() => {
                    screen.handleActivated(info);
                    let model2 = new ojmodel.Model({
                        'id': '6',
                        'quantity': 1,
                        'part_item_number': 'ECM100005~2345',
                        'part_item_number_rev': 'ECM100005~2345',
                        'part_uom_code': 'ea',
                        'part_disposition_code': 'M',
                        "invsn": '2345',
                        "invtype": 'part_sn',
                        "invsn": "2345"
                    });
                    screen.getInventoryViewModel(model2);
                }).should.not.throw();

            }));
            test('dismiss - branching is working', (() => {
                let screen = new AddUsedPartViewModel();
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    router: routerConfigureStub,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    addUsedPart(id, activityId, qty, serialNum) {
                                    }

                                }
                            }
                        };
                    }
                };

                screen.activityId = ko.observable('');
                screen.selectedInventory = ko.observable({
                    id: 'ECM100BELTA',
                    inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                    measuredQuantity: '1 ea',
                    dispositionText: 'No Return'
                });
                screen.serialNum = ko.observable('')
                screen.listViewSelection = ko.observable([]);
                screen._controller = info.valueAccessor().params.app;
                (() => {
                    screen.dismiss();
                }).should.not.throw();
            }));

            test('submit is working with all the validations being true', (() => {
                let screen = new AddUsedPartViewModel();
                let mockRouter = {
                    go: {}
                };
                sinon.stub(mockRouter,'go');
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    invSerialNumArray : invSnArray,
                                    activityEnumArray : {   'id': '2',
                                        'data': 'example2'},
                                    addUsedPart(id, activityId, qty, serialNum) {

                                    },
                                    checkValidationGroup(){
                                        return true;
                                    }

                                }
                            }
                        };
                    }
                };
                screen.router = oj.Router.rootInstance;
                screen.quantity = ko.observable(1);
                screen.activityId = ko.observable('');
                screen.serialNum = ko.observable('ASNK234');
                screen._controller = info.valueAccessor().params.app;
                screen.invSerialNumArray = invSnArray;

                screen.invSerialNumArray.data.find(
                    e => e.value === screen.serialNum)

                screen._validateBillingType = function (){
                    return true;
                }
                screen._validateSerialNum = function (){
                    return true;
                };
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomSerial = ko.observable('');
                screen.selectedInventory = ko.observable({
                    id: 'ECM100BELTA',
                    inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                    measuredQuantity: '1 ea',
                    dispositionText: 'No Return'
                });
                screen.serialNum('ASNK234');
                screen.submit();
            }));

            test('submit is working', (() => {
                let screen = new AddUsedPartViewModel();
                let mockRouter = {
                    go: {}
                };
                sinon.stub(mockRouter,'go');
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    invSerialNumArray : invSnArray,
                                    activityEnumArray : {   'id': '2',
                                        'data': 'example2'},
                                    addUsedPart(id, activityId, qty, serialNum) {

                                    },
                                    checkValidationGroup(){
                                        return true;
                                    }

                                }
                            }
                        };
                    }
                };
                screen.router = oj.Router.rootInstance;
                screen.quantity = ko.observable(1);
                screen.activityId = ko.observable('');
                screen.serialNum = ko.observable('ASNK234');
                screen._controller = info.valueAccessor().params.app;
                screen.invSerialNumArray = invSnArray;

                screen.invSerialNumArray.data.find(
                    e =>
                        e.value === screen.serialNum)
                screen.serialNum('ASNK234');

                screen._validateBillingType = function (){
                    return false;
                }
                screen._validateSerialNum = function (){
                    return true;
                };
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomSerial = ko.observable('');
                screen.selectedInventory = ko.observable({
                    id: 'ECM100BELTA',
                    inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                    measuredQuantity: '1 ea',
                    dispositionText: 'No Return'
                });
                screen.submit();
            }));

            test('submit else path is working', (() => {
                let screen = new AddUsedPartViewModel();
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    activityEnumArray : {   'id': '2',
                                        'data': 'example2'},
                                    addUsedPart(id, activityId, qty, serialNum) {

                                    },
                                    checkValidationGroup(){
                                        return true;
                                    }

                                }
                            }
                        };
                    }
                };
                screen.router = oj.Router.rootInstance;
                screen.quantity = ko.observable(1);
                screen.activityId = ko.observable('');
                screen.selectedInventory = ko.observable({
                    id: 'ECM100BELTA',
                    inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                    measuredQuantity: '1 ea',
                    dispositionText: 'No Return'
                });
                screen.serialNum = ko.observable('')
                screen._controller = info.valueAccessor().params.app;
                screen.invSerialNumArray = invSnArray;
                (() => {
                    screen.serialNum('');
                    screen._validateBillingType = function (){
                        return true;
                    }
                    screen._validateSerialNum = function (){
                        return false;
                    };
                    screen.selectMessagesCustomBillingType = ko.observable('');
                    screen.selectMessagesCustomSerial = ko.observable('');
                    screen.selectedInventory = ko.observable({
                        id: 'ECM100BELTA',
                        inventory: new oj.Model({'attributes': {'invsn': 'RI600072', 'invtype': 'part_sn'}}),
                        measuredQuantity: '1 ea',
                        dispositionText: 'No Return'
                    });
                    screen.submit();
                }).should.not.throw();
            }));

            test('dismiss is working', (() => {
                let screen = new AddUsedPartViewModel();
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    resourcePartsCollection: new oj.Collection([{
                                        'id': '5',
                                        'quantity': 1,
                                        'part_item_number': 'ECM2001',
                                        'part_item_number_rev': 'ea',
                                        'invsn': 'M'
                                    }]),
                                }
                            }
                        };
                    }
                };
                screen._controller = info.valueAccessor().params.app;
                screen.router = oj.Router.rootInstance;
                (() => {
                    screen.handleActivated(info);
                    screen.dismiss();
                }).should.not.throw();
                expect(screen._controller.router.go.calledOnce);
            }));

            test('listSelection subscribe is working', (() => {
                let screen = new AddUsedPartViewModel();

                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    part_uom_code: '1214',
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    resourcePartsCollection: new oj.Collection([{
                                        'id': '5',
                                        'quantity': 1,
                                        'part_item_number': 'ECM2001',
                                        'part_item_number_rev': 'ea',
                                        'invsn': 'M'
                                    }]),


                                    selectedIventoryMeasureUnit: '1ea',
                                    _attributeDescription: {part_uom_code: '1214'},
                                    searchResults:  new oj.Collection([{ 'id': 'ECM300001', 'inventory': { 'part_item_number_rev': 'ECM300001', 'part_service_activity_used': 'Install', 'quantity': '3' }, serviceActivityUsed: 'Install_New', serviceActivityReturned: null, measuredQuantity: '1 ea', 'serviceActivityUsed': 'Install' }]),

                                }
                            }
                        };
                    }
                };
                screen._controller = info.valueAccessor().params.app;
                screen.router = oj.Router.rootInstance;
                (() => {
                    screen.handleActivated(info)
                    screen.searchSubstringIsEmpty();
                    screen.selectedInventory = ko.observable("abc");

                let inventory = new ojmodel.Model({
                    'id': '6',
                    'quantity': 1,
                    'part_item_number': 'ECM10001',
                    'part_item_number_rev': 'ECM10001',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M',
                    "invsn": '2345',
                    "invtype": 'part_sn',
                    "invsn": "2345"
                });
                    screen.searchResults = ko.computed({
                        read: function () {
                            return [{ 'id': 'ECM10001', 'invsn' : '123', 'inventory': inventory, serviceActivityUsed: 'Install_New', serviceActivityReturned: null, measuredQuantity: '1 ea', 'serviceActivityUsed': 'Install' }];
                        },
                        write: function (value) {
                        },
                        owner: screen
                    });
                    screen.selectedIventoryMeasureUnit();
                    let a = ['ECM10001','123'];
                    let multiArray = [a];
                    screen.searchResultsObservableArray = ko.observableArray(new oj.Collection([{ 'id': 'ECM10001', 'inventory': { 'part_item_number_rev': 'ECM10001', 'part_service_activity_used': 'Install', 'quantity': '3', 'invtype' : 'part_sn' }, serviceActivityUsed: 'Install_New', serviceActivityReturned: null, measuredQuantity: '1 ea', 'serviceActivityUsed': 'Install' }])
                    );
                let partModelConstructor = oj.Model.extend({
                    idAttribute: 'part_item_number'
                });
                let resourcePartsCollection = new ojmodel.Collection(null, {
                    model: partModelConstructor
                });
                let model1 = new ojmodel.Model({
                    'id': '5',
                    'quantity': 1,
                    'part_item_number': 'ECM100001~1234',
                    'part_item_number_rev': 'ECM100001~1234',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M',
                    "invsn": '1234',
                    "invtype": 'part_sn'
                });
                let model2 = new ojmodel.Model({
                    'id': '6',
                    'quantity': 1,
                    'part_item_number': 'ECM10001',
                    'part_item_number_rev': 'ECM10001',
                    'part_uom_code': 'ea',
                    'part_disposition_code': 'M',
                    "invsn": '2345',
                    "invtype": 'part_sn',
                    "invsn": "2345"
                });
                resourcePartsCollection.add(model1);
                resourcePartsCollection.add(model2);
                screen._controller.resourcePartsCollection = resourcePartsCollection;
                screen.listViewSelection(multiArray);
                }).should.not.throw();
            }));

            test('AddUsedPartViewModel handleBindingsApplied is working', (() => {

                let screen = new AddUsedPartViewModel();
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    part_uom_code: '1214',
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    resourcePartsCollection: new oj.Collection([{
                                        'id': '5',
                                        'quantity': 1,
                                        'part_item_number': 'ECM2001',
                                        'part_item_number_rev': 'ea',
                                        'invsn': 'M'
                                    }]),
                                    listViewSelection: function (){
                                    },
                                    selectedIventoryMeasureUnit: '1ea'
                                }
                            }
                        };
                    }
                };
                (() => {
                    screen.router = oj.Router.rootInstance;
                    screen.handleBindingsApplied(info);
                }).should.not.throw();
            }));

            test('AddUsedPartViewModel handleDetached - branch1 is working', (() => {

                let screen = new AddUsedPartViewModel();

                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    part_uom_code: '1214',
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    resourcePartsCollection: new oj.Collection([{
                                        'id': '5',
                                        'quantity': 1,
                                        'part_item_number': 'ECM2001',
                                        'part_item_number_rev': 'ea',
                                        'invsn': 'M'
                                    }]),
                                    listViewSelection: function (){
                                    },
                                    selectedIventoryMeasureUnit: '1ea'
                                }
                            }
                        };
                    }
                };
                    screen.router = oj.Router.rootInstance;
                    screen.activityId= ko.observable('');
                    screen._controller = info.valueAccessor().params.app;
                    screen.handleDetached(info);
            }));

            test('AddUsedPartViewModel handleDetached - branch2 is working', (() => {

                let screen = new AddUsedPartViewModel();
                let info = {
                    valueAccessor: () => {
                        return {
                            params: {
                                app: {
                                    part_uom_code: '1214',
                                    router: oj.Router.rootInstance,
                                    inventorySearchService: new InventorySearchService(new ojmodel.Collection(), {},
                                        ['part_item_number_rev', 'part_item_desc', 'invsn'],
                                        // order by:
                                        'part_item_number_rev'),
                                    getInvTypePartConst() {
                                        return 'part';
                                    },
                                    getInvTypePartSnConst() {
                                        return 'part_sn';
                                    },
                                    partActivityUsedEnumCollection: new oj.Collection([{
                                        'id': '2',
                                        'text': 'example2'
                                    }]),
                                    resourcePartsCollection: new oj.Collection([{
                                        'id': '5',
                                        'quantity': 1,
                                        'part_item_number': 'ECM2001',
                                        'part_item_number_rev': 'ea',
                                        'invsn': 'M'
                                    }]),
                                    searchResults: function (){
                                    },
                                    selectedIventoryMeasureUnit: '1ea'
                                }
                            }
                        };
                    }
                };
                (() => {
                    screen.activityId= ko.observable('');
                    screen._controller = info.valueAccessor().params.app;
                    screen.router = oj.Router.rootInstance;
                    screen.searchResults = {'1212321':'4356475'};
                    screen.handleDetached(info);
                }).should.not.throw();
            }));

        });

    });