/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([], () => {

    class HtmlPage {

        /**
         * @param {Number} pageHeight Page height in pixels
         */
        constructor(pageHeight) {
            this.pageHeight = pageHeight;
        }

        /**
         * Remaining height left over division of height by a page height
         * @param {Number} height
         * @returns {Number} remaining height
         */
        remainingPageHeight (height) {
            return height % this.pageHeight;
        }

        /**
         * Calculate is height fit the page height
         * @param {Number} height
         * @returns {Boolean}
         */
        isExceedPageHeight (height) {
            return height > this.pageHeight;
        }

    }

    return HtmlPage;
});
