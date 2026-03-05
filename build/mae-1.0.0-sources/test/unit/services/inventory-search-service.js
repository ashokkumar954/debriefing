define(['knockout', 'services/inventory-search-service', 'ojs/ojmodel'], (ko, InventorySearchService, ojmodel) => {

    suite('InventorySearchService', () => {
        let attributeDescription;
        let resourcePartsCollection;
        suiteSetup(async () => {
            attributeDescription = "{ \"part_item_number_rev\": {" +
                    "\"fieldType\": \"property\"," +
                    "\"entity\": \"ENTITY_INVENTORY\"," +
                    "\"gui\": \"text\"," +
                    "\"label\": \"part_item_number_rev\"," +
                    "\"title\": \"Part Item + Revision\"," +
                    "\"type\": \"string\"," +
                    " \"access\": \"READ_WRITE\"" +
                " }," +
                "\"part_item_number\": {" +
                    "\"fieldType\": \"property\"," +
                    "\"entity\": \"ENTITY_INVENTORY\"," +
                    "\"gui\": \"text\"," +
                    "\"label\": \"part_item_number\"," +
                    "\"title\": \"Part Item\"," +
                    "\"type\": \"string\"," +
                    "\"access\": \"READ_WRITE\"" +
                "}," +
                "\"part_item_revision\": {" +
                    "\"fieldType\": \"property\"," +
                    "\"entity\": \"ENTITY_INVENTORY\"," +
                    "\"gui\": \"text\"," +
                    "\"label\": \"part_item_revision\"," +
                    "\"title\": \"Part Revision\"," +
                    "\"type\": \"string\"," +
                    "\"access\": \"READ_WRITE\"" +
                " }" +
                "}";

                let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM2001',
                'part_item_number_rev': 'ECM2001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM30015',
                'part_item_number_rev': 'ECM30015',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M'
            });
            resourcePartsCollection.add(model1) ;
            resourcePartsCollection.add(model2) ;

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('InventorySearchService is working', (() => {

               // new ojmodel.Collection([model1,model2]);
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new InventorySearchService(
                resourcePartsCollection, attributeDescriptionArray,
                // searchable properties:
                ['part_item_number_rev', 'part_item_desc', 'invsn'],
                // order by:
                'part_item_number_rev');
        }));

        test('_normalizeSearchSubstring is working', (() => {
            var screen = new InventorySearchService(
                resourcePartsCollection, attributeDescription,
                // searchable properties:
                ['part_item_number_rev', 'part_item_desc', 'invsn'],
                // order by:
                'part_item_number_rev');
            expect(screen._normalizeSearchSubstring('part_item_number_rev')).equal("part_item_number_rev");
        }));

        test('_normalizeSearchSubstring is null', (() => {
            var screen = new InventorySearchService(
                resourcePartsCollection, attributeDescription,
                // searchable properties:
                ['part_item_number_rev', 'part_item_desc', 'invsn'],
                // order by:
                'part_item_number_rev');
            expect(screen._normalizeSearchSubstring(null)).equal('');
        }));

        test('_normalizeSearchSubstring is working', (() => {
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new InventorySearchService(
                resourcePartsCollection, attributeDescriptionArray,
                // searchable properties:
                ['part_item_number_rev', 'part_item_desc', 'invsn'],
                // order by:
                'part_item_number_rev');
            let result=[];
            screen.searchBySubstring('part_item_number_rev');
        }));
    });

});