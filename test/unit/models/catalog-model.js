define(['knockout', 'models/catalog-model'], (ko, CatalogModel) => {
    suite('CatalogModel', () => {
        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });
        test('Constructor is working', (() => {
            new CatalogModel({}).should.be.instanceOf(CatalogModel);
        }));

        test('KEY_PROPERTY returns initial value', (() => {
            const testKeyproperty = 'catalogId';
            CatalogModel.KEY_PROPERTY.should.equal(testKeyproperty);
        }));

        test('label is observable', (() => {
            const testObservableLabel = ko.observable('testObservableLabel');
            const testChangedLabel = 'testChangedLabel';

            testObservableLabel(testChangedLabel);

            new CatalogModel({ label: testObservableLabel }).label.should.equal(testChangedLabel);
        }));
        test('label setter returns initial value', (() => {
            const testLabel = 'testLabel';
            const catalogModel = new CatalogModel({  label: testLabel });
            catalogModel.label = testLabel;
            catalogModel.label.should.equal('testLabel');

        }));

        test('catalogId getter returns initial value', (() => {
            const testCatalogId = 'testCatalogId';
            new CatalogModel({ catalogId: testCatalogId }).catalogId.should.equal(testCatalogId);
        }));

        test('name setter returns initial value', (() => {
            const testName = 'testName';
            const catalogModel = new CatalogModel({  label: testName });
            catalogModel.name = testName;
            catalogModel.name.should.equal('testName');

        }));

        test('name getter returns initial value', (() => {
            const testName = 'testName';
            new CatalogModel({ name: testName }).name.should.equal(testName);
        }));

        test('fieldSchemas setter returns initial value', (() => {
            const testFieldSchema = 'testFieldSchema';
            const catalogModel = new CatalogModel({  fieldSchemas: testFieldSchema });
            catalogModel.fieldSchemas = testFieldSchema;
            catalogModel.fieldSchemas.should.equal('testFieldSchema');

        }));

        test('previewFieldSchemas getter returns initial value', (() => {
            const catalogModel = new CatalogModel({});
            catalogModel._fieldSchemas = ko.observable([]);
            catalogModel._fieldSchemas([1]);
            catalogModel.previewFieldSchemas.calledOnce;
        }));

        test('nonPreviewFieldSchemas getter returns initial value', (() => {
            const catalogModel = new CatalogModel({});
            catalogModel._fieldSchemas = ko.observable([]);
            catalogModel._fieldSchemas([1]);
            catalogModel.nonPreviewFieldSchemas.calledOnce;
        }));

        test('searchableFields getter returns initial value', (() => {
            const catalogModel = new CatalogModel({});
            catalogModel._fieldSchemas = ko.observable([]);
            catalogModel._fieldSchemas([{label: 'part_item_number', name: 'Part #', propertyLabel: 'part_item_number', searchable: true, preview: true},
                {label: 'part_item_cost', name: 'Cost', propertyLabel: 'part_item_cost', searchable: false, preview: false}]);
            catalogModel.searchableFields.calledOnce;
        }));

        test('typeSchemas getter returns initial value', (() => {
            const testTypeSchemas = 'testTypeSchemas';
            new CatalogModel({ typeSchemas: testTypeSchemas }).typeSchemas.should.equal(testTypeSchemas);
        }));

        test('typeSchemas setter returns initial value', (() => {
            const testTypeSchemas = 'testTypeSchemas';
            const catalogModel = new CatalogModel({  typeSchemas: testTypeSchemas });
            catalogModel.typeSchemas = testTypeSchemas;
            catalogModel.typeSchemas.should.equal('testTypeSchemas');

        }));


    });

});