/**
 Copyright (c) 2015, 2022, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
  	console.log("Running before_build hook.");
      console.log("Changing path_mapping.json to 'use' either 'local' (dev builds) or 'cdn' (release builds) for dependencies.");
      const buildType = configObj.buildType;
      const useValue = buildType === "dev" ? "local" : "cdn";
      console.log(useValue === "local" ? "\t******* Using 'local'" : "\t******* Using 'cdn'");
      const pcwd = process.cwd();
      const pathMappingFile = path.resolve(pcwd, "src/js/path_mapping.json");
      let content = JSON.parse(fs.readFileSync(pathMappingFile, 'utf8'));
      content.use = useValue;
      fs.writeFileSync(pathMappingFile, JSON.stringify(content, null, 2));

  	resolve(configObj);
  });
};
