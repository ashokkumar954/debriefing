define(['knockout', 'viewModels/invoice', 'utils/signature', 'ojs/ojvalidation-datetime'], (ko, InvoiceViewModel, Signature) => {
    suite('InvoiceViewModel', () => {

        let screen;
        let screenOne;
        let info;
        let info1;
        let info2;
        let infoMultipleExpenses;
        let todaysDate;
        let element;
        let element1;
        let validation;
        suiteSetup(async () => {
            var proto = Object.getPrototypeOf(localStorage);
            sinon.stub(proto, 'getItem').returns("{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n");
            element = document.createElement("canvas");
            element1 = document.createElement("button_clear_canvas");

            let element2 = document.createElement("oj-dialog");

            element2.setAttribute("id", "alertDialog");
            validation = document.createElement("oj-validation-group");
            validation.setAttribute("id", "tracker");
            validation.setAttribute("valid", "valid");
            sinon.stub(document, 'getElementById')
                .withArgs('canvas_invoice')
                .returns(element)
                .withArgs('button_clear_canvas')
                .returns(element1).withArgs('printableSignatureCanvas')
                .returns(element).withArgs('alertDialog')
                .returns(element2).withArgs('tracker')
                .returns(validation);
            let d = new Date();
            let curr_date = d.getDate();
            let curr_month = d.getMonth();
            let curr_year = d.getFullYear();
            let m_names = ["Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec"];
            todaysDate = curr_date + " " + m_names[curr_month] + " " + curr_year;
        });

        suiteTeardown(async () => {
            sinon.restore();
            sinon.reset();
        });

        setup(() => {
            screen = new InvoiceViewModel();
            screenOne = new InvoiceViewModel();
            info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    name: "TestName" || '',
                                    address: "TestAddress" || '',
                                    city: "TestCity" || '',
                                    state: "TestState" || '',
                                    zip: "9999" || '',
                                    workorder: "1234" || '',
                                    company: "ORACLE" || ''
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }
                            }
                        }
                    };
                }
            };
            info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T02:30:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    name: "TestName" || '',
                                    address: "TestAddress" || '',
                                    city: "TestCity" || '',
                                    state: "TestState" || '',
                                    zip: "9999" || '',
                                    workorder: "1234" || '',
                                    company: "ORACLE" || ''
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }
                            }
                        }
                    };
                }
            };
            info2 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T00:01:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    name: "TestName" || '',
                                    address: "TestAddress" || '',
                                    city: "TestCity" || '',
                                    state: "TestState" || '',
                                    zip: "9999" || '',
                                    workorder: "1234" || '',
                                    company: "ORACLE" || ''
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }
                            }
                        }
                    };
                }
            };
            infoMultipleExpenses = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '428.57',
                                    'currencyKey': 'USD'
                                },
                                    {
                                        'id': '2',
                                        'activityId': 'Expense',
                                        'itemId': 'FS Toll',
                                        'amount': '1500',
                                        'currencyKey': 'USD'
                                    },
                                    {
                                        'id': '3',
                                        'activityId': 'Expense',
                                        'itemId': 'FS Toll',
                                        'amount': '258',
                                        'currencyKey': 'USD'
                                    },
                                ]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    name: "TestName" || '',
                                    address: "TestAddress" || '',
                                    city: "TestCity" || '',
                                    state: "TestState" || '',
                                    zip: "9999" || '',
                                    workorder: "1234" || '',
                                    company: "ORACLE" || ''
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            screen._controller.logoUrl = "test1@test.com"

            screenOne._controller = infoMultipleExpenses.valueAccessor().params.app;
            screenOne._controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            screenOne.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            screenOne._controller.logoUrl = "test1@test.com"

        });

        teardown(() => {

        });

        test('label getter returns initial value', (() => {
            const invoiceViewModel = new InvoiceViewModel();
        }));
        test('Calling HandleActivated', (() => {

            expect(screen.handleActivated(info)).equal(undefined);
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            expect(screen.laborsTotalHours()).equal("1 Hour");
            expect(screen.totalExpensesAmount()).equal("70");
            expect(screen.stateCityText()).equal("TestState, TestCity");
            expect(screen.workOrderText()).equal("WO1234");
            expect(screen.currentDate()).equal(todaysDate);
            expect(screen.isEmptyLogo()).equal(true);
            screen.customer = new oj.Model({
                state: "TestState" || ''
            })
            expect(screen.stateCityText()).equal("TestState, TestCity");

            expect(screen.handleActivated(info1)).equal(undefined);
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            expect(screen.laborsTotalHours()).equal("2 Hours 30 Minutes");
            expect(screen.totalExpensesAmount()).equal("70");
            expect(screen.stateCityText()).equal("TestState, TestCity");
            expect(screen.workOrderText()).equal("WO1234");
            expect(screen.currentDate()).equal(todaysDate);
            expect(screen.isEmptyLogo()).equal(true);
            screen.customer = new oj.Model({
                state: "TestState" || ''
            })
            expect(screen.stateCityText()).equal("TestState, TestCity");
        }));

        test('Calling HandleActivated with multiple expenses', (() => {

            expect(screenOne.handleActivated(infoMultipleExpenses)).equal(undefined);
            screenOne.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            expect(screenOne.laborsTotalHours()).equal("1 Hour");
            expect(screenOne.totalExpensesAmount()).equal("2186.57");
            expect(screenOne.stateCityText()).equal("TestState, TestCity");
            expect(screenOne.workOrderText()).equal("WO1234");
            expect(screenOne.currentDate()).equal(todaysDate);
            expect(screenOne.isEmptyLogo()).equal(true);
            screenOne.customer = new oj.Model({
                state: "TestState" || ''
            })
            expect(screenOne.stateCityText()).equal("TestState, TestCity");

            expect(screen.handleActivated(info2)).equal(undefined);
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            expect(screen.laborsTotalHours()).equal("1 Minute");
            expect(screen.totalExpensesAmount()).equal("70");
            expect(screen.stateCityText()).equal("TestState, TestCity");
            expect(screen.workOrderText()).equal("WO1234");
            expect(screen.currentDate()).equal(todaysDate);
            expect(screen.isEmptyLogo()).equal(true);
            screen.customer = new oj.Model({
                state: "TestState" || ''
            })
            expect(screen.stateCityText()).equal("TestState, TestCity");
        }));

        test('Calling - laborsTotalHours', (() => {
            let info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray(null),
                                expenseItems: ko.observableArray(null),
                                usedPartsCollection: new oj.Collection(),
                                returnedPartsCollection: new oj.Collection(),
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    name: "TestName" || '',
                                    address: "TestAddress" || '',
                                    city: "TestCity" || '',
                                    state: "TestState" || '',
                                    zip: "9999" || '',
                                    workorder: "1234" || '',
                                    company: "ORACLE" || ''
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }
                            }
                        }
                    };
                }
            };
            expect(screen.handleActivated(info1)).equal(undefined);
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            expect(screen.laborsTotalHours()).equal(0);
            expect(screen.totalExpensesAmount()).equal("0");
        }));

        test('Calling handleActivated with part_item_number blank', (() => {

            let info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': '',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': '',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '5',
                                    'quantity': 1,
                                    'part_item_number': '',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '6',
                                    'quantity': 1,
                                    'part_item_number': '',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }]),
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    city: "TestCity" || '', state: null
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }

                            }
                        }
                    };
                }
            };
            let screen1 = new InvoiceViewModel();
            screen1._controller = info1.valueAccessor().params.app;
            expect(screen1.handleActivated(info1)).equal(undefined);
        }));

        test('Calling stateCityText pureComputed EmptyState', (() => {

            let info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({
                                    city: "TestCity" || '', state: null
                                }),
                                logoUrl() {
                                    return "test@test.com";
                                }

                            }
                        }
                    };
                }
            };
            let screen1 = new InvoiceViewModel();
            screen1._controller = info1.valueAccessor().params.app;
            expect(screen1.handleActivated(info1)).equal(undefined);
            expect(screen1.stateCityText()).equal("TestCity");
        }));

        test('Executing with state and city are empty', (() => {

            let info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({state: 'TestState' , city: '' ,workorder: null}),
                                logoUrl() {
                                    return "test@test.com";
                                }

                            }
                        }
                    };
                }
            };
            let screen1 = new InvoiceViewModel();
            screen1._controller = info1.valueAccessor().params.app;
            screen1.handleActivated(info1)
            expect(screen1.stateCityText()).equal("TestState");
            expect(screen1.workOrderText()).equal("");
        }));

        test('Executing with state and city are empty', (() => {

            let info1 = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),

                                usedPartsCollection: new oj.Collection([{
                                    'id': '1',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'M'
                                }, {
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM10015',
                                    'part_uom_code': 'ea',
                                    'part_disposition_code': 'N'
                                }]),
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
                                _attributeDescription: JSON.parse(localStorage.getItem("abc")),
                                customer: new oj.Model({state: '' , city: '' ,workorder: null}),
                                logoUrl() {
                                    return "test@test.com";
                                }

                            }
                        }
                    };
                }
            };
            let screen1 = new InvoiceViewModel();
            screen1._controller = info1.valueAccessor().params.app;
            screen1.handleActivated(info1)
            expect(screen1.stateCityText()).equal("");
            expect(screen1.workOrderText()).equal("");
        }));

        test('Calling HandleAttached', (() => {
            expect(screen.handleAttached()).equal(undefined);

        }));

        test('Calling handleBindingsApplied', (() => {
            screen.handleBindingsApplied(info);
        }));

        test('Calling handleDetached', (() => {
            screen.handleDetached(info);

        }));

        test('Calling formatTime', (() => {
            screen.timeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            screen.formatTime("2013-11-16");


        }));

        test('Calling formatDuration', (() => {
            var screen = new InvoiceViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: {"name": "value"},
                                dateTimeConverter: {"name": "value"},
                                timeConverter: new oj.IntlDateTimeConverter({pattern: 'hh:mm a'}),
                                activityModel: {"name": "value"},
                                logoUrl: {"name": "value"},
                                laborsTotalHours: {"name": "value"},
                                usedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }])
                            }
                        }
                    };
                }
            };

            screen._controller = info.valueAccessor().params.app;
            screen._invoiceUtils = {
                _calculateDuration: () => {}
            };
            var stub = sinon.stub(screen._invoiceUtils, '_calculateDuration');
            stub.withArgs(screen.dateTimeConverter, "2013-11-16", "2013-11-17").returns("3 Hours 45 Minutes");
            screen.dateTimeConverter = new oj.IntlDateTimeConverter({pattern: 'hh:mm a'});
            const result1 = screen.formatDuration({
                duration: 1,
                startTime: "2013-11-16",
                endTime: "2013-11-17"
            });

            const result2 = screen.formatDuration({
                duration: 2,
                startTime: "2013-11-16",
                endTime: "2013-11-17"
            });

            // Assert: Verify the expected results
            expect(stub.calledTwice).to.be.true;
        }));

        test('Calling copySignatureCanvasToPrintableElementAsImage', (() => {
            screen._activityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }));
            screen.dateTimeFormat = "m/d/y H:i";
            screen.fileName = "abc.txt";
            screen.setActivityModelSignature("abc");
            screen.setActivityModelInvoice("abc")

            screen.copySignatureCanvasToPrintableElementAsImage();

        }));


        test('Calling onSubmitButtonClick', (() => {
            var screen = new InvoiceViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),
                                dateTimeConverter: {"name": "value"},
                                timeConverter: new oj.IntlDateTimeConverter({pattern: 'hh:mm a'}),
                                activityModel: {"name": "value"},
                                logoUrl: {"name": "value"},
                                laborsTotalHours: {"name": "value"},
                                usedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                copySignatureCanvasToPrintableElementAsImage() {

                                },
                                insertPageBreaks(arg) {

                                },
                                generatePDF() {

                                },
                                submitPluginData(){
                                    return;
                                }
                            }
                        }
                    };
                }
            };
            screen.dateTimeFormat = "m/d/y H:i";
            screen._activityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }));
            screen.invoiceSignature = new Signature(element,element1,false);
            screen._controller = info.valueAccessor().params.app;
            screen.saveForm("sdj");

        }));

        test('Calling saveForm when _ffsInstance is falsy and invoiceSignature is not empty', (() => {

            var screen = new InvoiceViewModel();
            var SignatureMock = function (element, element1, flag) {
                this.isEmpty = function () {
                    return false;
                };
                this.getDataString = function () {
                    return 'some-data-string';
                };
            };
            var element = document.createElement('div');
            var element1 = document.createElement('div');
            screen.invoiceSignature = new SignatureMock(element, element1, false);

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),
                                dateTimeConverter: {"name": "value"},
                                timeConverter: new oj.IntlDateTimeConverter({pattern: 'hh:mm a'}),
                                activityModel: {"name": "value"},
                                logoUrl: {"name": "value"},
                                laborsTotalHours: {"name": "value"},
                                usedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                copySignatureCanvasToPrintableElementAsImage() {

                                },
                                insertPageBreaks(arg) {

                                },
                                generatePDF() {

                                },
                                submitPluginData() {
                                    return;
                                }
                            }
                        }
                    };
                }
            };
            screen.dateTimeFormat = "m/d/y H:i";
            screen._activityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }));
            screen._controller = info.valueAccessor().params.app;
            screen.saveForm("sdj");
        }));

        test('Calling saveForm when _ffsInstance is truthy', (() => {
            var screen = new InvoiceViewModel();
            var SignatureMock = function (element, element1, flag) {
                this.isEmpty = function () {
                    return false;
                };
                this.getDataString = function () {
                    return 'some-data-string';
                };
            };
            var element = document.createElement('div');
            var element1 = document.createElement('div');
            screen.invoiceSignature = new SignatureMock(element, element1, false);

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),
                                dateTimeConverter: {"name": "value"},
                                timeConverter: new oj.IntlDateTimeConverter({pattern: 'hh:mm a'}),
                                activityModel: {"name": "value"},
                                logoUrl: {"name": "value"},
                                laborsTotalHours: {"name": "value"},
                                usedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                copySignatureCanvasToPrintableElementAsImage() {

                                },
                                insertPageBreaks(arg) {

                                },
                                generatePDF() {

                                },
                                submitPluginData() {
                                    return;
                                }
                            }
                        }
                    };
                }
            };
            screen.dateTimeFormat = "m/d/y H:i";
            screen._activityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }));

            screen._controller = info.valueAccessor().params.app;
            screen._ffsInstance = true;
            screen.saveForm("sdj");
        }));

        test('Calling saveForm when invoiceSignature is empty', (() => {
            var screen = new InvoiceViewModel();
            var SignatureMock = function (element, element1, flag) {
                this.isEmpty = function () {
                    return false;
                };
                this.getDataString = function () {
                    return 'some-data-string';
                };
            };
            var element = document.createElement('div');
            var element1 = document.createElement('div');
            screen.invoiceSignature = new SignatureMock(element, element1, false);

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'com',
                                    'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00',
                                    'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1',
                                    'activityId': 'Expense',
                                    'itemId': 'FS Toll',
                                    'amount': '70',
                                    'currencyKey': 'USD'
                                }]),
                                dateTimeConverter: {"name": "value"},
                                timeConverter: new oj.IntlDateTimeConverter({pattern: 'hh:mm a'}),
                                activityModel: {"name": "value"},
                                logoUrl: {"name": "value"},
                                laborsTotalHours: {"name": "value"},
                                usedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '2',
                                    'quantity': 10,
                                    'part_item_number': 'ECM1001'
                                }]),
                                copySignatureCanvasToPrintableElementAsImage() {

                                },
                                insertPageBreaks(arg) {

                                },
                                generatePDF() {

                                },
                                submitPluginData() {
                                    return;
                                }
                            }
                        }
                    };
                }
            };
            screen.dateTimeFormat = "m/d/y H:i";
            screen._activityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }));

            screen._controller = info.valueAccessor().params.app;
            screen.saveForm("sdj");
        }));

        test('Calling insertPageBreaks', (() => {
            var h1 = document.createElement("ul");
            h1.textContent = "Title";
            var li = document.createElement("li");
            h1.appendChild(li)
            screen.insertPageBreaks(h1,0,1);

        }));

    });
});