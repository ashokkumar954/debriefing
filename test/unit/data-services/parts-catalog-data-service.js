define(['knockout', 'data-services/parts-catalog-data-service','ofsc-connector', 'ojs/ojmodel'], (ko,
                                                                                                  PartsCatalogDataService, OfscConnector, ojmodel) => {

    suite('PartsCatalogDataService', () => {
        let attributeDescription;
        let resourcePartsCollection;
        let ofscConnector;
        suiteSetup(async () => {
            ofscConnector = new OfscConnector();
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

        test('PartsCatalogDataService constructor is throwing error as expected', (() => {
            let partsCatalogDataService;
            (() => {
                partsCatalogDataService = new PartsCatalogDataService(null);
            }).should.throw(TypeError);
        }));

        test('PartsCatalogDataService is working', (() => {

               // new ojmodel.Collection([model1,model2]);
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new PartsCatalogDataService(ofscConnector);
            screen.ofscConnector = ofscConnector;
            let promose = new Promise((resolve, reject) => {
                return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                        'Activity': {'aid': '4232516'}, inventory: {}}})});
            screen.ofscConnector.sendMessage = function(){
                return new Promise((resolve, reject) => {
                    return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                            'Activity': {'aid': '4232516'}, inventory: {}}});
                });
            }
            screen.searchParts("parts",10,false);
        }));

        test('searchPartsContinue is working', (() => {

            // new ojmodel.Collection([model1,model2]);
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new PartsCatalogDataService(ofscConnector);
            screen.ofscConnector = ofscConnector;
            screen.ofscConnector.sendMessage = function(){
                return new Promise((resolve, reject) => {
                    return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                            'Activity': {'aid': '4232516'}, inventory: {}}});
                });
            }
            screen.searchPartsContinue(123);
        }));


        test('getParts is working', (() => {

            // new ojmodel.Collection([model1,model2]);
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new PartsCatalogDataService(ofscConnector);
            screen.ofscConnector = ofscConnector;
            let promose = new Promise((resolve, reject) => {
                return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                        'Activity': {'aid': '4232516'}, inventory: {}}})});
            screen.ofscConnector.sendMessage = function(){
                return new Promise((resolve, reject) => {
                    return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                            'Activity': {'aid': '4232516'}, inventory: {}}});
                });
            }
            screen.getParts(promose,true);
        }));

        test('getPartsCatalogsStructure is working', (() => {

            // new ojmodel.Collection([model1,model2]);
            let attributeDescriptionArray = JSON.parse(attributeDescription);
            var screen = new PartsCatalogDataService(ofscConnector);
            screen.ofscConnector = ofscConnector;
            let promose = new Promise((resolve, reject) => {
                return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                        'Activity': {'aid': '4232516'}, inventory: {}}})});
            screen.ofscConnector.sendMessage = function(){
                return new Promise((resolve, reject) => {
                    return resolve({'resultData': {'items': [{itemID: 'ECM10001', label: 'ECM10001', itemType: 'PART', invtype: 'psrt'}],
                            'Activity': {'aid': '4232516'}, inventory: {}}});
                });
            }
            screen.getPartsCatalogsStructure();
        }));

    });

});