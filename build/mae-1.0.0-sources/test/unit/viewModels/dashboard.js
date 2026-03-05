define(['knockout', 'viewModels/dashboard', 'ojs/ojrouter', 'ojs/ojvalidation-datetime'], (ko, DashboardViewModel) => {
    suite('DashboardViewModel', () => {
        suiteSetup(async () => { });

        suiteTeardown(async () => { });

        setup(() => { });

        teardown(() => { });

        test('DashboardViewModel is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1', 'activityId': 'com', 'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00', 'endTime': 'T01:00:00'
                                },
                                {
                                    'id': '2', 'activityId': 'com', 'itemId': 'Overtime Labor',
                                    'startTime': 'T00:00:00', 'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll',
                                    'amount': '70', 'currencyKey': 'USD'
                                },
                                {
                                    'id': '2', 'activityId': 'Expense', 'itemId': 'Parking',
                                    'amount': '70', 'currencyKey': 'USD'
                                }]),
                                usedPartsCollection: new oj.Collection([{
                                    'id': '3', 'idAttribute': 'part_item_number',
                                    'attributes': { 'invid': '21475983', 'invsn': 'RI600072', 'invtype': 'part_sn' }
                                }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '3', 'idAttribute': 'part_item_number',
                                    'attributes': { 'invid': '21475983', 'invsn': 'RI600072', 'invtype': 'part_sn' }
                                }]),
                                selectedMenuItem: ko.observable(''),
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
            }).should.not.throw();
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            screen.selectedMenuItem('labor');
            expect(screen._controller.router.go.withArgs('add-labor').calledOnce);

            screen.selectedMenuItem('expenses');
            expect(screen._controller.router.go.withArgs('add-expense').calledOnce);

            screen.selectedMenuItem('addParts');
            expect(screen._controller.router.go.withArgs('add-used-part').calledOnce);

            screen.selectedMenuItem('returnParts');
            expect(screen._controller.router.go.withArgs('add-returned-part').calledOnce);

            screen.selectedMenuItem('Default');
            expect(screen._controller.router.go.withArgs('add-expense').calledOnce);
        }));

        test('getpopupMessage is working', (() => {
            let screen = new DashboardViewModel();
            let popupMessage = "";
            let currentObj = {
                'data': {
                    'id': 'ECM300001', 'serviceActivityUsed': 'Install', 'measuredQuantity': '3',
                    'inventory': new oj.Model({ 'invsn': 'RI600072', 'invtype': 'part_sn' })
                }
            };
            popupMessage = screen.getpopupMessage(currentObj);
            expect(popupMessage).equal('ECM300001 (RI600072)');

            currentObj = {
                'data': {
                    'id': 'ECM300001', 'serviceActivityUsed': 'Install', 'measuredQuantity': '3',
                    'inventory': new oj.Model({ 'invtype': 'part_sn' })
                }
            };
            popupMessage = screen.getpopupMessage(currentObj);
            expect(popupMessage).equal('ECM300001 (3)');
        }));

        test('openDialog - branch 1 is working', (() => {
            let screen = new DashboardViewModel();
            let source = 'labor';
            let currentObj = '';
            const eventMock = { 'currentTarget': { 'id': '12344' } };
            currentObj = {
                'data': {
                    'id': 'ECM300001', 'serviceActivityUsed': 'Install', 'measuredQuantity': '3',
                    'inventory': new oj.Model({ 'attributes': { 'invsn': 'RI600072', 'invtype': 'part_sn' } })
                }
            };
            let alertOverlayElement = document.createElement('oj-dialog');
            alertOverlayElement.id = 'modelDialog';
            screen.dialogElement = alertOverlayElement;
            screen.dialogHeading = ko.observable('');
            screen.currentItemId = ko.observable('');
            let node = document.getElementById("modelDialog");
            let busyContext = oj.Context.getContext(node).getBusyContext();
            busyContext.whenReady().then(function () {
                screen.openDialog(source, eventMock, currentObj);
            });

            busyContext.whenReady().then(function () {
                screen.openDialog('usedParts', eventMock, currentObj);
            });
         })); 

        test('openDialog - branch 2 is working', (() => {
            let screen = new DashboardViewModel();
            let source = 'labor';
            let currentObj = '';
            const eventMock = { 'currentTarget': { 'id': '12344' } };
            currentObj = {
                'data': {
                    'id': 'ECM300001', 'serviceActivityUsed': 'Install', 'item_label': 'New'}
            };
            let alertOverlayElement = document.createElement('oj-dialog');
            alertOverlayElement.id = 'modelDialog';
            screen.dialogElement = alertOverlayElement;
            screen.dialogHeading = ko.observable('');
            screen.currentItemId = ko.observable('');
            let node = document.getElementById("modelDialog");
            let busyContext = oj.Context.getContext(node).getBusyContext();
            busyContext.whenReady().then(function () {
                screen.openDialog(source, eventMock, currentObj);
            });
        }));

        test('openDialog - branch 3 is working', (() => {
            let screen = new DashboardViewModel();
            let node = document.getElementById("modelDialog");
            let busyContext = oj.Context.getContext(node).getBusyContext();
            busyContext.whenReady().then(function () {
                screen.openDialog('not-available');
            });
        }));

        test('deleteSelectedItem is working', (() => {
            let screen = new DashboardViewModel();
            const eventLaborMock = { 'currentTarget': { 'id': '1,labor' } };
            const eventExpenseMock = { 'currentTarget': { 'id': '1,expenses' } };
            const eventUsedPartsMock = { 'currentTarget': { 'id': 'ECM100001,usedParts' } };
            const eventReturnedPartsMock = { 'currentTarget': { 'id': 'ECM300001,returnParts' } };
            const eventUsedPartsWithSerialNoMock = { 'currentTarget': { 'id': 'ECM100001,usedParts,MF60006))' } };
            const eventReturnedPartsWithSerialNoMock = { 'currentTarget': { 'id': 'ECM300001,returnParts,MF50005' } };
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1', 'activityId': 'com', 'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00', 'endTime': 'T01:00:00'
                                }]),
                                expenseItems: ko.observableArray([{
                                    'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll',
                                    'amount': '70', 'currencyKey': 'USD'
                                }]),
                                usedPartsCollection: new oj.Collection([{ 'id': 'ECM300001', 'inventory': { 'part_item_number_rev': 'ECM300001', 'part_service_activity_used': 'Install', 'quantity': '3' }, serviceActivityUsed: 'Install_New', serviceActivityReturned: null, measuredQuantity: '1 ea', 'serviceActivityUsed': 'Install' }]),
                                returnedPartsCollection: new oj.Collection([{
                                    'id': '3', 'idAttribute': 'part_item_number',
                                    'attributes': { 'invid': '21475983', 'invsn': 'RI600072', 'invtype': 'part_sn' }
                                }]),
                                attributeDescription: '',
                                removeLabor(id) {
                                    const index = this.laborItems().findIndex(labor => labor.id === id);
                                    const deletedList = this.laborItems.splice(index, 1);
                                    const listWithRecordId = deletedList.filter(item => !!item.recordId);
                                },
                                removeExpense(id) {
                                    const index = this.expenseItems().findIndex(expense => expense.id === id);
                                    const deletedList = this.expenseItems.splice(index, 1);
                                    const listWithRecordId = deletedList.filter(item => !!item.recordId);
                                }
                            }
                        }
                    };
                }
            };
            console.log("eventLaborMock : : " + eventLaborMock.currentTarget.id);
            screen._controller = info.valueAccessor().params.app;
            screen.dialogHeading = ko.observable('');
            let alertOverlayElement = document.createElement('oj-dialog');
            alertOverlayElement.id = 'modelDialog';
            screen.dialogElement = alertOverlayElement;
            let node = document.getElementById("modelDialog");
            let busyContext = oj.Context.getContext(node).getBusyContext();
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventLaborMock);
            });

            //for Expense
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventExpenseMock);
            });

            //for used parts
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventUsedPartsMock);
            });

            //for returned parts
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventReturnedPartsMock);
            });
            //for used parts with serial No
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventUsedPartsWithSerialNoMock);
            });
            //for returned parts with serial No
            busyContext.whenReady().then(function () {
                screen.deleteSelectedItem(eventReturnedPartsWithSerialNoMock);
            });
        }));

        test('addLabor is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborItems: ko.observableArray([{
                                    'id': '1', 'activityId': 'com', 'itemId': 'FS Overtime Labor',
                                    'startTime': 'T00:00:00', 'endTime': 'T01:00:00'
                                }]),
                                addLabor({ activityId, itemId, startTime, endTime, recordId = null }) {

                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.addLabor({ 'activityId': '1', 'itemId': 'ECM300001', 'startTime': '12:00', 'endTime': '01:00' });
        }));

        test('onSaveButtonClick is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                ofscActivityModel: new (oj.Model.extend({
                                    idAttribute: 'aid'
                                })),
                                submitPluginData() { }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._activityModel = screen._controller.ofscActivityModel;
            screen.onSaveButtonClick();
        }));

        test('onCloseButtonClick is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                terminatePlugin() { }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.onCloseButtonClick();
        }));

        test('onCloseButtonClick is working', (() => {
            let screen = new DashboardViewModel();
            screen.dialogHeading = ko.observable('');
            let alertOverlayElement = document.createElement('oj-dialog');
            alertOverlayElement.id = 'modelDialog';
            screen.dialogElement = alertOverlayElement;
            let node = document.getElementById("modelDialog");
            let busyContext = oj.Context.getContext(node).getBusyContext();
            busyContext.whenReady().then(function () {
                screen.closeDialog();
            });
        }));

        test('gotoAddLabor is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            expect(screen._controller.router.go.withArgs('add-labor').calledOnce);
        }));

        test('gotoAddExpense is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            expect(screen._controller.router.go.withArgs('add-expense').calledOnce);
        }));

        test('gotoAddUsedPart is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            expect(screen._controller.router.go.withArgs('add-used-part').calledOnce);
        }));

        test('gotoAddReturnedPart is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._controller.router.go = sinon.spy();
            expect(screen._controller.router.go.withArgs('add-returned-part').calledOnce);
        }));

        test('onPreviewInvoiceButtonClick is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen.onPreviewInvoiceButtonClick();
            }).should.not.throw();
            screen._controller.router.go = sinon.spy();
            expect(screen._controller.router.go.withArgs('invoice').calledOnce);

        }));

        test('handleBindingsApplied is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen.handleBindingsApplied();
            }).should.not.throw();

        })); 

        test('removeSelectedUsedParts is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller.removeUsedPart = function () {
                    return Promise.resolve();
                }
                screen.removeSelectedUsedParts('ECM3001', null);
            }).should.not.throw();

        })); 

        test('removeSelectedReturnedParts is working', (() => {
            let screen = new DashboardViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen._controller.removeReturnedPart = function () {
                    return Promise.resolve();
                }
                screen.removeSelectedReturnedParts('ECM3001', null);
            }).should.not.throw();

        })); 

    });
});