define(['knockout', 'viewModels/add-labor', 'appController'], (ko, AddLaborViewModel, ControllerViewModel) => {

    suite('AddLaborViewModel', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('AddLaborViewModel - handleActivated - branch1 is working', (() => {

            var screen = new AddLaborViewModel();
            let dateTimeConverterStub = sinon.stub();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'text': 'Diagnose and Repair'
                                },
                            {
                                'id': '3',
                                'text': 'Labor'
                            }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'text': 'FS Overtime Labor',

                                },
                            {
                                'id': '2',
                                'label': 'FS Reg Labor',
                                'text': 'FS Reg Labor'
                            },
                        {
                            'id': '3',
                            'label': 'FS Travel Labor',
                            'text': 'FS Travel Labor'
                        }]),
                                defaultLaborItem: "FS Reg Labor",
                                defaultTravelItem: "FS Travel Time",
                                activityDetails: new oj.Model({
                                    startTime: '12:35 AM',
                                    endTime: "1:00 AM",
                                    resourceCurrentTime: "8:00 PM",
                                    duration: "3",
                                    travelTime: "12"
                                }),
                                isStartTimeValid: true,
                                isEndTimeValid: true,
                                dateTimeConverter: oj.Validation.converterFactory('datetime').createConverter(),
                                addLabor: function (){},
                                router: oj.Router.rootInstance,
                                onStartTimeValidChanged: function (){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
                screen.startTime.subscribe('07:00');
                screen.durationHours();
                screen.addLabor();
            }).should.not.throw();
            expect(screen.laborItemDescription()).equals("FS Overtime Labor");
            expect(screen.isSubmitDisabled()).equals(false);
        }));


        test('AddLaborViewModel - handleActivated - branch2 is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }]),
                                activityDetails: new oj.Model({
                                    startTime: '12:00 AM',
                                    endTime: "12:01 AM",
                                    resourceCurrentTime: "8:00 PM",
                                    duration: "3",
                                    travelTime: "12"
                                }),
                                isStartTimeValid: true,
                                isEndTimeValid: true,
                                dateTimeConverter: oj.Validation.converterFactory('datetime').createConverter(),
                                addLabor: function (){},
                                router: oj.Router.rootInstance,
                                onStartTimeValidChanged: function (){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
                screen.startTime.subscribe('07:00');
                screen.durationHours();
                screen.addLabor();
            }).should.not.throw();
            expect(screen.laborItemDescription()).equals('FS Travel Labor');
        }));

        test('AddLaborViewModel - handleDetached is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'text': 'Commute',
                                    'id': '2',
                                    'text': 'Diagnose and Repair',
                                    'id': '3',
                                    'text': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'text': 'FS Overtime Labor',
                                    'id': '2',
                                    'text': 'FS Reg Labor',
                                    'id': '3',
                                    'text': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.durationHours()
                screen.handleDetached(info);
            }).should.not.throw();
        }));

        test('AddLaborViewModel - handleBindingsApplied is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
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

        test('AddLaborViewModel - addLabor is working', (() => {
            var screen = new AddLaborViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }]),
                                startTime: '07:00',
                                endTime: '07:15',
                                checkValidationGroup(){
                                    return false;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._validateBillingType = function (){
                return false;
            }
            screen._validateBillingItem = function (){
                return false;
            }
            screen.addLabor(info);
        }));

        test('AddLaborViewModel - onCloseButtonClick is working', (() => {
            var screen = new AddLaborViewModel();
            var addLaborStub = sinon.spy();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }]),
                                activityDetails: new oj.Model({
                                    startTime: '12:35 AM',
                                    endTime: "1:00 AM",
                                    resourceCurrentTime: "8:00 PM",
                                    duration: "3",
                                    travelTime: "12"
                                }),
                                dateTimeConverter: oj.Validation.converterFactory('datetime').createConverter()
                            }
                        }
                    };
                }
            };
            screen.handleActivated(info);
            addLaborStub.should.have.been.calledOnce;
        }));

        test('AddLaborViewModel - durationHours - branch1 is working', () => {
            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen.durationHours();
            }).should.not.throw();
        });

        test('AddLaborViewModel - durationHours - branch2 is working', () => {
            var screen = new AddLaborViewModel();
            let dateTimeConverterStub = sinon.stub();
            (() => {
                screen.startTime = ko.observable(' ');
                screen.endTime = ko.observable('07:00');
                screen.dateTimeConverter = dateTimeConverterStub;
                screen.dateTimeConverter.parse = function (){};
                screen.dateTimeConverter.compareISODates = function (){};
                screen.durationHours();
            }).should.not.throw();
            dateTimeConverterStub.should.have.been.calledOnce;
        });

        test('AddLaborViewModel - startTime is empty', () => {
            var screen = new AddLaborViewModel();
            var startTime = " ";
            screen.durationValidator.validate(startTime);
            assert.should.throw()
        });

        test('AddLaborViewModel - durationHours is valid', () => {
            var screen = new AddLaborViewModel();
            var startTime = "07:00";

            (() => {
                screen.durationValidator.validate(startTime);
            }).should.not.throw();
        });

        test('AddLaborViewModel - durationHours is invalid', () => {
            var screen = new AddLaborViewModel();
            var startTime = '';

            (() => {
                screen.durationValidator.validate(startTime);
            }).should.throw(oj.ValidatorError);
        });

        test('onCloseButtonClick is working', (() => {
            let screen = new AddLaborViewModel();
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
            screen.onCloseButtonClick();
        }));

        test('_autoPopulateLaborTime when DEFAULT_LABOR_ACTIVITY is selected', (() => {
            let screen = new AddLaborViewModel();
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
            screen.DEFAULT_LABOR_ACTIVITY = 'Labor Time';
            screen.DEFAULT_TRAVEL_ACTIVITY = 'Travel Time';
            const event = {
                detail: {
                    value: { value: 'Labor Time' },
                },
            };
            screen._controller.activityDetails = {
                data: {
                    startTime: "12:00 AM",
                    endTime: "01:49 AM",
                    resourceCurrentTime: "03:00 PM",
                    duration: 45
                },
                get: function (key) {
                    return this.data[key];
                }
            };
            screen._populateDefaultDate(event);
            expect(screen.startTime()).to.equal("T24:00:00");
            expect(screen.endTime()).to.equal("T01:49:00");
        }));


        test('_autoPopulateLaborTime when DEFAULT_TRAVEL_ACTIVITY is selected and travelTime is empty', (() => {
            let screen = new AddLaborViewModel();
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
            screen.DEFAULT_LABOR_ACTIVITY = 'Labor Time';
            screen.DEFAULT_TRAVEL_ACTIVITY = 'Travel Time';
            const event = {
                detail: {
                    value: { value: 'Travel Time' },
                },
            };
            screen._controller.activityDetails = {
                data: {
                    startTime: "12:00 AM",
                    resourceCurrentTime: "03:00 PM",
                    duration: 45
                },
                get: function (key) {
                    return this.data[key];
                }
            };
            screen._populateDefaultDate(event);
            expect(screen.startTime()).to.equal("");
        }));

        test('_autoPopulateLaborTime when neither DEFAULT_LABOR_ACTIVITY nor DEFAULT_TRAVEL_ACTIVITY is selected', (() => {
            let screen = new AddLaborViewModel();
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
            screen.DEFAULT_LABOR_ACTIVITY = 'Labor Time';
            screen.DEFAULT_TRAVEL_ACTIVITY = 'Travel Time';
            const event = {
                detail: {
                    value: { value: 'FS Reg Labor' },
                }
            };
            screen.startTime = sinon.stub();
            screen.endTime = sinon.stub();
            screen._populateDefaultDate(event);
            expect(screen.startTime()).to.be.undefined;
            expect(screen.endTime()).to.be.undefined;
        }));

    });

    test('_autoPopulateLaborTime when DEFAULT_TRAVEL_ACTIVITY is selected and it is an overnight scenario', (() => {
        let screen = new AddLaborViewModel();
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
        screen.DEFAULT_LABOR_ACTIVITY = 'Labor Time';
        screen.DEFAULT_TRAVEL_ACTIVITY = 'Travel Time';
        const event = {
            detail: {
                value: { value: 'Travel Time' }
            },
        };
        screen._controller.activityDetails = {
            data: {
                startTime: "12:00 AM",
                endTime: "03:00 PM",
                resourceCurrentTime: "11:00 PM",
                duration: 1560
            },
            get: function (key) {
                return this.data[key];
            }
        };
        screen._populateDefaultDate(event);
        expect(screen.startTime()).to.equal("");
        const event1 = {
            detail: {
                value: { value: 'Labor Time' }
            },
        };
        screen._populateDefaultDate(event1);
        expect(screen.startTime()).to.equal("T24:00:00");

    }));

});