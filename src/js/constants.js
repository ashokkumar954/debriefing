/*
** Oracle Field Service Debrief plugin
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

        static get INVENTORY_TYPE_LABOR() {
            return "labor";
        }

        static get INVENTORY_TYPE_EXPENSE() {
            return "expense";
        }

        static get DELETE_ACTION_NAME() {
            return "delete";
        }

        static get STARTED() {
            return 'started';
        }

        static get ACTIVITY() {
            return 'activity';
        }

        static get DEFAULT_LABOR_ACTIVITY_SERVICE() {
            return 'Labor';
        }

        static get APPLICATION_SCOPE_FUSION_SERVICE() {
            return 'urn:opc:resource:faaas:fa:instanceurn:opc:resource:consumer::all';
        }

        static get APPLICATION_SCOPE_FIELD_SERVICE() {
            return 'urn:opc:resource:fusion:instance:field-service-common/use';
        }

        static get APP_TOKEN_ERROR_MESSAGE() {
            return "We encountered an issue while trying to fetch the authorization token. Please try again later."
        }

        static get APP_CONFIG_ERROR_MESSAGE() {
            return "Access to this page is not yet available. Please contact your system administrator to configure the application on the Debrief Activate screen."
        }

        static get ACTIVITY_START_MESSAGE(){
            return "The activity must be started";
        }

        static get ACTIVITY_NOT_PAST_MESSAGE(){
            return "The activity shouldn\'t be in the past";
        }

        static get CRITICAL_ERROR(){
            return "Critical Error";
        }

        static get ACCESS_PENDING(){
            return "Access Pending";
        }

        static get ACTIVATE_QUEUE_MESSAGE(){
            return "The queue must be activated and the activity must be started. The plugin will be terminated.";
        }

        static get OPEN_FROM_ACTIVITY_MESSAGE(){
            return "The plugin should be opened from an activity page. The plugin will be terminated."
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
        static get UNABLE_TO_UNDO_DEINSTALL_MESSAGE(){
            return "Unable to undo deinstall of inventory, part_item_number_rev = "
        }

        static get UNABLE_TO_LOCATE_PART_MESSAGE(){
            return "Unable to locate customer part, part_item_number_rev = ";
        }

        static get UNABLE_TO_INSTALL_INV_MESSAGE(){
            return "Unable to undo install of inventory, part_item_number_rev = ";
        }

        static get UNABLE_TO_LOCATE_RESOURCE_PART_MESSAGE(){
            return "Unable to locate resource part, part_item_number_rev = ";
        }

        static get HASH_SYMBOL() {
            return "#";
        }

        static get INSTALL_POOL() {
            return "install";
        }

        static get QUANTITY() {
            return "quantity";
        }

        static get INV_ID() {
            return "invid";
        }

        static get INV_TYPE() {
            return "invtype";
        }

        static get ACT_ID() {
            return "aid";
        }

        static get ACTION_CLOSE() {
            return "close";
        }

        static get ACTION_SLEEP() {
            return "sleep";
        }

        static get ACTION_UPDATE() {
            return "update";
        }

        static get START_TIME() {
            return "startTime";
        }

        static get END_TIME() {
            return "endTime";
        }

        static get TRAVEL_TIME() {
            return "travelTime";
        }

        static get RES_CURRENT_TIME() {
            return "resourceCurrentTime";
        }

        static get DURATION() {
            return "duration";
        }

        static get LABOR_ITEM() {
            return "laborItemNumberForRegLabor";
        }

        static get TRAVEL_ITEM() {
            return "laborItemNumberForTravel";
        }

        static get HOURS() {
            return "Hours";
        }

        static get HOUR() {
            return "Hour";
        }

        static get MINUTES() {
            return "Minutes";
        }

        static get MINUTE() {
            return "Minute";
        }

        static get CALL_PROC (){
            return 'callProcedure';
        };

        /**
         * Returns the label for the OFS End-point Secure Parameter.
         *
         * @returns {string}
         * @constructor
         */
        static get KEY_OAUTH_USER_ASSERTION_APP() {
            return 'fusionOAuthUserAssertionApplication'
        }

        static get KEY_OFS_API_APP() {
            return 'ofsApiApplication'
        }

        static get APPLICATIONS (){
            return 'debriefing_appConfig';
        }

        static get GET_TOKEN() {
            return 'obtainToken';
        }

        static get GET_TOKEN_WITH_SCOPE() {
            return 'obtainTokenByScope';
        }

        static get FUSION_ENVIRONMENT (){
            return 'debriefing_faEnv';
        }

        static get DEBRIEF_ACTIVITY_LIST() {
            return 'debriefActivityList';
        }

        static get DEBRIEF_META_DATA_CACHE() {
            return 'debriefMetaDataCache';
        }

        static get DEFAULT_ORG_ID() {
            return 'defaultOrgId';
        }

        static get ROLES_LIST() {
            return 'rolesList';
        }

    }

    return Constants;
});