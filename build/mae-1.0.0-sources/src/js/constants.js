/*
** Oracle Field Service Plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
"use strict";
define([
], (
) => {

    class Constants {

        static get DEVICE_TYPE_DESKTOP() {
            return "desktop";
        }
        static get DEVICE_TYPE_MOBILE() {
            return "mobile";
        }

        static get INVENTORY_ENTITY_NAME() {
            return "inventory";
        }

        static get INVENTORY_TYPE_PART() {
            return "part";
        }

        static get INVENTORY_TYPE_PART_SN() {
            return "part_sn";
        }

        static get DELETE_ACTION_NAME() {
            return "delete";
        }

        static get CRITICAL_ERROR(){
            return "Critical Error";
        }

        static get PROPERTY_MUST_BE_CONFIGURED(){
            return "The following property must be configured: ";
        }

        static get PROPERTIES_MUST_BE_CONFIGURED(){
            return "The following properties must be configured: ";
        }

        static get UNABLE_TO_START(){
            return "Unable to start application: ";
        }

        static get ERR_AUTHENTICATION() {
            return 'We encountered an issue while trying to fetch the authorization token. Please try again later.';
        }

        static get ERR_SERVER() {
            return 'Server returned an error. HTTP Status: ';
        }

        static get HASH_SYMBOL() {
            return "#";
        }

        static get ACTION_CLOSE() {
            return "close";
        }

        static get CALL_PROC (){
            return 'callProcedure';
        };

    }

    return Constants;
});
