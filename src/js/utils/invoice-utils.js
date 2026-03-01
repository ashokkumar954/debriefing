/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
        'knockout',
        '../utils/labor-time-utils',
        "ojs/ojresponsiveutils",
        "ojs/ojresponsiveknockoututils",
        "constants"],
    (ko,
     LaborTimeUtils,
     ResponsiveUtils,
     ResponsiveKnockoutUtils,
     Constants) => {

        class InvoiceUtils {

            constructor(){
                this._laborTimeUtils = new LaborTimeUtils();
            }

            detectDevice(){
                this.smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_DOWN);
                this.isSmallScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(this.smQuery);
                return this.determineDeviceType(this.isSmallScreen());
            }

            determineDeviceType(isSmallScreen) {
                return isSmallScreen ? Constants.DEVICE_TYPE_MOBILE : Constants.DEVICE_TYPE_DESKTOP;
            }

            _calculateDuration(converter, startTime, endTime){
                return this._laborTimeUtils._calculateDuration(converter, startTime, endTime);
            }

            _formatDuration(overallDuration){
                return this._laborTimeUtils._formatDuration(overallDuration);
            }

        }
        return InvoiceUtils;
    });