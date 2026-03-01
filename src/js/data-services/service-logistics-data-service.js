/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
    '../services/fusion-rest-api-transport',
    '../models/debrief-model',
    '../storage/persistent-storage',
    '../constants'
], (FusionRestApiTransport,
    DebriefModelBuilder,
    PersistentStorage,
    Constants) => {
    'use strict';

    class ServiceLogisticsDataService {

        static get FETCH_CUSTOMER_WORKORDERS() {
            return 'crmRestApi/resources/latest/customerWorkOrders?q=WoId={woId}';
        }

        static get FETCH_CUSTOMER_WORKORDERS_BY_WO_NUM() {
            return 'crmRestApi/resources/latest/customerWorkOrders?q=WoNumber={woNumber}';
        }

        static get FETCH_SERVICE_REQUESTS() {
            return 'crmRestApi/resources/latest/serviceRequests?q=SrId={srId}';
        }

        static get FETCH_OR_CREATE_DEBRIEF_HEADER() {
            return 'fscmRestApi/resources/latest/debriefs';
        }

        static get GET_DEFAULT_ORG_ID() {
            return 'fscmRestApi/resources/latest/profileValues/INV_DEFAULT_ORG_ID';
        }

        static get FETCH_UOM_OF_LABOR_BILLING_ITEM() {
            return 'fscmRestApi/resources/latest/itemsV2?q=OrganizationId={orgId};ItemNumber={labor_item_number}';
        }

        static get CREATE_RESERVATION() {
            return 'fscmRestApi/resources/latest/inventoryReservations';
        }

        static get GET_STOCKING_LOCATION() {
            return 'fscmRestApi/resources/latest/stockingLocations/{stockLocationId}';
        }

        static get GET_TECH_SUB_INVS() {
            return 'fscmRestApi/resources/latest/technicianSubinventories?q=PartyId={resourceId};ConditionCode=GOOD;DefaultFlag=true;EnabledFlag=true';
        }

        static get GET_RESERVATION() {
            return 'fscmRestApi/resources/11.13.18.05/inventoryReservations?q=OrganizationId={orgId};' +
                'ItemNumber={itemNumber};SubinventoryCode={subInvCode};DemandSourceName={debriefHeaderId}&expand=all&onlyData=true';
        }

        constructor(transport) {
            this._transport = transport;
            this.debriefHeaderId = 0;
        }

        async loadDefaultOrg() {
            let orgIdPromise = '';
            try{
                orgIdPromise = await this.getOrgId();
                PersistentStorage.saveData(Constants.DEFAULT_ORG_ID, orgIdPromise);
            } catch (error) {
                console.error("Error fetching Org Id", error);
            }
        }

        getCustomerWorkOrders(woId, resourceId) {
            return new Promise((resolve, reject) => {
                const url = this.constructor.FETCH_CUSTOMER_WORKORDERS
                    .replace(/{woId}/g, woId);
                return this._transport.request(url)
                    .then((responseData) => {
                        let workOrderResponse = this.processWorkOrderResponse(responseData, resourceId);
                        resolve(workOrderResponse);
                    }).catch(reject);
            });
        }

        getCustomerWorkOrderByWONUmber(woNumber) {
            return new Promise((resolve, reject) => {
                const url = this.constructor.FETCH_CUSTOMER_WORKORDERS_BY_WO_NUM
                    .replace(/{woNumber}/g, woNumber);
                return this._transport.request(url)
                    .then((responseData) => {
                        let workOrderResponse = this.processWOResponse(responseData);
                        resolve(workOrderResponse);
                    }).catch(reject);
            });
        }

        getServiceRequests(srId, debriefModel) {
            return new Promise((resolve, reject) => {
                const url = this.constructor.FETCH_SERVICE_REQUESTS
                    .replace(/{srId}/g, srId);
                return this._transport.request(url)
                    .then((responseData) => {
                        let serviceRequestResponse = this.processServiceRequestResponse(debriefModel, responseData);
                        resolve(serviceRequestResponse);
                    }).catch(reject);
            });
        }
        getDebriefHeader(woId) {
            return new Promise((resolve, reject) => {
                const url = this.constructor.FETCH_OR_CREATE_DEBRIEF_HEADER;
                let getParams = {
                    q: "ParentEntityId=" + woId
                }
                return this._transport.request(url, this._transport.constructor.HTTP_METHOD_GET, getParams)
                    .then((responseData) => {
                        let debriefResponse = this.processDebriefResponse(responseData);
                        resolve(debriefResponse);
                    }).catch(reject);
            });
        }

        async createDebriefHeader(svcWorkOrderId, resourceId) {
            try{
                if (!svcWorkOrderId) return null;
                let debriefHeaderId = await this.getDebriefHeader(svcWorkOrderId);
                this.debriefHeaderId = debriefHeaderId;
                if (debriefHeaderId) return debriefHeaderId;

                const customerWO = await this.getCustomerWorkOrders(svcWorkOrderId, resourceId);
                if (!customerWO.srId) {
                    console.debug("The Work Order does not have a SR Id");
                    return;
                }
                const serviceRequestWO = await this.getServiceRequests(customerWO.srId, customerWO);
                const payload = this._createDebriefPayload(serviceRequestWO);
                const debriefId = await this.invokeDebrief(payload);
                this.debriefHeaderId = debriefId;
                return debriefId;
            } catch(error) {
                console.error("Error creating debrief", error);
                throw error;
            }
        }

        async createDebriefLineItems(svcWorkOrderId, resourceId, lineItemsArray) {
            try{
                const customerWO = await this.getCustomerWorkOrders(svcWorkOrderId, resourceId);
                if (!customerWO.srId) {
                    console.debug("The Work Order does not have a SR Id");
                    return;
                }
                const serviceRequestWO = await this.getServiceRequests(customerWO.srId, customerWO);
                const payload = this._createDebriefPayload(serviceRequestWO, lineItemsArray, this.debriefHeaderId );
                const debriefId = await this.invokeDebrief(payload);
                return debriefId;
            } catch(error) {
                console.error("Error creating debrief line items", error);
                throw error;
            }
        }

        async invokeDebrief(payload) {
            return new Promise((resolve, reject) => {
                return this._transport.request(this.constructor.FETCH_OR_CREATE_DEBRIEF_HEADER,
                    this._transport.constructor.HTTP_METHOD_POST,
                    null, payload, this._getContentType())
                    .then((responseData) => {
                        let debriefResponse = this.processDebriefResponseAfterCreate(responseData);
                        resolve(debriefResponse);
                    }).catch(reject);
            });
        }

        async getOrgId() {
            try {
                const response = await this._transport.request(this.constructor.GET_DEFAULT_ORG_ID);
                return response && response.ProfileOptionValue? response.ProfileOptionValue: '';
            } catch (error) {
                console.error("Error fetching Org Id", error);
                throw error;
            }
        }

        async getStockingLocations(stockLocationId) {
            try{
                let path = this.constructor.GET_STOCKING_LOCATION.replace(/{stockLocationId}/g, stockLocationId)
                let response = await this._transport.request(path);
                return this.processStockingLocResponse(response);
            } catch(error) {
                console.error("Error fetching Stocking location for Truck resources")
            };
        }

        async getTechSubInventories(resourceId) {
            try {
                let path = this.constructor.GET_TECH_SUB_INVS.replace(/{resourceId}/g, resourceId)
                let response = await this._transport.request(path)
                return this.processTechSubInvResponse(response);
            } catch (error) {
                console.error("Error fetching subinventory details for a Tech resource");
            }
            ;
        }

        async createExpenseItemsPayload(expenses) {
            const promises = expenses.map(async (expenseItem) => {
                try{
                    return await this._createExpensePayload(expenseItem);
                } catch (err) {
                    console.error("Error creating expense item payload", expenseItem, err);
                    return null;
                }
            });
            const results = await Promise.all(promises);
            return results.filter(payload => payload !== null);
        }

        async createLaborItemsPayload(laborItems) {
            const promises = laborItems.map(async(laborItem) => {
                try {
                    const uomCode = await this.getUOMCode(laborItem.labor_item_number);
                    return await this._createLaborPayload(laborItem, uomCode);
                } catch (err) {
                    console.error("Error creating labor item", laborItem, err);
                    return null;
                }
            });
            const results = await Promise.all(promises);
            return results.filter(payload => payload !== null);
        }

        async createUsedPartsPayload(usedPartsCollection, roles) {
            const promises = usedPartsCollection.map(async(parts) => {
               let resType = roles.filter(item => item.label === parts.resourceType).map(item => item.role)
                try {
                    const resp = await this._getInventoryInfo(resType[0], parts.resourceId);
                    const {organizationId, subinventory} = resp || {};
                    const reservationId = await this._getOrCreateReservationId(organizationId, subinventory, parts);
                    return await this._createAddPartsPayload(parts, organizationId, subinventory, reservationId);
                } catch (err) {
                    console.error("Error creating part items", parts, err);
                    return null;
                }
            })
            const results = await Promise.all(promises);
            return results.filter(payload => payload !== null);
        }

        async _getOrCreateReservationId(organizationId, subinventory, parts) {
            const existing = await this.getExistingReservation(organizationId, subinventory, parts, this.debriefHeaderId);
            if (existing && existing.ReservationId) {
                return existing.ReservationId;
            }
            const created = await this.createReservation(organizationId, subinventory, parts, this.debriefHeaderId);
            return (created && created.ReservationId)? created.ReservationId: 0;
        }

        async _getInventoryInfo(resType, resourceId) {
            if (resType === 'field_resource') {
                return await this.getTechSubInventories(resourceId);
            } else if (resType === 'vehicle') {
                return await this.getStockingLocations(resourceId);
            }
            return null;
        }

        async getExistingReservation(organizationId, subinventory, parts, debriefHeaderId) {
            return new Promise((resolve, reject) => {
                let url = this.constructor.GET_RESERVATION
                    .replace(/{orgId}/g, organizationId)
                    .replace(/{itemNumber}/g, parts.part_item_number)
                    .replace(/{debriefHeaderId}/g, debriefHeaderId)
                    .replace(/{subInvCode}/g, subinventory);
                return this._transport.request(url,
                    this._transport.constructor.HTTP_METHOD_GET)
                    .then((responseData) => {
                        let reservationResponse = this.processReservationResponse(responseData, parts.serialNumber);
                        resolve(reservationResponse);
                    }).catch(reject);
            });
        }

        async createReturnPartsPayload(returnedPartsCollection) {
            if (!returnedPartsCollection || !Array.isArray(returnedPartsCollection.items) || returnedPartsCollection.items.length === 0) {
                console.log("No returned parts to process.");
                return [];
            }
            const promises = returnedPartsCollection.items.map(async(parts) => {
                try {
                    const orgId = await this._extractOrgId();
                    return await this._createReturnPartsPayload(parts, orgId);
                } catch (err) {
                    console.error("Unexpected error while posting returned parts", err);
                    return null;
                }
            })
            const results = await Promise.all(promises);
            return results.filter(payload => payload !== null);
        }


        async getUOMCode(laborItemNumber) {
            let orgId = await this._extractOrgId();
            let uomCode = '';
            const url = this.constructor.FETCH_UOM_OF_LABOR_BILLING_ITEM
                .replace(/{orgId}/g, orgId)
                .replace(/{labor_item_number}/g, `'${laborItemNumber}'`);
            let result = await this._transport.request(url);
            let uomValue = result.items[0].PrimaryUOMValue;
            let linksList = result.items[0].links;
            let uomURL = linksList.filter(item => item.name === 'LovPrimaryUOMValue')
            let uomCodeResp = await this._transport.request(uomURL[0].href);
            uomCode = JSON.parse(uomCodeResp).items.filter(resp => resp.UnitOfMeasure === uomValue);
            return uomCode.length ? uomCode[0].UomCode : null;
        }

        async createReservation(orgId, subInvCode, usedPartsCollection, debriefHeaderId) {
            return await this._transport.request(this.constructor.CREATE_RESERVATION, this._transport.constructor.HTTP_METHOD_POST,
                null, this._createReservationPayload(usedPartsCollection, orgId, subInvCode, debriefHeaderId), this._getContentType())

        }

        _createDebriefPayload(debriefHeader, lineItemsArray, debriefHeaderId) {
            let payload = {
                BUOrgId: debriefHeader.buOrgId,
                PartyId: debriefHeader.partyId,
                ProductItemId: debriefHeader.productItemId,
                AssetId: debriefHeader.assetId,
                DebriefNumber: debriefHeader.woNumber,
                ParentEntityName: debriefHeader.woNumber,
                TechnicianPartyId: debriefHeader.technicianPartyId,
                ParentEntityId: debriefHeader.woId,
                ProductSerialNumber: debriefHeader.productSerialNumber,
                ParentEntityCode: 'EC_WO',
                DebriefStatusCode: 'NEW'
            };
            if (lineItemsArray && lineItemsArray.length > 0) {
                payload.lines = lineItemsArray
            }
            if (debriefHeaderId) {
                payload.DebriefHeaderId = debriefHeaderId;
            }
            return JSON.stringify(payload);
        }

        _createReservationPayload(usedPartsCollection, orgId, subInvCode, debriefHeaderId) {
            const payload = {
                OrganizationId: orgId,
                ItemNumber: usedPartsCollection.part_item_number,
                DemandSourceTypeId: 13,
                DemandSourceName: debriefHeaderId,
                SupplySourceTypeId: 13,
                ReservationQuantity: usedPartsCollection.quantity,
                ReservationUOMCode: usedPartsCollection.part_uom_code,
                SubinventoryCode: subInvCode
            };
            if (usedPartsCollection.inventoryType === 'part_sn' && usedPartsCollection.serialNumber) {
                payload.serials = [{
                    SerialNumber: usedPartsCollection.serialNumber
                }];
            }
            return JSON.stringify(payload);
        }

        async _createAddPartsPayload (parts, orgId, subInvCode, reservationId) {
            const payload = {
                InventoryItemNumber : parts.part_item_number,
                ItemRevision : parts.part_item_revision,
                LineType : "M",
                OrganizationId : orgId,
                Quantity : parts.quantity,
                ReservationId : reservationId,
                SerialNumber : parts.serialNumber,
                ServiceActivityCode : parts.part_service_activity_used,
                SubinventoryCode : subInvCode,
                UOMCode : parts.part_uom_code
            };
            return payload;
        }

        async _createReturnPartsPayload (parts, orgId) {

            const payload = {
                InventoryItemNumber : this.extractPartItemNumber(parts.part_item_number),
                LineStatusCode : "NEW",
                LineType : "M",
                OrganizationId : orgId,
                Quantity : parts.quantity,
                SerialNumber : parts.serialNumber,
                ServiceActivityCode : parts.part_service_activity_returned,
                UOMCode : parts.part_uom_code
            };
            return payload;
        }

        async _createExpensePayload (exp) {
            const payload = {
                CurrencyCode : exp.expense_currency_code,
                ExpenseAmount : exp.expense_amount,
                InventoryItemNumber :  exp.expense_item_number,
                LineStatusCode : "NEW",
                LineType : "E",
                ServiceActivityCode : exp.expense_service_activity,
                UOMCode : exp.expense_currency_code
            };
            return payload;
        }

        async _createLaborPayload (laborItem, uomCode) {
            const payload = {
                InventoryItemNumber : laborItem.labor_item_number,
                LaborEndDate : laborItem.labor_end_time,
                LaborStartDate : laborItem.labor_start_time,
                LineStatusCode : 'NEW',
                LineType : 'L',
                Quantity : laborItem.quantity,
                ServiceActivityCode : laborItem.labor_service_activity,
                UOMCode : uomCode
            };
            return payload;
        }

        processDebriefResponse(debriefResponse){
            return (debriefResponse && debriefResponse.items[0]
                && debriefResponse.items[0].DebriefHeaderId > 0) ? debriefResponse.items[0].DebriefHeaderId  : null;
        }

        processDebriefResponseAfterCreate(debriefResponse){
            return (debriefResponse && debriefResponse.DebriefHeaderId > 0) ? debriefResponse.DebriefHeaderId  : null;
        }

        processReservationResponse(resResponse, serialNumber) {
            let element;
            if(serialNumber) {
                element = resResponse.items.find((item) => item.serials.some(serial => serial.SerialNumber === serialNumber))
            } else {
                element = resResponse.items[0] ? (resResponse.items[0]): "";
            }
            return element;
        }

        processWorkOrderResponse(workOrderResponse, resourceId) {
            let element = workOrderResponse.items[0] ? (workOrderResponse.items[0]): "";
            let updateddebriefHeader = new DebriefModelBuilder()
                .withWoNumber(element.WoNumber)
                .withWoId(element.WoId)
                .withProductSerialNumber(element.IBAssetSerialNumber)
                .withSrId(element.SrId)
                .withTechnicianPartyId(resourceId)
                .build();
            return updateddebriefHeader;

        }

        processWOResponse(workOrderResponse) {
            let element = workOrderResponse &&
                                        workOrderResponse.items && workOrderResponse.items[0] ? (workOrderResponse.items[0]): "";
            return element.WoId? element.WoId: '';

        }

        processServiceRequestResponse(debriefHeader, serviceRequestResponse) {
            let element = serviceRequestResponse.items ? serviceRequestResponse.items[0] : '';
            let updateddebriefHeader = new DebriefModelBuilder()
                .fromObject(debriefHeader)
                .withBuOrgId(element.BUOrgId)
                .withProductItemId(element.InventoryItemId)
                .withAssetId(element.IBAssetId)
                .withPartyId(element.AccountPartyId)
                .build();
            return updateddebriefHeader;
        }

        processTechSubInvResponse(response) {
            if (!response || !Array.isArray(response.items) || response.items.length === 0) {
                console.warn("Invalid or empty subinventory response:", response);
                return null;
            }
            const { OrganizationId, Subinventory } = response.items[0];
            return {
                organizationId: OrganizationId || null,
                subinventory: Subinventory || null
            };
        }

        processStockingLocResponse(response) {
            if (!response) {
                console.warn("Invalid or empty subinventory response:", response);
                return null;
            }
            const { OrganizationId, Subinventory } = response;
            return {
                organizationId: OrganizationId || null,
                subinventory: Subinventory || null
            };
        }

        async _extractOrgId() {
            let orgId = PersistentStorage.loadData(Constants.DEFAULT_ORG_ID);
            if (!orgId || (typeof orgId === 'object' && Object.keys(orgId).length === 0)) {
                orgId = await this.getOrgId();
            }
            return orgId;
        }

        _getContentType() {
            return {'Content-Type': 'application/json', 'Accept': 'application/json', 'REST-Framework-Version': 8, 'Upsert-Mode': true};
        }

        extractPartItemNumber(partItemNumber) {
            return partItemNumber.includes('~')
                ? partItemNumber.split('~')[0]
                : partItemNumber;
        }

    }
    return ServiceLogisticsDataService;
});