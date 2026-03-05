define(['knockout',
        'services/ofsc-plugin-api-transport',
        'services/ofsc-rest-api-transport',
        'services/fusion-rest-api-transport',
        'ofsc-connector' ,
        'storage/persistent-storage',
        'data-services/parts-catalog-data-service',
        'constants',
        'data-helper/data-debrief-helper',
        'data-services/activity-data-service'],
    (ko,
     OfscPluginApiTransport,
     OfscRestApiTransport,
     FusionRestApiTransport,
     OfscConnector,
     PersistentStorage,
     PartsCatalogDataService,
     Constants,
     DataDebriefHelper,
     ActivityDataService) => {

        suite('OfscPluginApiTransport', () => {
            let ofscConnector;
            let transport;
            var localStorage = {};
            let getItemStub;

            setup(() => {
                localStorage.setItem = function (key, val) {
                    this[key] = val + '';
                }
                localStorage.getItem = function (key) {
                    return this[key];
                }

            });

            suiteSetup(() => {
                const proto = Object.getPrototypeOf(window.localStorage);
                if (proto.getItem.restore) {
                    proto.getItem.restore(); // Important: clean up leftover stub from other suite
                }
                getItemStub = sinon.stub(proto, 'getItem');
                getItemStub.withArgs(Constants.APPLICATIONS).returns(JSON.stringify({
                    fusionOAuthUserAssertionApplication: {
                        type: 'oauth_user_assertion',
                        resourceUrl: 'https://cptbmtqqy.fusionapps.ocs.oc-test.com'
                    },
                    ofsApiApplication: {
                        type: 'ofs',
                        resourceUrl: 'https://plugins-0-ofsc-c033e3.test.fs.ocs.oc-test.com'
                    }
                }));

                getItemStub.withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(JSON.stringify([
                    "4232250",
                    "4232253"
                ]));
            });

            suiteTeardown(() => {
                if (getItemStub && getItemStub.restore) {
                    getItemStub.restore();
                }
            });

            test('Constructor is working', (() => {
                transport = new OfscPluginApiTransport();
                expect(transport).to.be.an.instanceof(OfscPluginApiTransport);
            }));

            test('#load() with init method is working', (async () => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                let initData = {
                    method: 'ready',
                    sendInitData: true
                };

                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'init',
                                'attributeDescription': attributeDesc,
                                'environment': {
                                    'environmentName': 'cptblfbqy-test',
                                    'fsUrl': 'https://CPTBLFBQY-TEST.fs.ocs.oc-test.com',
                                    'faUrl': 'https://cptblfbqy-test.fusionapps.ocs.oc-test.com'
                                }, 'data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }], 'Activity': {'aid': '4232516'}, inventory: {}
                                }
                            });
                        })
                    );
                ofscConnector.sendMessage.withArgs({ method: 'initEnd'})
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let result = transport.load();
                expect(result).to.be.a('promise');
            }));

            test('#load() with wakeup method is working', (async () => {

                let initData = {
                    method: 'ready',
                    sendInitData: true
                };

                const activityDetails = {
                    "apptNumber": "300100634335603",
                    "status": "completed",
                    "activityId": 4232249,
                    "resourceId": "300100073143336",
                    "resourceTimeZoneDiff": -420,
                    "wo_number": "0000018029"
                };
                let getActivityDetailsStub = sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById');
                getActivityDetailsStub.withArgs('4232250').resolves(activityDetails);


                const mockStrategy = { saveDebriefData: sinon.stub().resolves() };
                sinon.stub(DataDebriefHelper, 'getStrategy').returns(mockStrategy);
                ofscConnector = sinon.createStubInstance(OfscConnector);
                transport = new OfscPluginApiTransport();
                //sinon.stub(transport._activityDataService, 'getActivityDetailsById').withArgs(4232250).resolve(activityDetails);
                //transport._activityDataService = activityDataServiceStub;
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                        return resolve({
                            'method': 'wakeup', 'event': "online"})
                    }));

                transport.ofscConnector = ofscConnector;
                let result = transport.load();
                //await transport._fetchCachedActivityListAndProcess();
                expect(result).to.be.a('promise');
            }));

            test('#load() with wakeup method is working in fusion environment', (async () => {
                sinon.restore();
                let initData = {
                    method: 'ready',
                    sendInitData: true
                };

                const activityDetails = {
                    "apptNumber": "300100634335603",
                    "status": "completed",
                    "activityId": 4232249,
                    "resourceId": "300100073143336",
                    "resourceTimeZoneDiff": -420,
                    "wo_number": "0000018029"
                };
                const actStub = sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById');
                actStub.withArgs('4232250').resolves(activityDetails);


                const mockStrategy = {saveDebriefData: sinon.stub().resolves()};
                sinon.stub(DataDebriefHelper, 'getStrategy').returns(mockStrategy);
                ofscConnector = sinon.createStubInstance(OfscConnector);
                transport = new OfscPluginApiTransport();
                //sinon.stub(transport._activityDataService, 'getActivityDetailsById').withArgs(4232250).resolve(activityDetails);
                //transport._activityDataService = activityDataServiceStub;
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                        return resolve({
                            'method': 'wakeup', 'event': "online"
                        })
                    }));

                getItemStub.withArgs(Constants.FUSION_ENVIRONMENT).returns(JSON.stringify({
                    environmentName: "cptblfbqy-test",
                    fsUrl: "https://CPTBLFBQY-TEST.fs.ocs.oc-test.com",
                    faUrl: "https://cptblfbqy-test.fusionapps.ocs.oc-test.com"
                }));

                transport.ofscConnector = ofscConnector;
                let result = transport.load();
                //await transport._fetchCachedActivityListAndProcess();
                expect(result).to.be.a('promise');
                sinon.restore();
            }));

            test('#load() with wakeup method is working with empty activity list', (async () => {

                let initData = {
                    method: 'ready',
                    sendInitData: true
                };

                ofscConnector = sinon.createStubInstance(OfscConnector);
                transport = new OfscPluginApiTransport();
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                        return resolve({
                            'method': 'wakeup', 'event': "online"})
                    }));

                transport.ofscConnector = ofscConnector;
                getItemStub.withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(JSON.stringify([]));
                let result1 = transport.load();
                expect(result1).to.be.a('promise');

            }));

            test('#load() with open method is working', (async () => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                let initData = {
                    method: 'ready',
                    sendInitData: true
                };
                let actList = {
                    "4232250": {
                        "astatus": "pending",
                        "aid": "4232250"
                    }
                }
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'attributeDescription': attributeDesc, 'entity': 'activityList','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }], activityList: {'aid': '4232516'}, inventory: {}
                                }
                            });
                        })
                    );
                ofscConnector.sendMessage.withArgs({ method: 'initEnd'})
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                transport._pluginApiMessage.activityList = actList;
                let transportResult = transport.load();
                let activityList = [{"aid" : "12434", "astatus" : "pending"},{"aid" : "46346", "astatus" : "complete"}]
                transport._cacheActivityList(activityList);
                expect(transportResult).to.be.a('promise');
            }));

            test('loadData() testing', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                let initData = { method: 'ready',
                    sendInitData: true};
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'init', 'attributeDescription': attributeDesc, 'data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }], 'Activity': {'aid': '4232516'}, inventory: {}
                                }
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                transport.ofscConnector = ofscConnector;
                let pluginPromise = Promise.resolve();
                let partsCatalogDataServiceStub = sinon.createStubInstance(PartsCatalogDataService);
                partsCatalogDataServiceStub.getPartsCatalogsStructure.returns(pluginPromise);
                let result = transport.loadData();
                expect(result).to.be.a('promise');
            }));

            test('should initialize correctly and get resolved', async () => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                const mockMessage = { method: 'init' };
                ofscConnector.sendMessage.resolves(mockMessage);
                transport.load().then(() => {
                    // Expect the promise to be resolved successfully
                    done();
                }).catch((error) => {
                    // Fail the test if there's an error
                    done(error);
                });

            });

            test('#terminatePlugin() with open method', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = {method: 'close',
                    wakeupNeeded: true,
                    wakeOnEvents: {
                        online: { wakeupDelay: 120 },
                        timer: { wakeupDelay: 120, sleepTimeout: 300 }
                    }};
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'entity': 'activity','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }], 'activity': {'aid': '4232516','wo_number': 'WO1111','wo_asset_id': 'ssssadsd'}, inventory: {}
                                },'activity': {'aid': '4232516','wo_number': 'WO1111','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let result = transport.terminatePlugin();
                expect(result).to.be.an('undefined');
            }));

            test('#open() with error - flow 1', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = { method: 'ready', sendInitData: true};
                ofscConnector.attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'entity': 'activity','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }], 'activity': {'aid': '4232516','wo_number': 'WO1111','wo_asset_id': 'ssssadsd'}, inventory: {}
                                },'activity': {'aid': '4232516','wo_number': 'WO1111','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let errorsMsg = 'Error';
                // let verifyPropertiesStub =  sinon.stub(transport, "_verifyProperties")
                //     .returns(errorsMsg);
                transport.load();
                // verifyPropertiesStub.should.have.been.calledOnce;¸
            }));

            test('#open() with error - flow 2', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = { method: 'ready', sendInitData: true};
                ofscConnector.attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'entity': 'activity','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }],
                                },'activity': {'aid': '4232516','astatus': 'closed','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let errorsMsg = '';
                let verifyPropertiesStub = sinon.stub(transport, "_verifyProperties")
                    .returns(errorsMsg);
                transport.load();
                verifyPropertiesStub.should.have.been.calledOnce;
            }));

            test('#open() with error - flow 3', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = { method: 'ready', sendInitData: true};
                ofscConnector.attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'entity': 'activityList','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }],
                                },'activity': {'aid': '4232516','astatus': 'started','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let errorsMsg = '';
                let verifyPropertiesStub = sinon.stub(transport, "_verifyProperties")
                    .returns(errorsMsg);
                transport.load();
                verifyPropertiesStub.should.have.been.calledOnce;
            }));

            test('#open() with error - flow 4', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = { method: 'ready', sendInitData: true};
                ofscConnector.attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'open',  'entity': 'activity','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }],
                                },'activity': {'aid': '4232516','astatus': 'started','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let errorsMsg = '';
                let verifyPropertiesStub = sinon.stub(transport, "_verifyProperties")
                    .returns(errorsMsg);
                transport.load();
                verifyPropertiesStub.should.have.been.calledOnce;
            }));

            test('#open() with error - flow 5', (() => {
                ofscConnector = sinon.createStubInstance(OfscConnector);
                let initData = { method: 'ready', sendInitData: true};
                ofscConnector.attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
                ofscConnector.sendMessage.withArgs(initData)
                    .returns(new Promise((resolve, reject) => {
                            return resolve({
                                'method': 'error',  'entity': 'activity','data': {
                                    'actions': [{
                                        entity: 'inventory',
                                        action: 'create',
                                        invpool: 'install',
                                        invtype: 'labor',
                                        inv_aid: '4232516'
                                    }],
                                },'activity': {'aid': '4232516','astatus': 'started','wo_asset_id': 'ssssadsd'}
                            });
                        })
                    );
                transport = new OfscPluginApiTransport();
                transport.ofscConnector = ofscConnector;
                let errorsMsg = '';
                let verifyPropertiesStub = sinon.stub(transport, "_verifyProperties")
                    .returns(errorsMsg);
                transport.load();
                verifyPropertiesStub.should.have.been.calledOnce;
                sinon.restore();
            }));

            test('#_fetchCachedActivityListAndProcess with empty activity list', async () => {
                let screen = new OfscPluginApiTransport();

                sinon.stub(PersistentStorage, 'loadData').withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns([]);
                let saveDataStub = sinon.stub(PersistentStorage, 'saveData');
                let getSleepStub = sinon.stub(screen, '_getOfscSleepMessage');

                await screen._fetchCachedActivityListAndProcess();

                expect(getSleepStub.called).to.be.true;

                sinon.restore();
                saveDataStub.restore();
                getSleepStub.restore();
            });

            test('#_fetchCachedActivityListAndProcess with all activities completed', async () => {
                let screen = new OfscPluginApiTransport();
                screen._ofsApiTransport = {};
                screen._fusionApiTransport = {};

                const activityList = [1001, 1002];
                sinon.stub(PersistentStorage, 'loadData').withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(activityList);
                const saveDataStub = sinon.stub(PersistentStorage, 'saveData');
                const getSleepStub = sinon.stub(screen, '_getOfscSleepMessage');

                const actStub = sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById');
                actStub.withArgs(1001).resolves({ id: 1001, status: 'completed' });
                actStub.withArgs(1002).resolves({ id: 1002, status: 'completed' });

                const strategy = { saveDebriefData: sinon.stub().resolves() };
                sinon.stub(DataDebriefHelper, 'getStrategy').returns(strategy);

                await screen._fetchCachedActivityListAndProcess();

                expect(strategy.saveDebriefData.calledTwice).to.be.true;
                expect(saveDataStub.calledWith(Constants.DEBRIEF_ACTIVITY_LIST, [])).to.be.true;
                expect(getSleepStub.calledOnce).to.be.true;

                sinon.restore();
                saveDataStub.restore();
                getSleepStub.restore();
            });

            test('#_fetchCachedActivityListAndProcess with activities not completed', async () => {
                let screen = new OfscPluginApiTransport();
                screen._ofsApiTransport = {};
                screen._fusionApiTransport = {};

                const activityList = [2001];
                sinon.stub(PersistentStorage, 'loadData').withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(activityList);
                const saveDataStub = sinon.stub(PersistentStorage, 'saveData');
                const getSleepStub = sinon.stub(screen, '_getOfscSleepMessage');

                sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById')
                    .withArgs(2001).resolves({ id: 2001, status: 'inProgress' });

                sinon.stub(DataDebriefHelper, 'getStrategy');

                await screen._fetchCachedActivityListAndProcess();

                expect(saveDataStub.calledWith(Constants.DEBRIEF_ACTIVITY_LIST, [2001])).to.be.true;
                expect(getSleepStub.calledOnce).to.be.true;

                sinon.restore();
                saveDataStub.restore();
                getSleepStub.restore();
            });

            test('#_fetchCachedActivityListAndProcess with mix of completed and non-completed', async () => {
                let screen = new OfscPluginApiTransport();
                screen._ofsApiTransport = {};
                screen._fusionApiTransport = {};

                const activityList = [3001, 3002, 3003];
                sinon.stub(PersistentStorage, 'loadData').withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(activityList);
                const saveDataStub = sinon.stub(PersistentStorage, 'saveData');
                const getSleepStub = sinon.stub(screen, '_getOfscSleepMessage');

                const actStub = sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById');
                actStub.withArgs(3001).resolves({ id: 3001, status: 'completed' });
                actStub.withArgs(3002).resolves({ id: 3002, status: 'inProgress' });
                actStub.withArgs(3003).resolves(null);

                const strategy = { saveDebriefData: sinon.stub().resolves() };
                sinon.stub(DataDebriefHelper, 'getStrategy').returns(strategy);

                await screen._fetchCachedActivityListAndProcess();

                expect(strategy.saveDebriefData.calledOnce).to.be.true;
                expect(saveDataStub.calledWith(Constants.DEBRIEF_ACTIVITY_LIST, [3002, 3003])).to.be.true;
                expect(getSleepStub.calledOnce).to.be.true;

                sinon.restore();
                saveDataStub.restore();
                getSleepStub.restore();
            });

            test('#_fetchCachedActivityListAndProcess handles rejected activity fetch', async () => {
                let screen = new OfscPluginApiTransport();
                screen._ofsApiTransport = {};
                screen._fusionApiTransport = {};

                const activityList = [4001, 4002];
                sinon.stub(PersistentStorage, 'loadData').withArgs(Constants.DEBRIEF_ACTIVITY_LIST).returns(activityList);
                const saveDataStub = sinon.stub(PersistentStorage, 'saveData');
                const getSleepStub = sinon.stub(screen, '_getOfscSleepMessage');

                const actStub = sinon.stub(ActivityDataService.prototype, 'getActivityDetailsById');
                actStub.withArgs(4001).resolves({ id: 4001, status: 'completed' });
                actStub.withArgs(4002).rejects(new Error('Failed'));

                const strategy = { saveDebriefData: sinon.stub().resolves() };
                sinon.stub(DataDebriefHelper, 'getStrategy').returns(strategy);

                await screen._fetchCachedActivityListAndProcess();

                expect(strategy.saveDebriefData.calledOnce).to.be.true;
                expect(saveDataStub.calledWith(Constants.DEBRIEF_ACTIVITY_LIST, [4002])).to.be.true;
                expect(getSleepStub.calledOnce).to.be.true;

                sinon.restore();
                saveDataStub.restore();
                getSleepStub.restore();
            });

            test('#_getOfscSleepMessage with empty activity list', async () => {

                let screen = new OfscPluginApiTransport();
                const sendMessageStub = sinon.stub().resolves('OK');

                screen.ofscConnector = { sendMessage: sendMessageStub };

                sinon.stub(PersistentStorage, 'loadData')
                    .withArgs(Constants.DEBRIEF_ACTIVITY_LIST)
                    .returns([]);

                await screen._getOfscSleepMessage();

                expect(sendMessageStub.calledOnce).to.be.true;

                const messageSent = sendMessageStub.getCall(0).args[0];
                expect(messageSent.method).to.equal(Constants.ACTION_SLEEP);
                expect(messageSent.wakeupNeeded).to.be.false;
                expect(messageSent.wakeOnEvents.online.wakeupDelay).to.equal(120);
                expect(messageSent.wakeOnEvents.timer.sleepTimeout).to.equal(600);

                sinon.restore();
            });

            test('#_getOfscSleepMessage with non-empty activity list', async () => {
                sinon.restore();

                let screen = new OfscPluginApiTransport();
                const sendMessageStub = sinon.stub().resolves('OK');

                screen.ofscConnector = { sendMessage: sendMessageStub };

                sinon.stub(PersistentStorage, 'loadData')
                    .withArgs(Constants.DEBRIEF_ACTIVITY_LIST)
                    .returns(['ACT123']); // Non-empty list

                await screen._getOfscSleepMessage();

                expect(sendMessageStub.calledOnce).to.be.true;

                const messageSent = sendMessageStub.getCall(0).args[0];
                expect(messageSent.method).to.equal(Constants.ACTION_SLEEP);
                expect(messageSent.wakeupNeeded).to.be.true;

                sinon.restore();
            });

            test('#_getOfscSleepMessage logs error on sendMessage rejection', async () => {
                sinon.restore();

                let screen = new OfscPluginApiTransport();
                const error = new Error('send failed');
                const sendMessageStub = sinon.stub().rejects(error);

                screen.ofscConnector = { sendMessage: sendMessageStub };

                sinon.stub(PersistentStorage, 'loadData')
                    .withArgs(Constants.DEBRIEF_ACTIVITY_LIST)
                    .returns(['ACT456']);

                const consoleErrorStub = sinon.stub(console, 'error');

                await screen._getOfscSleepMessage();

                expect(sendMessageStub.calledOnce).to.be.true;
                sinon.restore();
            });

            test('#_isValidConnectorUrl with ffsInstance branch', () => {
                const transport = new OfscPluginApiTransport();
                transport.ffsInstance = {};
                transport._pluginFaEnvironment = {
                    fsUrl: 'https://fs.test.com',
                    faUrl: 'https://fa.test.com'
                };

                expect(transport._isValidConnectorUrl()).to.be.false;
            });

            test('#_isValidConnectorUrl with non-ffsInstance branch', () => {
                const transport = new OfscPluginApiTransport();
                transport.ffsInstance = null;
                transport._pluginApplicationMessage = {
                    [Constants.KEY_OAUTH_USER_ASSERTION_APP]: {
                        type: 'oauth_user_assertion',
                        resourceUrl: 'https://cptbtkxqy.fusionapps.ocs.oc-test.com'
                    },
                    [Constants.KEY_OFS_API_APP]: {
                        type: 'ofs',
                        resourceUrl: 'https://plugins-0-cptbtkxqy.fs.ocs.oc-test.com'
                    }
                };

                expect(transport._isValidConnectorUrl()).to.be.false;
            });

        });

    });