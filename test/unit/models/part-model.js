define(['knockout', 'models/part-model'], (ko, PartModel) => {

    suite('PartModel', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            new PartModel({}).should.be.instanceOf(PartModel);
        }));

        test('catalogId getter returns initial value', (() => {
            const testCatalogId = 'testCatalogId';
            new PartModel({ catalogId: testCatalogId }).catalogId.should.equal(testCatalogId);
        }));

        test('catalogId is observable', (() => {
            const testObservableCatalogId = ko.observable('testObservableCatalogId');
            const testChangedCatalogId = 'testChangedCatalogId';

            testObservableCatalogId(testChangedCatalogId);

            new PartModel({ label: testObservableCatalogId }).label.should.equal(testChangedCatalogId);
        }));

        test('itemId getter returns initial value', (() => {
            const testItemId = 'testItemId';

            new PartModel({ itemId: testItemId }).itemId.should.equal(testItemId);
        }));

        test('testItemId is observable', (() => {
            const testObservableItemId = ko.observable('testObservableItemId');
            const testChangedItemId = 'testChangedItemId';

            testObservableItemId(testChangedItemId);

            new PartModel({ label: testObservableItemId }).label.should.equal(testChangedItemId);
        }));

        test('label setter returns initial value', (() => {
            const testLabel = 'testLabel';
            const partModel = new PartModel({  label: testLabel });
            partModel.label = testLabel;
            partModel.label.should.equal('testLabel');

        }));

        test('label getter returns initial value', (() => {
            const testLabel = 'testLabel';

            new PartModel({ label: testLabel }).label.should.equal(testLabel);
        }));

        test('label is observable', (() => {
            const testObservableLabel = ko.observable('testObservableLabel');
            const testChangedLabel = 'testChangedLabel';

            testObservableLabel(testChangedLabel);

            new PartModel({ label: testObservableLabel }).label.should.equal(testChangedLabel);
        }));

        test('itemType setter returns initial value', (() => {
            const testItemType = 'testItemType';
            const partModel = new PartModel({  itemType: testItemType });
            partModel.itemType = testItemType;
            partModel.itemType.should.equal('testItemType');

        }));

        test('itemType getter returns initial value', (() => {
            const testItemType = 'testItemType';

            new PartModel({ itemType: testItemType }).itemType.should.equal(testItemType);
        }));

        test('inventoryType setter returns initial value', (() => {
            const testInventoryType = 'testInventoryType';
            const partModel = new PartModel({  inventoryType: testInventoryType });
            partModel.inventoryType = testInventoryType;
            partModel.inventoryType.should.equal('testInventoryType');

        }));

        test('inventoryType getter returns initial value', (() => {
            const testInventoryType = 'testInventoryType';

            new PartModel({ inventoryType: testInventoryType }).inventoryType.should.equal(testInventoryType);
        }));

        test('fields setter returns initial value', (() => {
            const testFields = 'testFields';
            const partModel = new PartModel({  fields: testFields });
            partModel.fields = testFields;
            partModel.fields.should.equal('testFields');

        }));

        test('fields getter returns initial value', (() => {
            const testFields = 'testFields';

            new PartModel({ fields: testFields }).fields.should.equal(testFields);
        }));

        test('linkedItems setter returns initial value', (() => {
            const testLinkedItems = 'testLinkedItems';
            const partModel = new PartModel({  fields: testLinkedItems });
            partModel.linkedItems = testLinkedItems;
            partModel.linkedItems.should.equal('testLinkedItems');

        }));

        test('linkedItems getter returns initial value', (() => {
            const testLinkedItems = 'testLinkedItems';

            new PartModel({ linkedItems: testLinkedItems }).linkedItems.should.equal(testLinkedItems);
        }));

        test('images setter returns initial value', (() => {
            const testImages = 'testImages';
            const partModel = new PartModel({  fields: testImages });
            partModel.images = testImages;
            partModel.images.should.equal('testImages');

        }));

        test('images getter returns initial value', (() => {
            const testImages = 'testImages';

            new PartModel({ images: testImages }).images.should.equal(testImages);
        }));

        test('KEY_PROPERTY returns initial value', (() => {
            const testKeyproperty = 'itemId';
            PartModel.KEY_PROPERTY.should.equal(testKeyproperty);
        }));
    });

});