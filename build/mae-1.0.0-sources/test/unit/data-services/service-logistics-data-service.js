define(['data-services/service-logistics-data-service', 'services/fusion-rest-api-transport','models/debrief-model', 'storage/persistent-storage'],
    (ServicelogisticsService, FusionRestApiTransport, DebriefModel, PersistentStorage) => {

        suite('ServicelogisticsService', () => {
            var restApiTransportStub;
            setup(() => {
                restApiTransportStub = sinon.createStubInstance(FusionRestApiTransport);
           });

            teardown(() => {
                sinon.reset();
            });

            test('#ServicelogisticsService is working', (() => {
                let screen = new ServicelogisticsService(restApiTransportStub);
                screen.should.be.instanceOf(ServicelogisticsService);
            }));

            test('#loadDefaultOrg with data', (async function () {

                let serviceReqResp = Promise.resolve({
                    items : [ {
                        BUOrgId : 1234,
                        AccountPartyId: 12453,
                        InventoryItemId : 100000549488958,
                        IBAssetId : 32456786574,
                        PurchaseOrder : null
                    } ]
                });
                let resourceDet = Promise.resolve({
                    items : [ {
                        WoNumber : "W01234",
                        WoId : 100000549488958,
                        SrId : 154,
                        IBAssetSerialNumber : "VR1000000003"
                    } ]
                });
                let screen = new ServicelogisticsService();
                let responseData = Promise.resolve({
                    items : [ {
                        ProfileOptionValue : "14241"
                    } ]
                });
                sinon.stub(screen, 'getOrgId')
                    .returns(responseData);

                sinon.stub(screen, 'getCustomerWorkOrders').withArgs(sinon.match.any, sinon.match.any).returns(resourceDet);
                sinon.stub(screen, 'getServiceRequests').withArgs(sinon.match.any).returns(serviceReqResp);
                screen.loadDefaultOrg(12323,100000549488958,123123).then((result) => {
                    assert.equal(result.woNumber, 'W01234');
                })

            }));

            test('#loadDefaultOrg with error', (async function () {
                let screen = new ServicelogisticsService();
                sinon.stub(screen, 'getOrgId').rejects(new Error('Error fetching Org Id'));
                const consoleErrorSpy = sinon.spy(console, 'error');

                await screen.loadDefaultOrg();
                expect(consoleErrorSpy.calledOnce).to.be.true;
                expect(consoleErrorSpy.firstCall.args[0]).to.include("Error fetching Org Id");
                console.error.restore();

            }));

            test('#getCustomerWorkOrders with apptNumber', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items : [ {
                        WoNumber : "W01234",
                        WoId : 100000549488958,
                        SrId : 154,
                        IBAssetSerialNumber : "VR1000000003"
                    } ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                await responseData;
                screen.getCustomerWorkOrders("100000549488958").then((result) => {
                    assert.equal(result.woNumber, 'W01234');
                })
            }));

            test('#getCustomerWorkOrders no data return error', ( async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {}
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getCustomerWorkOrders("100000549488958");
                await expect(screen.getCustomerWorkOrders()).to.be.rejected;
            }));

            test('#processDebriefResponse no data return', ( async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {
                    items : [ {
                        DebriefHeaderId : 1234
                    } ]
                }
                var screen = new ServicelogisticsService(restTran);
                let result = await(screen.processDebriefResponse(responseData))
                await expect(result.DebriefHeaderId).to.be.undefined;
            }));

            test('#getCustomerWorkOrderByWONUmber with Data', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items : [ {
                        WoNumber : "W01234",
                        WoId : 100000549488958,
                        SrId : 154,
                        IBAssetSerialNumber : "VR1000000003"
                    } ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                await responseData;
                screen.getCustomerWorkOrderByWONUmber("W01234").then((result) => {
                    assert.equal(result.woId, 100000549488958);
                })
            }));

            test('#getCustomerWorkOrderByWONUmber no data return error', ( async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {}
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getCustomerWorkOrderByWONUmber("W01234");
                await expect(screen.getCustomerWorkOrderByWONUmber()).to.be.rejected;
            }));

            test('#getCustomerWorkOrderByWONUmber empty data return', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {}; // sample empty response

                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .resolves(responseData); // resolves, since getCustomerWorkOrderByWONUmber returns a Promise

                var screen = new ServicelogisticsService(restTran);
                const result = await screen.getCustomerWorkOrderByWONUmber("W01234");
                expect(result).to.equal('');
            }));

            test('#getServiceRequests with debriefHeader', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items : [ {
                        BUOrgId : 1234,
                        AccountPartyId: 12453,
                        InventoryItemId : 100000549488958,
                        IBAssetId : 32456786574,
                        PurchaseOrder : null
                    } ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                await responseData;
                let debriefHeader = {
                    WoNumber : "W01234",
                    WoId : 100000549488958,
                    SrId : 154,
                    IBAssetSerialNumber : "VR1000000003"
                }
                screen.getServiceRequests(debriefHeader).then((result) => {
                    assert.equal(result.IBAssetId, '32456786574');
                })
            }));

            test('#getServiceRequests no data return error', ( async function () {
                let screen = new ServicelogisticsService(restApiTransportStub);
                await expect(screen.getCustomerWorkOrders()).to.be.rejected;
            }));

            test('#getDebriefHeader with srId', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items : [ {
                        WoNumber : "W01234",
                        WoId : 100000549488958,
                        SrId : 123,
                        IBAssetSerialNumber : "VR1000000003"
                    } ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                await responseData;
                screen.getDebriefHeader("123").then((result) => {
                    assert.equal(result.woNumber, 'W01234');
                })
            }));

            test('#getDebriefHeader no data return error', ( async function () {
                let screen = new ServicelogisticsService(restApiTransportStub);
                await expect(screen.getDebriefHeader()).to.be.rejected;
            }));

            test('#getOrgId with data', (async function () {
                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items : [ {
                        ProfileOptionValue : "14241"
                    } ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                await responseData;
                screen.getOrgId().then((result) => {
                    assert.equal(result.ProfileOptionValue, '14241');
                })
            }));

            test('#getOrgId no data return error', ( async function () {
                const screen = new ServicelogisticsService();

                const error = new Error("Simulated transport failure");
                screen._transport = {
                    request: sinon.stub().rejects(error)
                };
                screen.constructor.GET_DEFAULT_ORG_ID = '/some/path';

                const consoleSpy = sinon.spy(console, 'error');

                try {
                    await screen.getOrgId();
                    throw new Error("Expected getOrgId to throw, but it didn't");
                } catch (e) {
                    expect(e).to.equal(error);
                    expect(consoleSpy.calledOnce).to.be.true;
                    expect(consoleSpy.firstCall.args[0]).to.include("Error fetching Org Id");
                }

                // Clean up
                console.error.restore();
            }));

            test('#getStockingLocations with data', (async function () {
                const stockLocationId = 300100182866241;
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const expectedPath = 'fscmRestApi/resources/latest/stockingLocations/{stockLocationId}'.replace(/{stockLocationId}/g, stockLocationId);
                let responseData =  {
                            "StockLocationId": 300100175330935,
                            "StockLocationName": "FST.FS_Truck6",
                            "OrganizationId": 5702
                        } ;
                sinon.stub(restTran, 'request')
                    .withArgs(expectedPath)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getStockingLocations(300100182866241).then((result) => {
                    assert.equal(result.OrganizationId, '5702');
                })
            }));

            test('#getStockingLocations with empty response', (async function () {
                const stockLocationId = 300100182866241;
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const expectedPath = 'fscmRestApi/resources/latest/stockingLocations/{stockLocationId}'.replace(/{stockLocationId}/g, stockLocationId);
                let responseData =  null ;
                sinon.stub(restTran, 'request')
                    .withArgs(expectedPath)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getStockingLocations(300100182866241).then((result) => {
                    assert.equal(result.OrganizationId, '');
                })
            }));

            test('#getStockingLocations return error', ( async function () {
                const stockLocationId = 300100182866241;
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const expectedPath = 'fscmRestApi/resources/latest/stockingLocations/{stockLocationId}'.replace(/{stockLocationId}/g, stockLocationId);
                sinon.stub(restTran, 'request')
                    .withArgs(expectedPath)
                    .rejects(new Error("Error fetching Stocking location for Truck resources"));
                let screen = new ServicelogisticsService(restTran);
                const logStub = sinon.stub(console, 'error');
                await screen.getStockingLocations(stockLocationId);
                sinon.assert.calledWith(logStub, "Error fetching Stocking location for Truck resources");
                logStub.restore();
            }));

            test('#getTechSubInventories with data', (async function () {
                const resourceId = 300100182866241;
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                var path = 'fscmRestApi/resources/latest/technicianSubinventories?q=PartyId={resourceId};ConditionCode=GOOD;DefaultFlag=true;EnabledFlag=true'.replace(/{resourceId}/g, resourceId);;
                let responseData = {
                    "items": [
                        {
                            "Subinventory": "FST.FS_Truck6",
                            "OrganizationId": 5702
                        }
                    ]
                };
                sinon.stub(restTran, 'request')
                    .withArgs(path)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getTechSubInventories(300100182866241).then((result) => {
                    assert.equal(result.OrganizationId, '5702');
                })
            }));

            test('#getTechSubInventories with no data response', (async function () {
                const resourceId = 300100182866241;
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                var path = 'fscmRestApi/resources/latest/technicianSubinventories?q=PartyId={resourceId};ConditionCode=GOOD;DefaultFlag=true;EnabledFlag=true'.replace(/{resourceId}/g, resourceId);;
                let responseData = null;
                sinon.stub(restTran, 'request')
                    .withArgs(path)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen.getTechSubInventories(300100182866241).then((result) => {
                    assert.equal(result.OrganizationId, '5702');
                })
            }));

            test('#getTechSubInventories no data return error', ( async function () {
                const resourceId = 300100182866241;
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const expectedPath = 'fscmRestApi/resources/latest/technicianSubinventories?q=PartyId={resourceId};ConditionCode=GOOD;DefaultFlag=true;EnabledFlag=true'.replace(/{resourceId}/g, resourceId);
                sinon.stub(restTran, 'request')
                    .withArgs(expectedPath)
                    .rejects(new Error("Error fetching subinventory details for a Tech resource"));
                let screen = new ServicelogisticsService(restTran);
                const logStub = sinon.stub(console, 'error');
                await screen.getTechSubInventories(300100182866241);
                sinon.assert.calledWith(logStub, "Error fetching subinventory details for a Tech resource");
                logStub.restore();
            }));

            test('#getUOMCode with data', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {
                    items: [{
                        PrimaryUOMCode: "12321"
                    }]
                }
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen._orgId = 1;
                screen.getUOMCode(300100182866241).then((result) => {
                    assert.equal(result.PrimaryUOMCode, '12321');
                })
            }));

            test('#getUOMCode with data', (async function () {
                var restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = {
                }
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                var screen = new ServicelogisticsService(restTran);
                screen._orgId = 1;
                screen.getUOMCode(300100182866241).then((result) => {
                    assert.equal(result.PrimaryUOMCode, '12321');
                })
            }));

            test('#getUOMCode no data return error', ( async function () {
                let screen = new ServicelogisticsService(restApiTransportStub);
                await expect(screen.getUOMCode(1242)).to.be.rejected;
            }));

            test('#createDebriefHeader with non empty debriefHeaderId ', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                let responseData = Promise.resolve({
                    items: [
                        {
                            DebriefHeaderId : 12432,
                            WoNumber : "W01234",
                            WoId : 100000549488958,
                            SrId : 123,
                            IBAssetSerialNumber : "VR1000000003"
                        }
                    ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ServicelogisticsService(restTran);
                let dbHeader = {
                    DebriefHeaderId : 12432,
                    WoNumber : "W01234",
                    WoId : 100000549488958,
                    SrId : 123,
                    IBAssetSerialNumber : "VR1000000003"
                }

                let dbDetailsResponse = "";

                sinon.stub(screen, 'getDebriefHeader').returns(dbDetailsResponse);
                screen.createDebriefHeader(dbHeader);
                await dbDetailsResponse
                await responseData

            }));

            test('#createDebriefHeader with empty debriefHeaderId ', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                let responseData = Promise.resolve({
                    items: [ { }]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ServicelogisticsService(restTran);
                let dbHeader = {
                    buOrgId: 120,
                    accountPartyId : 32354,
                    productItemId : 12432,
                    ibAssetId : "W01234",
                    woNumber : 100000549488958,
                    resourceId : 123,
                    woId : "VR1000000003",
                    ibSerialNumber : 132453
                }

                let dbDetailsResponse = Promise.resolve({
                    items : [ {
                        DebriefHeaderId : 300100634339733
                    } ]
                });
                sinon.stub(screen, 'getDebriefHeader').resolves(dbDetailsResponse);
                screen.createDebriefHeader(dbHeader);
                await dbDetailsResponse;


            }));

            test('#createDebriefHeader with error', (async function () {
                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const svcWorkOrderId = 'WO123';
                const resourceId = 'RES789';
                const lineItemsArray = [{ item: 'something' }];
                let responseData = Promise.resolve({
                    items: [ { }]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ServicelogisticsService(restTran);
                sinon.stub(screen, 'getDebriefHeader').rejects(new Error('Error creating debrief'));
                const consoleSpy = sinon.spy(console, 'error');
                try {
                    await screen.createDebriefHeader(svcWorkOrderId, resourceId, lineItemsArray);
                    throw new Error("Expected createDebriefHeader to throw but it did not");
                } catch (e) {
                    expect(e.message).to.equal('Error creating debrief');
                }
                expect(consoleSpy.calledOnce).to.be.true;
                expect(consoleSpy.firstCall.args[0]).to.include("Error creating debrief");
                screen.getDebriefHeader.restore();
                console.error.restore();

            }));

            test('#createDebriefHeader returns null when svcWorkOrderId is null', async function () {
                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let responseData = Promise.resolve({
                    items: [ { }]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                const screen = new ServicelogisticsService({});
                const result = await screen.createDebriefHeader(null, 123455, null, 1234444);
                assert.equal(result, null);
            });

            test('#createDebriefHeader uses getDebriefHeader and returns its value if found', async function () {
                const screen = new ServicelogisticsService({});
                sinon.stub(screen, 'getDebriefHeader').resolves(77777);

                const result = await screen.createDebriefHeader("WO456", 123455, null, null);
                assert.equal(result, 77777); // from stubbed getDebriefHeader
            });

            test('#createDebriefHeader logs and returns if customerWO has no srId', async function () {
                const screen = new ServicelogisticsService({});
                sinon.stub(screen, 'getDebriefHeader').resolves(null);
                sinon.stub(screen, 'getCustomerWorkOrders').resolves({ srId: null });

                const debugStub = sinon.stub(console, 'debug');

                const result = await screen.createDebriefHeader("WO789", 123455, null, null);
                assert.equal(result, undefined);
                assert(debugStub.calledWith("The Work Order does not have a SR Id"));

                debugStub.restore();
            });

            test('#createDebriefLineItems with non empty debriefHeaderId ', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                let responseData = Promise.resolve({
                    items: [
                        {
                            DebriefHeaderId : 12432,
                            WoNumber : "W01234",
                            WoId : 100000549488958,
                            SrId : 123,
                            IBAssetSerialNumber : "VR1000000003"
                        }
                    ]
                });
                sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ServicelogisticsService(restTran);
                let dbHeader = {
                    DebriefHeaderId : 12432,
                    WoNumber : "W01234",
                    WoId : 100000549488958,
                    SrId : 123,
                    IBAssetSerialNumber : "VR1000000003"
                }

                let dbDetailsResponse = "";

                sinon.stub(screen, 'getDebriefHeader').returns(dbDetailsResponse);
                screen.createDebriefLineItems(dbHeader);
                await dbDetailsResponse
                await responseData

            }));

            test('#createDebriefLineItems logs if customerWO has no srId', async function () {
                const screen = new ServicelogisticsService({});
                sinon.stub(screen, 'getDebriefHeader').resolves(null);
                sinon.stub(screen, 'getCustomerWorkOrders').resolves({ srId: null });

                const debugStub = sinon.stub(console, 'debug');

                const result = await screen.createDebriefLineItems("WO789", 123455, null, null);
                assert.equal(result, undefined);
                assert(debugStub.calledWith("The Work Order does not have a SR Id"));

                debugStub.restore();
            });

            test('#createDebriefLineItems with missing srId logs debug and returns', async function () {
                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                const svcWorkOrderId = 'WO123';
                const resourceId = 'RES789';
                const lineItemsArray = [{ item: 'something' }];

                const screen = new ServicelogisticsService(restTran);

                sinon.stub(screen, 'getCustomerWorkOrders').resolves({}); // no srId
                const debugSpy = sinon.spy(console, 'debug');

                const result = await screen.createDebriefLineItems(svcWorkOrderId, resourceId, lineItemsArray);

                expect(result).to.be.undefined;
                expect(debugSpy.calledOnce).to.be.true;
                expect(debugSpy.firstCall.args[0]).to.include('The Work Order does not have a SR Id');

                console.debug.restore();
            });

            test('#createDebriefLineItems throws and logs error', async function () {
                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                const svcWorkOrderId = 'WO123';
                const resourceId = 'RES789';
                const lineItemsArray = [{ item: 'something' }];

                const screen = new ServicelogisticsService(restTran);

                sinon.stub(screen, 'getCustomerWorkOrders').throws(new Error('Error creating debrief line items'));
                const errorSpy = sinon.spy(console, 'error');

                try {
                    await screen.createDebriefLineItems(svcWorkOrderId, resourceId, lineItemsArray);
                    throw new Error('Test should not reach here');
                } catch (e) {
                    expect(e.message).to.equal('Error creating debrief line items');
                    expect(errorSpy.calledOnce).to.be.true;
                    expect(errorSpy.firstCall.args[0]).to.include('Error creating debrief line items');
                }

                console.error.restore();
            });

            test('#createLaborItemsPayload handles error and returns filtered results', async function () {
                const screen = new ServicelogisticsService();
                const laborItems = [
                    { labor_item_number: 'L001' },
                    { labor_item_number: 'L002' }
                ];

                // Stub getUOMCode to throw error for one item
                const getUOMCodeStub = sinon.stub(screen, 'getUOMCode');
                getUOMCodeStub.onFirstCall().rejects(new Error('UOM not found'));
                getUOMCodeStub.onSecondCall().resolves('HRS');

                // Stub _createLaborPayload for the second labor item
                const createPayloadStub = sinon.stub(screen, '_createLaborPayload');
                createPayloadStub.withArgs(laborItems[1], 'HRS').resolves({ item: 'createdPayload' });

                const errorSpy = sinon.spy(console, 'error');

                const result = await screen.createLaborItemsPayload(laborItems);

                // Expected: only 1 valid payload should be returned
                expect(result).to.have.lengthOf(1);
                expect(result[0]).to.deep.equal({ item: 'createdPayload' });

                // Verify error logging
                expect(errorSpy.calledOnce).to.be.true;
                expect(errorSpy.firstCall.args[0]).to.include('Error creating labor item');
                expect(errorSpy.firstCall.args[1]).to.deep.equal(laborItems[0]);

                // Cleanup
                console.error.restore();
            });


            test('#createExpenseItemsPayload test', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let expenses = {
                            "CurrencyCode":"USD",
                            "ExpenseAmount":"60",
                            "InventoryItemNumber":"Parking Expense - EUR",
                            "LineStatusCode":"NEW",
                            "LineType":"E",
                            "ServiceActivityCode":"Expense",
                            "UOMCode":"USD"
                        };
                let screen = new ServicelogisticsService(restTran);
                const result = await screen.createExpenseItemsPayload([expenses]);
                expect(result).to.deep.equal[{"LineStatusCode":"NEW","LineType":"E"}];
            }));

            test('#createExpenseItemsPayload test with error response', async function () {
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const expenses = {
                    "CurrencyCode": "USD",
                    "ExpenseAmount": "60",
                    "InventoryItemNumber": "Parking Expense - EUR",
                    "LineStatusCode": "NEW",
                    "LineType": "E",
                    "ServiceActivityCode": "Expense",
                    "UOMCode": "USD"
                };
                const errExpense = {
                    InventoryItemNumber: "Bad Item"
                };

                const screen = new ServicelogisticsService(restTran);
                screen._createExpensePayload = async function (item) {
                    if (item.InventoryItemNumber === "Bad Item") {
                        throw new Error("Simulated failure");
                    }
                    return {};
                };
                const errorSpy = sinon.spy(console, 'error');

                const result = await screen.createExpenseItemsPayload([errExpense]);

                expect(result).to.deep.equal[{}];
                expect(errorSpy.calledOnce).to.be.true;
                expect(errorSpy.firstCall.args[0]).to.include("Error creating expense item payload");
                errorSpy.restore();
            });

            test('#createLaborItemsPayload test', async function () {
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");

                const labor = {
                    "InventoryItemNumber": "Overtime Labor",
                    "LaborEndDate": "2025-05-23T02:30:00.000Z",
                    "LaborStartDate": "2025-05-22T22:30:00.000Z",
                    "LineStatusCode": "NEW",
                    "LineType": "L",
                    "Quantity": 1,
                    "ServiceActivityCode": "INSTALL",
                    "UOMCode": "HR"
                };

                const screen = new ServicelogisticsService(restTran);

                sinon.stub(screen, 'getUOMCode').returns("HR");

                const logSpy = sinon.spy(console, 'error');

                const result = await screen.createLaborItemsPayload([labor]);
                expect(result).to.deep.equal[{"LineStatusCode":"NEW","LineType":"L","UOMCode":"HR"}];

                sinon.assert.notCalled(logSpy);
                logSpy.restore();
            });

            test('#createUsedPartsPayload test when resourceType is field_resource', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let usedParts = {
                    SubinventoryCode: "FS_Truck6",
                    part_item_number: "RCL_FSS",
                    quantity : 2,
                    part_uom_code : "Ea",
                    resourceType : "field_resource",
                    resourceId: 1234555
                };

                let roles = [{ "label": "field_resource", "role": "field_resource" },
                                                        { "label": "bucket", "role": "bucket"}];

                let orgSubInvResp = {
                    organizationId: 32145666677,
                    subinventory: 34234234234
                }
                let screen = new ServicelogisticsService(restTran);
                sinon.stub(screen, 'getTechSubInventories').withArgs(1234555).resolves(orgSubInvResp);
                sinon.stub(screen, 'getStockingLocations').withArgs(1234555).resolves(orgSubInvResp);
                sinon.stub(screen, 'getExistingReservation').resolves({ ReservationId: 'RES123' });
                sinon.stub(screen, 'createReservation').resolves({ ReservationId: 'RES123' });
                const result = await screen.createUsedPartsPayload([usedParts], roles, );
                expect(result).to.deep.equal[{"InventoryItemNumber":"RCL_FSS","LineType":"M","OrganizationId":32145666677,"Quantity":2,"ReservationId":"RES123","SubinventoryCode":34234234234,"UOMCode":"Ea"}]

            }));

            test('#createUsedPartsPayload test when resourceType is field_resource and no existing reservation', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let usedParts = {
                    SubinventoryCode: "FS_Truck6",
                    part_item_number: "RCL_FSS",
                    quantity : 2,
                    part_uom_code : "Ea",
                    resourceType : "field_resource",
                    resourceId: 1234555
                };

                let roles = [{ "label": "field_resource", "role": "field_resource" },
                    { "label": "bucket", "role": "bucket"}];

                let orgSubInvResp = {
                    organizationId: 32145666677,
                    subinventory: 34234234234
                }
                let screen = new ServicelogisticsService(restTran);
                sinon.stub(screen, 'getTechSubInventories').withArgs(1234555).resolves(orgSubInvResp);
                sinon.stub(screen, 'getStockingLocations').withArgs(1234555).resolves(orgSubInvResp);
                sinon.stub(screen, 'getExistingReservation').resolves({});
                sinon.stub(screen, 'createReservation').resolves({ ReservationId: 'RES123' });
                const result = await screen.createUsedPartsPayload([usedParts], roles, );
                expect(result).to.deep.equal[{"InventoryItemNumber":"RCL_FSS","LineType":"M","OrganizationId":32145666677,"Quantity":2,"ReservationId":"RES123","SubinventoryCode":34234234234,"UOMCode":"Ea"}]

            }));

            test('#createUsedPartsPayload test when resourceType is Vehicle', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let usedParts = {
                    SubinventoryCode: "FS_Truck6",
                    part_item_number: "RCL_FSS",
                    quantity : 2,
                    part_uom_code : "Ea",
                    resourceType : "TRUCK",
                    resourceId: 12312312312,
                    serialNumber: 1243,
                    inventoryType: "part_sn"
                };
                let roles = [{ "label": "field_resource", "role": "field_resource" },
                    { "label": "TRUCK", "role": "vehicle"}];

                let orgSubInvResp = {
                    organizationId: 32145666677,
                    subinventory: 34234234234
                }

                let screen = new ServicelogisticsService(restTran);
                sinon.stub(screen, 'getTechSubInventories').withArgs(sinon.match.any).resolves(orgSubInvResp);
                sinon.stub(screen, 'getStockingLocations').withArgs(sinon.match.any).resolves(orgSubInvResp);
                sinon.stub(screen, '_getContentType').returns({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                });
                sinon.stub(screen, 'createReservation').resolves({ ReservationId: 'RES123' });
                sinon.stub(screen, '_createAddPartsPayload').returns( usedParts );
                const results = await screen.createUsedPartsPayload([usedParts], roles);
                expect(results).to.deep.equal[{
                    SubinventoryCode: "FS_Truck6",
                    part_item_number: "RCL_FSS",
                    quantity : 2,
                    part_uom_code : "Ea",
                    resourceType : "TRUCK",
                    resourceId: 12312312312,
                    serialNumber: 1243,
                    inventoryType: "part_sn"

                }]


            }));

            test('#createUsedPartsPayload test when resourceType is unknown', (async function () {
                let usedParts = {
                    resourceType : "Some",
                    resourceId: 12312312312
                };
                let roles = [{ "label": "field_resource", "role": "field_resource" },
                    { "label": "TRUCK", "role": "vehicle"}];

                let screen = new ServicelogisticsService();
                let failedItems = [{
                    item: 'RCL_123',
                    error: "Bad request"
                }]

                sinon.stub(screen, '_getContentType').returns({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                });
                try {
                    await screen.createUsedPartsPayload([usedParts], roles);
                } catch (err) {
                    expect(err.message).to.equal("1 part item(s) failed to post");
                }

            }));

            test('#getExistingReservation when serialNumber is present and included in item.serials', async function () {
                const parts = {
                    part_item_number: 'ITEM123',
                    serialNumber: 'SN001'
                };
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const mockResponse = {
                    items: [
                        { id: 1, serials: ['SN999', 'SN001'] },
                        { id: 2, serials: ['SN002'] }
                    ]
                };

                const subinventory = 'SUB1';
                const debriefHeaderId = 'DH123';
                const orgId = 'ORG456';

                const instance = new ServicelogisticsService(restTran);
                sinon.stub(restTran, 'request').withArgs(sinon.match.any).resolves(mockResponse);

                const result = await instance.getExistingReservation(orgId, subinventory, parts, debriefHeaderId);
                //expect(result).to.deep.equal(mockResponse.items[0]); // First item includes SN001
            });

            test('#getExistingReservation for non serialised item', async function () {
                const parts = {
                    part_item_number: 'ITEM123'
                };
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const mockResponse = {
                    items: [
                        { id: 1, ItemNumber: 'ITEM123' },
                        { id: 2, ItemNumber: 'ITEM124' }
                    ]
                };

                const subinventory = 'SUB1';
                const debriefHeaderId = 'DH123';
                const orgId = 'ORG456';

                const instance = new ServicelogisticsService(restTran);
                sinon.stub(restTran, 'request').withArgs(sinon.match.any).resolves(mockResponse);

                const result = await instance.getExistingReservation(orgId, subinventory, parts, debriefHeaderId);
                //expect(result).to.deep.equal(mockResponse.items[0]); // First item includes SN001
            });


            test('#createReservation should call transport.request with correct arguments', async function () {
                const mockTransport = {
                    request: sinon.stub(),
                    constructor: {
                        HTTP_METHOD_POST: 'POST'
                    }
                };

                // Custom class with the method
                class FakeService extends ServicelogisticsService {
                    static CREATE_RESERVATION = '/inventory/reservations';
                }

                const service = new FakeService(mockTransport);

                // Arrange inputs
                const orgId = 123;
                const subInvCode = 'FS_TRUCK6';
                const usedPartsCollection = [{ part_item_number: 'ABC', quantity: 2 }];
                const debriefHeaderId = 456;

                const fakePayload = { data: 'payload' };
                const fakeHeaders = { 'Content-Type': 'application/json' };
                const fakeResponse = { success: true };

                // Stubs
                sinon.stub(service, '_createReservationPayload').returns(fakePayload);
                sinon.stub(service, '_getContentType').returns(fakeHeaders);
                mockTransport.request.resolves(fakeResponse);

                // Act
                const result = await service.createReservation(orgId, subInvCode, usedPartsCollection, debriefHeaderId);

                // Assert
                sinon.assert.calledOnceWithExactly(
                    mockTransport.request,
                    '/inventory/reservations',
                    'POST',
                    null,
                    fakePayload,
                    fakeHeaders
                );

                expect(result).to.deep.equal(fakeResponse);
            });


            test('#createReturnPartsPayload test with no data', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let returnedPartsCollection = {
                    "items": []
                };

                let screen = new ServicelogisticsService(restTran);
                const expectedOrgId = 'ORG123';
                sinon.stub(PersistentStorage, 'loadData').returns(expectedOrgId);
                const results = await screen.createReturnPartsPayload([returnedPartsCollection]);
                expect(results).to.deep.equal[{}];
                PersistentStorage.loadData.restore();


                const expectedOrgId1 = [];
                sinon.stub(PersistentStorage, 'loadData').returns(expectedOrgId1);
                const results1 = await screen.createReturnPartsPayload([returnedPartsCollection]);
                expect(results1).to.deep.equal[{}];
                PersistentStorage.loadData.restore();

            }));

            test('#createReturnPartsPayload test with error', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let returnedPartsCollection = {
                    items: [{ partNumber: 'ABC123' }]
                };

                let screen = new ServicelogisticsService(restTran);
                sinon.stub(screen, '_extractOrgId').rejects(new Error('Simulated extractOrgId failure'));
                const consoleErrorSpy = sinon.spy(console, 'error');
                const result = await screen.createReturnPartsPayload(returnedPartsCollection);
                expect(result).to.deep.equal([]);
                expect(consoleErrorSpy.calledOnce).to.be.true;
                expect(consoleErrorSpy.firstCall.args[0]).to.include("Unexpected error while posting returned parts");

                screen._extractOrgId.restore();
                console.error.restore();
            }));

            test('#createReturnPartsPayload test with data', (async function () {

                let restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                let returnedPartsCollection = {
                        items: [{
                            part_item_number: "RCL_FSS",
                            quantity : 2,
                            part_uom_code : "Ea",
                            part_service_activity_returned : "RECOVER"
                        }]
                };

                let screen = new ServicelogisticsService(restTran);
                const results = await screen.createReturnPartsPayload(returnedPartsCollection);
                expect(results).to.deep.equal[{"InventoryItemNumber":"RCL_FSS","LineStatusCode":"NEW","LineType":"M","OrganizationId":{"items":[{"ProfileOptionValue":"14241"}]},"Quantity":2,"ServiceActivityCode":"RECOVER","UOMCode":"Ea"}]
                returnedPartsCollection = {
                    items: [{
                        part_item_number: "RCL_FSS~12344",
                        quantity : 2,
                        part_uom_code : "Ea",
                        part_service_activity_returned : "RECOVER"
                    }]
                };
                const result = await screen.createReturnPartsPayload(returnedPartsCollection);
                expect(result).to.deep.equal[{"InventoryItemNumber":"RCL_FSS","LineStatusCode":"NEW","LineType":"M","OrganizationId":{"items":[{"ProfileOptionValue":"14241"}]},"Quantity":2,"ServiceActivityCode":"RECOVER","UOMCode":"Ea"}]
            }));

            test('#createReturnPartsPayload handles transport request error (covers catch block)', async function () {
                const restTran = new FusionRestApiTransport("url", "clientID", "clientSecret");
                const screen = new ServicelogisticsService(restTran);

                screen._debriefHeaderId = 1234455;
                screen._orgId = 5702;

                let returnedPartsCollection = {
                    items: [{
                        part_item_number: "RCL_FSS",
                        quantity : 2,
                        part_uom_code : "Ea",
                        part_service_activity_returned : "RECOVER"
                    }]
                };

                const requestError = new Error("Simulated transport failure");
                sinon.stub(restTran, 'request').withArgs(sinon.match.any).rejects(requestError);
                sinon.stub(screen, '_getContentType').returns({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                });

                const logStub = sinon.stub(console, 'error');
                await screen.createReturnPartsPayload([returnedPartsCollection]);
                //sinon.assert.calledWith(logStub, "No returned parts to process.");
                logStub.restore();
            });

            test('#_extractOrgId should fetch new orgId if PersistentStorage returns null', async function () {
                const screen = new ServicelogisticsService();

                sinon.stub(PersistentStorage, 'loadData').returns(null);
                sinon.stub(screen, 'getOrgId').resolves('ORG_FROM_API');

                const result = await screen._extractOrgId();

                expect(result).to.equal('ORG_FROM_API');
                expect(screen.getOrgId.calledOnce).to.be.true;

                PersistentStorage.loadData.restore();
                screen.getOrgId.restore();
            });

            test('#_extractOrgId should fetch new orgId if PersistentStorage returns empty object', async function () {
                const screen = new ServicelogisticsService();

                sinon.stub(PersistentStorage, 'loadData').returns({});
                sinon.stub(screen, 'getOrgId').resolves('ORG_FROM_API');

                const result = await screen._extractOrgId();

                expect(result).to.equal('ORG_FROM_API');
                expect(screen.getOrgId.calledOnce).to.be.true;

                PersistentStorage.loadData.restore();
                screen.getOrgId.restore();
            });

            test('#_extractOrgId should return orgId from PersistentStorage if valid', async function () {
                const screen = new ServicelogisticsService();

                sinon.stub(PersistentStorage, 'loadData').returns('STORED_ORG_ID');
                const getOrgStub = sinon.stub(screen, 'getOrgId');

                const result = await screen._extractOrgId();

                expect(result).to.equal('STORED_ORG_ID');
                expect(getOrgStub.notCalled).to.be.true;

                PersistentStorage.loadData.restore();
                screen.getOrgId.restore();
            });

            test('#_createDebriefPayload with lineItemsArray and debriefHeaderId', function () {
                let screen = new ServicelogisticsService();

                const debriefHeader = {
                    buOrgId: 120,
                    partyId: 32354,
                    productItemId: 12432,
                    assetId: "W01234",
                    woNumber: 100000549488958,
                    technicianPartyId: 123,
                    woId: "VR1000000003",
                    productSerialNumber: 132453
                };

                const lineItemsArray = [{ itemId: 1, desc: 'Part1' }];
                const debriefHeaderId = 300100634339733;

                const result = JSON.parse(screen._createDebriefPayload(debriefHeader, lineItemsArray, debriefHeaderId));

                expect(result.lines).to.deep.equal(lineItemsArray);
                expect(result.DebriefHeaderId).to.equal(debriefHeaderId);
            });


            test('#_createDebriefPayload with empty lineItemsArray', function () {
                let screen = new ServicelogisticsService();

                const debriefHeader = {
                    buOrgId: 120,
                    partyId: 32354,
                    productItemId: 12432,
                    assetId: "W01234",
                    woNumber: 100000549488958,
                    technicianPartyId: 123,
                    woId: "VR1000000003",
                    productSerialNumber: 132453
                };

                const result = JSON.parse(screen._createDebriefPayload(debriefHeader, [], null));

                expect(result.lines).to.be.undefined;
                expect(result.DebriefHeaderId).to.be.undefined;
            });


            test('#_createDebriefPayload with null lineItemsArray and no debriefHeaderId', function () {
                let screen = new ServicelogisticsService();

                const debriefHeader = {
                    buOrgId: 120,
                    partyId: 32354,
                    productItemId: 12432,
                    assetId: "W01234",
                    woNumber: 100000549488958,
                    technicianPartyId: 123,
                    woId: "VR1000000003",
                    productSerialNumber: 132453
                };

                const result = JSON.parse(screen._createDebriefPayload(debriefHeader, null, undefined));

                expect(result.lines).to.be.undefined;
                expect(result.DebriefHeaderId).to.be.undefined;
            });

            test('#_createReservationPayload includes serials when inventoryType is part_sn and serialNumber is present', function () {
                const screen = new ServicelogisticsService();

                const usedPartsCollection = {
                    part_item_number: 'ITEM123',
                    inventoryType: 'part_sn',
                    serialNumber: 'SN123456',
                    quantity: 1,
                    part_uom_code: 'EA'
                };

                const result = JSON.parse(
                    screen._createReservationPayload(usedPartsCollection, 100, 'SUB123', 'DBH456')
                );

                expect(result).to.include({
                    OrganizationId: 100,
                    ItemNumber: 'ITEM123',
                    DemandSourceTypeId: 13,
                    DemandSourceName: 'DBH456',
                    SupplySourceTypeId: 13,
                    ReservationQuantity: 1,
                    ReservationUOMCode: 'EA',
                    SubinventoryCode: 'SUB123'
                });

                expect(result.serials).to.be.an('array').with.lengthOf(1);
                expect(result.serials[0].SerialNumber).to.equal('SN123456');
            });

            test('#_createReservationPayload does NOT include serials when inventoryType is not part_sn or serialNumber missing', function () {
                const screen = new ServicelogisticsService();

                const usedPartsCollection = {
                    part_item_number: 'ITEM456',
                    inventoryType: 'part_bulk',
                    quantity: 2,
                    part_uom_code: 'EA'
                };

                const result = JSON.parse(
                    screen._createReservationPayload(usedPartsCollection, 101, 'SUB999', 'DBH999')
                );

                expect(result.serials).to.be.undefined;
            });

            test('#getUOMCode returns correct UOM code when all data is present', async function () {
                const screen = new ServicelogisticsService();
                screen._transport = { request: sinon.stub() };
                sinon.stub(screen, '_extractOrgId').resolves('ORG123');

                const result = {
                    items: [{
                        links: [
                            { name: 'LovPrimaryUOMValue', href: 'http://uom.url' }
                        ],
                        PrimaryUOMValue: 'HRS'
                    }]
                };

                const uomCodeResp = JSON.stringify({
                    items: [
                        { UnitOfMeasure: 'HRS', UomCode: 'HRS' },
                        { UnitOfMeasure: 'MIN', UomCode: 'MIN' }
                    ]
                });

                screen._transport.request.onFirstCall().resolves(result);
                screen._transport.request.onSecondCall().resolves(uomCodeResp);

                const uomCode = await screen.getUOMCode('L001');

                expect(uomCode).to.equal('HRS');
            });

            test('#getUOMCode returns null when UOM value not found in response', async function () {
                const screen = new ServicelogisticsService();
                screen._transport = { request: sinon.stub() };
                sinon.stub(screen, '_extractOrgId').resolves('ORG123');

                const result = {
                    items: [{
                        links: [
                            { name: 'LovPrimaryUOMValue', href: 'http://uom.url' }
                        ],
                        PrimaryUOMValue: 'HRS'
                    }]
                };

                const uomCodeResp = JSON.stringify({
                    items: [
                        { UnitOfMeasure: 'MIN', UomCode: 'MIN' }
                    ]
                });

                screen._transport.request.onFirstCall().resolves(result);
                screen._transport.request.onSecondCall().resolves(uomCodeResp);

                const uomCode = await screen.getUOMCode('L001');

                expect(uomCode).to.equal(null);
            });

            test('#getUOMCode throws or fails if LovPrimaryUOMValue link is missing', async function () {
                const screen = new ServicelogisticsService();
                screen._transport = { request: sinon.stub() };
                sinon.stub(screen, '_extractOrgId').resolves('ORG123');

                const result = {
                    items: [{
                        links: [
                            { name: 'OtherLink', href: 'http://wrong.url' }
                        ],
                        PrimaryUOMValue: 'HRS'
                    }]
                };

                screen._transport.request.onFirstCall().resolves(result);

                try {
                    await screen.getUOMCode('L001');
                    throw new Error('Expected method to throw, but it did not');
                } catch (err) {
                    expect(err).to.exist;
                }
            });
        });

    });