define(['services/ofsc-rest-api-transport',
    'data-services/activity-data-service',
    'ofsc-connector'],
    (OfscRestApiTransport, ActivityDataService, OfscConnector) => {

        suite('ActivityDataService', () => {
            let restApiTransportStub;
            let ofscConnector;

            setup(() => {
                restApiTransportStub = sinon.createStubInstance(OfscRestApiTransport);
                ofscConnector = sinon.createStubInstance(OfscConnector);
           });

            teardown(() => {
                sinon.reset();
            });

            test('#ActivityDataService is working', (() => {
                let screen = new ActivityDataService(restApiTransportStub);
                screen.should.be.instanceOf(ActivityDataService);
            }));

            test('getActivityDetailsById is working', (() => {
                let restTran = new OfscRestApiTransport("url", ofscConnector);
                let responseData = Promise.resolve({
                    items : [ {
                        activityId: 12344,
                        apptNumber : "W01234",
                        wo_number : 100000549488958,
                        status : "completed"
                    } ]
                });
                const stub = sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ActivityDataService(restTran);
                let result = screen.getActivityDetailsById(12344);
                assert(stub.calledOnce, 'Transport request should be called once');

            }));

            test('getInstalledInventoriesFromActivity is working', (() => {
                let restTran = new OfscRestApiTransport("url", ofscConnector);
                let responseData = Promise.resolve({
                    items : [ {
                        inventoryType: "part",
                        part_service_activity_used : "Install",
                        part_item_number : "RCL_FS54888",
                        part_uom_code : "Ea"
                    } ]
                });
                const stub = sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ActivityDataService(restTran);
                let result = screen.getInstalledInventoriesFromActivity(12344);
                assert(stub.calledOnce, 'Transport request should be called once');

            }));

            test('getDeinstalledInventoriesFromActivity is working', (() => {
                let restTran = new OfscRestApiTransport("url", ofscConnector);
                let responseData = Promise.resolve({
                    items : [ {
                        inventoryType: "part",
                        part_service_activity_returned : "RECOVER",
                        part_item_number : "RCL_FS54888",
                        part_uom_code : "Ea"
                    } ]
                });
                const stub = sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ActivityDataService(restTran);
                let result = screen.getDeinstalledInventoriesFromActivity(12344);
                assert(stub.calledOnce, 'Transport request should be called once');

            }));

            test('getResourceDetails is working', (() => {
                let restTran = new OfscRestApiTransport("url", ofscConnector);
                let responseData = Promise.resolve({
                        resourceId: "55028",
                        resourceType : "TECH"
                });
                const stub = sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ActivityDataService(restTran);
                let result = screen.getResourceDetails(12344);
                assert(stub.calledOnce, 'Transport request should be called once');

            }));

            test('getResourceRoles is working', (() => {
                let restTran = new OfscRestApiTransport("url", ofscConnector);
                let responseData = Promise.resolve({
                        items: [
                            {
                                "label": "field_resource",
                                "role": "field_resource"
                            },
                            {
                                "label": "bucket",
                                "role": "bucket"
                            }]
                });
                const stub = sinon.stub(restTran, 'request')
                    .withArgs(sinon.match.any)
                    .returns(responseData);
                let screen = new ActivityDataService(restTran);
                screen.getResourceRoles();
                assert(stub.calledOnce, 'Transport request should be called once');

            }));


        });

    });