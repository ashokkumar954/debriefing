/*
** Oracle Field Service BHM - Bulk Health Metrics plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
'use strict';

define(['services/fusion-rest-api-transport', 'constants'], (FusionRestApiTransport, Constants) => {

    const IB_ASSETS_PATH = '/fscmRestApi/resources/11.13.18.05/installedBaseAssets';

    class IbAssetsService {

        /**
         * @param {object} ofscConnector - OfscConnector instance
         */
        constructor(ofscConnector) {
            this._transport = new FusionRestApiTransport(Constants.FUSION_BASE_URL, ofscConnector);
        }

        /**
         * Fetch all IB assets for a customer site party name.
         * OFSC property: wo_account_name (e.g. "Campbell Soup Co.")
         *
         * @param {string} accountName - Value of wo_account_name from OFSC openData
         * @returns {Promise<Array>}   - Array of mapped asset objects
         */
        async getAssetsByAccountName(accountName) {
            const data = await this._transport.request(
                IB_ASSETS_PATH,
                FusionRestApiTransport.HTTP_METHOD_GET,
                { q: 'CustomerSitePartyName=' + accountName }
            );
            const items = (data && data.items) ? data.items : [];
            return items.map(item => IbAssetsService._mapItem(item));
        }

        /**
         * Map a single Fusion installedBaseAssets response item to the BHM asset shape.
         *
         * isBat / isFlood are derived from Description since the IB API does not expose
         * a dedicated battery-type field. Adjust the regex if a type field becomes available.
         *
         * @param {object} item - Raw Fusion API item
         * @returns {object}
         */
        static _mapItem(item) {
            const desc    = item.Description || '';   // "Testing Battery" — used for isBat/isFlood detection
            const isBat   = /battery|bat\b/i.test(desc);
            const isFlood = /flooded|lead.?acid/i.test(desc);
            return {
                instanceNumber: String(item.AssetId || ''),   // unique key for storage + row id
                assetId:  item.AssetId     || '',             // UI column: Asset ID
                serial:   item.SerialNumber || '',            // UI column: Serial
                mfr:      '',
                model:    '',
                desc:     item.ItemNumber  || '',             // UI column: Description pill (e.g. "TEST_BATTERY")
                mfgDate:  '',
                barcode:  '',
                isBat:    isBat,
                isFlood:  isFlood
            };
        }

        /**
         * Format an ISO date string to MM/YY.
         * @param {string|null} isoDate
         * @returns {string}
         */
        static _formatDate(isoDate) {
            if (!isoDate) return '';
            const d = new Date(isoDate);
            if (isNaN(d.getTime())) return '';
            return String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getFullYear()).slice(-2);
        }
    }

    return IbAssetsService;
});
