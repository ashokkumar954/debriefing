/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

"use strict";
define(['knockout', './abstract-collection', './catalog-model'], (ko, AbstractCollection, CatalogModel) => {
    class CatalogCollection extends AbstractCollection {
        constructor() {
            super();
        }

        /**
         * @param {Number} catalogId
         * @returns {CatalogModel}
         */
        getByIdOrCreate(catalogId) {
            return super.getByIdOrCreate(catalogId);
        }

        /**
         * @param id
         * @returns {CatalogModel}
         */
        static createEmptyModel(id) {
            return new CatalogModel({id, name: '', fieldSchemas: [], typeSchemas: []});
        }
    }

    return CatalogCollection;
});