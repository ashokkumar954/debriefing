define(['knockout',
    'components/part-preview-component/part-preview-component',
    'ojs/ojmodel',
    'models/catalog-model',
    'models/catalog-collection'], (ko,
                                   PartPreviewComponent,
                                   ojmodel,
                                   CatalogModel,
                                   CatalogCollection) => {

    suite('PartPreviewComponent', () => {
        let catalogCollection;
        let model1;
        let model2;
        let model3;
        suiteSetup(async () => {
             model1 = {
                catalogId: 579,
                itemId: 32975,
                label: 'ECM100BELTA',
                itemType: 'part',
                inventoryType: 'part',
                linkedItems: [],

                fields: {
                part_item_number: 'ECM100BELTA',
                    part_item_revision: 'A',
                    part_item_desc: 'Running belt, 60x20, Multi-ply, Pre-lubricated',
                    part_uom_code: 'ea',
                    part_item_cost: '250.00',
            },
                images: [
                'https://bots40oke01dev.example.com/image/directory/cxfs/ECM100BELT.JPG'
            ]

            };
             model2 = {
                catalogId: 124,
                itemId: 32975,
                label: 'ECM1000301',
                itemType: 'part',
                inventoryType: 'part',
                linkedItems: [],

                fields: {
                    part_item_number: 'ECM1000301',
                    part_item_revision: 'A',
                    part_item_desc: 'Running belt, 60x20, Multi-ply, Pre-lubricated',
                    part_uom_code: 'ea',
                    part_item_cost: '250.00',
                },
                images: [
                    'https://bots40oke01dev.oraclepdemos.com/image/directory/cxfs/ECM100BELT.JPG'
                ]

            };
             model3 = {
                catalogId: 124,
                itemId: 32975,
                label: 'ECM1000301',
                itemType: 'part',
                inventoryType: 'part',
                linkedItems: [],

                fields: {
                    part_item_number: 'ECM1000301',
                    part_item_revision: 'A',
                    part_item_desc: 'Running belt, 60x20, Multi-ply, Pre-lubricated',
                    part_uom_code: 'ea',
                    part_item_cost: '250.00',
                },
                 images: []

            };
            let catlogModel =  new CatalogModel({id:"123", name: 'test', fieldSchemas: [], typeSchemas: []});
            catalogCollection = new CatalogCollection(catlogModel);
        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('previewFields - branch1 - is working', (() => {
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.previewFields()).to.eql([]);
            screen.dispose();
        }));

        test('previewFields - branch2 - is working', (() => {
            var screen = new PartPreviewComponent({model: model2,catalogCollection: catalogCollection,onOpenDetails:Function,searchRequest:null,showAllFields:true});
            screen.catalogCollection = catalogCollection
            screen.model = model2;
            screen.model.catalogId = null
            screen.previewFields();
            screen.detailFields();
        }));

        test('detailFields is working', (() => {
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.detailFields()).to.eql([]);
        }));

        test('previewImage is working', (() => {
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.previewImage()).to.eql('https://bots40oke01dev.example.com/image/directory/cxfs/ECM100BELT.JPG');
        }));

        test('previewImage is working', (() => {
            var screen = new PartPreviewComponent({model: model3,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
          //  expect(screen.previewImage()).to.eql('https://bots40oke01dev.example.com/image/directory/cxfs/ECM100BELT.JPG');
            screen.previewImage();
        }));

        test('imageLoaded is working', (() => {
            let r;
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.imageLoaded()).to.eql(r);
        }));

        test('dispose is working', (() => {
            let r;
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.dispose()).to.eql(r);
        }));

        test('event is working', (() => {
            let r;
            let even = new Event('change');
            var screen = new PartPreviewComponent({model: model1,catalogCollection: catalogCollection,onOpenDetails:null,searchRequest:"part",showAllFields:true});
            expect(screen.openDetails(screen,even)).to.eql(r);
        }));

    });

});