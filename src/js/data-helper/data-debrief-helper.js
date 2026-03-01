/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define(['./service-debrief-helper'],
    (ServiceDebriefHelper) => {
        class DataDebriefHelper {
            static getStrategy(woType, fusionApiTransport, ofsApiTransport) {
                switch (woType) {
                    case 'serviceWO':
                        return new ServiceDebriefHelper(fusionApiTransport, ofsApiTransport);
                    default:
                        throw new Error("Unsupported WO type");
                }
            }

        }

        return DataDebriefHelper;
    });