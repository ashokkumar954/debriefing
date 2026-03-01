/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

"use strict";
define(['knockout'], (ko) => {
    class AbstractCollection {
        constructor() {
            /**
             * @type {Object.<AbstractModel>}
             */
            this._dictionary = {};

            this.items = ko.observableArray([]);
        }

        getByIdOrCreate(id) {
            if (!this.has(id)) {
                let model = this.constructor.createEmptyModel(id);
                this.items.push(model);
                this._dictionary[id] = model;
            }
            return this._dictionary[id];
        }

        /**
         * @param {AbstractModel} model
         */
        add(model) {
            this._dictionary[model.getId()] = model;
            this.items.push(model);
        }

        /**
         * @param id
         * @abstract
         * @protected
         */
        static createEmptyModel(id) {
            throw new Error('Not implemented');
        }

        has(id) {
            return this._dictionary.hasOwnProperty(id);
        }

    }

    return AbstractCollection;
});