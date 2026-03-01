/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

"use strict";
define(['knockout'], (ko) => {
    let idCounter = 1;

    class AbstractModel {
        getId() {
            return this[this.constructor.KEY_PROPERTY];
        }

        static _getArgumentAsObservable(value) {
            if (ko.isObservable(value)) {
                return value;
            }
            if (value instanceof Array) {
                return ko.observableArray(value);
            }
            return ko.observable(value);
        }

        static generateUniqueId() {
            let timestamp = (new Date).getTime();

            let numbers = window.crypto.getRandomValues(new Uint8Array(8));

            let randomHexString = '';

            numbers.forEach((number) => {
                let hexNumber = number.toString(16);
                randomHexString += hexNumber.length < 2 ? '0' + hexNumber : hexNumber;
            });

            let counter = idCounter++;

            return `${timestamp}-${counter}-${randomHexString}`;
        }

        static definePropertyAsArray(property) {
            property.__isArray = true;
        }

        static definePropertyAsObject(property) {
            property.__isObject = true;
        }

        static isPropertyArray(property) {
            return property.__isArray;
        }

        static isPropertyObject(property) {
            return property.__isObject;
        }

        static get KEY_PROPERTY() {
            return 'id';
        }
    }

    return AbstractModel;
});