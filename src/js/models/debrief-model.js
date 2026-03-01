/*
** Oracle Field Service Asset Details plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
"use strict";
define([], () => {

    class DebriefModelBuilder {

        constructor() {
            this.woNumber = null;
            this.woId = null;
            this.srId = null;
            this.buOrgId = null;
            this.partyId = null;
            this.productItemId = null;
            this.assetId = null;
            this.purchaseOrder = null;
            this.debriefNumber = null;
            this.parentEntityName = null;
            this.technicianPartyId = null;
            this.parentEntityId = null;
            this.productSerialNumber = null;
            this.defaultInvOrgId = null;
        }

        withWoNumber(woNumber){
            this.woNumber = woNumber;
            return this;
        }

        withWoId(woId){
            this.woId = woId;
            return this;
        }

        withSrId(srId){
            this.srId = srId;
            return this;
        }
        withBuOrgId(buOrgId) {
            this.buOrgId = buOrgId;
            return this;
        }

        withPartyId(partyId) {
            this.partyId = partyId;
            return this;
        }

        withProductItemId(productItemId) {
            this.productItemId = productItemId;
            return this;
        }
        withAssetId(assetId) {
            this.assetId = assetId;
            return this;
        }

        withDebriefNumber(debriefNumber) {
            this.debriefNumber = debriefNumber;
            return this;
        }

        withParentEntityName(parentEntityName) {
            this.parentEntityName = parentEntityName;
            return this;
        }

        withTechnicianPartyId(technicianPartyId) {
            this.technicianPartyId = technicianPartyId;
            return this;
        }

        withParentEntityId(parentEntityId) {
            this.parentEntityId = parentEntityId;
            return this;
        }

        withProductSerialNumber(productSerialNumber) {
            this.productSerialNumber = productSerialNumber;
            return this;
        }

        fromObject(obj) {
            this.woId = obj.woId;
            this.woNumber = obj.woNumber;
            this.srId = obj.srId;
            this.buOrgId = obj.buOrgId;
            this.partyId = obj.partyId;
            this.productItemId = obj.productItemId;
            this.assetId = obj.assetId;
            this.purchaseOrder = obj.purchaseOrder;
            this.debriefNumber = obj.debriefNumber;
            this.parentEntityName = obj.parentEntityName;
            this.technicianPartyId = obj.technicianPartyId;
            this.parentEntityId = obj.parentEntityId;
            this.productSerialNumber = obj.productSerialNumber;
            this.defaultInvOrgId = obj.defaultInvOrgId;
            return this;
        }

        build() {
            let returnObj = {
                woId : this.woId,
                woNumber : this.woNumber,
                srId : this.srId,
                buOrgId : this.buOrgId,
                partyId : this.partyId,
                productItemId : this.productItemId,
                purchaseOrder : this.purchaseOrder,
                debriefNumber : this.debriefNumber,
                parentEntityName : this.parentEntityName,
                technicianPartyId : this.technicianPartyId,
                parentEntityId : this.parentEntityId,
                productSerialNumber : this.productSerialNumber,
                defaultInvOrgId : this.defaultInvOrgId,
            }
            // Object.freeze(returnObj);
            return returnObj;
        }

    }

    return DebriefModelBuilder;
});
