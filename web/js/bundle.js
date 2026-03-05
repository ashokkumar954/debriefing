/**
 * @licence
 * Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
 * Oracle Technology Network Developer License Terms (http://www.oracle.com/technetwork/licenses/production-modify-license-2162709.html)
 */
define('errors/application-critical-error',[],(()=>{"use strict";return class{constructor(s,e){this.heading=s,this.message=e}}}));
/**
 * @license text 2.0.16 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/text/LICENSE
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    function useDefault(value, defaultValue) {
        return value === undefined || value === '' ? defaultValue : value;
    }

    //Allow for default ports for http and https.
    function isSamePort(protocol1, port1, protocol2, port2) {
        if (port1 === port2) {
            return true;
        } else if (protocol1 === protocol2) {
            if (protocol1 === 'http') {
                return useDefault(port1, '80') === useDefault(port2, '80');
            } else if (protocol1 === 'https') {
                return useDefault(port1, '443') === useDefault(port2, '443');
            }
        }
        return false;
    }

    text = {
        version: '2.0.16',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || isSamePort(uProtocol, uPort, protocol, port));
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'] &&
            !process.versions['atom-shell'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file[0] === '\uFEFF') {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!required-properties.json',[],function () { return '{\n  "format": 1,\n  "product": "19.5.0",\n  "properties": [],\n  "pluginAppsObj":[\n    {\n      "name" : "FUSION",\n      "type" : "oauth_user_assertion",\n      "key" : "fusionOAuthUserAssertionApplication",\n      "comment" : "Select Fusion application configured in the OFS Applications screen to authenticate the plugin"\n    },\n\n    {\n      "name" : "FFS",\n      "type" : "ofs",\n      "key" : "ofsApiApplication",\n      "comment" : "Select OFS application configured in the OFS Applications screen to authenticate the plugin"\n    }\n\n  ],\n  "plugin": {\n    "label": "debriefing_plugin",\n    "lang": "en",\n    "val": "Debrief"\n  }\n}';});

define('constants',[],(()=>class{static get DEVICE_TYPE_DESKTOP(){return"desktop"}static get DEVICE_TYPE_MOBILE(){return"mobile"}static get INVENTORY_ENTITY_NAME(){return"inventory"}static get INVENTORY_TYPE_PART(){return"part"}static get INVENTORY_TYPE_PART_SN(){return"part_sn"}static get DELETE_ACTION_NAME(){return"delete"}static get CRITICAL_ERROR(){return"Critical Error"}static get PROPERTY_MUST_BE_CONFIGURED(){return"The following property must be configured: "}static get PROPERTIES_MUST_BE_CONFIGURED(){return"The following properties must be configured: "}static get UNABLE_TO_START(){return"Unable to start application: "}static get ERR_AUTHENTICATION(){return"We encountered an issue while trying to fetch the authorization token. Please try again later."}static get ERR_SERVER(){return"Server returned an error. HTTP Status: "}static get HASH_SYMBOL(){return"#"}static get ACTION_CLOSE(){return"close"}static get CALL_PROC(){return"callProcedure"}}));
define('ofsc-connector',["signals","constants"],((e,t)=>{const r="default";return class{constructor(){window.addEventListener("message",this.onPostMessage.bind(this),!1),this.debugMessageSentSignal=new e,this.debugMessageReceivedSignal=new e,this.debugIncorrectMessageReceivedSignal=new e,this.messageFromOfscSignal=new e,this._currentCommunicationCallbacks={},this._currentCommunicationPromises={}}sendMessage(e){const s=this._getOriginUrl();let a=this._getKey(e),o="";return e.method!=t.CALL_PROC&&this._currentCommunicationPromises[r]?Promise.reject(new Error("Communication chanel is busy")):(o=this._processDataAndReturn(e,s,a),this._currentCommunicationPromises[a]=o,o)}_getOriginUrl(){return document.referrer||document.location.ancestorOrigins&&document.location.ancestorOrigins[0]||""}_processDataAndReturn(e,t,r){return new Promise(((s,a)=>{this._currentCommunicationCallbacks[r]=e=>(this._deleteCallbacksAndPromises(r),e instanceof Error||e.method&&"error"===e.method?a(e):s(e)),e.apiVersion=1;let o=t?this.constructor._getOrigin(t):"*";parent.postMessage(e,o),this.debugMessageSentSignal.dispatch(e)}))}_deleteCallbacksAndPromises(e){this._currentCommunicationCallbacks[e]&&delete this._currentCommunicationCallbacks[e],this._currentCommunicationPromises[e]&&delete this._currentCommunicationPromises[e]}_getKey(e){let t=r;return("callProcedure"===e.method||"callProcedureResult"===e.method||"error"===e.method&&e.callId)&&(t=e&&e.callId?e.callId.toString():""),t}onPostMessage(e){if(e.source===window)return;if(void 0===e.data)return this.debugIncorrectMessageReceivedSignal.dispatch("No data"),this.setError(),!1;let t="";try{t=JSON.parse(e.data)}catch(t){return this.setError(),this.debugIncorrectMessageReceivedSignal.dispatch("Incorrect JSON",e.data),!1}this.debugMessageReceivedSignal.dispatch(t),this.processResult(t)}setError(){this._currentCommunicationCallbacks[r]&&this._currentCommunicationCallbacks[r](new Error("No data"))}processResult(e){let t=this._getKey(e);this._currentCommunicationCallbacks[t]?this._currentCommunicationCallbacks[t](e):this.messageFromOfscSignal.dispatch(e)}static generateCallId(){return btoa(String.fromCharCode.apply(null,window.crypto.getRandomValues(new Uint8Array(16))))}static _getOrigin(e){return"string"==typeof e&&""!==e?e.indexOf("://")>-1?(window.location.protocol||"https:")+e.split("/")[2]:(window.location.protocol||"https:")+e.split("/")[0]:""}obtainToken(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"getAccessToken",params:{applicationKey:e}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),Promise.reject(e)))).catch((e=>r(e.errors)))}))}obtainTokenByScope(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"getAccessTokenByScope",params:{scope:e}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),Promise.reject(e)))).catch((e=>{if("error"===e.method)return r(e.errors)}))}))}shareFile(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"share",params:{title:"File",fileObject:e,text:"Sharing File"}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),r(e)))).catch((e=>r(e.errors)))}))}}}));
define('storage/persistent-storage',[],(()=>{const t=window.localStorage;return class{static saveData(e,a){t.setItem(e,JSON.stringify(a))}static loadData(e){const a=t.getItem(e);return a?JSON.parse(a):{}}static removeData(e){t.removeItem(e)}}}));
define('services/ofsc-plugin-api-transport',["knockout","../errors/application-critical-error","text!required-properties.json","ofsc-connector","storage/persistent-storage","constants"],((e,t,s,i,o,r)=>class{constructor(){this.ofscConnector=new i,this.openData=e.observable(""),this.attributeDescriptionParam=e.observable(""),this._pluginApiMessage={},this.ofscConnector.debugMessageReceivedSignal.add((e=>{console.info("-> Plugin: ",e)})),this.ofscConnector.debugMessageSentSignal.add((e=>{console.info("<- Plugin: ",e)})),this.ofscConnector.debugIncorrectMessageReceivedSignal.add(((e,t)=>{console.error("-> Plugin: incorrect message: ",e,t)}))}terminatePlugin(){this.ofscConnector.sendMessage({method:"close"}).then((e=>{console.log("RESPONSE DATA: ",e)})).catch((e=>{console.error(e)}))}load(){return new Promise(((e,i)=>{this.ofscConnector.sendMessage({method:"ready",sendInitData:!0}).then((i=>{switch(i.method){case"init":let n=i.attributeDescription;o.saveData("plugin_attributeDescription",n),this.ofscConnector.sendMessage({method:"initEnd",wakeupNeeded:!1});break;case"open":this.openData(i),this._pluginApiMessage=i,this.attributeDescription=JSON.parse(window.localStorage.getItem("plugin_attributeDescription")),this.attributeDescriptionParam(this.attributeDescription);let a=this._verifyProperties(s,this.attributeDescription);if(""!==a)throw new t(r.CRITICAL_ERROR,a);e()}})).catch((e=>{if(e instanceof t)return i(e);console.error(r.UNABLE_TO_START,e)}))}))}_verifyProperties(e,t){let s=JSON.parse(e).properties,i=[];return Object.values(s).forEach((e=>{t[e.label]||i.push(e.label)})),i.length?1===i.length?r.PROPERTY_MUST_BE_CONFIGURED+i[0]+".":r.PROPERTIES_MUST_BE_CONFIGURED+i.join(", ")+".":""}}));
define('viewModels/asset',["knockout"],(function(e){"use strict";return class{constructor(o){this.app=o&&o.app?o.app:null,this.problemCodeOptions=e.observableArray([]),this.hasOptions=e.computed((()=>this.problemCodeOptions().length>0)),this.problemCodeCount=e.computed((()=>this.problemCodeOptions().length)),this.showAllAssets=e.observable(!1),this._enumValues={},this._loadProblemCodes()}_loadProblemCodes(){this.app?this.app.loaded.then((()=>{var e=this.app._openData,o=this.app._attributeDescription;console.log("[AssetViewModel] openData received:",e),console.log("[AssetViewModel] attrDesc:",o),e?this._processOpenData(e,o):console.warn("[AssetViewModel] No openData available")})):console.warn("[AssetViewModel] No app instance")}_processOpenData(e,o){var t=e.openParams||{};console.log("[DEBUG] openData keys:",Object.keys(e)),console.log("[DEBUG] openParams keys:",Object.keys(t)),console.log("[DEBUG] openData.activity:",e.activity),console.log("[DEBUG] openParams.enum:",t.enum),console.log("[DEBUG] openParams.properties:",t.properties),console.log("[DEBUG] attributeDescription keys:",Object.keys(o||{})),console.log("[DEBUG] attrDesc problem_code entry:",o&&o.problem_code);try{var s=localStorage.getItem("plugin_attributeDescription"),l=s?JSON.parse(s):{};console.log("[DEBUG] localStorage attrDesc keys:",Object.keys(l)),console.log("[DEBUG] localStorage problem_code:",l.problem_code)}catch(e){}var a={};if(t.enum&&t.enum.problem_code&&(a=t.enum.problem_code,console.log("[AssetViewModel] enum from openParams.enum:",a)),0===Object.keys(a).length){var n=t.attributeDescription||o||{};n.problem_code&&n.problem_code.enum&&Object.entries(n.problem_code.enum).forEach((([e,o])=>{o.inactive||(a[e]="object"==typeof o?o.text:o)}))}if(0===Object.keys(a).length&&e.attributeDescription){var r=e.attributeDescription;r.problem_code&&r.problem_code.enum&&Object.entries(r.problem_code.enum).forEach((([e,o])=>{o.inactive||(a[e]="object"==typeof o?o.text:o)}))}if(0===Object.keys(a).length)try{var i=localStorage.getItem("plugin_attributeDescription");if(i){var c=JSON.parse(i);c.problem_code&&c.problem_code.enum&&(Object.entries(c.problem_code.enum).forEach((([e,o])=>{o.inactive||(a[e]="object"==typeof o?o.text:o)})),console.log("[AssetViewModel] enum from localStorage:",a))}}catch(e){console.warn("[AssetViewModel] localStorage error:",e)}console.log("[AssetViewModel] Final enumValues:",a),this._enumValues=a,window.__problemCodeEnum=a,window.__activityId=e.activity&&e.activity.aid||"",this.problemCodeOptions(Object.keys(a).map((e=>({index:e,label:a[e]}))))}navigateToAllAssets(){this.showAllAssets(!0),setTimeout((()=>{this._ensureAssetsLoaded((()=>{"undefined"!=typeof AllAssetDetails&&AllAssetDetails.render("all-assets-inline-container",this._enumValues)}))}),80)}_ensureAssetsLoaded(e){if(!document.getElementById("cc-asset-styles")){var o=document.createElement("link");o.id="cc-asset-styles",o.rel="stylesheet",o.href="asset-details.css",document.head.appendChild(o)}if("undefined"==typeof AllAssetDetails){var t=document.createElement("script");t.src="asset-detail.js",t.onload=()=>{var o=document.createElement("script");o.src="all-asset-details.js",o.onload=e,o.onerror=()=>console.error("[AssetViewModel] Failed to load all-asset-details.js"),document.head.appendChild(o)},t.onerror=()=>console.error("[AssetViewModel] Failed to load asset-detail.js"),document.head.appendChild(t)}else e()}goBack(){this.showAllAssets(!1);var e=document.getElementById("all-assets-inline-container");e&&(e.innerHTML="")}}}));

define('text!views/asset.html',[],function () { return '<!-- src/js/views/asset.html -->\r\n<div class="cc-plugin">\r\n\r\n    <!-- ── LANDING VIEW ── -->\r\n    <div data-bind="ifnot: showAllAssets">\r\n        <div class="cc-landing">\r\n            <div class="cc-landing-title">Multi-Asset Execution (MAE)</div>\r\n            <div class="cc-landing-sub">Asset service management</div>\r\n\r\n            <div data-bind="ifnot: hasOptions">\r\n                <div class="cc-banner-warn">\r\n                    <strong>No problem_code values received from OFSC.</strong><br>\r\n                    Please ensure <em>problem_code</em> is added to plugin Properties\r\n                    with Read or Read/Write access.\r\n                </div>\r\n            </div>\r\n\r\n            <div data-bind="if: hasOptions">\r\n                <div class="cc-banner-ok">\r\n                    <strong style="color:#3a7030;">&#10003; Problem codes loaded &mdash; </strong>\r\n                    <span data-bind="text: problemCodeCount"></span> asset type(s) available.\r\n                </div>\r\n                <button class="cc-primary-btn" data-bind="click: navigateToAllAssets">\r\n                    View All Asset Details &rarr;\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- ── ALL ASSETS INLINE VIEW ── -->\r\n    <div data-bind="if: showAllAssets" style="width:100%;">\r\n\r\n        <div class="cc-header">\r\n            <button class="cc-back-btn" data-bind="click: goBack">&#8592;</button>\r\n            <span class="cc-h-title">Multi-Asset Execution (MAE)</span>\r\n            <span class="cc-h-badge" data-bind="text: problemCodeCount() + \' asset(s)\'"></span>\r\n        </div>\r\n\r\n        <div class="cc-toolbar">\r\n            <span class="cc-tb-title">Asset Details</span>\r\n            <span class="cc-tb-spacer"></span>\r\n            <button class="cc-icon-btn" title="Refresh"\r\n                    data-bind="click: function(){ if(typeof AllAssetDetails!==\'undefined\') AllAssetDetails.render(\'all-assets-inline-container\', _enumValues); }">\r\n                &#8635;\r\n            </button>\r\n        </div>\r\n\r\n        <div class="cc-cards-wrap">\r\n            <div id="all-assets-inline-container">\r\n                <div class="cc-no-data">Loading asset details&hellip;</div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>';});

var AssetDetail=function(){var c=["Cables","Connectors","Contact Tips","Shrouds","Vent Caps","Watering System","Battery Tray","Physical damage"],e=["Cables","Connectors","Contact Tips","Shrouds","Watering System","Battery Tray","Physical damage"],t={ids:[29148,30021,11553,44821,76320,55019,38741],ser:["7970CL","PL111222333","BT44921","HK-0012","DK-7731","CL-8820","PL-3310"],mfr:["DEKA","HAWKER","DEKA","EnerSys","DEKA","HAWKER","EnerSys"],mdl:["24-G75-19","18-125F-13","24-85-17","36-125-13","48-G75-19","18-100F-11","24-G85-17"],dsc:["Sit","Stand","Reach","Sit","Counterbalance","Reach","Stand"],mfd:["01/11","03/15","07/18","11/20","02/19","06/17","09/21"],age:[99,15,82,55,71,43,38],dates:["08/26/2025","09/10/2025","07/15/2025","10/01/2025","08/01/2025","11/05/2025","06/20/2025"],hrs:[54,15,null,null,12,null,null]};function a(c){return String(c).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function i(c){return"mae_record_"+(void 0!==window.__activityId&&window.__activityId?window.__activityId:"local")+"_"+c}function l(c){var e=document.getElementById("cc-sum-"+c);if(e){var t=e.dataset.code||String(c),a=function(c){var e=document.getElementById("cc-note-"+c),t=document.getElementById("cc-repair-"+c),a=document.getElementById("cc-complete-"+c),i=document.getElementById("cc-det-"+c),l={};i&&i.querySelectorAll(".cc-chkl-input").forEach((function(c){var e=c.nextElementSibling?c.nextElementSibling.textContent.trim():c.id;l[e]=c.checked}));var n={};i&&i.querySelectorAll(".cc-comp-chk").forEach((function(c){var e=c.previousElementSibling?c.previousElementSibling.textContent.trim():c.id;n[e]=c.checked}));var s={};i&&i.querySelectorAll(".cc-rd-input").forEach((function(c){s[c.dataset.label||c.id]=c.value}));return{rowIndex:c,note:e?e.value:"",checklist:l,components:n,readings:s,needsRepair:!!t&&t.checked,complete:!!a&&a.checked,savedAt:(new Date).toISOString()}}(c);try{localStorage.setItem(i(t),JSON.stringify(a))}catch(c){console.warn("[AssetDetail] localStorage save failed:",c)}n(c)}}function n(c){var e=document.getElementById("cc-status-"+c);if(e){var t,a=document.getElementById("cc-sum-"+c),l=a&&a.dataset.code||String(c),n=null;try{(t=localStorage.getItem(i(l)))&&(n=JSON.parse(t))}catch(c){}if(!n)return e.style.display="none",void(e.textContent="");n.complete?(e.textContent="✓ Complete",e.style.cssText="display:inline-block;font-size:10px;margin-left:6px;background:#2a7a2a;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;"):(e.textContent="● Saved",e.style.cssText="display:inline-block;font-size:10px;margin-left:6px;background:#c67c00;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;")}}function s(c){var e=document.getElementById("cc-det-"+c),t=document.getElementById("cc-sum-"+c),a=document.getElementById("cc-ebtn-"+c);if(e){var l=e.classList.toggle("cc-open");t&&t.classList.toggle("cc-row-open",l),a&&(a.innerHTML=l?"&#8964;":"&#8250;"),l&&function(c){var e=document.getElementById("cc-sum-"+c);if(e){var t,a=e.dataset.code||String(c);try{t=localStorage.getItem(i(a))}catch(c){return}if(t){var l;try{l=JSON.parse(t)}catch(c){return}var n=document.getElementById("cc-det-"+c);if(n){l.checklist&&n.querySelectorAll(".cc-chkl-input").forEach((function(c){var e=c.nextElementSibling?c.nextElementSibling.textContent.trim():"";e&&void 0!==l.checklist[e]&&(c.checked=l.checklist[e])})),l.components&&n.querySelectorAll(".cc-comp-chk").forEach((function(c){var e=c.previousElementSibling?c.previousElementSibling.textContent.trim():"";e&&void 0!==l.components[e]&&(c.checked=l.components[e])})),l.readings&&n.querySelectorAll(".cc-rd-input").forEach((function(c){var e=c.dataset.label||c.id;void 0!==l.readings[e]&&(c.value=l.readings[e])}));var s=document.getElementById("cc-note-"+c);s&&void 0!==l.note&&(s.value=l.note);var d=document.getElementById("cc-repair-"+c);d&&void 0!==l.needsRepair&&(d.checked=l.needsRepair);var o=document.getElementById("cc-complete-"+c);o&&void 0!==l.complete&&(o.checked=l.complete)}}}}(c)}}return{createRows:function(i,l,s){var d=function(c,e){var a=(c.length+e.length)%7,i=/^BAT-/i.test(c),l=/flooded|lead/i.test(e);return{isBat:i,isFlood:l,assetId:t.ids[a],serial:t.ser[a],mfr:t.mfr[a],model:t.mdl[a],desc:t.dsc[a],mfgDate:t.mfd[a],age:t.age[a],barcode:"",dates:[t.dates[a],t.dates[a],t.dates[a],t.dates[a]],lcDate:t.dates[a],totalHrs:t.hrs[a],lowVdc:l?"2.222":"7.7",highVdc:l?"2.23":"6",lowSg:i?null:l?"1.111":"1.280"}}(i,l),o=s,r=document.createDocumentFragment(),v=document.createElement("tr");v.id="cc-sum-"+o,v.className="cc-asset-row",v.dataset.assetId=String(d.assetId),v.dataset.serial=d.serial,v.dataset.label=l,v.dataset.code=i,v.innerHTML='<td class="cc-summary-td cc-expand-td"><button class="cc-expand-btn" id="cc-ebtn-'+o+'" onclick="AssetDetail.toggle('+o+')">&#8250;</button></td><td class="cc-summary-td" style="width:34px;text-align:center;"><button class="cc-view-btn" title="View" onclick="AssetDetail.toggle('+o+')">&#128065;</button></td><td class="cc-summary-td"><span class="cc-code-pill" title="'+a(i)+'">'+a(l)+'</span><span id="cc-status-'+o+'" style="display:none;"></span></td><td class="cc-summary-td cc-num">'+d.assetId+'</td><td class="cc-summary-td">'+d.serial+'</td><td class="cc-summary-td">'+d.mfr+'</td><td class="cc-summary-td">'+d.model+"</td>",r.appendChild(v);var u=document.createElement("tr");u.id="cc-det-"+o,u.className="cc-detail-row";var m=document.createElement("td");return m.colSpan=7,m.className="cc-detail-panel",m.innerHTML=function(t,i,l,n){var s=t.isBat,d=s?c:e,o=t.dates.map((function(c){return'<span class="cc-lc-chip">'+c+"</span>"})).join("");s&&(o+='<span class="cc-lc-chip na">N/A</span>');var r=["Visual Inspection","Added Water","BDR Download","Wash"];s&&r.push("ICC Torque");var v=r.map((function(c,e){return'<div class="cc-chk-item"><input type="checkbox" class="cc-chk-input cc-chkl-input" id="cc-chkl-'+n+"-"+e+'" oninput="AssetDetail.updateNote('+n+')"/><span>'+c+"</span></div>"})).join(""),u='<div class="cc-rd-col"><div class="cc-rd-lbl">Low VDC</div><input type="text" class="cc-rd-input" id="cc-rd-lowvdc-'+n+'" data-label="Low VDC" value="'+a(String(t.lowVdc))+'" oninput="AssetDetail.updateNote('+n+')"/></div><div class="cc-rd-col"><div class="cc-rd-lbl">High VDC</div><input type="text" class="cc-rd-input" id="cc-rd-highvdc-'+n+'" data-label="High VDC" value="'+a(String(t.highVdc))+'" oninput="AssetDetail.updateNote('+n+')"/></div>';s||(u+='<div class="cc-rd-col"><div class="cc-rd-lbl">Low SG</div><input type="text" class="cc-rd-input" id="cc-rd-lowsg-'+n+'" data-label="Low SG" value="'+a(String(t.lowSg||""))+'" oninput="AssetDetail.updateNote('+n+')"/></div>');var m=d.map((function(c,e){return'<div class="cc-comp-row"><span>'+c+'</span><input type="checkbox" class="cc-chk-input cc-comp-chk" id="cc-comp-'+n+"-"+e+'" oninput="AssetDetail.updateNote('+n+')"/></div>'})).join("");return'<div class="cc-hazard"></div><div class="cc-detail-subtitle" id="cc-sub-'+n+'"><span class="cc-sub-label">'+a(l)+" &mdash; "+a(i)+'</span><div class="cc-action-btns"><button class="cc-btn-close"    onclick="AssetDetail.closeRow('+n+')">&#10005; Close</button><button class="cc-btn-save"     onclick="AssetDetail.saveRow('+n+')">&#10003; Save</button><button class="cc-btn-continue" onclick="AssetDetail.continueRow('+n+')">&#8594; Continue</button></div></div><div class="cc-card-body"><div class="cc-sec-asset"><div class="cc-fields-grid"><div class="cc-field"><div class="cc-f-lbl">Assets ID</div><div class="cc-f-val cc-f-val-id">'+t.assetId+'</div></div><div class="cc-field"><div class="cc-f-lbl">Serial</div><div class="cc-f-val">'+t.serial+'</div></div><div class="cc-field"><div class="cc-f-lbl">Manufacturer Id</div><div class="cc-f-val">'+t.mfr+'</div></div><div class="cc-field"><div class="cc-f-lbl">Model</div><div class="cc-f-val">'+t.model+'</div></div><div class="cc-field"><div class="cc-f-lbl">Description</div><div class="cc-f-val">'+t.desc+'</div></div><div class="cc-field"><div class="cc-f-lbl">Mfg Date</div><div class="cc-f-val">'+t.mfgDate+'</div></div><div class="cc-field"><div class="cc-f-lbl">Age</div><div class="cc-f-val">'+t.age+'</div></div><div class="cc-field"><div class="cc-f-lbl">Barcode</div><div class="cc-f-val">'+(t.barcode||"&mdash;")+'</div></div></div><div class="cc-lc-block"><div class="cc-lc-title">Last Completed</div><div class="cc-lc-dates">'+o+'</div><div class="cc-checklist">'+v+'</div></div></div><div class="cc-sec-reading"><div class="cc-lc-box"><div class="cc-lc-box-lbl">Last<br>Complete</div><div class="cc-lc-box-date">'+t.lcDate+'</div><div class="cc-lc-box-pm">PM</div></div><div class="cc-rd-title">Last Reading</div><div class="cc-rd-row">'+u+"</div></div>"+(s?'<div class="cc-sec-comps"><div class="cc-sec-title">Components</div>'+m+"</div>":"")+'<div class="cc-sec-note"><div class="cc-sec-title">Problem Note</div><textarea class="cc-note-area" id="cc-note-'+n+'" placeholder="Enter problem note…"></textarea><div class="cc-note-chk"><span>Needs Repair</span><input type="checkbox" class="cc-chk-input" id="cc-repair-'+n+'"/></div><div class="cc-note-chk"><span>Complete</span><input type="checkbox" class="cc-chk-input" id="cc-complete-'+n+'"/></div></div></div>'}(d,l,i,o),u.appendChild(m),r.appendChild(u),setTimeout((function(){n(o)}),0),r},toggle:s,saveRow:function(c){l(c);var e=document.getElementById("cc-sub-"+c),t=e?e.querySelector(".cc-btn-save"):null;if(t){var a=t.innerHTML;t.innerHTML="&#10003; Saved!",setTimeout((function(){t.innerHTML=a}),800)}},continueRow:function(c){l(c);var e=document.getElementById("cc-sub-"+c),t=e?e.querySelector(".cc-btn-continue"):null;if(t){var a=t.innerHTML;t.innerHTML="&#10003; Saved!",setTimeout((function(){t.innerHTML=a,s(c)}),800)}else s(c)},closeRow:function(c){s(c)},updateNote:function(c){var e=document.getElementById("cc-note-"+c),t=document.getElementById("cc-det-"+c);if(e&&t){var a=[],i=[];t.querySelectorAll(".cc-chkl-input").forEach((function(c){if(c.checked){var e=c.nextElementSibling;e&&i.push(e.textContent.trim())}})),i.length&&a.push("Checklist: "+i.join(", "));var l=[];t.querySelectorAll(".cc-comp-chk").forEach((function(c){if(c.checked){var e=c.previousElementSibling;e&&l.push(e.textContent.trim())}})),l.length&&a.push("Components: "+l.join(", "));var n=[];t.querySelectorAll(".cc-rd-input").forEach((function(c){var e=c.value.trim();e&&n.push((c.dataset.label||c.id)+": "+e)})),n.length&&a.push("Readings: "+n.join("\n")),e.value=a.join("\n")}},getSavedStatus:function(c){var e=document.getElementById("cc-sum-"+c);if(!e)return null;var t,a=e.dataset.code||String(c);try{t=localStorage.getItem(i(a))}catch(c){return null}if(!t)return null;try{var l=JSON.parse(t);return{complete:!!l.complete,needsRepair:!!l.needsRepair}}catch(c){return null}}}}();
define("viewModels/asset-detail", function(){});


define('text!views/asset-detail.html',[],function () { return '<!DOCTYPE html>\n<!--\n    all-asset-details.html\n    Standalone page version of the asset details view.\n    Used only if direct navigation is needed; inline rendering via asset.html is preferred.\n-->\n<html lang="en-us">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Asset Details — Multi-Asset Execution (MAE)</title>\n    <link rel="stylesheet" href="asset-details.css"/>\n</head>\n<body class="cc-plugin">\n\n    <!-- Header -->\n    <div class="cc-header">\n        <button class="cc-back-btn" onclick="history.back()">&#8592;</button>\n        <span class="cc-h-title">Multi-Asset Execution (MAE)</span>\n        <span class="cc-h-badge" id="cc-badge">0</span>\n    </div>\n\n    <!-- Toolbar -->\n    <div class="cc-toolbar">\n        <span class="cc-tb-title">Asset Details</span>\n        <span class="cc-tb-spacer"></span>\n        <button class="cc-icon-btn" title="Refresh" onclick="rerender()">&#8635;</button>\n    </div>\n\n    <!-- Table container -->\n    <div class="cc-cards-wrap">\n        <div id="all-assets-inline-container">\n            <div class="cc-no-data">Loading&hellip;</div>\n        </div>\n    </div>\n\n    <script src="asset-detail.js"></script>\n    <script src="all-asset-details.js"></script>\n    <script>\n        (function () {\n            var enumValues = window.__problemCodeEnum || {};\n            var keys = Object.keys(enumValues);\n\n            var badge = document.getElementById(\'cc-badge\');\n            if (badge) badge.textContent = keys.length + \' asset(s)\';\n\n            AllAssetDetails.render(\'all-assets-inline-container\', enumValues);\n\n            window.rerender = function () {\n                AllAssetDetails.render(\'all-assets-inline-container\', enumValues);\n            };\n        })();\n    </script>\n</body>\n</html>';});

var AllAssetDetails=function(){var e={};function t(t){var a=document.getElementById("cc-search-"+t),c=document.getElementById("cc-tbody-"+t);if(c){var s=a?a.value.trim().toLowerCase():"",l=(e[t]||{}).filter||"all";c.querySelectorAll(".cc-asset-row").forEach((function(e){var t=e.id.replace("cc-sum-",""),a=(e.dataset.assetId||"").toLowerCase(),c=(e.dataset.serial||"").toLowerCase(),n=(e.dataset.label||"").toLowerCase(),r=(e.dataset.code||"").toLowerCase(),i=document.getElementById("cc-det-"+t),o=i?i.querySelector("#cc-complete-"+t):null,d=!!o&&o.checked;if(!d&&"undefined"!=typeof AssetDetail&&AssetDetail.getSavedStatus){var u=AssetDetail.getSavedStatus(t);u&&(d=u.complete)}var p=(!s||-1!==a.indexOf(s)||-1!==c.indexOf(s)||-1!==n.indexOf(s)||-1!==r.indexOf(s))&&("all"===l||"completed"===l&&d||"pending"===l&&!d);e.style.display=p?"":"none",i&&(i.style.display=p?"":"none")}))}}return{render:function(t,a){var c=document.getElementById(t);if(c){var s=Object.keys(a||{});if(c.innerHTML="",e[t]={filter:"all"},0!==s.length){var l=document.createElement("div");l.className="cc-search-wrap",l.innerHTML='<div class="cc-search-input-wrap"><span class="cc-search-icon">&#128269;</span><input type="text" class="cc-search-input" id="cc-search-'+t+'" placeholder="Enter Asset# or Serial#" oninput="AllAssetDetails.applyFilter(\''+t+'\')"/></div><div class="cc-filter-tabs" id="cc-tabs-'+t+'"><button class="cc-tab cc-tab-active" onclick="AllAssetDetails.setFilter(\''+t+"', 'all', this)\">All</button><button class=\"cc-tab\" onclick=\"AllAssetDetails.setFilter('"+t+"', 'pending', this)\">Pending</button><button class=\"cc-tab\" onclick=\"AllAssetDetails.setFilter('"+t+"', 'completed', this)\">Completed</button></div>",c.appendChild(l);var n=document.createElement("table");n.className="cc-asset-table";var r=document.createElement("thead");r.innerHTML='<tr><th style="width:28px;"></th><th style="width:28px;">Actions</th><th>Problem Code</th><th class="cc-num">Asset ID</th><th>Serial</th><th>Manufacturer</th><th>Model</th></tr>',n.appendChild(r);var i=document.createElement("tbody");i.id="cc-tbody-"+t,s.forEach((function(e,t){i.appendChild(AssetDetail.createRows(e,a[e],t))})),n.appendChild(i),c.appendChild(n),console.log("[AllAssetDetails] Rendered "+s.length+" row(s).")}else c.innerHTML='<p class="cc-no-data"><strong>No problem_code values received.</strong><br>Please ensure <em>problem_code</em> is added to plugin Properties with Read or Read/Write access.</p>'}else console.error("[AllAssetDetails] Container not found:",t)},applyFilter:t,setFilter:function(a,c,s){e[a]||(e[a]={}),e[a].filter=c;var l=document.getElementById("cc-tabs-"+a);l&&l.querySelectorAll(".cc-tab").forEach((function(e){e.classList.remove("cc-tab-active")})),s&&s.classList.add("cc-tab-active"),t(a)}}}();
define("viewModels/all-asset-details", function(){});


define('text!views/all-asset-details.html',[],function () { return '<!DOCTYPE html>\n<!--\n    all-asset-details.html\n    Displays one Battery PM asset card per problem_code value received from OFSC.\n    Integrates with the existing plugin via postMessage.\n-->\n<html lang="en-us">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>All Asset Details</title>\n    <link rel="stylesheet" href="../../asset-detail.css" type="text/css"/>\n    <style>\n        /* Page-level styles */\n        * { box-sizing: border-box; margin: 0; padding: 0; }\n\n        body {\n            background: #e8e8e8;\n            font-family: Arial, sans-serif;\n        }\n\n        /* Top navigation bar matching screenshot */\n        .page-topbar {\n            background: #1565c0;\n            color: #fff;\n            display: flex;\n            align-items: center;\n            padding: 8px 16px;\n            gap: 12px;\n            position: sticky;\n            top: 0;\n            z-index: 100;\n            box-shadow: 0 2px 6px rgba(0,0,0,0.3);\n        }\n\n        .page-topbar .back-btn {\n            background: none;\n            border: none;\n            color: #fff;\n            font-size: 20px;\n            cursor: pointer;\n            padding: 4px 8px;\n        }\n\n        .page-topbar .title {\n            flex: 1;\n            text-align: center;\n            font-size: 17px;\n            font-weight: 700;\n            letter-spacing: 0.3px;\n        }\n\n        .page-topbar .fwd-btn {\n            background: none;\n            border: none;\n            color: #fff;\n            font-size: 20px;\n            cursor: pointer;\n            padding: 4px 8px;\n        }\n\n        /* Section header: "Battery PM ˄" + save/refresh icons */\n        .section-header {\n            display: flex;\n            align-items: center;\n            padding: 10px 16px 6px 16px;\n            gap: 8px;\n            background: #f0f0f0;\n            border-bottom: 1px solid #ccc;\n            position: sticky;\n            top: 48px;\n            z-index: 90;\n        }\n\n        .section-title {\n            font-size: 20px;\n            font-weight: 700;\n            color: #111;\n        }\n\n        .section-toggle {\n            font-size: 16px;\n            cursor: pointer;\n            color: #555;\n            user-select: none;\n        }\n\n        .section-actions {\n            margin-left: auto;\n            display: flex;\n            gap: 8px;\n        }\n\n        .icon-btn {\n            width: 32px;\n            height: 32px;\n            border-radius: 50%;\n            border: 2px solid #4caf50;\n            background: #fff;\n            color: #4caf50;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            cursor: pointer;\n            font-size: 15px;\n        }\n\n        .icon-btn:hover {\n            background: #4caf50;\n            color: #fff;\n        }\n\n        /* Cards container */\n        .cards-container {\n            padding: 12px 16px;\n        }\n\n        /* Loading state */\n        .loading-msg {\n            text-align: center;\n            padding: 40px;\n            color: #666;\n            font-size: 15px;\n        }\n\n        /* No data state */\n        .no-data-msg {\n            background: #fff3cd;\n            border: 1px solid #ffc107;\n            border-radius: 6px;\n            padding: 16px;\n            margin: 16px;\n            color: #856404;\n            font-size: 14px;\n        }\n\n        /* Problem code count badge */\n        .count-badge {\n            background: #1565c0;\n            color: #fff;\n            border-radius: 12px;\n            padding: 2px 10px;\n            font-size: 12px;\n            font-weight: 600;\n            margin-left: 4px;\n        }\n    </style>\n</head>\n<body>\n\n    <!-- Top navigation bar -->\n    <div class="page-topbar">\n        <button class="back-btn" onclick="history.back()">&#8592;</button>\n        <div class="title" id="page-title">Service Call</div>\n        <button class="fwd-btn">&#8594;</button>\n    </div>\n\n    <!-- Section header -->\n    <div class="section-header">\n        <span class="section-title">All Assets</span>\n        <span class="section-toggle" id="section-toggle" onclick="toggleSection()">&#8743;</span>\n        <span class="count-badge" id="count-badge">0</span>\n        <div class="section-actions">\n            <button class="icon-btn" title="Refresh" onclick="refreshCards()">&#8635;</button>\n            <button class="icon-btn" title="Save" onclick="saveAll()">&#128190;</button>\n        </div>\n    </div>\n\n    <!-- Cards will be injected here -->\n    <div class="cards-container" id="cards-container">\n        <div class="loading-msg" id="loading-msg">\n            Loading asset details...\n        </div>\n    </div>\n\n    <script src="asset-detail.js"></script>\n    <script src="all-asset-details.js"></script>\n</body>\n</html>\n';});

define('appController',["ojs/ojcore","knockout","./services/ofsc-plugin-api-transport","ojs/ojrouter","ojs/ojvalidation-datetime","viewModels/asset","text!views/asset.html","viewModels/asset-detail","text!views/asset-detail.html","viewModels/all-asset-details","text!views/all-asset-details.html"],(function(t,e,o){return class{constructor(){this.router=t.Router.rootInstance,this.router.configure({asset:{label:"asset",isDefault:!0},"asset-detail":{label:"asset-detail"},"all-asset-details":{label:"all-asset-details"}}),t.Router.defaults.urlAdapter=new t.Router.urlParamAdapter,this.router.moduleConfig.params.app=this,this._openData=null,this._attributeDescription=null,this._pluginApiTransport=new o,this.ofscConnector=this._pluginApiTransport.ofscConnector,this._loadedResolve=null,this.loaded=new Promise((t=>{this._loadedResolve=t}))}load(){return new Promise((t=>{this._pluginApiTransport.load().then((()=>{this._openData=this._pluginApiTransport.openData(),this._attributeDescription=this._pluginApiTransport.attributeDescriptionParam(),console.log("[AppController] loaded successfully"),console.log("[AppController] _openData:",this._openData),console.log("[AppController] _attributeDescription:",this._attributeDescription),this._loadedResolve(),t()})).catch((e=>{console.warn("[AppController] Transport error, trying to get data anyway:",e);try{this._openData=this._pluginApiTransport.openData(),this._attributeDescription=this._pluginApiTransport.attributeDescriptionParam(),console.log("[AppController] Got data despite error:",this._openData),console.log("[AppController] _attributeDescription despite error:",this._attributeDescription)}catch(t){console.warn("[AppController] Could not get data from transport:",t)}this._loadedResolve(),t()}))}))}}}));
let logServiceWorkerMessage=()=>{},serviceWorkerRegistrationMutexName="mutex-root-service-worker-registration",requiredRootServiceWorkerVersion="NA",serviceWorkerScriptPath="plugin-service-worker.js",serviceWorkerScope="/",GET_SERVICE_WORKER_VERSION_TIME_LIMIT=5e3,CACHE_RESOURCES_TIME_LIMIT=3e4,SW_ACTIVATION_TIME_LIMIT=1e4,REGISTRATION_WAITING_TIME_LIMIT=1e4;class PluginServiceWorkerInterface{static async cacheViaCacheManifest(e,r,i=null,t=null){if(!navigator.locks)throw new Error("Web Locks API is not supported");return await navigator.locks.request(serviceWorkerRegistrationMutexName,(async o=>{const{serviceWorker:s,serviceWorkerRegistration:a}=await this.getActualServiceWorkerAndRegistration(e);return{cache:(await postMessageToServiceWorkerViaMessageChannel(s,createCacheRequest({type:"CACHE_VIA_CACHE_MANIFEST",path:r},i,t),CACHE_RESOURCES_TIME_LIMIT)).result,serviceWorkerRegistration:a,serviceWorker:s}}))}static async cacheResourcesList(e,r,i=null,t=null){if(!navigator.locks)throw new Error("Web Locks API is not supported");return await navigator.locks.request(serviceWorkerRegistrationMutexName,(async o=>{const{serviceWorker:s,serviceWorkerRegistration:a}=await this.getActualServiceWorkerAndRegistration(e);return{cache:(await postMessageToServiceWorkerViaMessageChannel(s,createCacheRequest({type:"CACHE_RESOURCES_LIST",resourcesList:r},i,t),CACHE_RESOURCES_TIME_LIMIT)).result,serviceWorkerRegistration:a,serviceWorker:s}}))}static async getActualServiceWorkerAndRegistration(e){if(!navigator.serviceWorker)throw new Error("Service workers are not supported");let r=await this.registerOrGetRootServiceWorker(e);const i=await navigator.serviceWorker.getRegistration();return logServiceWorkerMessage(`Active service worker: ${r.scriptURL}, state: ${r.state}, scope: ${i.scope}`),r=await this.actualizeServiceWorker(r,e),logServiceWorkerMessage(`Actualized service worker state: ${r.state}`),{serviceWorker:r,serviceWorkerRegistration:i}}static async registerOrGetRootServiceWorker(e){let r=await navigator.serviceWorker.getRegistration();if(r)return logServiceWorkerMessage("Service worker registration is obtained"),this.waitUntilServiceWorkerIsActivated(r);logServiceWorkerMessage("Service worker registration is absent");const i=await this.registerServiceWorker(e);if(!i){logServiceWorkerMessage("Waiting registration of the service worker by another plugin");return(await this.waitForServiceWorkerRegistration()).active}return logServiceWorkerMessage("Service worker is registered"),this.waitUntilServiceWorkerIsActivated(i)}static async actualizeServiceWorker(e,r){logServiceWorkerMessage("Requesting service worker version...");const i=(await postMessageToServiceWorkerViaMessageChannel(e,{type:"GET_VERSION"},GET_SERVICE_WORKER_VERSION_TIME_LIMIT)).result;if(logServiceWorkerMessage(`Required service worker version: ${requiredRootServiceWorkerVersion}`),logServiceWorkerMessage(`Current service worker version: ${i}`),this.isServiceWorkerVersionNeedsToBeUpdated(i)){let e;logServiceWorkerMessage("The service worker has to be updated");try{e=await this.registerServiceWorker(r)}catch(i){if(!i||"Job rejected for non app-bound domain"!==i.message)throw i;{logServiceWorkerMessage(`Unable to update Service Worker. ${i.message}.`),logServiceWorkerMessage("Attempting to remove Service Worker and register it again.");const t=await navigator.serviceWorker.getRegistrations();if(!t)throw i;await Promise.all(t.map((e=>(logServiceWorkerMessage(`Removing Service Worker Registration for scope "${e.scope}"`),e.unregister())))),e=await this.registerServiceWorker(r)}}return e?this.waitUntilServiceWorkerIsActivated(e):(logServiceWorkerMessage("Waiting registration of the service worker by another plugin"),e=await this.waitForServiceWorkerRegistration(),logServiceWorkerMessage("Obtained service worker registration"),this.actualizeServiceWorker(await this.waitUntilServiceWorkerIsActivated(e),r))}return logServiceWorkerMessage("The service worker version is actual"),e}static async registerServiceWorker(e){logServiceWorkerMessage("Registering new service worker");const r={};serviceWorkerScope&&(r.scope=serviceWorkerScope);const i=await navigator.serviceWorker.register(e,r);return logServiceWorkerMessage(`New service worker is registered. Scope: ${i.scope}`),i}static waitForServiceWorkerRegistration(){return new Promise(((e,r)=>{const i=setTimeout((()=>{r(new Error("Registration waiting time limit is reached"))}),REGISTRATION_WAITING_TIME_LIMIT);navigator.serviceWorker.ready.then((r=>(clearTimeout(i),e(r))))}))}static isServiceWorkerVersionNeedsToBeUpdated(e){if(isNaN(requiredRootServiceWorkerVersion)&&requiredRootServiceWorkerVersion!==e)return!0;if(!isNaN(requiredRootServiceWorkerVersion)&&!isNaN(e)){if(parseInt(e,10)<parseInt(requiredRootServiceWorkerVersion,10))return!0}return!1}static async waitServiceWorkerToBecomeActive(e){if("activated"===e.state)return e;logServiceWorkerMessage(`Service worker: ${e.scriptURL}, state: ${e.state}. Waiting for Service Worker to be activated`);let r=e.state;return new Promise(((i,t)=>{let o=setTimeout((()=>{e.onstatechange=null,t(new Error("Service Worker activation time limit is reached"))}),SW_ACTIVATION_TIME_LIMIT);e.onstatechange=()=>(logServiceWorkerMessage(`Service Worker state change ${r} -> ${e.state}`),"activated"===e.state?(clearTimeout(o),e.onstatechange=null,i(e)):"redundant"===e.state?(e.onstatechange=null,t("Service Worker became redundant")):void 0)}))}static async waitUntilServiceWorkerIsActivated(e){let r=e.active;return e.installing?this.waitServiceWorkerToBecomeActive(e.installing):e.waiting?this.waitServiceWorkerToBecomeActive(e.waiting):(logServiceWorkerMessage(`Service worker is ready: ${r.scriptURL}, state: ${r.state}`),r)}static getServiceWorkerRegistrationMutexName(){return serviceWorkerRegistrationMutexName}static setServiceWorkerRegistrationMutexName(e){serviceWorkerRegistrationMutexName=e}static getRequiredRootServiceWorkerVersion(){return requiredRootServiceWorkerVersion}static setRequiredRootServiceWorkerVersion(e){requiredRootServiceWorkerVersion=e}static setLogMessageFunction(e){logServiceWorkerMessage=e}static getServiceWorkerVersionTimeLimit(){return GET_SERVICE_WORKER_VERSION_TIME_LIMIT}static setServiceWorkerVersionTimeLimit(e){GET_SERVICE_WORKER_VERSION_TIME_LIMIT=e}static getCacheResourcesTimeLimit(){return CACHE_RESOURCES_TIME_LIMIT}static setCacheResourcesTimeLimit(e){CACHE_RESOURCES_TIME_LIMIT=e}static getServiceWorkerActivationTimeLimit(){return SW_ACTIVATION_TIME_LIMIT}static setServiceWorkerActivationTimeLimit(e){SW_ACTIVATION_TIME_LIMIT=e}static getRegistrationWaitingTimeLimit(){return REGISTRATION_WAITING_TIME_LIMIT}static setRegistrationWaitingTimeLimit(e){REGISTRATION_WAITING_TIME_LIMIT=e}static getRootServiceWorkerScriptPath(){return serviceWorkerScriptPath}static setRootServiceWorkerScriptPath(e){serviceWorkerScriptPath=e}static getServiceWorkerScope(){return serviceWorkerScope}static setServiceWorkerScope(e){serviceWorkerScope=e}}function createCacheRequest(e,r,i){return null!==r&&null!==i&&!isNaN(i)&&r.indexOf("#")<0&&(e.cacheName=r,e.cacheVersion=parseInt(i,10)),e}function postMessageToServiceWorkerViaMessageChannel(e,r,i=5e3){return new Promise(((t,o)=>{r&&r.type&&logServiceWorkerMessage(`Sending ${r.type} message to service worker ${e.scriptURL} ...`);let s=!1;const a=setTimeout((()=>{s||o(new Error(`Time limit of ${i}ms is reached`))}),i),c=new MessageChannel;c.port1.onmessage=i=>{clearTimeout(a);const o=i&&i.data;logServiceWorkerMessage(`Received response for ${r.type} message from service worker ${e.scriptURL}`),s=!0,t(o)},e.postMessage(r,[c.port2])}))}window.define&&window.define.amd?define('plugin-service-worker-interface',[],(()=>PluginServiceWorkerInterface)):"object"==typeof exports&&"object"==typeof module?module.exports=PluginServiceWorkerInterface:window.PluginServiceWorkerInterface=PluginServiceWorkerInterface;
const MINIMAL_SERVICE_WORKER_VERSION="240801",CACHE_NAME=null,CACHE_VERSION=null,SERVICE_WORKER_SCOPE="/",SERVICE_WORKER_SCRIPT_PATH="./plugin-service-worker.js",CACHE_MANIFEST_PATH="./manifest.appcache";requirejs.config({baseUrl:"js",paths:{knockout:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/knockout/knockout-3.5.1",jquery:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/jquery/jquery-3.7.1.min","jqueryui-amd":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/jquery/jqueryui-amd-1.14.1.min",promise:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/es6-promise/es6-promise.min",hammerjs:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/hammer/hammer-2.0.8.min",ojdnd:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/dnd-polyfill/dnd-polyfill-1.0.2.min",ojL10n:"libs/oj/18.1.0/ojL10n",persist:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/persist/min",text:"libs/require/text",signals:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/js-signals/signals.min",touchr:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/touchr/touchr","@oracle/oraclejet-preact":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/oraclejet-preact/amd","oj-c":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/../../packs/oj-c/null/min",preact:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/dist/preact.umd","preact/hooks":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/hooks/dist/hooks.umd","preact/compat":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/compat/dist/compat.umd","preact/jsx-runtime":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/jsx-runtime/dist/jsxRuntime.umd","preact/debug":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/debug/dist/debug.umd","preact/devtools":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/devtools/dist/devtools.umd",proj4:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/proj4js/dist/proj4",css:"libs/require-css/css.min",ojcss:"libs/oj/18.1.0/min/ojcss","ojs/ojcss":"libs/oj/18.1.0/min/ojcss",chai:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/chai/chai-4.5.0.min","css-builder":"libs/require-css/css-builder",normalize:"libs/require-css/normalize","ojs/normalize":"libs/require-css/normalize","jet-composites":"jet-composites"},shim:{jquery:{exports:["jQuery","$"]}}}),require(["ojs/ojcore","knockout","appController","plugin-service-worker-interface","./errors/application-critical-error","ojs/ojcontext","ojs/ojknockout","ojs/ojmodule","ojs/ojrouter","ojs/ojnavigationlist","ojs/ojbutton","ojs/ojtoolbar"],(function(t,e,r,o,c,s){$((function(){function s(){(o.setRequiredRootServiceWorkerVersion("240801"),o.setServiceWorkerScope("/"),o.setLogMessageFunction(logServiceWorkerMessage),o.cacheViaCacheManifest(SERVICE_WORKER_SCRIPT_PATH,CACHE_MANIFEST_PATH,null,null).then((t=>!0)).catch((t=>(console.error("Service Worker error: ",t),!1)))).then((()=>{let o=new r;t.Router.sync().then((function(){o.load().then((()=>{e.applyBindings(o,document.getElementById("globalBody"))}),(r=>{if(r instanceof c){let c=document.getElementById("alertDialog");t.Context.getContext(c).getBusyContext().whenReady().then((function(){o.errorAlertPopup(r.heading,r.message).then((()=>{o._pluginApiTransport.terminatePlugin()}))})),e.applyBindings(o,document.getElementById("globalBody"))}console.error(r)}))}),(function(e){t.Logger.error("Error in root start: "+e.message)}))}))}$(document.body).hasClass("oj-hybrid")?document.addEventListener("deviceready",s):s()}))}));
define("bundle-temp", function(){});

