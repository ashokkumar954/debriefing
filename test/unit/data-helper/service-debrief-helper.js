// LEGACY: This file tests ServiceDebriefHelper which is not part of the BHM (Bulk Health Metrics) plugin.
// It was part of the old OOB debrief architecture and is retained for reference only.
// These tests are NOT included in the unit test runner (test/unit-index.js).
define(['data-helper/service-debrief-helper',
        'knockout',
        'data-services/service-logistics-data-service',
        'data-services/activity-data-service',
        'models/debrief-model',
        'storage/persistent-storage',
        'utils/labor-time-utils'

    ],
    (ServiceDebriefHelper,
     ko,
     ServiceLogisticsDataService,
     ActivityDataService,
     DebriefModel,
     PersistentStorage,
     LaborTimeUtils) => {

        suite('ServiceDebriefHelper', () => {
            var fusionDataServiceStub;
            var ofsDataServiceStub;
            var laborTimeUtilsStub;
            setup(() => {
                fusionDataServiceStub = sinon.createStubInstance(ServiceLogisticsDataService);
                ofsDataServiceStub = sinon.createStubInstance(ActivityDataService);
                laborTimeUtilsStub = sinon.createStubInstance(LaborTimeUtils);
            });

            teardown(() => {
                sinon.reset();
            });

            test('#ServiceDebriefHelper is working', (() => {
                let screen = new ServiceDebriefHelper(fusionDataServiceStub, ofsDataServiceStub, laborTimeUtilsStub);
                screen.should.be.instanceOf(ServiceDebriefHelper);
            }));

            test('#saveDebriefData with activity details', (async function () {

                let activityDetails = {
                    activityId : 123456,
                    wo_number : 100000549488958,
                    resourceId: 1241
                }
                let responseData = Promise.resolve({
                    debriefHeaderId : 1234
                });

                var screen = new ServiceDebriefHelper();
                fusionDataServiceStub = {
                    createDebriefHeaderRequest: sinon.stub().resolves()
                };
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub
                await responseData;
                screen.saveDebriefData(activityDetails).then((result) => {
                    assert.equal(result.wo_number, 100000549488958);
                })
            }));

            test('#processDebrief with activity details', (async function () {

                let activityDetails = {
                    activityId : 123456,
                    wo_number : 100000549488958,
                    resourceId: 1241
                }
                let cacheData = {
                    orgId : 100,
                    debriefMetaData : 9786546
                };

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub
                fusionDataServiceStub.createDebriefHeader
                    .withArgs(sinon.match.any)
                    .returns(cacheData);

                screen.saveDebriefData(activityDetails).then((result) => {
                    assert.equal(result.wo_number, 100000549488958);
                })
            }));

            test('#saveDebriefData throws error if debrief header is not returned', (async function () {
                const activityDetails = {
                    activityId: 123456,
                    wo_number: 100000549488958,
                    resourceId: 1241,
                    svcWorkOrderId: 456
                };

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;

                ofsDataServiceStub.getInstalledInventoriesFromActivity.resolves({ items: [] });
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity.resolves([]);

                screen.processDebriefHeader = sinon.stub().resolves(null);

                try {
                    await screen.saveDebriefData(activityDetails);
                    assert.fail('Expected error was not thrown');
                } catch (e) {
                    assert.ok(e.message.includes('Error creating Debrief header for WOId'));
                }
            }));

            test('#saveDebriefData throws error if no lineItems to process', (async function () {
                const activityDetails = {
                    activityId: 123456,
                    wo_number: 100000549488958,
                    resourceId: 1241,
                    svcWorkOrderId: 456
                };

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;

                ofsDataServiceStub.getInstalledInventoriesFromActivity.resolves({ items: [] });
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity.resolves([]);

                screen.processDebriefHeader = sinon.stub();
                screen.processDebriefHeader.onCall(0).resolves('header123');
                screen.processDebriefHeader.onCall(1).resolves(false);

                screen._createLineItems = sinon.stub().resolves([]);

                try {
                    await screen.saveDebriefData(activityDetails);
                    assert.fail('Expected error not thrown');
                } catch (e) {
                    assert.equal(e.message, 'No line items to post. So retry the posting.');
                }
            }));

            test('#saveDebriefData throws error if post lineItems fails', (async function () {
                const activityDetails = {
                    activityId: 123456,
                    wo_number: 100000549488958,
                    resourceId: 1241,
                    svcWorkOrderId: 456
                };

                const lineItems = [
                    {
                        "InventoryItemNumber": "FS65101",
                        "LineType": "M",
                        "OrganizationId": 5702,
                        "Quantity": 1,
                        "ReservationId": 300100634108203,
                        "ServiceActivityCode": "INSTALL",
                        "SubinventoryCode": "FS_Truck1",
                        "UOMCode": "Ea"
                    }
                ];

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;

                ofsDataServiceStub.getInstalledInventoriesFromActivity.resolves({ items: [] });
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity.resolves([]);

                screen.processDebriefHeader = sinon.stub();
                screen.processDebriefHeader.onCall(0).resolves('header123');
                screen.processDebriefHeader.onCall(1).resolves(false);

                screen._createLineItems = sinon.stub().resolves(lineItems);

                try {
                    await screen.saveDebriefData(activityDetails);
                    assert.fail('Expected error not thrown');
                } catch (e) {
                    assert.equal(e.message, 'All postLineItems calls failed. So retry the posting.');
                }
            }));

            test('#_createLineItems cover all conditions', (async function () {

                let fusionDataServiceStub = {
                    createLaborItemsPayload: sinon.stub().resolves([{ id: 'labor1' }]),
                    createExpenseItemsPayload: sinon.stub().resolves([{ id: 'expense1' }]),
                    createUsedPartsPayload: sinon.stub().resolves([{ id: 'used1' }]),
                    createReturnPartsPayload: sinon.stub().resolves([{ id: 'return1' }])
                };

                let ofsDataServiceStub = {
                    getResourceRoles: sinon.stub().resolves({ role: 'tech' })
                };

                // let persistentStorageStub = sinon.stub(PersistentStorage);
                // persistentStorageStubsistentStorageStub.loadData.withArgs('rolesList').returns(null);

                let screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;

                const laborItems = [{ id: 'laborItem' }];
                const expenseItems = [{ id: 'expenseItem' }];
                const usedParts = [{ id: 'usedPart' }];
                const deinstalledItems = { totalResults: 1 };

                const result = await screen._createLineItems(
                    laborItems,
                    expenseItems,
                    usedParts,
                    deinstalledItems
                );

                sinon.assert.calledOnce(fusionDataServiceStub.createLaborItemsPayload);
                sinon.assert.calledOnce(fusionDataServiceStub.createExpenseItemsPayload);
                sinon.assert.calledOnce(ofsDataServiceStub.getResourceRoles);
                sinon.assert.calledOnce(fusionDataServiceStub.createUsedPartsPayload);
                sinon.assert.calledOnce(fusionDataServiceStub.createReturnPartsPayload);

                expect(result).to.deep.equal([
                    { id: 'labor1' },
                    { id: 'expense1' },
                    { id: 'used1' },
                    { id: 'return1' }
                ]);

                //sinon.restore();

            }));

            test('#saveDebriefData to cover the createLineItems Flow', (async function () {
                const activityDetails = {
                    activityId: 123456,
                    wo_number: 100000549488958,
                    resourceId: 1241
                };

                const lineItems = [
                    {
                        "InventoryItemNumber": "FS65101",
                        "LineType": "M",
                        "OrganizationId": 5702,
                        "Quantity": 1,
                        "ReservationId": 300100634108203,
                        "ServiceActivityCode": "INSTALL",
                        "SubinventoryCode": "FS_Truck1",
                        "UOMCode": "Ea"
                    }
                ];

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;

                ofsDataServiceStub.getInstalledInventoriesFromActivity.resolves({ items: [] });
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity.resolves([]);
                fusionDataServiceStub.getCustomerWorkOrderByWONUmber.resolves('1234555555');

                screen.processDebriefHeader = sinon.stub();
                screen.processDebriefLineItems = sinon.stub();
                screen.processDebriefHeader.onCall(0).resolves('header123');
                screen.processDebriefLineItems.resolves(true);

                screen._createLineItems = sinon.stub().resolves(lineItems);

                await screen.saveDebriefData(activityDetails);

            }));

            test('#processDebrief with activity details flow 1', (async function () {

                let activityDetails = {
                    activityId : 123456,
                    wo_number : 100000549488958,
                    resourceId: 1241
                }
                let cacheData = {
                    orgId : 100,
                    debriefMetaData : 9786546
                };

                let installed = Promise.resolve({
                    "totalResults": 1,
                    "limit": 10,
                    "offset": 0,
                    "items": [
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "expense",
                            "quantity": 1,
                            "resourceId": "33011",
                            "activityId": 4225371
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "labor",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceTimeZoneDiff" : 0,
                            "activityId": 4225371,
                            "labor_start_time" : "2023-04-11T05:57:34+00:00",
                            "labor_end_time" : "2023-04-11T05:57:34+00:00"
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "part",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceType" : "TRUCK",
                            "activityId": 4225371
                        }
                    ]
                })
                let deinstalled = Promise.resolve(
                    {
                        items: {
                            inventoryType: "expense",
                            CurrencyCode: "USD",
                            ExpenseAmount: "60",
                            InventoryItemNumber: "Parking",
                            LineStatusCode: "NEW",
                            LineType: "E",
                            ServiceActivityCode: "Expense",
                            UOMCode: "USD"
                        }
                    })
                let resourceDet = Promise.resolve(
                    {
                        items: {
                            resourceType: "TRUCK"
                        }
                    })

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;
                fusionDataServiceStub.createDebriefHeader
                    .withArgs(sinon.match.any)
                    .returns(cacheData);
                ofsDataServiceStub.getInstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(installed);
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(deinstalled);
                ofsDataServiceStub.getResourceDetails
                    .withArgs(sinon.match.any)
                    .returns(resourceDet);

                screen.saveDebriefData(activityDetails).then((result) => {
                    assert.equal(result.wo_number, 100000549488958);
                })
            }));

            test('#processDebrief with activity details flow 2', (async function () {

                let activityDetails = {
                    activityId : 123456,
                    wo_number : 100000549488958,
                    resourceId: 1241
                }
                let cacheData = {
                    orgId : 100,
                    debriefMetaData : 9786546
                };

                let installed = Promise.resolve({
                    "totalResults": 1,
                    "limit": 10,
                    "offset": 0,
                    "items": [
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "expense",
                            "quantity": 1,
                            "resourceId": "33011",
                            "activityId": 4225371
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "labor",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceTimeZoneDiff" : 0,
                            "activityId": 4225371,
                            "labor_start_time" : "2023-04-11T05:57:34+00:00",
                            "labor_end_time" : "2023-04-11T05:57:34+00:00"
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "part",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceType" : "TRUCK",
                            "activityId": 4225371
                        }
                    ]
                })
                let deinstalled = Promise.resolve(
                    {
                        items: {
                            inventoryType: "expense",
                            CurrencyCode: "USD",
                            ExpenseAmount: "60",
                            InventoryItemNumber: "Parking",
                            LineStatusCode: "NEW",
                            LineType: "E",
                            ServiceActivityCode: "Expense",
                            UOMCode: "USD"
                        }
                    })
                let resourceDet = Promise.resolve(
                    {
                        items: {
                            resourceType: "TRUCK"
                        }
                    })

                var screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;
                screen.laborTimeUtils = laborTimeUtilsStub ;
                fusionDataServiceStub.createDebriefHeader
                    .withArgs(sinon.match.any)
                    .returns(cacheData);
                ofsDataServiceStub.getInstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(installed);
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(deinstalled);
                ofsDataServiceStub.getResourceDetails
                    .withArgs(sinon.match.any)
                    .returns(resourceDet);

                screen.saveDebriefData(activityDetails).then((result) => {
                    assert.equal(result.wo_number, 100000549488958);
                })
            }));

            test('#processDebrief with activity details flow 3', (async function () {

                let activityDetails = {
                    activityId : 123456,
                    wo_number : 100000549488958,
                    resourceId: 1241
                }
                let cacheData = {
                    orgId : 100,
                    debriefMetaData : 9786546
                };
                let installed = Promise.resolve({
                    "totalResults": 1,
                    "limit": 10,
                    "offset": 0,
                    "items": [
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "expense",
                            "quantity": 1,
                            "resourceId": "33011",
                            "activityId": 4225371
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "labor",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceTimeZoneDiff" : 0,
                            "activityId": 4225371,
                            "labor_start_time" : "2023-04-11T05:57:34+00:00",
                            "labor_end_time" : "2023-04-11T05:57:34+00:00"
                        },
                        {
                            "inventoryId": 21258546,
                            "inventoryType": "part",
                            "quantity": 1,
                            "resourceId": "33011",
                            "resourceType" : "TRUCK",
                            "activityId": 4225371
                        }
                    ]
                });

                let deinstalled = Promise.resolve(
                    {
                        items: {
                            inventoryType: "expense",
                            CurrencyCode: "USD",
                            ExpenseAmount: "60",
                            InventoryItemNumber: "Parking",
                            LineStatusCode: "NEW",
                            LineType: "E",
                            ServiceActivityCode: "Expense",
                            UOMCode: "USD"
                        },
                        totalResults: 1,
                        hasMore: false
                    })
                let resourceDet = Promise.resolve(
                    {
                        items: {
                            resourceType: "TRUCK"
                        }
                    });

                let resourceRoles = Promise.resolve(
                    [{ "label": "field_resource", "role": "field_resource" },
                        { "label": "bucket", "role": "bucket" }]);

                let screen = new ServiceDebriefHelper();
                screen._fusionDataService = fusionDataServiceStub;
                screen._ofsDataService = ofsDataServiceStub;
                screen.laborTimeUtils = laborTimeUtilsStub ;
                sinon.stub(PersistentStorage, 'loadData').withArgs('rolesList').returns(null);
                sinon.stub(PersistentStorage, 'saveData');
                fusionDataServiceStub.createDebriefHeader
                    .withArgs(sinon.match.any)
                    .returns(cacheData);
                ofsDataServiceStub.getInstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(installed);
                ofsDataServiceStub.getResourceRoles
                    .withArgs(sinon.match.any)
                    .returns(resourceRoles);
                ofsDataServiceStub.getDeinstalledInventoriesFromActivity
                    .withArgs(sinon.match.any)
                    .returns(deinstalled);
                ofsDataServiceStub.getResourceDetails
                    .withArgs(sinon.match.any)
                    .returns(resourceDet);

                screen.saveDebriefData(activityDetails).then((result) => {
                    assert.equal(result.wo_number, 100000549488958);
                })

                sinon.restore();
            }));

            test('#loadDebriefDefaultOrg test', (async function () {
                const mockFusionDataService = {
                    loadDefaultOrg: sinon.spy()
                };

                let screen = new ServiceDebriefHelper();
                screen._fusionDataService = mockFusionDataService;

                screen.loadDebriefDefaultOrg();

                expect(mockFusionDataService.loadDefaultOrg.calledOnce).to.be.true;
            }));

        });

    });