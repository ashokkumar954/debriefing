define(['knockout', 'viewModels/add-expense', 'ojs/ojarraydataprovider','ojs/ojmodel', 'ojs/ojrouter'], (ko, AddExpenseViewModel, ArrayDataProvider,ojmodel) => {

    suite('AddExpenseViewModel', () => {
        let invSnArray;
        suiteSetup(async () => {
            let serailArray = [{value: '1234'},{value: '2345'},{value: 'ASNK234'}];
            invSnArray=new ArrayDataProvider(serailArray,{keyAttributes:'value'});
        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('AddExpenseViewModel - branch 1 is working', (() => {

            var screen = new AddExpenseViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD'
                                },
                                {
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '', 'label': 'example3'}])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
            }).should.not.throw();
            expect(screen.expenseItemDescription()).equals('');
        }));

        test('AddExpenseViewModel - branch 2 is working', (() => {

            var screen = new AddExpenseViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD',
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '3', 'label': 'example3'}])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
            }).should.not.throw();
            expect(screen.expenseItemDescription()).equals("example3");
        }));

        test('onCloseButtonClick is working', (() => {
            let screen = new AddExpenseViewModel();
            var addExpenseStub = sinon.stub();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance,
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD',
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '3', 'label': 'example3'}]),
                                addExpense: addExpenseStub,
                                invSerialNumArray : invSnArray,
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info);
                screen.submit();
            }).should.not.throw();
        }));

        test('submit is working', (() => {
            let screen = new AddExpenseViewModel();
            var addExpenseStub = sinon.stub();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance,
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD',
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '3', 'label': 'example3'}]),
                                addExpense: addExpenseStub,
                                invSerialNumArray : invSnArray,
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen._validateBillingType = function (){
                    return false;
                }
                screen._validateBillingItem = function (){
                    return false;
                }
                screen._validateCurrency = function (){
                    return false;
                }
                screen.selectMessagesCustomBillingType = ko.observable('');
                screen.selectMessagesCustomBillingItem = ko.observable('');
                screen.selectMessagesCustomCurrency = ko.observable('');
                screen.submit()
            }).should.not.throw();
        }));

        test('dispose is working', (() => {
            let screen = new AddExpenseViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance,
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD',
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '3', 'label': 'example3'}]),
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleActivated(info);
                screen.dispose();
            }).should.not.throw();
            expect(screen._controller.router.go.calledOnce);
        }));

        test('handleBindingsApplied is working', (() => {
            let screen = new AddExpenseViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                expenseCurrencyEnumCollection: new ojmodel.Collection([{
                                    'id': '1',
                                    'text': 'USD',
                                    'id': '2',
                                    'text': 'EUR'
                                }]),
                                expenseActivityEnumCollection: new ojmodel.Collection([{'id': '2', 'label': 'example2'}]),
                                expenseItemEnumCollection: new ojmodel.Collection([{'id': '3', 'label': 'example3'}]),
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            (() => {
                screen.handleBindingsApplied(info);

            }).should.not.throw();
        }));

    });
});