define(['knockout', 'models/abstract-collection', 'models/abstract-model'], (ko, AbstractCollection, AbstractModel) => {
    suite('AbstractCollection', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            new AbstractCollection({}).should.be.instanceOf(AbstractCollection);
        }));


        test('getByIdOrCreate returns inital value', (() => {
            let abstractcollection = new AbstractCollection();
            abstractcollection.constructor.createEmptyModel = function(){};
            abstractcollection._dictionary = {'579': {'id':'1234'}};
            abstractcollection.items = ko.observableArray([]);
            abstractcollection.getByIdOrCreate('1');
            abstractcollection._dictionary = {'579': {'id':'1234'}};
            abstractcollection.getByIdOrCreate('579').calledOnce;
        }));

        test('add returns inital value', (() => {
            let abstractcollection = new AbstractCollection();
            abstractcollection._dictionary = [];
            abstractcollection.items = ko.observableArray([]);
            abstractcollection.add(new AbstractModel());
            AbstractCollection.createEmptyModel();
        }));

        test('createEmptyModel returns inital value', (() => {

            (() => {
                AbstractCollection.createEmptyModel();
            }).should.not.throw();
        }));

    });



})