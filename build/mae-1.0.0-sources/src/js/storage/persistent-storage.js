/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([], () => {
    const storage = window.localStorage;

    /**
     * @class PersistentStorage
     */
    class PersistentStorage {

        static saveData(key, value) {
            storage.setItem(key, JSON.stringify(value));
        }

        static loadData(key) {
            const raw = storage.getItem(key);
            return raw ? JSON.parse(raw) : {};
        }

        static removeData(key) {
            storage.removeItem(key);
        }

    }

    return PersistentStorage;
});
