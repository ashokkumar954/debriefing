/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([], () => {
    'use strict';

    class ActivityDataService {

        static get GET_ACTIVITY_BY_ID() {
            return 'rest/ofscCore/v1/activities/{activityId}';
        }

        static get GET_INSTALLED_INVENTORIES_ACTIVITY() {
            return 'rest/ofscCore/v1/activities/{activityId}/installedInventories';
        }

        static get GET_DEINSTALLED_INVENTORIES_ACTIVITY() {
            return 'rest/ofscCore/v1/activities/{activityId}/deinstalledInventories';
        }

        static get GET_RESOURCE_DETAILS() {
            return 'rest/ofscCore/v1/resources/{resourceId}';
        }

        static get GET_RESOURCE_ROLES() {
            return 'rest/ofscMetadata/v1/resourceTypes';
        }

        constructor(transport) {
            this._transport = transport;
        }

        async getActivityDetailsById(activityId) {
            let path = this.constructor.GET_ACTIVITY_BY_ID
                .replace(/{activityId}/g, activityId);
            return this._transport.request(path);
        }

        async getResourceRoles() {
            let path = this.constructor.GET_RESOURCE_ROLES;
            let response = await this._transport.request(path);
            return this.processResRoleResponse(response);
        }

        async getInstalledInventoriesFromActivity(activityId) {
            let path = this.constructor.GET_INSTALLED_INVENTORIES_ACTIVITY
                .replace(/{activityId}/g, activityId);

            const responseData = await this._transport.request(path);
            return responseData;
        }

        async getDeinstalledInventoriesFromActivity(activityId) {
            let path = this.constructor.GET_DEINSTALLED_INVENTORIES_ACTIVITY
                .replace(/{activityId}/g, activityId);
            return await this._transport.request(path);
        }

        async getResourceDetails(resourceId) {
            let path = this.constructor.GET_RESOURCE_DETAILS
                .replace(/{resourceId}/g, resourceId);
            return await this._transport.request(path);
        }

        processResRoleResponse(data) {
            const roleMap = data.items.map(item => ({
                label: item.label,
                role: item.role
            }));
            return roleMap;
        }
    }
    return ActivityDataService;
});