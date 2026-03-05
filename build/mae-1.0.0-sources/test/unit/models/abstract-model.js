define(['knockout', 'models/abstract-model'], (ko, AbstractModel) => {
        suite('AbstractModel', () => {

            suiteSetup(async () => {

            });

            suiteTeardown(async () => {

            });

            setup(() => {

            });

            teardown(() => {

            });

            test('Constructor is working', (() => {
                new AbstractModel({}).should.be.instanceOf(AbstractModel);
            }));

            test('getId returns inital value', (() => {
                let abstractModel = new AbstractModel();
                abstractModel.constructor.KEY_PROPERTY = 'id';
                //abstractModel.getId().calledOnce;
            }));

            test('_getArgumentAsObservable is observable', (() => {

            }));

            test('generateUniqueId is observable', (() => {

            }));

            test('definePropertyAsArray is observable', (() => {

            }));

            test('definePropertyAsObject is observable', (() => {

            }));

            test('isPropertyArray is observable', (() => {
                AbstractModel.isPropertyArray(ko.observable([]));
            }));

            test('isPropertyObject is observable', (() => {
                AbstractModel.isPropertyObject(ko.observable([]));
            }));

            test('KEY_PROPERTY is observable', (() => {
                AbstractModel.KEY_PROPERTY.should.equal('id');
            }));

           
        });

    });