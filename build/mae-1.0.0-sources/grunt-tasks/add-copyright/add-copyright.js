/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

'use strict';

const copyrightText = require('./copyright');

module.exports = (grunt) => {

    grunt.registerMultiTask('addCopyright', 'Prepend contents of passed files with a copyright note that\'s predefined in copyright.js', function () {

        this.files.forEach(function(filesItem) {

            if (filesItem.src.length > 1) {
                grunt.log.warn('Only one src file per one destination is supported.');

                return false;
            }

            const srcFilePath = filesItem.src[0];

            if (grunt.file.isDir(srcFilePath)) {
                return;
            }

            const srcContent = grunt.file.read(srcFilePath);

            grunt.file.write(filesItem.dest, copyrightText() + srcContent);

            grunt.log.writeln('File ' + filesItem.dest + ' processed.');
        });
    });
};
