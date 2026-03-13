define(['appController',
        'ojs/ojcore',
        'ojs/ojmodel',
        'knockout',
        'services/ofsc-plugin-api-transport',
        'services/ofsc-rest-api-transport',
        'services/fusion-rest-api-transport',
        'storage/persistent-storage',
        'constants'],
    (ControllerViewModel,
     oj,
     ojmodel,
     ko,
     OfscPluginApiTransport,
     OfscRestApiTransport,
     FusionRestApiTransport,
     PersistentStorage,
     Constants) => {
    suite('App Controller', () => {

        suiteSetup(async () => {
        });


        suiteTeardown(async () => {
            sinon.restore();
            sinon.reset();
        });

        setup(() => {

        });

        teardown(() => {
            sinon.restore();
            sinon.reset();
        });

    });

    test('Constructor is working', (() => {
        let routerConfigureStub = sinon.stub();

        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }

            getRouterInstance() {
                return {
                    configure: routerConfigureStub, moduleConfig: {params: {}}
                };
            }
        }

        let controller = new TestControllerViewModel();
        let laborItems = [];
        laborItems.push({
            id: '1', label: 'FS Overtime Labor', text: 'FS Overtime Labor', itemId: 'FS Overtime Labor'
        })
        let attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
        controller._attributeDescription = JSON.parse(attributeDesc);

        let data = JSON.parse("{\n    \"apiVersion\": 1,\n    \"method\": \"open\",\n    \"entity\": \"activity\",\n    \"user\": {\n        \"allow_desktop_notifications\": 0,\n        \"allow_vibration\": 0,\n        \"design_theme\": 12,\n        \"format\": {\n            \"date\": \"d.m.y\",\n            \"long_date\": \"l, F jS, Y\",\n            \"time\": \"H:i\",\n            \"datetime\": \"d.m.y H:i\"\n        },\n        \"providers\": [\n            2\n        ],\n        \"sound_theme\": 0,\n        \"su_zid\": 2,\n        \"uid\": 2315,\n        \"ulanguage\": 1,\n        \"ulogin\": \"admin\",\n        \"uname\": \"Admin\",\n        \"week_start\": 1,\n        \"languageCode\": \"en\"\n    },\n    \"resource\": {\n        \"pid\": \"5000001\",\n        \"pname\": \"AMBRIZ, Walter\",\n        \"currentTime\": \"2024-12-04 17:33:36\",\n        \"deviceUTCDiffSeconds\": 1,\n        \"timeZoneDiffSeconds\": 19800\n    },\n    \"team\": {\n        \"teamMembers\": {},\n        \"assistingTo\": {},\n        \"assistingMe\": []\n    },\n    \"queue\": {\n        \"date\": \"2024-12-03\",\n        \"status\": \"activated\",\n        \"isActual\": true,\n        \"activationTime\": \"2024-12-03 15:01:00\"\n    },\n    \"activity\": {\n        \"cname\": null,\n        \"caddress\": null,\n        \"ccity\": null,\n        \"czip\": null,\n        \"cstate\": null,\n        \"appt_number\": null,\n        \"length\": 120,\n        \"ETA\": \"15:01\",\n        \"astatus\": \"started\",\n        \"aid\": \"4237321\",\n        \"end_time\": \"17:01\",\n        \"travel\": null,\n        \"csign\": \"{\\\"name\\\":\\\"signature.png, 4KB\\\",\\\"file_id\\\":5852,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"smCUsDxd9u\\\\/uyOmIvQeskejGPkXL6GtImpK258QfP78=\\\"}\",\n        \"ccompany\": null,\n        \"invoice\": \"{\\\"name\\\":\\\"pro_forma_invoice.pdf, 82KB\\\",\\\"file_id\\\":5850,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"Yxa34D9YoVIyDC6rDBuHhZbGnHzx3NCpZa3j2f5FGA8=\\\"}\",\n        \"sla_window_start\": null,\n        \"sla_window_end\": null,\n        \"DURATION_EXTERNAL_LABOR\": null,\n        \"OPERATION_END_TIME\": null,\n        \"temporary_aid\": \"17332182930-6483\",\n        \"activity_flow\": null\n    },\n    \"activityList\": {\n        \"4236926\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 60,\n            \"ETA\": null,\n            \"astatus\": \"pending\",\n            \"aid\": \"4236926\",\n            \"end_time\": null,\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": \"2023-12-14 00:00:00\",\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null\n        },\n        \"4236928\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 60,\n            \"ETA\": null,\n            \"astatus\": \"pending\",\n            \"aid\": \"4236928\",\n            \"end_time\": null,\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": \"2023-12-11 00:00:00\",\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null\n        },\n        \"4237320\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": null,\n            \"ETA\": \"15:01\",\n            \"astatus\": \"complete\",\n            \"aid\": \"4237320\",\n            \"end_time\": \"15:01\",\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": null,\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null,\n            \"activity_flow\": null\n        },\n        \"4237321\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 120,\n            \"ETA\": \"15:01\",\n            \"astatus\": \"started\",\n            \"aid\": \"4237321\",\n            \"end_time\": \"17:01\",\n            \"travel\": null,\n            \"csign\": \"{\\\"name\\\":\\\"signature.png, 4KB\\\",\\\"file_id\\\":5852,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"smCUsDxd9u\\\\/uyOmIvQeskejGPkXL6GtImpK258QfP78=\\\"}\",\n            \"ccompany\": null,\n            \"invoice\": \"{\\\"name\\\":\\\"pro_forma_invoice.pdf, 82KB\\\",\\\"file_id\\\":5850,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"Yxa34D9YoVIyDC6rDBuHhZbGnHzx3NCpZa3j2f5FGA8=\\\"}\",\n            \"sla_window_start\": null,\n            \"sla_window_end\": null,\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null,\n            \"temporary_aid\": \"17332182930-6483\",\n            \"activity_flow\": null\n        }\n    },\n    \"inventoryList\": {\n        \"21260387\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260387\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": -7,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": \"IN\",\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELTA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260389\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260389\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 6,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"FAN001A\",\n            \"part_item_number\": \"FAN001A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Acon 4in Treadmill Console Fan\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260390\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260390\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 14,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"FUSE002A\",\n            \"part_item_number\": \"FUSE002A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Treadmill Fuse 002\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260391\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260391\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 9,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"KEY001A\",\n            \"part_item_number\": \"KEY001A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"FIT3000 Treadmill Safety Key\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260392\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260392\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 11,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"KEY002A\",\n            \"part_item_number\": \"KEY002A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"FIT2100 Treadmill Safety Key\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21480874\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"ordered_part\",\n            \"invid\": \"21480874\",\n            \"inv_aid\": 4236926,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELT\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21480875\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"ordered_part\",\n            \"invid\": \"21480875\",\n            \"inv_aid\": 4236928,\n            \"inv_pid\": null,\n            \"quantity\": 2,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELT\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21481048\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"part\",\n            \"invid\": \"21481048\",\n            \"inv_aid\": 4237321,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": \"RET\",\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELTA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": \"N\",\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": \"ea\",\n            \"part_uom_code1\": null\n        },\n        \"21481049\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"part\",\n            \"invid\": \"21481049\",\n            \"inv_aid\": 4237321,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": \"RET\",\n            \"part_item_number_rev\": \"ECM200SENSORA\",\n            \"part_item_number\": \"ECM200SENSORA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Belt Force Sensor/Tensioner\",\n            \"part_disposition_code\": \"N\",\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": \"ea\",\n            \"part_uom_code1\": null\n        }\n    },\n    \"buttonId\": \"43690\",\n    \"securedData\": {\n        \"autoPopulateLabor\": \"true\",\n        \"laborItemNumberForRegLabor\": \"FS Reg Labor\",\n        \"laborItemNumberForTravel\": \"FS Travel Time\"\n    },\n    \"openParams\": {},\n    \"allowedProcedures\": {\n        \"openLink\": true,\n        \"searchParts\": true,\n        \"searchPartsContinue\": true,\n        \"getParts\": true,\n        \"getPartsCatalogsStructure\": true,\n        \"print\": true,\n        \"share\": true,\n        \"updateIconData\": true,\n        \"updateButtonsIconData\": true,\n        \"getAccessToken\": true\n    }\n}");
        controller._openData = data;

        controller.isLaborHrsConfigured = false;
        controller.isLaborTravelHrsConfigured = false;


            controller.laborItemEnumCollection = new oj.Collection(laborItems);
            controller.laborItems = ko.observableArray([]);
            controller.laborItems = ko.observableArray([{
                'id': 1,
                'activityId': 'com',
                'itemId': 'Labor Time1',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': 2,
                'activityId': 'drp',
                'itemId': 'Travel Time1',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);
            controller.activityDetails = "{\n    \"aid\": \"4232404\",\n    \"end_time\": \"02:27 AM\",\n    \"travel\": 1,\n    \"csign\": null,\n    \"ccompany\": null,\n    \"invoice\": null,\n    \"astatus\": \"started\",\n    \"ETA\": \"01:27 AM\",\n    \"cname\": null,\n    \"ccity\": null,\n    \"cstate\": null,\n    \"length\": 60,\n    \"caddress\": null,\n    \"czip\": null,\n    \"appt_number\": null,\n    \"temporary_aid\": \"17322568170-3693\",\n    \"activity_flow\": null\n}";
            window.localStorage.setItem("Labor Time", "42320351");
            window.localStorage.setItem("Travel Time", "42320351");
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            sinon.stub(controller, "addExpense");
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            window.localStorage.setItem("4237321", "Sample");
            data.securedData = "";
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

        }));

        test('removeReturnedPart is working', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid',
            }))({
                aid: "1",
            });

            // Mock collections with Sinon stubs
            const customerPartsCollection = sinon.createStubInstance(ojmodel.Collection);
            const returnedPartsCollection = sinon.createStubInstance(ojmodel.Collection);
            customerPartsCollection.findWhere.returns(null);
            returnedPartsCollection.findWhere.returns(null);
            controller.customerPartsCollection = customerPartsCollection;
            controller.returnedPartsCollection = returnedPartsCollection;
            controller._openData = {
                activity: {aid: '12345'},
            };
            //no installedPart found
            await controller.removeReturnedPart('model1', 'serial1');
            sinon.assert.calledWith(returnedPartsCollection.findWhere, {
                part_item_number_rev: 'model1',
                invsn: 'serial1',
            });
        });

        test('test removeReturnedPart when updating deinstalledUpdateInventoriesSummary', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            let promise = Promise.resolve([]);
            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid',
            }))({
                aid: "1",
            });

            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage').resolves({message: 'Success'});
            let customerPartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let returnedPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });
            let model1 = new ojmodel.Model({
                "part_item_number": "ECM100BELTA",
                "part_item_revision": "A",
                "part_item_number_rev": "ECM100BELTA~4234",
                "invtype": "part",
                "inv_pid": 8100539,
                "invsn": 4234,
                "quantity": 1
            });
            let model2 = new ojmodel.Model({
                "part_item_number": "ECM100BELTAN",
                "part_item_revision": "A",
                "part_item_number_rev": "ECM100BELTAN",
                "invtype": "part",
                "inv_pid": 8100539,
                "invsn": 4234,
                "quantity": 1
            });
            controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            returnedPartsCollection.add(model1);
            returnedPartsCollection.add(model2);
            controller.deinstalledInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.customerPartsCollection = customerPartsCollection;
            controller.returnedPartsCollection = returnedPartsCollection;
            controller._openData = {
                activity: {aid: '12345'},
            };
            controller.removeReturnedPart('ECM100BELTA~4234', 4234);
            await promise;
            sinon.assert.calledOnce(sendMessageStub);

            customerPartsCollection.add(model1);
            customerPartsCollection.add(model2);
            controller.removeReturnedPart('ECM100BELTAN', null);
            await promise;
            sinon.assert.calledOnce(sendMessageStub);

        });

        test('test removeUsedPart when updating installedUpdateInventoriesSummary', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            let promise = Promise.resolve({});
            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid',
            }))({
                aid: "1",
            });

            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage').resolves({message: 'Success'});
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.errorAlertPopup = sinon.stub();
            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let usedPartsCollection = new ojmodel.Collection(null, {
                model: this.partModelConstructor
            });
            let model1 = new ojmodel.Model({
                "part_item_number": "ECM100BELTA",
                "part_item_revision": "A",
                "part_item_number_rev": "ECM100BELTA~4234",
                "invtype": "part",
                "inv_pid": 8100539,
                "invsn": 4234,
                "quantity": 1
            });
            let model2 = new ojmodel.Model({
                "part_item_number": "ECM100BELTAN",
                "part_item_revision": "A",
                "part_item_number_rev": "ECM100BELTAN",
                "invtype": "part",
                "inv_pid": 8100539,
                "invsn": null,
                "quantity": 1
            });
            controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            usedPartsCollection.add(model1);
            usedPartsCollection.add(model2);
            controller.installedInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = usedPartsCollection;
            controller._openData = {
                activity: {aid: '12345'},
            };
            controller.removeUsedPart('ECM100BELTA~4234', 4234);
            await promise;
            expect(controller.removeUsedPart('ECM100BELTA~4234', 4234)).calledOnce;
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.ofscConnector.sendMessage = function () {
                return Promise.resolve();
            }
            controller.removeUsedPart('ECM100BELTAN', null);
            await promise;
            expect(controller.removeUsedPart('ECM100BELTA~4234', 4234)).calledOnce;
        });

        test('test removeUsedPart is working', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid',
            }))({
                aid: "1",
            });

            // Mock collections with Sinon stubs
            const resourcePartsCollection = sinon.createStubInstance(ojmodel.Collection);
            const usedPartsCollection = sinon.createStubInstance(ojmodel.Collection);
            usedPartsCollection.findWhere.returns(null);
            resourcePartsCollection.findWhere.returns(null);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = usedPartsCollection;
            controller._openData = {
                activity: {aid: '12345'},
            };
            //no installedPart found
            await controller.removeUsedPart('model1', 'serial1');
            sinon.assert.calledWith(usedPartsCollection.findWhere, {
                part_item_number_rev: 'model1',
                invsn: 'serial1',
            });
        });

        test('Constructor is working for negative scenario', (() => {
            let routerConfigureStub = sinon.stub();

            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }

                getRouterInstance() {
                    return {
                        configure: routerConfigureStub, moduleConfig: {params: {}}
                    };
                }
            }

            let controller = new TestControllerViewModel();
            let laborItems = [];
            laborItems.push({
                id: '1', label: 'FS Overtime Labor', text: 'FS Overtime Labor', itemId: 'FS Overtime Labor'
            })
            let attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);

            let data = JSON.parse("{\n" + "\"apiVersion\": 1,\n" + "\"securedData\": {\n      \"autoPopulateLabor\" : \"true\"\n    },\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"customer\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            controller._openData = data;

            controller.isLaborHrsConfigured = false;
            controller.isLaborTravelHrsConfigured = false;


            controller.laborItemEnumCollection = new oj.Collection(laborItems);
            controller.laborItems = ko.observableArray([{
                'id': 1,
                'activityId': 'com',
                'itemId': 'Labor Time',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': 2,
                'activityId': 'drp',
                'itemId': 'Travel Time',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);
            controller.activityDetails = "{\n    \"aid\": \"4232404\",\n    \"end_time\": \"02:27 AM\",\n    \"travel\": 1,\n    \"csign\": null,\n    \"ccompany\": null,\n    \"invoice\": null,\n    \"astatus\": \"started\",\n    \"ETA\": \"01:27 AM\",\n    \"cname\": null,\n    \"ccity\": null,\n    \"cstate\": null,\n    \"length\": 60,\n    \"caddress\": null,\n    \"czip\": null,\n    \"appt_number\": null,\n    \"temporary_aid\": \"17322568170-3693\",\n    \"activity_flow\": null\n}";
            window.localStorage.setItem("Travel Time", "4232404");
            attributeDesc = "{\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n       \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            sinon.stub(controller, "addExpense");
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            window.localStorage.setItem("Labor Time", "4232404");
            window.localStorage.setItem("Travel Time", "4232404");
            attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Hours\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);


            controller.laborItems = ko.observableArray([{
                'id': 1,
                'activityId': 'com',
                'itemId': 'Labor Time1',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': 2,
                'activityId': 'drp',
                'itemId': 'Travel Time1',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);


        }));

        test('test populateDefaultLaborItem when autoPopulateLabor is set to false', (() => {
            let routerConfigureStub = sinon.stub();

            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }

                getRouterInstance() {
                    return {
                        configure: routerConfigureStub, moduleConfig: {params: {}}
                    };
                }
            }

            let controller = new TestControllerViewModel();
            let laborItems = [];
            laborItems.push({
                id: '1', label: 'FS Overtime Labor', text: 'FS Overtime Labor', itemId: 'FS Overtime Labor'
            })
            let attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);

            let data = JSON.parse("{\n" + "\"apiVersion\": 1,\n" + "\"securedData\": {\n      \"autoPopulateLabor1\" : \"false\"\n    },\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"customer\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            controller._openData = data;

            controller.isLaborHrsConfigured = false;
            controller.isLaborTravelHrsConfigured = false;


            controller.laborItemEnumCollection = new oj.Collection(laborItems);
            controller.laborItems = ko.observableArray([{
                'id': 1,
                'activityId': 'com',
                'itemId': 'Labor Time',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': 2,
                'activityId': 'drp',
                'itemId': 'Travel Time',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);
            controller.activityDetails = "{\n    \"aid\": \"4232404\",\n    \"end_time\": \"02:27 AM\",\n    \"travel\": 1,\n    \"csign\": null,\n    \"ccompany\": null,\n    \"invoice\": null,\n    \"astatus\": \"started\",\n    \"ETA\": \"01:27 AM\",\n    \"cname\": null,\n    \"ccity\": null,\n    \"cstate\": null,\n    \"length\": 60,\n    \"caddress\": null,\n    \"czip\": null,\n    \"appt_number\": null,\n    \"temporary_aid\": \"17322568170-3693\",\n    \"activity_flow\": null\n}";
            attributeDesc = "{\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n       \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            sinon.stub(controller, "addExpense");
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            window.localStorage.setItem("Labor Time", "4232404");
            window.localStorage.setItem("Travel Time", "4232404");
            attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Hours\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

        }));

        test('test populateDefaultLaborItem when default Travel Time is configured', (() => {
            let routerConfigureStub = sinon.stub();

            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }

                getRouterInstance() {
                    return {
                        configure: routerConfigureStub, moduleConfig: {params: {}}
                    };
                }
            }

            let controller = new TestControllerViewModel();
            let laborItems = [];
            laborItems.push({
                id: '1', label: 'FS Travel Time', text: 'FS Travel Time', itemId: 'FS Travel Time'
            });
            laborItems.push({
                id: '2', label: 'FS Reg Labor', text: 'FS Reg Labor', itemId: 'FS Reg Labor'
            })
            let attributeDesc = "{\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"FIT3000\": {\n        \"label\": \"FIT3000\",\n        \"text\": \"FIT3000 Cardio Fitness Machine\",\n        \"nonSerialized\": false\n      },\n      \"FIT1410\": {\n        \"label\": \"FIT1410\",\n        \"text\": \"FIT1410 Elliptical\",\n        \"nonSerialized\": false\n      },\n      \"FIT2100\": {\n        \"label\": \"FIT2100\",\n        \"text\": \"FIT2100 Treadmill\",\n        \"nonSerialized\": false\n      },\n      \"HEADSET\": {\n        \"label\": \"HEADSET\",\n        \"text\": \"VR Headset\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOUNT\": {\n        \"label\": \"MOUNT\",\n        \"text\": \"Tablet Mount\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"PEDAL\": {\n        \"label\": \"PEDAL\",\n        \"text\": \"Elliptical Pedal\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MAT\": {\n        \"label\": \"MAT\",\n        \"text\": \"Floor Mat\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"STRAP\": {\n        \"label\": \"STRAP\",\n        \"text\": \"Heart Rate Strap\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BELT\": {\n        \"label\": \"BELT\",\n        \"text\": \"Treadmill Belt\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"MOTOR\": {\n        \"label\": \"MOTOR\",\n        \"text\": \"Drive Motor\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"SCALE\": {\n        \"label\": \"SCALE\",\n        \"text\": \"Body Composition Scale\",\n        \"nonSerialized\": false\n      },\n      \"STABLE\": {\n        \"label\": \"STABLE\",\n        \"text\": \"Front Stabilizer\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"partwd\": {\n        \"label\": \"partwd\",\n        \"text\": \"ZPart\",\n        \"inactive\": true,\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Each\"\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      },\n      \"TRAY\": {\n        \"label\": \"TRAY\",\n        \"text\": \"Treadmill Tray\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BREAKER\": {\n        \"label\": \"BREAKER\",\n        \"text\": \"Reset Circuit Breaker\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CONSOLE\": {\n        \"label\": \"CONSOLE\",\n        \"text\": \"FIT5000 Workout Console\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"BASE\": {\n        \"label\": \"BASE\",\n        \"text\": \"FIT5000 Base Assembly\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"CRANK\": {\n        \"label\": \"CRANK\",\n        \"text\": \"Crank Bearing\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"ordered_part\": {\n        \"label\": \"ordered_part\",\n        \"text\": \"Ordered Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"received_part\": {\n        \"label\": \"received_part\",\n        \"text\": \"Received Part\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"ea\"\n      },\n      \"part\": {\n        \"label\": \"part\",\n        \"text\": \"NonSerialisedPart\",\n        \"nonSerialized\": true,\n        \"quantityPrecision\": 0,\n        \"unitOfMeasurement\": \"Ea\"\n      },\n      \"part_sn\": {\n        \"label\": \"part_sn\",\n        \"text\": \"SerialisedPart\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"Labor Time\": {\n        \"text\": \"Labor Hours\"\n      },\n      \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);

            let data = JSON.parse("{\n    \"apiVersion\": 1,\n    \"method\": \"open\",\n    \"entity\": \"activity\",\n    \"user\": {\n        \"allow_desktop_notifications\": 0,\n        \"allow_vibration\": 0,\n        \"design_theme\": 12,\n        \"format\": {\n            \"date\": \"d.m.y\",\n            \"long_date\": \"l, F jS, Y\",\n            \"time\": \"H:i\",\n            \"datetime\": \"d.m.y H:i\"\n        },\n        \"providers\": [\n            2\n        ],\n        \"sound_theme\": 0,\n        \"su_zid\": 2,\n        \"uid\": 2315,\n        \"ulanguage\": 1,\n        \"ulogin\": \"admin\",\n        \"uname\": \"Admin\",\n        \"week_start\": 1,\n        \"languageCode\": \"en\"\n    },\n    \"resource\": {\n        \"pid\": \"5000001\",\n        \"pname\": \"AMBRIZ, Walter\",\n        \"currentTime\": \"2024-12-04 17:33:36\",\n        \"deviceUTCDiffSeconds\": 1,\n        \"timeZoneDiffSeconds\": 19800\n    },\n    \"team\": {\n        \"teamMembers\": {},\n        \"assistingTo\": {},\n        \"assistingMe\": []\n    },\n    \"queue\": {\n        \"date\": \"2024-12-03\",\n        \"status\": \"activated\",\n        \"isActual\": true,\n        \"activationTime\": \"2024-12-03 15:01:00\"\n    },\n    \"activity\": {\n        \"cname\": null,\n        \"caddress\": null,\n        \"ccity\": null,\n        \"czip\": null,\n        \"cstate\": null,\n        \"appt_number\": null,\n        \"length\": 120,\n        \"ETA\": \"15:01\",\n        \"astatus\": \"started\",\n        \"aid\": \"4237321\",\n        \"end_time\": \"17:01\",\n        \"travel\": null,\n        \"csign\": \"{\\\"name\\\":\\\"signature.png, 4KB\\\",\\\"file_id\\\":5852,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"smCUsDxd9u\\\\/uyOmIvQeskejGPkXL6GtImpK258QfP78=\\\"}\",\n        \"ccompany\": null,\n        \"invoice\": \"{\\\"name\\\":\\\"pro_forma_invoice.pdf, 82KB\\\",\\\"file_id\\\":5850,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"Yxa34D9YoVIyDC6rDBuHhZbGnHzx3NCpZa3j2f5FGA8=\\\"}\",\n        \"sla_window_start\": null,\n        \"sla_window_end\": null,\n        \"DURATION_EXTERNAL_LABOR\": null,\n        \"OPERATION_END_TIME\": null,\n        \"temporary_aid\": \"17332182930-6483\",\n        \"activity_flow\": null\n    },\n    \"activityList\": {\n        \"4236926\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 60,\n            \"ETA\": null,\n            \"astatus\": \"pending\",\n            \"aid\": \"4236926\",\n            \"end_time\": null,\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": \"2023-12-14 00:00:00\",\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null\n        },\n        \"4236928\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 60,\n            \"ETA\": null,\n            \"astatus\": \"pending\",\n            \"aid\": \"4236928\",\n            \"end_time\": null,\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": \"2023-12-11 00:00:00\",\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null\n        },\n        \"4237320\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": null,\n            \"ETA\": \"15:01\",\n            \"astatus\": \"complete\",\n            \"aid\": \"4237320\",\n            \"end_time\": \"15:01\",\n            \"travel\": null,\n            \"csign\": null,\n            \"ccompany\": null,\n            \"invoice\": null,\n            \"sla_window_start\": null,\n            \"sla_window_end\": null,\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null,\n            \"activity_flow\": null\n        },\n        \"4237321\": {\n            \"cname\": null,\n            \"caddress\": null,\n            \"ccity\": null,\n            \"czip\": null,\n            \"cstate\": null,\n            \"appt_number\": null,\n            \"length\": 120,\n            \"ETA\": \"15:01\",\n            \"astatus\": \"started\",\n            \"aid\": \"4237321\",\n            \"end_time\": \"17:01\",\n            \"travel\": null,\n            \"csign\": \"{\\\"name\\\":\\\"signature.png, 4KB\\\",\\\"file_id\\\":5852,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"smCUsDxd9u\\\\/uyOmIvQeskejGPkXL6GtImpK258QfP78=\\\"}\",\n            \"ccompany\": null,\n            \"invoice\": \"{\\\"name\\\":\\\"pro_forma_invoice.pdf, 82KB\\\",\\\"file_id\\\":5850,\\\"entity_id\\\":4237321,\\\"at\\\":\\\"Yxa34D9YoVIyDC6rDBuHhZbGnHzx3NCpZa3j2f5FGA8=\\\"}\",\n            \"sla_window_start\": null,\n            \"sla_window_end\": null,\n            \"DURATION_EXTERNAL_LABOR\": null,\n            \"OPERATION_END_TIME\": null,\n            \"temporary_aid\": \"17332182930-6483\",\n            \"activity_flow\": null\n        }\n    },\n    \"inventoryList\": {\n        \"21260387\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260387\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": -7,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": \"IN\",\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELTA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260389\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260389\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 6,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"FAN001A\",\n            \"part_item_number\": \"FAN001A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Acon 4in Treadmill Console Fan\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260390\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260390\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 14,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"FUSE002A\",\n            \"part_item_number\": \"FUSE002A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Treadmill Fuse 002\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260391\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260391\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 9,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"KEY001A\",\n            \"part_item_number\": \"KEY001A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"FIT3000 Treadmill Safety Key\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21260392\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"provider\",\n            \"invtype\": \"part\",\n            \"invid\": \"21260392\",\n            \"inv_aid\": null,\n            \"inv_pid\": 5000001,\n            \"quantity\": 11,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"KEY002A\",\n            \"part_item_number\": \"KEY002A~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"FIT2100 Treadmill Safety Key\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21480874\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"ordered_part\",\n            \"invid\": \"21480874\",\n            \"inv_aid\": 4236926,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELT\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21480875\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"ordered_part\",\n            \"invid\": \"21480875\",\n            \"inv_aid\": 4236928,\n            \"inv_pid\": null,\n            \"quantity\": 2,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": null,\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELT\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": null,\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": null,\n            \"part_uom_code1\": \"ea\"\n        },\n        \"21481048\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"part\",\n            \"invid\": \"21481048\",\n            \"inv_aid\": 4237321,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": \"RET\",\n            \"part_item_number_rev\": \"ECM100BELTA\",\n            \"part_item_number\": \"ECM100BELTA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Running belt, 60x20, Multi-ply, Pre-lubricated\",\n            \"part_disposition_code\": \"N\",\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": \"ea\",\n            \"part_uom_code1\": null\n        },\n        \"21481049\": {\n            \"labor_default_start_time\": null,\n            \"labor_default_end_time\": null,\n            \"invsn\": null,\n            \"invpool\": \"customer\",\n            \"invtype\": \"part\",\n            \"invid\": \"21481049\",\n            \"inv_aid\": 4237321,\n            \"inv_pid\": null,\n            \"quantity\": 1,\n            \"labor_service_activity\": null,\n            \"labor_item_number\": null,\n            \"labor_item_desc\": null,\n            \"labor_start_time\": null,\n            \"labor_end_time\": null,\n            \"expense_service_activity\": null,\n            \"expense_item_number\": null,\n            \"expense_item_desc\": null,\n            \"part_service_activity_used\": null,\n            \"part_service_activity_returned\": \"RET\",\n            \"part_item_number_rev\": \"ECM200SENSORA\",\n            \"part_item_number\": \"ECM200SENSORA~null\",\n            \"part_item_revision\": \"A\",\n            \"part_item_desc\": \"Belt Force Sensor/Tensioner\",\n            \"part_disposition_code\": \"N\",\n            \"expense_currency_code\": null,\n            \"expense_amount\": null,\n            \"part_uom_code\": \"ea\",\n            \"part_uom_code1\": null\n        }\n    },\n    \"buttonId\": \"43690\",\n    \"securedData\": {\n        \"autoPopulateLabor\": \"true\",\n        \"laborItemNumberForRegLabor\": \"FS Reg Labor\",\n        \"laborItemNumberForTravel\": \"FS Travel Time\"\n    },\n    \"openParams\": {},\n    \"allowedProcedures\": {\n        \"openLink\": true,\n        \"searchParts\": true,\n        \"searchPartsContinue\": true,\n        \"getParts\": true,\n        \"getPartsCatalogsStructure\": true,\n        \"print\": true,\n        \"share\": true,\n        \"updateIconData\": true,\n        \"updateButtonsIconData\": true,\n        \"getAccessToken\": true\n    }\n}");
            controller._openData = data;

            controller.isLaborHrsConfigured = false;
            controller.isLaborTravelHrsConfigured = false;
            window.localStorage.setItem("4237321", "FS Reg Labor:FS Travel Time");
            controller.defaultTravelItem = 'FS Travel Time';
            controller.defaultLaborItem = 'FS Reg Labor';
            controller.laborItemEnumCollection = new oj.Collection(laborItems);
            controller.laborItems = ko.observableArray([{
                id: 1,
                activityId: 'com',
                itemId: 'FS Travel Time',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00'
            }, {
                id: 2,
                activityId: 'drp',
                itemId: 'FS Reg Labor',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00',
                recordId: '2'
            }]);
            controller.activityDetails = "{\n    \"aid\": \"4232404\",\n    \"end_time\": \"02:27 AM\",\n    \"travel\": 1,\n    \"csign\": null,\n    \"ccompany\": null,\n    \"invoice\": null,\n    \"astatus\": \"started\",\n    \"ETA\": \"01:27 AM\",\n    \"cname\": null,\n    \"ccity\": null,\n    \"cstate\": null,\n    \"length\": 60,\n    \"caddress\": null,\n    \"czip\": null,\n    \"appt_number\": null,\n    \"temporary_aid\": \"17322568170-3693\",\n    \"activity_flow\": null\n}";
            attributeDesc = "{\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"csign\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"signature\",\n    \"label\": \"csign\",\n    \"title\": \"Signature\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"image/png\",\n      \"image/jpeg\",\n      \"image/gif\"\n    ]\n  },\n  \"ccompany\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccompany\",\n    \"title\": \"Company name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invoice\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"file\",\n    \"label\": \"invoice\",\n    \"title\": \"Invoice\",\n    \"type\": \"file\",\n    \"access\": \"READ_WRITE\",\n    \"mime_types\": [\n      \"application/pdf\"\n    ],\n    \"file_size_limit\": \"5\"\n  },\n  \"astatus\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"astatus\",\n    \"title\": \"Activity status\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"cancelled\": {\n        \"label\": \"cancelled\",\n        \"text\": \"Cancelled\"\n      },\n      \"complete\": {\n        \"label\": \"complete\",\n        \"text\": \"Completed\"\n      },\n      \"deleted\": {\n        \"label\": \"deleted\",\n        \"text\": \"Deleted\"\n      },\n      \"notdone\": {\n        \"label\": \"notdone\",\n        \"text\": \"Not Done\"\n      },\n      \"pending\": {\n        \"label\": \"pending\",\n        \"text\": \"Pending\"\n      },\n      \"started\": {\n        \"label\": \"started\",\n        \"text\": \"Started\"\n      },\n      \"suspended\": {\n        \"label\": \"suspended\",\n        \"text\": \"Suspended\"\n      }\n    }\n  },\n  \"ETA\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ETA\",\n    \"title\": \"Start\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"ccity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"ccity\",\n    \"title\": \"City\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"cstate\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"cstate\",\n    \"title\": \"State\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"length\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"length\",\n    \"title\": \"Duration\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"caddress\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"caddress\",\n    \"title\": \"Address\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"czip\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"czip\",\n    \"title\": \"ZIP/Postal Code\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"appt_number\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"appt_number\",\n    \"title\": \"Work Order\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n       \"Travel Time\": {\n        \"text\": \"Travel Time\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pid\",\n    \"title\": \"ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"pname\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_PROVIDER\",\n    \"gui\": \"text\",\n    \"label\": \"pname\",\n    \"title\": \"Name\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            sinon.stub(controller, "addExpense");
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            attributeDesc = "{\n  \"aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"aid\",\n    \"title\": \"Activity ID\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"end_time\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"end_time\",\n    \"title\": \"End\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"travel\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_ACTIVITY\",\n    \"gui\": \"text\",\n    \"label\": \"travel\",\n    \"title\": \"Traveling Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invsn\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invsn\",\n    \"title\": \"Serial Number\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"invpool\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invpool\",\n    \"title\": \"Inventory pool\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"customer\": {\n        \"label\": \"customer\",\n        \"text\": \"Customer\"\n      },\n      \"deinstall\": {\n        \"label\": \"deinstall\",\n        \"text\": \"Deinstalled\"\n      },\n      \"install\": {\n        \"label\": \"install\",\n        \"text\": \"Installed\"\n      },\n      \"provider\": {\n        \"label\": \"provider\",\n        \"text\": \"Technician\"\n      }\n    }\n  },\n  \"invtype\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"invtype\",\n    \"title\": \"Inventory Type\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FIT5000\": {\n        \"label\": \"FIT5000\",\n        \"text\": \"FIT5000 Virtual Reality Trainer\",\n        \"nonSerialized\": false\n      },\n      \"labor\": {\n        \"label\": \"labor\",\n        \"text\": \"Labor\",\n        \"nonSerialized\": false\n      },\n      \"expense\": {\n        \"label\": \"expense\",\n        \"text\": \"Expense\",\n        \"nonSerialized\": false\n      }\n    }\n  },\n  \"invid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"invid\",\n    \"title\": \"Inventory Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_aid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_aid\",\n    \"title\": \"Activity Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"inv_pid\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"inv_pid\",\n    \"title\": \"Resource Id\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"quantity\": {\n    \"fieldType\": \"field\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"quantity\",\n    \"title\": \"Quantity\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_service_activity\",\n    \"title\": \"Labor Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"com\": {\n        \"text\": \"Commute\"\n      },\n      \"drp\": {\n        \"text\": \"Diagnose and Repair\"\n      },\n      \"Labor\": {\n        \"text\": \"Labor\"\n      }\n    }\n  },\n  \"labor_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_number\",\n    \"title\": \"Labor Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Overtime Labor\": {\n        \"text\": \"FS Overtime Labor\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"FS Reg Labor\"\n      },\n      \"FS Travel Time\": {\n        \"text\": \"Labor Hours\"\n      }\n    }\n  },\n  \"labor_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"labor_item_desc\",\n    \"title\": \"Labor Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Labor Time\": {\n        \"text\": \"Labor Hours Spent\"\n      },\n      \"FS Overtime Labor\": {\n        \"text\": \"Overtime Labor (Hours)\"\n      },\n      \"FS Reg Labor\": {\n        \"text\": \"Regular Labor (Hours)\"\n      }\n    }\n  },\n  \"labor_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_start_time\",\n    \"title\": \"Labor Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_end_time\",\n    \"title\": \"Labor End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"expense_service_activity\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_service_activity\",\n    \"title\": \"Expense Activity\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Expense\": {\n        \"text\": \"Expense\"\n      },\n      \"msc\": {\n        \"text\": \"Miscellaneous\"\n      },\n      \"trv\": {\n        \"text\": \"Travel\"\n      }\n    }\n  },\n  \"expense_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_number\",\n    \"title\": \"Expense Item\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"FS Toll\": {\n        \"text\": \"FS Toll\"\n      },\n      \"prk\": {\n        \"text\": \"Parking\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges\"\n      }\n    }\n  },\n  \"expense_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_item_desc\",\n    \"title\": \"Expense Item Description\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"prk\": {\n        \"text\": \"Parking Charges for Service\"\n      },\n      \"FS Toll\": {\n        \"text\": \"Toll Charges\"\n      },\n      \"tol\": {\n        \"text\": \"Toll Charges for Service\"\n      }\n    }\n  },\n  \"part_service_activity_used\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_used\",\n    \"title\": \"Activity (Used)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"IN\": {\n        \"text\": \"Install\"\n      },\n      \"Install\": {\n        \"text\": \"Install\"\n      },\n      \"W_IN\": {\n        \"text\": \"Warranty Install\"\n      },\n      \"Warranty Install\": {\n        \"text\": \"Warranty Install\"\n      }\n    }\n  },\n  \"part_service_activity_returned\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_service_activity_returned\",\n    \"title\": \"Activity (returned)\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"RET\": {\n        \"text\": \"Return\"\n      },\n      \"Return\": {\n        \"text\": \"Return\"\n      },\n      \"W_RET\": {\n        \"text\": \"Warranty Return\"\n      },\n      \"Warranty Return\": {\n        \"text\": \"Warranty Return\"\n      }\n    }\n  },\n  \"part_item_number_rev\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number_rev\",\n    \"title\": \"Part Item + Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_number\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_number\",\n    \"title\": \"Part Item\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_revision\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_revision\",\n    \"title\": \"Part Item Revision\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_item_desc\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"part_item_desc\",\n    \"title\": \"Part Item Description\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"part_uom_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_uom_code\",\n    \"title\": \"Part Unit of Measure\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"Ea\": {\n        \"text\": \"Ea\"\n      },\n      \"ea\": {\n        \"text\": \"ea\"\n      },\n      \"zzu\": {\n        \"text\": \"ea\"\n      },\n      \"in\": {\n        \"text\": \"in\"\n      },\n      \"m\": {\n        \"text\": \"m\"\n      }\n    }\n  },\n  \"part_disposition_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"part_disposition_code\",\n    \"title\": \"Part Disposition\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"M\": {\n        \"text\": \"Fast Return\"\n      },\n      \"N\": {\n        \"text\": \"No Return\"\n      },\n      \"S\": {\n        \"text\": \"Slow Return\"\n      }\n    }\n  },\n  \"expense_currency_code\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"combobox\",\n    \"label\": \"expense_currency_code\",\n    \"title\": \"Expense Currency\",\n    \"type\": \"enum\",\n    \"access\": \"READ_WRITE\",\n    \"enum\": {\n      \"USD\": {\n        \"text\": \"$|US Dollars\"\n      },\n      \"GBP\": {\n        \"text\": \"£|UK Pound\"\n      },\n      \"EUR\": {\n        \"text\": \"€|Euro\"\n      }\n    }\n  },\n  \"expense_amount\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"expense_amount\",\n    \"title\": \"Expense\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_start_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_start_time\",\n    \"title\": \"Labor Default Start Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  },\n  \"labor_default_end_time\": {\n    \"fieldType\": \"property\",\n    \"entity\": \"ENTITY_INVENTORY\",\n    \"gui\": \"text\",\n    \"label\": \"labor_default_end_time\",\n    \"title\": \"Labor Default End Time\",\n    \"type\": \"string\",\n    \"access\": \"READ_WRITE\"\n  }\n}";
            controller._attributeDescription = JSON.parse(attributeDesc);
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            //When no Travel Time property is present
            controller.laborItems = ko.observableArray([{
                id: 1,
                activityId: 'com',
                itemId: 'FS Travel Time1',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00'
            }, {
                id: 2,
                activityId: 'drp',
                itemId: 'FS Reg Labor',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00',
                recordId: '2'
            }]);
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            window.localStorage.clear();
            window.localStorage.setItem("4237321", "FS Travel Time");
            controller.defaultLaborItem = "FS Travel Time";
            controller.laborItems = ko.observableArray([{}]);
            controller.open();
            controller.should.be.instanceOf(ControllerViewModel);

            //cover _populateDefaultTravel


        }));

        test('addLabor is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.laborItems = ko.observableArray([]);
            controller.laborActivities = ['1', 'text'];
            controller.laborItemEnumCollection = new oj.Collection([{
                id: "1" || '',
                label: "FS Overtime Labor" || '',
                text: "FS Overtime Labor" || '',
                itemId: "FS Overtime Labor" || ''
            }]);


            controller.laborActivityEnumCollection = new oj.Collection([{
                id: "1" || '',
                label: "FS Overtime Labor" || '',
                text: "FS Overtime Labor" || '',
                itemId: "FS Overtime Labor" || ''
            }]);
            let result;
            expect(controller.addLabor({
                id: "1", activityId: "1", itemId: '1', startTime: 'T00:00:00', endTime: 'T01:00:00'
            })).equals(result);
            expect(controller.addLabor({
                id: "2", activityId: "1", itemId: '1', startTime: 'T00:00:00', endTime: 'T01:00:00', recordId: '123'
            })).equals(result);

        }));

        test('add expense is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.laborItems = ko.observableArray([]);
            controller.expenseItems = ko.observableArray([{
                'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
            }, {
                'id': '2',
                'activityId': 'Expense',
                'itemId': 'FS Parking',
                'amount': '50',
                'currencyKey': 'USD',
                'recordId': '2'
            }]);
            controller.laborActivities = ['1', 'text'];
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);


            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            let result;
            expect(controller.addExpense({
                activityId: "1", itemId: '1', amount: '50', currencyKey: 'USD'
            })).equals(result);
            expect(controller.addExpense({
                activityId: "1", itemId: '1', amount: '50', currencyKey: 'USD', recordId: '123'
            })).equals(result);
            controller.load();
        }));

        test('removeLabor from is working - flow 1', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"customer\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            controller._openData = data;
            controller.laborItems = ko.observableArray([{
                'id': 1,
                'activityId': 'com',
                'itemId': 'Labor Time',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': 2,
                'activityId': 'drp',
                'itemId': 'Diagnose & Repair',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);

            controller.deleteInventoryList = [{
                'id': '2',
                'activityId': 'drp',
                'itemId': 'Diagnose & Repair',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }];
            let result;
            expect(controller.removeLabor(1)).equals(result);
            expect(controller.addDataInCache('Labor Time')).calledOnce;
            expect(controller.addDataInCache('Travel Time')).calledOnce;

            controller.laborItems = ko.observableArray([{
                'id': '1',
                'activityId': 'com',
                'itemId': 'FS Overtime Labor',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': '2',
                'activityId': 'drp',
                'itemId': 'Diagnose & Repair',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            },
                {
                    'id': '3',
                    'activityId': 'drp3',
                    'itemId': 'Diagnose & Repair3',
                    'startTime': 'T00:00:00',
                    'endTime': 'T01:00:00',
                    'recordId': '3'
                }]);
            expect(controller.removeLabor(2)).equals(result);

            //removal with deletedList but no deleted inventory to send
            controller.addInventoryListToDeleted = sinon.spy();
            controller.getDeletedInventoryList = sinon.stub().returns([]);
            controller._getOfscUpdateData = sinon.stub().returns('MockData');
            controller.setDeleteInventoryList = sinon.spy();
            controller.removeLabor(2);
            // Verify labor item is removed
            expect(controller.laborItems().length).to.equal(1);
            expect(controller.laborItems()[0].id).to.equal('1');

        }));

        test('should handle closeData failure', async () => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() { super(); }
            }
            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({ aid: "1" });
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            const closeData = { msg: 'close' };
            sinon.stub(controller, '_getOfscCloseData').returns(closeData);

            // Only one call, which rejects
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage')
                .rejects(new Error('Close failed'));

            // This is the function that gets called inside handleError
            const showErrorAlertSpy = sinon.spy(controller, '_showErrorAlert');

            await controller.submitPluginData();

            sinon.assert.calledOnce(sendMessageStub);
            sinon.assert.calledWith(sendMessageStub.firstCall, closeData);
        });

        test('test removal with deletedList and send inventory update', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"customer\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            controller._openData = data;
            controller.laborItems = ko.observableArray([{
                id: 1,
                activityId: 'com',
                itemId: 'FS Overtime Labor',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00',
                recordId: '1'
            }, {
                id: '2',
                activityId: 'drp',
                itemId: 'Diagnose & Repair',
                startTime: 'T00:00:00',
                endTime: 'T01:00:00'

            }]);
            mockOfscConnector = {
                sendMessage: sinon.stub().resolves('Mock Response'),
            };
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.ofscConnector = mockOfscConnector;
            controller.addDataInCache = sinon.spy();
            controller.addInventoryListToDeleted = sinon.spy();
            controller.getDeletedInventoryList = sinon.stub().returns([]);
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.setDeleteInventoryList = sinon.spy();

            await controller.removeLabor(1); // Has recordId for id: 1


            // Verify labor item is removed
            expect(controller.laborItems().length).to.equal(1);
            expect(controller.laborItems()[0].id).to.equal('2');


            // Verify inventory list is reset
            sinon.assert.calledOnce(controller.setDeleteInventoryList);

        });

        test('removeLabor is working - flow 2', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"customer\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            controller._openData = data;
            controller.laborItems = ko.observableArray([{
                'id': '1',
                'activityId': 'com',
                'itemId': 'FS Overtime Labor',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00'
            }, {
                'id': '2',
                'activityId': 'drp',
                'itemId': 'Diagnose & Repair',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }]);
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedUpdateInventoriesSummary = [];
            controller.deinstalledUpdateInventoriesSummary = [];
            controller.deleteInventoryList = [];
            controller.errorAlertPopup = sinon.stub(); // Mock the error alert popup
            controller.ofscConnector = {
                sendMessage: sinon.stub().returns(Promise.reject(new Error('Simulated error'))), // Simulate rejection
            };
            await controller.removeLabor('2');
        });

        test('removeExpense is working - flow 1', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.expenseItems = ko.observableArray([{
                id: 1, activityId: "Expense", itemId: 'FS Toll', amount: '50', currencyKey: 'USD', recordId: 2
            }, {
                id: 2,
                activityId: 'Expense',
                itemId: 'FS Parking',
                amount: '50',
                currencyKey: 'USD'
            }]);
            controller.errorAlertPopup = sinon.stub(); // Mock the error alert popup
            controller.ofscConnector = {
                sendMessage: sinon.stub().returns(Promise.reject(new Error('Simulated error'))), // Simulate rejection
            };
            controller.deleteInventoryList = [];
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.ofscConnector.sendMessage = async () => 'Mock Success Response';
            let result;
            await controller.removeExpense(1);
            expect(controller.lastError).to.be.undefined;

            controller.laborItems = ko.observableArray([]);
            expect(controller.removeExpense(2)).equals(result);
        });

        test('removeExpense is working - flow 2', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.errorAlertPopup = sinon.stub();
            controller.expenseItems = ko.observableArray([{
                'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
            }, {
                'id': '2',
                'activityId': 'Expense',
                'itemId': 'FS Parking',
                'amount': '50',
                'currencyKey': 'USD',
                'recordId': '2'
            }]);
            controller.deleteInventoryList = [{
                'id': '2',
                'activityId': 'Expense',
                'itemId': 'FS Toll',
                'amount': '40',
                'currencyKey': 'USD',
                'recordId': '2'
            }];
            controller.errorAlertPopup = sinon.stub();
            controller.ofscConnector = {
                sendMessage: sinon.stub().returns(Promise.reject(new Error('Simulated error')))
            };
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            let result;
            expect(controller.removeExpense('2')).equals(result);

            controller.laborItems = ko.observableArray([{
                'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '30', 'currencyKey': 'USD'
            }, {
                'id': '2',
                'activityId': 'Expense',
                'itemId': 'FS Parking',
                'amount': '20',
                'currencyKey': 'USD',
                'recordId': '2'
            }]);
            controller.deleteInventoryList = [];
            expect(controller.removeExpense('1')).equals(result);
        }));

        test('validationGroup is returning true', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            let getElementByIdStub = sinon.stub(document, 'getElementById');
            let dialogSpy = {
                valid: "valid",
                showMessages: function () {
                    console.log("showMessages ");
                },
                focusOn: function () {
                    console.log("focusOn ");
                }

            };
            getElementByIdStub.withArgs('tracker')
                .returns(dialogSpy);

            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};

            expect(controller.checkValidationGroup()).equals(true);
            sinon.restore();

        }));

        test('validationGroup is returning false', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller2 = new TestControllerViewModel();
            let getElementByIdStub = sinon.stub(document, 'getElementById');
            let dialogSpyInvalid = {
                valid: "invalid",
                showMessages: function () {
                    console.log("showMessages ");
                },
                focusOn: function () {
                    console.log("focusOn ");
                }

            };
            getElementByIdStub.withArgs('tracker')
                .returns(dialogSpyInvalid);

            controller2.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller2.installedInventoriesSummary = {};
            controller2.installedUpdateInventoriesSummary = {};
            controller2.deinstalledInventoriesSummary = {};
            controller2.deinstalledUpdateInventoriesSummary = {};

            expect(controller2.checkValidationGroup()).equals(false);
            sinon.restore();

        }));

        test('submitPluginData is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.strategy = sinon.createStubInstance(ServiceDebriefHelper);
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '', model: "ECM100001~1234" || '', quantity_delta: 2, invsn: "1234" || ''
            });
            controller.installedUpdateInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                activityId: "12345",
                quantity_delta: 0,
                quantity: 1,
                invsn: "1234" || ''
            });
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
                invid: "2" || '', model: "ECM100005~2345" || '', quantity_delta: 2, invsn: "2345" || ''
            });
            controller.deinstalledUpdateInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                activityId: "12345",
                quantity_delta: 0,
                quantity: 1,
                invsn: "1234" || ''
            });
            controller.deinstalledUpdateInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                activityId: "12345",
                quantity_delta: 0,
                quantity: 1,
                invsn: "1234" || ''
            });
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001~1234',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345"
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            let result;
            expect(controller.submitPluginData()).equals(result);

        }));

        test('should send close message when no inventories exist', async () => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() { super(); }
            }
            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({ aid: "1" });

            // Prepare close data
            const closeData = {
                method: 'close',
                wakeupNeeded: true,
                wakeOnEvents: {
                    online: { wakeupDelay: 120 },
                    timer: { wakeupDelay: 120, sleepTimeout: 600 }
                },
                activity: { aid: '1' },
                inventoryList: {},
                actions: []
            };
            sinon.stub(controller, '_getOfscCloseData').returns(closeData);

            // Stub sendMessage to resolve
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage').resolves('close ok');
            await controller.submitPluginData();
            sinon.assert.calledOnce(sendMessageStub);
            sinon.assert.calledWith(sendMessageStub, closeData);
        });

        test('should send close message when inventories exist', async () => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() { super(); }
            }
            const controller = new TestControllerViewModel();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({ aid: "1" });

            // Prepare close data with sample inventory actions
            const closeData = { msg: 'close', actions: ['something'] };
            sinon.stub(controller, '_getOfscCloseData').returns(closeData);

            // Stub sendMessage to resolve
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage').resolves('close ok');
            await controller.submitPluginData();
            sinon.assert.calledOnce(sendMessageStub);
            sinon.assert.calledWith(sendMessageStub, closeData);
        });

        test('test handle error when message sending fails', (() => {

            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.strategy = sinon.createStubInstance(ServiceDebriefHelper);
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            const sendMessageStub = sinon.stub(controller.ofscConnector, 'sendMessage');
            const errorResponse = {error: 'Some error'};
            sendMessageStub.rejects(errorResponse);
            const showErrorAlertStub = sinon.stub(controller, '_showErrorAlert');
            const setDeleteInventoryListStub = sinon.stub(controller, 'setDeleteInventoryList');
            controller.submitPluginData();

            setTimeout(() => {
                sinon.assert.calledOnce(sendMessageStub);
                sinon.assert.calledOnce(showErrorAlertStub);
            }, 0);
        }));

        test('Add parts is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 2,
                quantity: 2,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            });
            controller.installedUpdateInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 0,
                quantity: 2,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            });
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: 2,
                quantity: 2,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            });
            controller.deinstalledUpdateInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: 0,
                quantity: 2,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            });
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001~1234',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345"
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;
            controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";


            expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();
            expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();

            expect(controller.addReturnedPart(model2, 1, 1, '2345')).equals();

            expect(controller.load());

            expect(controller._createDeinstallInventoryAction(model2)).equals();
            expect(controller._generatePartsActions()).equals();

            controller.customerPartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            controller.returnedPartsCollection = resourcePartsCollection;

            expect(controller.addUsedPart('ECM100005~2345', "IN", 1, '2345')).equals();
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            model1 = new ojmodel.Model({
                'id': '5',
                'quantity': -1,
                'activityId': 'IN',
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": null,
                "invtype": 'part'
            });
            controller.installedInventoriesSummary['ECM100001'] = {
                invid: "2",
                activityId: 'IN',
                model: "ECM100001",
                quantity_delta: -1,
                quantity: 1,
                invsn: null,
                invtype: "part"
            };
            resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            resourcePartsCollection.add(model1);
            controller.resourcePartsCollection = resourcePartsCollection;
            expect(controller.addUsedPart('ECM100001', "W_IN", 1, null)).equals();
            resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'activityId': 'W_RET',
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                'invsn': null,
                'invtype': 'part',
            });
            resourcePartsCollection.add(model2);
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.deinstalledInventoriesSummary['ECM100001'] = {
                invid: null,
                model: 'ECM100001',
                activityId: 'W_RET',
                quantity_delta: -1,
                quantity: 1,
                invsn: null
            };
            expect(controller.addReturnedPart(model2, 'RET', 1, null)).equals();
        }));


        test('_createDeinstallInventoryAction for part is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 2,
                invsn: "1234" || '',
                "invtype": "part" || ''
            });
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: 2,
                invsn: "2345" || '',
                "invtype": "part" || ''
            });
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001~1234',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part',
                "invsn": "2345"
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;

            expect(controller.addReturnedPart(model2, 1, 1, '2345')).equals();


            expect(controller._createDeinstallInventoryAction(model2)).equals();


        }));

        test('addReturnedPart negative sceanrio is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 2,
                invsn: "1234" || '',
                "invtype": "part" || ''
            });
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: 2,
                invsn: "2345" || '',
                "invtype": "part" || ''
            });
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let resourcePartsCollection1 = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            controller._attributeDescription = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001~1234',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part',
                "invsn": "2345"
            });

            let model3 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100006~2345',
                'part_item_number_rev': 'ECM100006~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1111',
                "invtype": 'part'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection.add(model3);
            expect(controller.addReturnedPart(model3, 1, 1, '2345')).equals();

        }));

        test('_generatePartsActions 1 is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 2,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            };
            controller.installedUpdateInventoriesSummary["ECM100001~4234"] = {
                invid: "2" || '',
                model: "ECM100001~4234" || '',
                quantity_delta: 2,
                invsn: "4234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001~5234"] = {
                invid: "2" || '',
                model: "ECM100001~5234" || '',
                quantity_delta: 2,
                invsn: "5234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;

            expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generateUpdatedPartsActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.partsInventoryUpdateActionsCollection = new oj.Collection();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedUpdateInventoriesSummary["ECM100001~4234"] = {
                invid: "2" || '',
                model: "ECM100001~4234" || '',
                quantity_delta: 2,
                invsn: "4234" || '',
                invtype: "part_sn" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001~5234"] = {
                invid: "2" || '',
                model: "ECM100001~5234" || '',
                quantity_delta: 2,
                invsn: "5234" || '',
                invtype: "part_sn" || ''
            };

            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~4234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '4234',
                "invtype": 'part_sn',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100001~5234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invtype": 'part_sn',
                "invsn": "5234",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;

            expect(controller._generateUpdatedPartsActions()).equals();

        }));

        test('_generateUpdatedPartsActions for non serialised is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.partsInventoryUpdateActionsCollection = new oj.Collection();
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedUpdateInventoriesSummary["ECM100001"] = {
                invid: "2" || '',
                model: "ECM100001" || '',
                quantity_delta: 2,
                invsn: null,
                invtype: "part" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001"] = {
                invid: "2" || '',
                model: "ECM100001" || '',
                quantity_delta: 2,
                invsn: null,
                invtype: "part" || ''
            };

            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": null,
                "invtype": 'part',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invtype": 'part',
                "invsn": null,
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;

            expect(controller._generateUpdatedPartsActions()).equals();

        }));

        test('_generatePartsActions 2 is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: 10,
                invsn: "1234" || '',
                "invtype": "part" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: 10,
                invsn: "2345" || '',
                "invtype": "part" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part',
                "invsn": "2345",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;

            //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generatePartsActions negative qualtity is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: -1,
                invsn: "1234" || '',
                "invtype": "part" || ''
            };
            controller.installedUpdateInventoriesSummary["ECM100001~2234"] = {
                invid: "2" || '',
                model: "ECM100001~2234" || '',
                quantity_delta: -1,
                invsn: "2234" || '',
                "invtype": "part" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001~4234"] = {
                invid: "2" || '',
                model: "ECM100001~4234" || '',
                quantity_delta: -1,
                invsn: "4234" || '',
                "invtype": "part" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part',
                "invsn": "2345",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;

            //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generatePartsActions negative qualtity for serial number is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: -1,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            };
            controller.installedUpdateInventoriesSummary["ECM100001~3234"] = {
                invid: "2" || '',
                model: "ECM100001~3234" || '',
                quantity_delta: -1,
                invsn: "3234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001~4234"] = {
                invid: "2" || '',
                model: "ECM100001~4234" || '',
                quantity_delta: -1,
                invsn: "4234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;

            //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generatePartsActions negative qualtity for serial number is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: -1,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            };
            controller.installedUpdateInventoriesSummary["ECM100001~2234"] = {
                invid: "2" || '',
                model: "ECM100001~2234" || '',
                quantity_delta: -1,
                invsn: "2234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledUpdateInventoriesSummary["ECM100001~3234"] = {
                invid: "2" || '',
                model: "ECM100001~3234" || '',
                quantity_delta: -1,
                invsn: "3234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001~1234',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn',
                "invid": 'ECM100001'
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005~2345',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345",
                "invid": 'ECM100001'
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;

            controller.createdDeinstalledPartsCollection = resourcePartsCollection;
            //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generatePartsActions for deinstallInventory part_sn is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: -1,
                invsn: "1234" || '',
                "invtype": "part_sn" || ''
            };
            controller.installedInventoriesSummary["ECM100001~2234"] = {
                invid: "2" || '',
                model: "ECM100001~2234" || '',
                quantity_delta: -1,
                invsn: "2234" || '',
                "invtype": "part_sn" || ''
            };
            controller.installedInventoriesSummary["ECM100001~3234"] = {
                invid: "2" || '',
                model: "ECM100001~3234" || '',
                quantity_delta: -1,
                invsn: "3234" || '',
                "invtype": "part_sn" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part_sn" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part_sn',
                "invid": 1
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part_sn',
                "invsn": "2345",
                "invid": 2
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;
            expect(controller._generatePartsActions()).equals();

        }));

        test('_generatePartsActions for deinstallInventory for part is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller.ofscConnector.sendMessage = function () {
                return Promise.reject(new Error('Communication chanel is busy'));
            }
            controller.installedInventoriesSummary = {};
            controller.deinstalledInventoriesSummary = {};
            controller.installedUpdateInventoriesSummary = {};
            controller.deinstalledUpdateInventoriesSummary = {};
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: "1"
            });
            controller.installedInventoriesSummary["ECM100001~1234"] = {
                invid: "2" || '',
                model: "ECM100001~1234" || '',
                quantity_delta: -1,
                invsn: "1234" || '',
                "invtype": "part" || ''
            };
            controller.installedInventoriesSummary["ECM100001~2234"] = {
                invid: "2" || '',
                model: "ECM100001~2234" || '',
                quantity_delta: -1,
                invsn: "2234" || '',
                "invtype": "part" || ''
            };
            controller.installedInventoriesSummary["ECM100001~3234"] = {
                invid: "2" || '',
                model: "ECM100001~3234" || '',
                quantity_delta: -1,
                invsn: "3234" || '',
                "invtype": "part" || ''
            };
            controller.deinstalledInventoriesSummary["ECM100005~2345"] = {
                invid: "2" || '',
                model: "ECM100005~2345" || '',
                quantity_delta: -1,
                invsn: "2345" || '',
                "invtype": "part" || ''
            };
            let partModelConstructor = oj.Model.extend({
                idAttribute: 'part_item_number'
            });

            let resourcePartsCollection = new ojmodel.Collection(null, {
                model: partModelConstructor
            });
            let model1 = new ojmodel.Model({
                'id': '5',
                'quantity': 1,
                'part_item_number': 'ECM100001',
                'part_item_number_rev': 'ECM100001',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '1234',
                "invtype": 'part',
                "invid": 1
            });
            let model2 = new ojmodel.Model({
                'id': '6',
                'quantity': 1,
                'part_item_number': 'ECM100005~2345',
                'part_item_number_rev': 'ECM100005',
                'part_uom_code': 'ea',
                'part_disposition_code': 'M',
                "invsn": '2345',
                "invtype": 'part',
                "invsn": "2345",
                "invid": 2
            });
            resourcePartsCollection.add(model1);
            resourcePartsCollection.add(model2);
            controller.resourcePartsCollection = resourcePartsCollection;
            controller.customerPartsCollection = resourcePartsCollection;
            controller.returnedPartsCollection = resourcePartsCollection;
            controller.usedPartsCollection = resourcePartsCollection;
            controller.createdDeinstalledPartsCollection = resourcePartsCollection;
            expect(controller._generatePartsActions()).equals();

        }));

        test('_showErrorAlert is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            let data = {
                'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                    'type': 'TYPE_ENTITY_ACTION',
                    'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED',
                    'entity': 'activity',
                    'entityId': '4232516'
                }]
            };
            try {
                controller._showErrorAlert(data);
            } catch (e) {

            }

            data = {
                'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                    'type': 'TYPE_ENTITY_ACTION',
                    'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED',
                    'entity': 'activity',
                    'entityId': '4232516'
                }, {
                    'type': 'TYPE_ENTITY_ACTION1',
                    'code': 'CODE_ACTION_INVENTORY_ACTIVITY_STATUS_INVALID',
                    'entity': 'activity',
                    'entityId': '4232517'
                }]
            };
            try {
                controller._showErrorAlert(data);
            } catch (e) {

            }

            data = {
                'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': []
            };
            controller._showErrorAlert(data);
            data = {
                'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                    'type': 'TYPE_ENTITY_ACTION',
                    'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED1',
                    'entity': 'activity',
                    'entityId': '4232516'
                }]
            };
            try {
                controller._showErrorAlert(data);
            } catch (e) {

            }
        }));

        test('_addInstallInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection();
            expect(controller._addInstallInventoryAction({
                'invid': '21475998',
                'inv_aid': '4232743',
                'invsn': '',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_addInstallUpdateInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryUpdateActionsCollection = new oj.Collection();
            expect(controller._addInstallUpdateInventoryAction({
                'invid': '21475998',
                'inv_aid': '4232743',
                'invsn': '',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_addDeinstallInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection();
            expect(controller._addDeinstallInventoryAction({
                'invid': '21475998',
                'inv_pid': '4232743',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_addUndoInstallInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection();
            expect(controller._addUndoInstallInventoryAction({
                'invid': '21475998',
                'invsn': '4232743',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_addUndoDeinstallInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection();
            expect(controller._addUndoDeinstallInventoryAction({
                'invid': '21475998',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_addUndoDeinstallUpdateInventoryAction is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryUpdateActionsCollection = new oj.Collection();
            expect(controller._addUndoDeinstallUpdateInventoryAction({
                'invid': '21475998',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            })).equals();
        }));

        test('_getOfscInventoryListUpdates is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection({
                'action': 'update',
                'invid': '123455',
                'inv_aid': '4353454',
                'invtype': 'part_sn',
                'inv_pid': '745884',
                'invsn': 'MF50004',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            });
            expect(controller._getOfscInventoryListUpdates()).to.have.property('123455');
        }));

        test('_getOfscPartsInventoryActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryActionsCollection = new oj.Collection({
                'action': 'install',
                'invid': '123455',
                'inv_aid': '4353454',
                'invtype': 'part_sn',
                'inv_pid': '745884',
                'invsn': 'MF50004',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            });
            expect(controller._getOfscPartsInventoryActions()).to.have.lengthOf(1);
        }));

        test('_getOfscPartsInventoryUpdateActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.partsInventoryUpdateActionsCollection = new oj.Collection({
                'action': 'install',
                'invid': '123455',
                'inv_aid': '4353454',
                'invtype': 'part_sn',
                'inv_pid': '745884',
                'invsn': 'MF50004',
                'quantity': '3',
                'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
            });
            expect(controller._getOfscPartsInventoryUpdateActions()).to.have.lengthOf(1);
        }));

        test('_getOfscCreateLaborInventoryActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.laborItems = ko.observableArray([{
                'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '30', 'currencyKey': 'USD'
            }, {'id': '2', 'activityId': 'Expense', 'itemId': 'FS Parking', 'amount': '20', 'currencyKey': 'USD'}]);

            controller.resource = new oj.Model({
                id: 12345 || '', name: 'Anton' || ''
            });
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: '234234'
            });

            expect(controller._getOfscCreateLaborInventoryActions()).to.have.lengthOf(2);
        }));

        test('_getOfscCreateExpenseInventoryActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.expenseItems = ko.observableArray([{
                'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
            }, {'id': '2', 'activityId': 'Expense', 'itemId': 'FS Parking', 'amount': '50', 'currencyKey': 'USD'}]);
            controller.resource = new oj.Model({
                id: 12345 || '', name: 'Anton' || ''
            });
            controller.ofscActivityModel = new (oj.Model.extend({
                idAttribute: 'aid'
            }))({
                aid: '234234'
            });
            expect(controller._getOfscCreateExpenseInventoryActions()).to.have.lengthOf(2);
        }));

        test('_getOfscDeleteInventoryActions is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.deleteInventoryList = [{
                'id': '2',
                'activityId': 'drp',
                'itemId': 'Diagnose & Repair',
                'startTime': 'T00:00:00',
                'endTime': 'T01:00:00',
                'recordId': '2'
            }];
            const INVENTORY_ENTITY_NAME = "inventory";
            const DELETE_ACTION_NAME = 'delete';
            controller.mapInventoryToDeleteAction = function (inventory) {
                return {
                    entity: INVENTORY_ENTITY_NAME, action: DELETE_ACTION_NAME, invid: inventory.recordId
                }
            }
            expect(controller._getOfscDeleteInventoryActions()).to.have.lengthOf(1);
        }));

        test('_verifyProperties is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            let requiredJson = "{  \"properties\": [{    \n" + "      \"label\": \"part_uom_code\",\n" + "      \"create\": true,\n" + "      \"entity\": \"inventory\",\n" + "      \"type\": \"enum\",\n" + "      \"gui\": \"combobox\",\n" + "      \"duplicate\": 0,\n" + "      \"line_count\": 0,\n" + "      \"name\": {\n" + "        \"lang\": \"en\",\n" + "        \"active\": 0,\n" + "        \"val\": \"Part Unit of Measure\"\n" + "      },\n" + "      \"lookups\": [\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"ea\",\n" + "          \"index\": \"ea\"\n" + "        },\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"m\",\n" + "          \"index\": \"m\"\n" + "        },\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"in\",\n" + "          \"index\": \"in\"\n" + "        }\n" + "      ]\n" + "    }]}"
            const controller = new TestControllerViewModel();
            expect(controller._verifyProperties(requiredJson, attributeDesc)).equals("The following property must be configured: part_uom_code.")


        }));

        test('init load is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            controller._attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";

            controller.ofscConnector.sendMessage = function () {
                return new Promise((resolve, reject) => {
                    return resolve({
                        'method': 'init', 'attributeDescription': attributeDesc, 'data': {
                            'actions': [{
                                entity: 'inventory',
                                action: 'create',
                                invpool: 'install',
                                invtype: 'labor',
                                inv_aid: '4232516'
                            }], 'Activity': {'aid': '4232516'}, inventory: {}
                        }
                    });
                });
            }
            let pluginPromise = Promise.resolve();
            sinon.stub(controller._pluginApiTransport, "load")
                .returns(pluginPromise);
            controller.load();
            expect(controller._pluginApiTransport).is.not.empty;
        }));

        test('load - open is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller.ofscConnector = new OfscConnector();
            // let attributeDesc = JSON.parse("{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n");
            let attributeDesc1 = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            let attributeDesc = JSON.parse(attributeDesc1);
            // let attributeDesc = JSON.parse("{ \n" + "    \"part_uom_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_uom_code\",\n" + "        \"title\": \"Part Unit of Measure\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\"ea\": {\"text\": \"ea\"  },\n" + "                  \"zzu\": {\"text\": \"ea\" },\n" + "                  \"in\": {\"text\": \"in\" },\n" + "                  \"m\": {\"text\": \"m\"}\n" + "                 }\n" + "        }\n" + "    }");
            controller.ofscConnector.sendMessage = function () {
                return new Promise((resolve, reject) => {
                    return resolve({
                        'method': 'open', 'attributeDescription': attributeDesc, 'data': {
                            'actions': [{
                                entity: 'inventory',
                                action: 'create',
                                invpool: 'install',
                                invtype: 'labor',
                                inv_aid: '4232516'
                            }], 'Activity': {'aid': '4232516'}, inventory: {}
                        }
                    });
                });
            }
            try {
                controller.load();
            } catch (e) {

            }

        }));

        test('load - open - flow 1 is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            // controller._pluginApiTransport = new OfscPluginApiTransport();

            let attributeDesc = "   { \"labor_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_service_activity\",\n" + "        \"title\": \"Labor Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"com\": {\n" + "                \"text\": \"Commute\"\n" + "            },\n" + "            \"drp\": {\n" + "                \"text\": \"Diagnose and Repair\"\n" + "            },\n" + "            \"Labor\": {\n" + "                \"text\": \"Labor\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_number\",\n" + "        \"title\": \"Labor Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"FS Overtime Labor\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"FS Overtime Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"FS Reg Labor\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"FS Regular Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel Time\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_desc\",\n" + "        \"title\": \"Labor Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"trv\": {\n" + "                \"text\": \"FS Tech Actual Travel\"\n" + "            },\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"Overtime Labor (Hours)\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"Overtime Labor Time\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"Regular Labor (Hours)\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"Regular Labor Time\",\n" + "                \"inactive\": true\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_service_activity\",\n" + "        \"title\": \"Expense Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"Expense\": {\n" + "                \"text\": \"Expense\"\n" + "            },\n" + "            \"msc\": {\n" + "                \"text\": \"Miscellaneous\"\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_number\",\n" + "        \"title\": \"Expense Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Toll\": {\n" + "                \"text\": \"FS Toll\"\n" + "            },\n" + "            \"prk\": {\n" + "                \"text\": \"Parking\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_desc\",\n" + "        \"title\": \"Expense Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"prk\": {\n" + "                \"text\": \"Parking Charges for Service\"\n" + "            },\n" + "            \"FS Toll\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges for Service\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_used\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_used\",\n" + "        \"title\": \"Activity (Used)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"IN\": {\n" + "                \"text\": \"Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Install\": {\n" + "                \"text\": \"Install\"\n" + "            },\n" + "            \"W_IN\": {\n" + "                \"text\": \"Warranty Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Install\": {\n" + "                \"text\": \"Warranty Install\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_returned\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_returned\",\n" + "        \"title\": \"Activity (returned)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"RET\": {\n" + "                \"text\": \"Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Return\": {\n" + "                \"text\": \"Return\"\n" + "            },\n" + "            \"W_RET\": {\n" + "                \"text\": \"Warranty Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Return\": {\n" + "                \"text\": \"Warranty Return\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_currency_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_currency_code\",\n" + "        \"title\": \"Expense Currency\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"USD\": {\n" + "                \"text\": \"$|US Dollars\"\n" + "            },\n" + "            \"GBP\": {\n" + "                \"text\": \"£|UK Pound\"\n" + "            },\n" + "            \"EUR\": {\n" + "                \"text\": \"€|Euro\"\n" + "            }\n" + "        }\n" + "    }\n" + "}";
            controller._attributeDescription = JSON.parse(attributeDesc);

            let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"provider\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"customer\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            let test = ko.observableArray();
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "trv" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            controller.openData = ko.observable(data);
            let pluginPromise = Promise.resolve();
            sinon.stub(controller._pluginApiTransport, "load")
                .returns(pluginPromise);
            sinon.stub(controller, "processLaborActivities")
                .returns(pluginPromise);
            sinon.stub(controller, "processExpenseActivities")
                .returns(pluginPromise);
            controller._pluginApiTransport._pluginApiMessage = {entity: 'activity'};

            try {
                controller.open();
            } catch (e) {

            }
        }));

        test('load - open - flow 2 is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();

            let attributeDesc = "   { \"labor_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_service_activity\",\n" + "        \"title\": \"Labor Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"com\": {\n" + "                \"text\": \"Commute\"\n" + "            },\n" + "            \"drp\": {\n" + "                \"text\": \"Diagnose and Repair\"\n" + "            },\n" + "            \"Labor\": {\n" + "                \"text\": \"Labor\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_number\",\n" + "        \"title\": \"Labor Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"FS Overtime Labor\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"FS Overtime Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"FS Reg Labor\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"FS Regular Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel Time\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_desc\",\n" + "        \"title\": \"Labor Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"trv\": {\n" + "                \"text\": \"FS Tech Actual Travel\"\n" + "            },\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"Overtime Labor (Hours)\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"Overtime Labor Time\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"Regular Labor (Hours)\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"Regular Labor Time\",\n" + "                \"inactive\": true\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_service_activity\",\n" + "        \"title\": \"Expense Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"Expense\": {\n" + "                \"text\": \"Expense\"\n" + "            },\n" + "            \"msc\": {\n" + "                \"text\": \"Miscellaneous\"\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_number\",\n" + "        \"title\": \"Expense Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Toll\": {\n" + "                \"text\": \"FS Toll\"\n" + "            },\n" + "            \"prk\": {\n" + "                \"text\": \"Parking\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_desc\",\n" + "        \"title\": \"Expense Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"prk\": {\n" + "                \"text\": \"Parking Charges for Service\"\n" + "            },\n" + "            \"FS Toll\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges for Service\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_used\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_used\",\n" + "        \"title\": \"Activity (Used)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"IN\": {\n" + "                \"text\": \"Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Install\": {\n" + "                \"text\": \"Install\"\n" + "            },\n" + "            \"W_IN\": {\n" + "                \"text\": \"Warranty Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Install\": {\n" + "                \"text\": \"Warranty Install\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_returned\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_returned\",\n" + "        \"title\": \"Activity (returned)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"RET\": {\n" + "                \"text\": \"Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Return\": {\n" + "                \"text\": \"Return\"\n" + "            },\n" + "            \"W_RET\": {\n" + "                \"text\": \"Warranty Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Return\": {\n" + "                \"text\": \"Warranty Return\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_currency_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_currency_code\",\n" + "        \"title\": \"Expense Currency\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"USD\": {\n" + "                \"text\": \"$|US Dollars\"\n" + "            },\n" + "            \"GBP\": {\n" + "                \"text\": \"£|UK Pound\"\n" + "            },\n" + "            \"EUR\": {\n" + "                \"text\": \"€|Euro\"\n" + "            }\n" + "        }\n" + "    }\n" + "}";
            controller._attributeDescription = JSON.parse(attributeDesc);

            let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"provider\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"customer\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
            let test = ko.observableArray();
            controller.expenseItemEnumCollection = new oj.Collection([{
                id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
            }]);
            controller.expenseActivityEnumCollection = new oj.Collection([{
                id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "trv" || ''
            }]);
            controller.expenseCurrencyEnumCollection = new oj.Collection([{
                id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
            }]);
            controller.openData = ko.observable(data);
            try {
                sinon.stub(controller, "processLaborActivities");
                controller.open();
            } catch (e) {

            }
        }));


        test('invokeTokens flow', async () => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                    this.errorAlertPopup = sinon.stub().resolves();
                }
            }
            const controller = new TestControllerViewModel();
            controller._pluginApiApps = {
                [Constants.KEY_OFS_API_APP]: { resourceUrl: 'ofs-url' },
                [Constants.KEY_OAUTH_USER_ASSERTION_APP]: { resourceUrl: 'fusion-url' }
            };
            controller.ofscConnector = {};
            await controller.invokeTokens();
        });

        test('closeDialog closes alertDialog, calls resolveAlertCallback, and terminates plugin', () => {
            const closeSpy = sinon.spy();
            const terminatePluginSpy = sinon.spy();

            // Stub the DOM element
            const dialogStub = { close: closeSpy };
            const getElementByIdStub = sinon.stub(document, 'getElementById');
            getElementByIdStub.withArgs('alertDialog').returns(dialogStub);

            // Define the class with the real method
            class TestControllerViewModel {
                constructor() {
                    this.resolveAlertCallback = sinon.spy();
                }

                closeDialog(event) {
                    document.getElementById("alertDialog").close();
                    if (this.resolveAlertCallback instanceof Function) {
                        this.resolveAlertCallback();
                    }
                }
            }

            const obj = new TestControllerViewModel();

            // Call the method under test
            obj.closeDialog();

            // Assertions
            expect(closeSpy.calledOnce).to.be.true;
            expect(obj.resolveAlertCallback.calledOnce).to.be.true;
            sinon.restore();
        });

        test('should call terminatePlugin inside closeDialog', () => {
            const closeSpy = sinon.spy();
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                    this.errorAlertPopup = sinon.spy();
                }
            }

            // Stub alertDialog
            const dialogStub = { close: closeSpy };
            sinon.stub(document, 'getElementById').returns(dialogStub);

            const viewModel = new TestControllerViewModel();
            viewModel.resolveAlertCallback = sinon.spy();

            viewModel.closeDialog();

            expect(closeSpy.calledOnce).to.be.true;
            expect(viewModel.resolveAlertCallback.calledOnce).to.be.true;

            sinon.restore();
        });

        test('invokeTokens runs full happy path', async function () {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                    this._pluginApiTransport = {
                        _initializeConnectors: sinon.stub(),
                        _fusionApiTransport: { _renewToken: sinon.stub().resolves() },
                        _ofsApiTransport: { _renewToken: sinon.stub().resolves() },
                        terminatePlugin: sinon.stub()
                    };
                    this.invokeDebriefDefaultOrg = sinon.stub();
                }
            }

            const controller = new TestControllerViewModel();

            await controller.invokeTokens();

            sinon.assert.calledOnce(controller._pluginApiTransport._initializeConnectors);
            sinon.assert.calledOnce(controller._pluginApiTransport._fusionApiTransport._renewToken);
            sinon.assert.calledOnce(controller._pluginApiTransport._ofsApiTransport._renewToken);
            sinon.assert.calledOnce(controller.invokeDebriefDefaultOrg);
            sinon.assert.notCalled(controller._pluginApiTransport.terminatePlugin);
        });

    });