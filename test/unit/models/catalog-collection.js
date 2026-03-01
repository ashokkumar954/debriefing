define(['knockout', 'models/catalog-collection', 'models/catalog-model', 'models/abstract-collection'],
    (ko, CatalogCollection, CatalogModel, AbstractCollection) => {
    suite('CatalogCollection', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            new CatalogCollection({}).should.be.instanceOf(CatalogCollection);
        }));

        test('getByIdOrCreate is observable', (() => {
            let abstractCollection = new AbstractCollection();
            abstractCollection._dictionary = {};
            abstractCollection.items = ko.observableArray([]);

            new CatalogCollection({}).getByIdOrCreate(1).calledOnce;
        }));


    });

});