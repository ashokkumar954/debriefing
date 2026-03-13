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


define('text!required-properties.json',[],function () { return '{\n  "format": 1,\n  "product": "19.5.0",\n  "properties": [],\n  "pluginAppsObj":[\n    {\n      "name" : "Ext",\n      "type" : "oauth_user_assertion",\n      "key" : "fusionOAuthUserAssertionApplication",\n      "comment" : "External: FFS application calling REST APIs via OAuth from OFSC. Application name: \'Concentric - Oracle Fusion Applications - User Asserted\'"\n    },\n\n    {\n      "name" : "Int",\n      "type" : "ofs",\n      "key" : "ofsApiApplication",\n      "comment" : "Internal: Field Service APIs. Application name: \'App CX Service\'"\n    }\n\n  ],\n  "plugin": {\n    "label": "mae",\n    "lang": "en",\n    "val": "MAE"\n  }\n}';});

define('constants',[],(()=>class{static get DEVICE_TYPE_DESKTOP(){return"desktop"}static get DEVICE_TYPE_MOBILE(){return"mobile"}static get INVENTORY_ENTITY_NAME(){return"inventory"}static get INVENTORY_TYPE_PART(){return"part"}static get INVENTORY_TYPE_PART_SN(){return"part_sn"}static get DELETE_ACTION_NAME(){return"delete"}static get CRITICAL_ERROR(){return"Critical Error"}static get PROPERTY_MUST_BE_CONFIGURED(){return"The following property must be configured: "}static get PROPERTIES_MUST_BE_CONFIGURED(){return"The following properties must be configured: "}static get UNABLE_TO_START(){return"Unable to start application: "}static get ERR_AUTHENTICATION(){return"We encountered an issue while trying to fetch the authorization token. Please try again later."}static get ERR_SERVER(){return"Server returned an error. HTTP Status: "}static get HASH_SYMBOL(){return"#"}static get ACTION_CLOSE(){return"close"}static get CALL_PROC(){return"callProcedure"}static get KEY_EXT(){return"Ext"}static get KEY_INT(){return"ofsApiApplication"}static get FUSION_BASE_URL(){return"https://ibfaqy-dev1.fa.ocs.oraclecloud.com:443"}}));
define('ofsc-connector',["signals","constants"],((e,t)=>{const r="default";return class{constructor(){window.addEventListener("message",this.onPostMessage.bind(this),!1),this.debugMessageSentSignal=new e,this.debugMessageReceivedSignal=new e,this.debugIncorrectMessageReceivedSignal=new e,this.messageFromOfscSignal=new e,this._currentCommunicationCallbacks={},this._currentCommunicationPromises={}}sendMessage(e){const s=this._getOriginUrl();let a=this._getKey(e),o="";return e.method!=t.CALL_PROC&&this._currentCommunicationPromises[r]?Promise.reject(new Error("Communication chanel is busy")):(o=this._processDataAndReturn(e,s,a),this._currentCommunicationPromises[a]=o,o)}_getOriginUrl(){return document.referrer||document.location.ancestorOrigins&&document.location.ancestorOrigins[0]||""}_processDataAndReturn(e,t,r){return new Promise(((s,a)=>{this._currentCommunicationCallbacks[r]=e=>(this._deleteCallbacksAndPromises(r),e instanceof Error||e.method&&"error"===e.method?a(e):s(e)),e.apiVersion=1;let o=t?this.constructor._getOrigin(t):"*";parent.postMessage(e,o),this.debugMessageSentSignal.dispatch(e)}))}_deleteCallbacksAndPromises(e){this._currentCommunicationCallbacks[e]&&delete this._currentCommunicationCallbacks[e],this._currentCommunicationPromises[e]&&delete this._currentCommunicationPromises[e]}_getKey(e){let t=r;return("callProcedure"===e.method||"callProcedureResult"===e.method||"error"===e.method&&e.callId)&&(t=e&&e.callId?e.callId.toString():""),t}onPostMessage(e){if(e.source===window)return;if(void 0===e.data)return this.debugIncorrectMessageReceivedSignal.dispatch("No data"),this.setError(),!1;let t="";try{t=JSON.parse(e.data)}catch(t){return this.setError(),this.debugIncorrectMessageReceivedSignal.dispatch("Incorrect JSON",e.data),!1}this.debugMessageReceivedSignal.dispatch(t),this.processResult(t)}setError(){this._currentCommunicationCallbacks[r]&&this._currentCommunicationCallbacks[r](new Error("No data"))}processResult(e){let t=this._getKey(e);this._currentCommunicationCallbacks[t]?this._currentCommunicationCallbacks[t](e):this.messageFromOfscSignal.dispatch(e)}static generateCallId(){return btoa(String.fromCharCode.apply(null,window.crypto.getRandomValues(new Uint8Array(16))))}static _getOrigin(e){return"string"==typeof e&&""!==e?e.indexOf("://")>-1?(window.location.protocol||"https:")+e.split("/")[2]:(window.location.protocol||"https:")+e.split("/")[0]:""}obtainToken(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"getAccessToken",params:{applicationKey:e}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),Promise.reject(e)))).catch((e=>r(e.errors)))}))}obtainTokenByScope(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"getAccessTokenByScope",params:{scope:e}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),Promise.reject(e)))).catch((e=>{if("error"===e.method)return r(e.errors)}))}))}shareFile(e){return new Promise(((t,r)=>{let s=this.constructor.generateCallId();this.sendMessage({method:"callProcedure",callId:s,procedure:"share",params:{title:"File",fileObject:e,text:"Sharing File"}}).then((e=>e.resultData?t(e.resultData):(console.error("No data.resultData in callProcedure response"),r(e)))).catch((e=>r(e.errors)))}))}}}));
define('storage/persistent-storage',[],(()=>{const t=window.localStorage;return class{static saveData(e,a){t.setItem(e,JSON.stringify(a))}static loadData(e){const a=t.getItem(e);return a?JSON.parse(a):{}}static removeData(e){t.removeItem(e)}}}));
define('services/ofsc-plugin-api-transport',["knockout","../errors/application-critical-error","text!required-properties.json","ofsc-connector","storage/persistent-storage","constants"],((e,t,s,i,o,r)=>class{constructor(){this.ofscConnector=new i,this.openData=e.observable(""),this.attributeDescriptionParam=e.observable(""),this._pluginApiMessage={},this.ofscConnector.debugMessageReceivedSignal.add((e=>{console.info("-> Plugin: ",e)})),this.ofscConnector.debugMessageSentSignal.add((e=>{console.info("<- Plugin: ",e)})),this.ofscConnector.debugIncorrectMessageReceivedSignal.add(((e,t)=>{console.error("-> Plugin: incorrect message: ",e,t)}))}terminatePlugin(){this.ofscConnector.sendMessage({method:"close"}).then((e=>{console.log("RESPONSE DATA: ",e)})).catch((e=>{console.error(e)}))}load(){return new Promise(((e,i)=>{this.ofscConnector.sendMessage({method:"ready",sendInitData:!0}).then((i=>{switch(i.method){case"init":let n=i.attributeDescription;o.saveData("plugin_attributeDescription",n),this.ofscConnector.sendMessage({method:"initEnd",wakeupNeeded:!1});break;case"open":this.openData(i),this._pluginApiMessage=i,this.attributeDescription=JSON.parse(window.localStorage.getItem("plugin_attributeDescription")),this.attributeDescriptionParam(this.attributeDescription);let a=this._verifyProperties(s,this.attributeDescription);if(""!==a)throw new t(r.CRITICAL_ERROR,a);e()}})).catch((e=>{if(e instanceof t)return i(e);console.error(r.UNABLE_TO_START,e)}))}))}_verifyProperties(e,t){let s=JSON.parse(e).properties,i=[];return Object.values(s).forEach((e=>{t[e.label]||i.push(e.label)})),i.length?1===i.length?r.PROPERTY_MUST_BE_CONFIGURED+i[0]+".":r.PROPERTIES_MUST_BE_CONFIGURED+i.join(", ")+".":""}}));
define('services/fusion-rest-api-transport',["constants"],(t=>{class e{constructor(t,e){if(!t||"string"!=typeof t)throw new Error("FusionRestApiTransport: baseUrl must be a non-empty string");if(!e||"function"!=typeof e.obtainToken)throw new Error("FusionRestApiTransport: ofscConnector must have an obtainToken method");this._baseUrl=t.replace(/\/$/,""),this._ofscConnector=e}async request(e,s,n,o,r){let a;try{a=await this._ofscConnector.obtainToken(t.KEY_EXT)}catch(e){throw new Error(t.ERR_AUTHENTICATION)}const c=a&&"object"==typeof a?a.token||a.accessToken||a.access_token||"":String(a||""),i=Object.assign({"Content-Type":"application/json",Accept:"application/json"},o,{Authorization:"Bearer "+c});return this._doRequest(e,s,n,r,i)}async _doRequest(s,n,o,r,a){const c=this._buildUrl(s,o),i={method:n,headers:a};r&&n!==e.HTTP_METHOD_GET&&(i.body=r);const T=await fetch(c,i);if(T.status>=200&&T.status<300)return 204===T.status?{}:T.json();throw new Error(t.ERR_SERVER+T.status)}async _doRequestForNonJsonResponse(s,n,o,r,a){const c=this._buildUrl(s,o),i={method:n,headers:a};r&&n!==e.HTTP_METHOD_GET&&(i.body=r);const T=await fetch(c,i);if(T.status>=200&&T.status<300)return T;throw new Error(t.ERR_SERVER+T.status)}_buildUrl(t,e){let s=this._baseUrl+t;if(e&&Object.keys(e).length>0){s+="?"+Object.keys(e).map((t=>encodeURIComponent(t)+"="+encodeURIComponent(e[t]).replace(/%3D/gi,"="))).join("&")}return s}static get HTTP_METHOD_GET(){return"GET"}static get HTTP_METHOD_POST(){return"POST"}static get HTTP_METHOD_PATCH(){return"PATCH"}static get POST_DATA_TYPE_JSON(){return"json"}static get POST_DATA_TYPE_FORM(){return"form"}}return e}));
define('services/ib-assets-service',["services/fusion-rest-api-transport","constants"],((t,e)=>{class s{constructor(s){this._transport=new t(e.FUSION_BASE_URL,s)}async getAssetsByAccountName(e){const r=await this._transport.request("/fscmRestApi/resources/11.13.18.05/installedBaseAssets",t.HTTP_METHOD_GET,{q:"CustomerSitePartyName="+e});return(r&&r.items?r.items:[]).map((t=>s._mapItem(t)))}static _mapItem(t){const e=t.Description||"",s=/battery|bat\b/i.test(e),r=/flooded|lead.?acid/i.test(e);return{instanceNumber:String(t.AssetId||""),assetId:t.AssetId||"",serial:t.SerialNumber||"",mfr:"",model:"",desc:t.ItemNumber||"",mfgDate:"",barcode:"",isBat:s,isFlood:r}}static _formatDate(t){if(!t)return"";const e=new Date(t);return isNaN(e.getTime())?"":String(e.getMonth()+1).padStart(2,"0")+"/"+String(e.getFullYear()).slice(-2)}}return s}));
define('viewModels/asset',["knockout","services/ib-assets-service"],(function(e,s){"use strict";return class{constructor(s){this.app=s&&s.app?s.app:null,this.problemCodeOptions=e.observableArray([]),this.hasOptions=e.computed((()=>this.problemCodeOptions().length>0)),this.problemCodeCount=e.computed((()=>this.problemCodeOptions().length)),this.showAllAssets=e.observable(!1),this._enumValues={},this._loadProblemCodes()}_loadProblemCodes(){this.app?this.app.loaded.then((()=>{var e=this.app._openData,s=this.app._attributeDescription;console.log("[AssetViewModel] openData received:",e),console.log("[AssetViewModel] attrDesc:",s),e?this._processOpenData(e,s):console.warn("[AssetViewModel] No openData available")})):console.warn("[AssetViewModel] No app instance")}_processOpenData(e,o){var t=e.openParams||{};console.log("[DEBUG] openData keys:",Object.keys(e)),console.log("[DEBUG] openParams keys:",Object.keys(t)),console.log("[DEBUG] openData.activity:",e.activity),console.log("[DEBUG] openParams.enum:",t.enum),console.log("[DEBUG] openParams.properties:",t.properties),console.log("[DEBUG] attributeDescription keys:",Object.keys(o||{})),console.log("[DEBUG] attrDesc problem_code entry:",o&&o.problem_code);try{var a=localStorage.getItem("plugin_attributeDescription"),l=a?JSON.parse(a):{};console.log("[DEBUG] localStorage attrDesc keys:",Object.keys(l)),console.log("[DEBUG] localStorage problem_code:",l.problem_code)}catch(e){}var n={};if(t.enum&&t.enum.problem_code&&(n=t.enum.problem_code,console.log("[AssetViewModel] enum from openParams.enum:",n)),0===Object.keys(n).length){var i=t.attributeDescription||o||{};i.problem_code&&i.problem_code.enum&&Object.entries(i.problem_code.enum).forEach((([e,s])=>{s.inactive||(n[e]="object"==typeof s?s.text:s)}))}if(0===Object.keys(n).length&&e.attributeDescription){var r=e.attributeDescription;r.problem_code&&r.problem_code.enum&&Object.entries(r.problem_code.enum).forEach((([e,s])=>{s.inactive||(n[e]="object"==typeof s?s.text:s)}))}if(0===Object.keys(n).length)try{var c=localStorage.getItem("plugin_attributeDescription");if(c){var p=JSON.parse(c);p.problem_code&&p.problem_code.enum&&(Object.entries(p.problem_code.enum).forEach((([e,s])=>{s.inactive||(n[e]="object"==typeof s?s.text:s)})),console.log("[AssetViewModel] enum from localStorage:",n))}}catch(e){console.warn("[AssetViewModel] localStorage error:",e)}console.log("[AssetViewModel] Final enumValues:",n),this._enumValues=n,window.__problemCodeEnum=n,window.__activityId=e.activity&&e.activity.aid||"",window.__ibAssets=null;var d=t.properties||{},m=d.wo_account_name||e.activity&&e.activity.wo_account_name||"";if(console.log("[AssetViewModel] wo_account_name:",m,"| props keys:",Object.keys(d)),m&&this.app&&this.app.ofscConnector){var u=new s(this.app.ofscConnector);this._ibAssetsReady=u.getAssetsByAccountName(m).then((function(e){window.__ibAssets=e,console.log("[AssetViewModel] IB Assets loaded:",e.length)})).catch((function(e){console.warn("[AssetViewModel] IB Assets fetch failed (offline?):",e)}))}else console.warn("[AssetViewModel] wo_account_name not found in openParams.properties or openData.activity — skipping IB fetch."),this._ibAssetsReady=Promise.resolve();this.problemCodeOptions(Object.keys(n).map((e=>({index:e,label:n[e]}))))}navigateToAllAssets(){this.showAllAssets(!0),(this._ibAssetsReady||Promise.resolve()).then((()=>{this._ensureAssetsLoaded((()=>{if("undefined"!=typeof AllAssetDetails){var e=window.__ibAssets&&window.__ibAssets.length>0?window.__ibAssets:this._enumValues;AllAssetDetails.render("all-assets-inline-container",e)}}))}))}_ensureAssetsLoaded(e){if(!document.getElementById("cc-asset-styles")){var s=document.createElement("link");s.id="cc-asset-styles",s.rel="stylesheet",s.href="asset-details.css",document.head.appendChild(s)}if("undefined"==typeof AllAssetDetails){var o=document.createElement("script");o.src="asset-detail.js",o.onload=()=>{var s=document.createElement("script");s.src="all-asset-details.js",s.onload=e,s.onerror=()=>console.error("[AssetViewModel] Failed to load all-asset-details.js"),document.head.appendChild(s)},o.onerror=()=>console.error("[AssetViewModel] Failed to load asset-detail.js"),document.head.appendChild(o)}else e()}goBack(){this.showAllAssets(!1);var e=document.getElementById("all-assets-inline-container");e&&(e.innerHTML="")}}}));

define('text!views/asset.html',[],function () { return '<!-- src/js/views/asset.html -->\r\n<div class="cc-plugin">\r\n\r\n    <!-- ── LANDING VIEW ── -->\r\n    <div data-bind="ifnot: showAllAssets">\r\n        <div class="cc-landing">\r\n            <div class="cc-landing-title">Multi-Asset Execution (MAE)</div>\r\n            <div class="cc-landing-sub">Asset service management</div>\r\n\r\n            <div class="cc-banner-ok">\r\n                <strong style="color:#3a7030;">&#10003; Assets loaded for this customer.</strong>\r\n            </div>\r\n            <button class="cc-primary-btn" data-bind="click: navigateToAllAssets">\r\n                View Assets Associated to this Customer &rarr;\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- ── ALL ASSETS INLINE VIEW ── -->\r\n    <div data-bind="if: showAllAssets" style="width:100%;">\r\n\r\n        <div class="cc-header">\r\n            <button class="cc-back-btn" data-bind="click: goBack">&#8592;</button>\r\n            <span class="cc-h-title">Multi-Asset Execution (MAE)</span>\r\n            <span class="cc-h-badge" data-bind="text: problemCodeCount() + \' asset(s)\'"></span>\r\n        </div>\r\n\r\n        <div class="cc-toolbar">\r\n            <span class="cc-tb-title">Asset Details</span>\r\n            <span class="cc-tb-spacer"></span>\r\n            <button class="cc-icon-btn" title="Refresh"\r\n                    data-bind="click: navigateToAllAssets">\r\n                &#8635;\r\n            </button>\r\n        </div>\r\n\r\n        <div class="cc-cards-wrap">\r\n            <div id="all-assets-inline-container">\r\n                <div class="cc-no-data">Loading asset details&hellip;</div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>';});

var AssetDetail=function(){var e=["Cables","Connectors","Contact Tips","Shrouds","Vent Caps","Watering System","Battery Tray","Physical damage"],t=["Cables","Connectors","Contact Tips","Shrouds","Watering System","Battery Tray","Physical damage"],c='<option value="1">1 - Good Condition</option><option value="2">2 - Address Customer Request</option><option value="3">3 - Safety Related Issue</option><option value="4">4 - Does not meet design Specification</option><option value="5">5 - Missing</option>',a={ids:[29148,30021,11553,44821,76320,55019,38741],ser:["7970CL","PL111222333","BT44921","HK-0012","DK-7731","CL-8820","PL-3310"],mfr:["DEKA","HAWKER","DEKA","EnerSys","DEKA","HAWKER","EnerSys"],mdl:["24-G75-19","18-125F-13","24-85-17","36-125-13","48-G75-19","18-100F-11","24-G85-17"],dsc:["Sit","Stand","Reach","Sit","Counterbalance","Reach","Stand"],mfd:["01/11","03/15","07/18","11/20","02/19","06/17","09/21"],age:[99,15,82,55,71,43,38],dates:["08/26/2025","09/10/2025","07/15/2025","10/01/2025","08/01/2025","11/05/2025","06/20/2025"],hrs:[54,15,null,null,12,null,null]};function n(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function i(e){return"mae_record_"+(void 0!==window.__activityId&&window.__activityId?window.__activityId:"local")+"_"+e}function l(e){var t=document.getElementById("cc-sum-"+e);if(t){var c=t.dataset.code||String(e),a=function(e){var t=document.getElementById("cc-note-"+e),c=document.getElementById("cc-repair-"+e),a=document.getElementById("cc-complete-"+e),n=document.getElementById("cc-det-"+e),i={};n&&n.querySelectorAll(".cc-chkl-input").forEach((function(e){var t=e.nextElementSibling?e.nextElementSibling.textContent.trim():e.id;i[t]=e.checked}));var l={};n&&n.querySelectorAll(".cc-comp-sel").forEach((function(e){var t=e.previousElementSibling?e.previousElementSibling.textContent.trim():e.id;l[t]=e.value}));var s={};n&&n.querySelectorAll(".cc-rd-input").forEach((function(e){s[e.dataset.label||e.id]=e.value}));return{rowIndex:e,note:t?t.value:"",checklist:i,components:l,readings:s,needsRepair:!!c&&c.checked,complete:!!a&&a.checked,savedAt:(new Date).toISOString()}}(e);try{localStorage.setItem(i(c),JSON.stringify(a))}catch(e){console.warn("[AssetDetail] localStorage save failed:",e)}s(e)}}function s(e){var t=document.getElementById("cc-status-"+e);if(t){var c,a=document.getElementById("cc-sum-"+e),n=a&&a.dataset.code||String(e),l=null;try{(c=localStorage.getItem(i(n)))&&(l=JSON.parse(c))}catch(e){}if(!l)return t.style.display="none",void(t.textContent="");l.complete?(t.textContent="✓ Complete",t.style.cssText="display:inline-block;font-size:10px;margin-left:6px;background:#2a7a2a;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;"):(t.textContent="● Saved",t.style.cssText="display:inline-block;font-size:10px;margin-left:6px;background:#c67c00;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;")}}function d(e){var t=document.getElementById("cc-det-"+e),c=document.getElementById("cc-sum-"+e),a=document.getElementById("cc-ebtn-"+e);if(t){var n=t.classList.toggle("cc-open");c&&c.classList.toggle("cc-row-open",n),a&&(a.innerHTML=n?"&#8964;":"&#8250;"),n&&(function(e){var t=document.getElementById("cc-sum-"+e);if(t){var c,a=t.dataset.code||String(e);try{c=localStorage.getItem(i(a))}catch(e){return}if(c){var n;try{n=JSON.parse(c)}catch(e){return}var l=document.getElementById("cc-det-"+e);if(l){n.checklist&&l.querySelectorAll(".cc-chkl-input").forEach((function(e){var t=e.nextElementSibling?e.nextElementSibling.textContent.trim():"";t&&void 0!==n.checklist[t]&&(e.checked=n.checklist[t])})),n.components&&l.querySelectorAll(".cc-comp-sel").forEach((function(e){var t=e.previousElementSibling?e.previousElementSibling.textContent.trim():"";t&&void 0!==n.components[t]&&(e.value=n.components[t])})),n.readings&&l.querySelectorAll(".cc-rd-input").forEach((function(e){var t=e.dataset.label||e.id;void 0!==n.readings[t]&&(e.value=n.readings[t])}));var s=document.getElementById("cc-note-"+e);s&&void 0!==n.note&&(s.value=n.note);var d=document.getElementById("cc-repair-"+e);d&&void 0!==n.needsRepair&&(d.checked=n.needsRepair);var o=document.getElementById("cc-complete-"+e);o&&void 0!==n.complete&&(o.checked=n.complete)}}}}(e),function(e){var t=document.getElementById("cc-det-"+e);t&&t.querySelectorAll(".cc-comp-sel").forEach((function(e){if(!e.dataset.compactInit){e.dataset.compactInit="1";var t=Array.from(e.options).map((function(e){return e.text}));e.addEventListener("mousedown",(function(){Array.from(e.options).forEach((function(e,c){e.text=t[c]}))})),e.addEventListener("change",(function(){setTimeout(c,0)})),e.addEventListener("blur",c),c()}function c(){Array.from(e.options).forEach((function(e){e.text=e.value}))}}))}(e))}}return{createRows:function(i,l,d){var o,r,u,v;if("object"==typeof i&&null!==i){var p=i;v=l,r=String(p.instanceNumber||p.assetId||v),u=(p.desc||"")+" ("+(p.assetId||"")+")",o={isBat:p.isBat,isFlood:p.isFlood,assetId:p.assetId||"",serial:p.serial||"",mfr:p.mfr||"",model:p.model||"",desc:p.desc||"",mfgDate:p.mfgDate||"",age:"",barcode:p.barcode||"",dates:["—","—","—","—"],lcDate:"—",totalHrs:null,lowVdc:p.isFlood?"2.222":"7.7",highVdc:p.isFlood?"2.23":"6",lowSg:p.isBat?null:p.isFlood?"1.111":"1.280"}}else v=d,o=function(e,t){var c=(e.length+t.length)%7,n=/^BAT-/i.test(e),i=/flooded|lead/i.test(t);return{isBat:n,isFlood:i,assetId:a.ids[c],serial:a.ser[c],mfr:a.mfr[c],model:a.mdl[c],desc:a.dsc[c],mfgDate:a.mfd[c],age:a.age[c],barcode:"",dates:[a.dates[c],a.dates[c],a.dates[c],a.dates[c]],lcDate:a.dates[c],totalHrs:a.hrs[c],lowVdc:i?"2.222":"7.7",highVdc:i?"2.23":"6",lowSg:n?null:i?"1.111":"1.280"}}(r=i,u=l);var m=document.createDocumentFragment(),f=document.createElement("tr");f.id="cc-sum-"+v,f.className="cc-asset-row",f.dataset.assetId=String(o.assetId),f.dataset.serial=o.serial,f.dataset.label=u,f.dataset.code=r,f.innerHTML='<td class="cc-summary-td cc-expand-td"><button class="cc-expand-btn" id="cc-ebtn-'+v+'" onclick="AssetDetail.toggle('+v+')">&#8250;</button></td><td class="cc-summary-td" style="width:34px;text-align:center;"><button class="cc-view-btn" title="View" onclick="AssetDetail.toggle('+v+')">&#128065;</button></td><td class="cc-summary-td"><span class="cc-code-pill" title="'+n(r)+'">'+n(u)+'</span><span id="cc-status-'+v+'" style="display:none;"></span></td><td class="cc-summary-td">'+o.serial+'</td><td class="cc-summary-td">'+o.mfr+'</td><td class="cc-summary-td">'+o.model+"</td>",m.appendChild(f);var g=document.createElement("tr");g.id="cc-det-"+v,g.className="cc-detail-row";var h=document.createElement("td");return h.colSpan=6,h.className="cc-detail-panel",h.innerHTML=function(a,i,l,s){var d=a.isBat,o=d?e:t,r=a.dates.filter((function(e){return e&&"—"!==e})),u=r.map((function(e){return'<span class="cc-lc-chip">'+e+"</span>"})).join("");d&&r.length>0&&(u+='<span class="cc-lc-chip na">N/A</span>');u||(u='<span class="cc-lc-chip na">No history</span>');var v=["Visual Inspection","Added Water","BDR Download","Wash"];d&&v.push("ICC Torque");var p=v.map((function(e,t){return'<div class="cc-chk-item"><input type="checkbox" class="cc-chk-input cc-chkl-input" id="cc-chkl-'+s+"-"+t+'" oninput="AssetDetail.updateNote('+s+')"/><span>'+e+"</span></div>"})).join(""),m='<div class="cc-rd-col"><div class="cc-rd-lbl">Low VDC</div><input type="text" class="cc-rd-input" id="cc-rd-lowvdc-'+s+'" data-label="Low VDC" value="'+n(String(a.lowVdc))+'" oninput="AssetDetail.updateNote('+s+')"/></div><div class="cc-rd-col"><div class="cc-rd-lbl">High VDC</div><input type="text" class="cc-rd-input" id="cc-rd-highvdc-'+s+'" data-label="High VDC" value="'+n(String(a.highVdc))+'" oninput="AssetDetail.updateNote('+s+')"/></div>';d||(m+='<div class="cc-rd-col"><div class="cc-rd-lbl">Low SG</div><input type="text" class="cc-rd-input" id="cc-rd-lowsg-'+s+'" data-label="Low SG" value="'+n(String(a.lowSg||""))+'" oninput="AssetDetail.updateNote('+s+')"/></div>');var f=o.map((function(e,t){return'<div class="cc-comp-row"><span>'+e+'</span><select class="cc-comp-sel" id="cc-comp-'+s+"-"+t+'" oninput="AssetDetail.updateNote('+s+')">'+c+"</select></div>"})).join("");return'<div class="cc-hazard"></div><div class="cc-detail-subtitle" id="cc-sub-'+s+'"><span class="cc-sub-label">'+n(l)+" &mdash; "+n(i)+'</span><div class="cc-action-btns"><button class="cc-btn-close"    onclick="AssetDetail.closeRow('+s+')">&#10005; Close</button><button class="cc-btn-save"     onclick="AssetDetail.saveRow('+s+')">&#10003; Save</button><button class="cc-btn-continue" onclick="AssetDetail.continueRow('+s+')">&#8594; Continue</button></div></div><div class="cc-card-body"><div class="cc-sec-asset"><div class="cc-fields-grid"><div class="cc-field"><div class="cc-f-lbl">Assets ID</div><div class="cc-f-val cc-f-val-id">'+a.assetId+'</div></div><div class="cc-field"><div class="cc-f-lbl">Serial</div><div class="cc-f-val">'+a.serial+'</div></div><div class="cc-field"><div class="cc-f-lbl">Manufacturer Id</div><div class="cc-f-val">'+a.mfr+'</div></div><div class="cc-field"><div class="cc-f-lbl">Model</div><div class="cc-f-val">'+a.model+'</div></div><div class="cc-field"><div class="cc-f-lbl">Description</div><div class="cc-f-val">'+a.desc+'</div></div><div class="cc-field"><div class="cc-f-lbl">Mfg Date</div><div class="cc-f-val">'+a.mfgDate+'</div></div><div class="cc-field"><div class="cc-f-lbl">Age</div><div class="cc-f-val">'+a.age+'</div></div><div class="cc-field"><div class="cc-f-lbl">Barcode</div><div class="cc-f-val">'+(a.barcode||"&mdash;")+'</div></div></div><div class="cc-lc-block"><div class="cc-lc-title">Last Completed</div><div class="cc-lc-dates">'+u+'</div><div class="cc-checklist">'+p+'</div></div></div><div class="cc-sec-reading"><div class="cc-lc-box"><div class="cc-lc-box-lbl">Last<br>Complete</div><div class="cc-lc-box-date">'+(a.lcDate&&"—"!==a.lcDate?a.lcDate:"N/A")+'</div><div class="cc-lc-box-pm">PM</div></div><div class="cc-rd-title">Last Reading</div><div class="cc-rd-row">'+m+"</div></div>"+(d?'<div class="cc-sec-comps"><div class="cc-sec-title">Components</div>'+f+"</div>":"")+'<div class="cc-sec-note"><div class="cc-sec-title">Problem Note</div><textarea class="cc-note-area" id="cc-note-'+s+'" placeholder="Enter problem note…"></textarea><div class="cc-note-chk"><span>Needs Repair</span><input type="checkbox" class="cc-chk-input" id="cc-repair-'+s+'"/></div><div class="cc-note-chk"><span>Complete</span><input type="checkbox" class="cc-chk-input" id="cc-complete-'+s+'"/></div></div></div>'}(o,u,r,v),g.appendChild(h),m.appendChild(g),setTimeout((function(){s(v)}),0),m},toggle:d,saveRow:function(e){l(e);var t=document.getElementById("cc-sub-"+e),c=t?t.querySelector(".cc-btn-save"):null;if(c){var a=c.innerHTML;c.innerHTML="&#10003; Saved!",setTimeout((function(){c.innerHTML=a}),800)}},continueRow:function(e){l(e);var t=document.getElementById("cc-sub-"+e),c=t?t.querySelector(".cc-btn-continue"):null;if(c){var a=c.innerHTML;c.innerHTML="&#10003; Saved!",setTimeout((function(){c.innerHTML=a,d(e)}),800)}else d(e)},closeRow:function(e){d(e)},updateNote:function(e){var t=document.getElementById("cc-note-"+e),c=document.getElementById("cc-det-"+e);if(t&&c){var a=[],n=[];c.querySelectorAll(".cc-chkl-input").forEach((function(e){if(e.checked){var t=e.nextElementSibling;t&&n.push(t.textContent.trim())}})),n.length&&a.push("Checklist: "+n.join(", "));var i=[];c.querySelectorAll(".cc-comp-sel").forEach((function(e){if(e.value&&"1"!==e.value){var t=e.previousElementSibling,c=t?t.textContent.trim():e.id,a=e.options[e.selectedIndex]?e.options[e.selectedIndex].text:e.value;i.push(c+": "+a)}})),i.length&&a.push("Components: "+i.join(", "));var l=[];c.querySelectorAll(".cc-rd-input").forEach((function(e){var t=e.value.trim();t&&l.push((e.dataset.label||e.id)+": "+t)})),l.length&&a.push("Readings: "+l.join("\n")),t.value=a.join("\n")}},getSavedStatus:function(e){var t=document.getElementById("cc-sum-"+e);if(!t)return null;var c,a=t.dataset.code||String(e);try{c=localStorage.getItem(i(a))}catch(e){return null}if(!c)return null;try{var n=JSON.parse(c);return{complete:!!n.complete,needsRepair:!!n.needsRepair}}catch(e){return null}}}}();
define("viewModels/asset-detail", function(){});


define('text!views/asset-detail.html',[],function () { return '<!DOCTYPE html>\n<!--\n    all-asset-details.html\n    Standalone page version of the asset details view.\n    Used only if direct navigation is needed; inline rendering via asset.html is preferred.\n-->\n<html lang="en-us">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Asset Details — Multi-Asset Execution (MAE)</title>\n    <link rel="stylesheet" href="asset-details.css"/>\n</head>\n<body class="cc-plugin">\n\n    <!-- Header -->\n    <div class="cc-header">\n        <button class="cc-back-btn" onclick="history.back()">&#8592;</button>\n        <span class="cc-h-title">Multi-Asset Execution (MAE)</span>\n        <span class="cc-h-badge" id="cc-badge">0</span>\n    </div>\n\n    <!-- Toolbar -->\n    <div class="cc-toolbar">\n        <span class="cc-tb-title">Asset Details</span>\n        <span class="cc-tb-spacer"></span>\n        <button class="cc-icon-btn" title="Refresh" onclick="rerender()">&#8635;</button>\n    </div>\n\n    <!-- Table container -->\n    <div class="cc-cards-wrap">\n        <div id="all-assets-inline-container">\n            <div class="cc-no-data">Loading&hellip;</div>\n        </div>\n    </div>\n\n    <script src="asset-detail.js"></script>\n    <script src="all-asset-details.js"></script>\n    <script>\n        (function () {\n            var enumValues = window.__problemCodeEnum || {};\n            var keys = Object.keys(enumValues);\n\n            var badge = document.getElementById(\'cc-badge\');\n            if (badge) badge.textContent = keys.length + \' asset(s)\';\n\n            AllAssetDetails.render(\'all-assets-inline-container\', enumValues);\n\n            window.rerender = function () {\n                AllAssetDetails.render(\'all-assets-inline-container\', enumValues);\n            };\n        })();\n    </script>\n</body>\n</html>';});

var AllAssetDetails=function(){var e={};function t(t){var s=document.getElementById("cc-search-"+t),a=document.getElementById("cc-tbody-"+t);if(a){var c=s?s.value.trim().toLowerCase():"",l=(e[t]||{}).filter||"all";a.querySelectorAll(".cc-asset-row").forEach((function(e){var t=e.id.replace("cc-sum-",""),s=(e.dataset.assetId||"").toLowerCase(),a=(e.dataset.serial||"").toLowerCase(),n=(e.dataset.label||"").toLowerCase(),r=(e.dataset.code||"").toLowerCase(),i=document.getElementById("cc-det-"+t),o=i?i.querySelector("#cc-complete-"+t):null,d=!!o&&o.checked;if(!d&&"undefined"!=typeof AssetDetail&&AssetDetail.getSavedStatus){var p=AssetDetail.getSavedStatus(t);p&&(d=p.complete)}var u=(!c||-1!==s.indexOf(c)||-1!==a.indexOf(c)||-1!==n.indexOf(c)||-1!==r.indexOf(c))&&("all"===l||"completed"===l&&d||"pending"===l&&!d);e.style.display=u?"":"none",i&&(i.style.display=u?"":"none")}))}}return{render:function(t,s){var a=document.getElementById(t);if(a){var c=Array.isArray(s);a.innerHTML="",e[t]={filter:"all"};var l=c?s.length:Object.keys(s||{}).length;if(0!==l){var n=document.createElement("div");n.className="cc-search-wrap",n.innerHTML='<div class="cc-search-input-wrap"><span class="cc-search-icon">&#128269;</span><input type="text" class="cc-search-input" id="cc-search-'+t+'" placeholder="Enter Asset# or Serial#" oninput="AllAssetDetails.applyFilter(\''+t+'\')"/></div><div class="cc-filter-tabs" id="cc-tabs-'+t+'"><button class="cc-tab cc-tab-active" onclick="AllAssetDetails.setFilter(\''+t+"', 'all', this)\">All</button><button class=\"cc-tab\" onclick=\"AllAssetDetails.setFilter('"+t+"', 'pending', this)\">Pending</button><button class=\"cc-tab\" onclick=\"AllAssetDetails.setFilter('"+t+"', 'completed', this)\">Completed</button></div>",a.appendChild(n);var r=document.createElement("table");r.className="cc-asset-table";var i=document.createElement("thead");i.innerHTML='<tr><th style="width:28px;"></th><th style="width:28px;">Actions</th><th>'+(c?"Description":"Problem Code")+"</th><th>Serial</th><th>Manufacturer</th><th>Model</th></tr>",r.appendChild(i);var o=document.createElement("tbody");o.id="cc-tbody-"+t,c?s.forEach((function(e,t){o.appendChild(AssetDetail.createRows(e,t))})):Object.keys(s).forEach((function(e,t){o.appendChild(AssetDetail.createRows(e,s[e],t))})),r.appendChild(o),a.appendChild(r),console.log("[AllAssetDetails] Rendered "+l+" row(s) ("+(c?"IB Assets":"problem_code enum")+").")}else a.innerHTML=c?'<p class="cc-no-data"><strong>No IB Assets found for this customer.</strong></p>':'<p class="cc-no-data"><strong>No problem_code values received.</strong><br>Please ensure <em>problem_code</em> is added to plugin Properties with Read or Read/Write access.</p>'}else console.error("[AllAssetDetails] Container not found:",t)},applyFilter:t,setFilter:function(s,a,c){e[s]||(e[s]={}),e[s].filter=a;var l=document.getElementById("cc-tabs-"+s);l&&l.querySelectorAll(".cc-tab").forEach((function(e){e.classList.remove("cc-tab-active")})),c&&c.classList.add("cc-tab-active"),t(s)}}}();
define("viewModels/all-asset-details", function(){});


define('text!views/all-asset-details.html',[],function () { return '<!DOCTYPE html>\n<!--\n    all-asset-details.html\n    Displays one Battery PM asset card per problem_code value received from OFSC.\n    Integrates with the existing plugin via postMessage.\n-->\n<html lang="en-us">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>All Asset Details</title>\n    <link rel="stylesheet" href="../../asset-detail.css" type="text/css"/>\n    <style>\n        /* Page-level styles */\n        * { box-sizing: border-box; margin: 0; padding: 0; }\n\n        body {\n            background: #e8e8e8;\n            font-family: Arial, sans-serif;\n        }\n\n        /* Top navigation bar matching screenshot */\n        .page-topbar {\n            background: #1565c0;\n            color: #fff;\n            display: flex;\n            align-items: center;\n            padding: 8px 16px;\n            gap: 12px;\n            position: sticky;\n            top: 0;\n            z-index: 100;\n            box-shadow: 0 2px 6px rgba(0,0,0,0.3);\n        }\n\n        .page-topbar .back-btn {\n            background: none;\n            border: none;\n            color: #fff;\n            font-size: 20px;\n            cursor: pointer;\n            padding: 4px 8px;\n        }\n\n        .page-topbar .title {\n            flex: 1;\n            text-align: center;\n            font-size: 17px;\n            font-weight: 700;\n            letter-spacing: 0.3px;\n        }\n\n        .page-topbar .fwd-btn {\n            background: none;\n            border: none;\n            color: #fff;\n            font-size: 20px;\n            cursor: pointer;\n            padding: 4px 8px;\n        }\n\n        /* Section header: "Battery PM ˄" + save/refresh icons */\n        .section-header {\n            display: flex;\n            align-items: center;\n            padding: 10px 16px 6px 16px;\n            gap: 8px;\n            background: #f0f0f0;\n            border-bottom: 1px solid #ccc;\n            position: sticky;\n            top: 48px;\n            z-index: 90;\n        }\n\n        .section-title {\n            font-size: 20px;\n            font-weight: 700;\n            color: #111;\n        }\n\n        .section-toggle {\n            font-size: 16px;\n            cursor: pointer;\n            color: #555;\n            user-select: none;\n        }\n\n        .section-actions {\n            margin-left: auto;\n            display: flex;\n            gap: 8px;\n        }\n\n        .icon-btn {\n            width: 32px;\n            height: 32px;\n            border-radius: 50%;\n            border: 2px solid #4caf50;\n            background: #fff;\n            color: #4caf50;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            cursor: pointer;\n            font-size: 15px;\n        }\n\n        .icon-btn:hover {\n            background: #4caf50;\n            color: #fff;\n        }\n\n        /* Cards container */\n        .cards-container {\n            padding: 12px 16px;\n        }\n\n        /* Loading state */\n        .loading-msg {\n            text-align: center;\n            padding: 40px;\n            color: #666;\n            font-size: 15px;\n        }\n\n        /* No data state */\n        .no-data-msg {\n            background: #fff3cd;\n            border: 1px solid #ffc107;\n            border-radius: 6px;\n            padding: 16px;\n            margin: 16px;\n            color: #856404;\n            font-size: 14px;\n        }\n\n        /* Problem code count badge */\n        .count-badge {\n            background: #1565c0;\n            color: #fff;\n            border-radius: 12px;\n            padding: 2px 10px;\n            font-size: 12px;\n            font-weight: 600;\n            margin-left: 4px;\n        }\n    </style>\n</head>\n<body>\n\n    <!-- Top navigation bar -->\n    <div class="page-topbar">\n        <button class="back-btn" onclick="history.back()">&#8592;</button>\n        <div class="title" id="page-title">Service Call</div>\n        <button class="fwd-btn">&#8594;</button>\n    </div>\n\n    <!-- Section header -->\n    <div class="section-header">\n        <span class="section-title">All Assets</span>\n        <span class="section-toggle" id="section-toggle" onclick="toggleSection()">&#8743;</span>\n        <span class="count-badge" id="count-badge">0</span>\n        <div class="section-actions">\n            <button class="icon-btn" title="Refresh" onclick="refreshCards()">&#8635;</button>\n            <button class="icon-btn" title="Save" onclick="saveAll()">&#128190;</button>\n        </div>\n    </div>\n\n    <!-- Cards will be injected here -->\n    <div class="cards-container" id="cards-container">\n        <div class="loading-msg" id="loading-msg">\n            Loading asset details...\n        </div>\n    </div>\n\n    <script src="asset-detail.js"></script>\n    <script src="all-asset-details.js"></script>\n</body>\n</html>\n';});

define('appController',["ojs/ojcore","knockout","./services/ofsc-plugin-api-transport","ojs/ojrouter","ojs/ojvalidation-datetime","viewModels/asset","text!views/asset.html","viewModels/asset-detail","text!views/asset-detail.html","viewModels/all-asset-details","text!views/all-asset-details.html"],(function(t,e,o){return class{constructor(){this.router=t.Router.rootInstance,this.router.configure({asset:{label:"asset",isDefault:!0},"asset-detail":{label:"asset-detail"},"all-asset-details":{label:"all-asset-details"}}),t.Router.defaults.urlAdapter=new t.Router.urlParamAdapter,this.router.moduleConfig.params.app=this,this._openData=null,this._attributeDescription=null,this._pluginApiTransport=new o,this.ofscConnector=this._pluginApiTransport.ofscConnector,this._loadedResolve=null,this.loaded=new Promise((t=>{this._loadedResolve=t}))}load(){return new Promise((t=>{this._pluginApiTransport.load().then((()=>{this._openData=this._pluginApiTransport.openData(),this._attributeDescription=this._pluginApiTransport.attributeDescriptionParam(),console.log("[AppController] loaded successfully"),console.log("[AppController] _openData:",this._openData),console.log("[AppController] _attributeDescription:",this._attributeDescription),this._loadedResolve(),t()})).catch((e=>{console.warn("[AppController] Transport error, trying to get data anyway:",e);try{this._openData=this._pluginApiTransport.openData(),this._attributeDescription=this._pluginApiTransport.attributeDescriptionParam(),console.log("[AppController] Got data despite error:",this._openData),console.log("[AppController] _attributeDescription despite error:",this._attributeDescription)}catch(t){console.warn("[AppController] Could not get data from transport:",t)}this._loadedResolve(),t()}))}))}}}));
let logServiceWorkerMessage=()=>{},serviceWorkerRegistrationMutexName="mutex-root-service-worker-registration",requiredRootServiceWorkerVersion="NA",serviceWorkerScriptPath="plugin-service-worker.js",serviceWorkerScope="/",GET_SERVICE_WORKER_VERSION_TIME_LIMIT=5e3,CACHE_RESOURCES_TIME_LIMIT=3e4,SW_ACTIVATION_TIME_LIMIT=1e4,REGISTRATION_WAITING_TIME_LIMIT=1e4;class PluginServiceWorkerInterface{static async cacheViaCacheManifest(e,r,i=null,t=null){if(!navigator.locks)throw new Error("Web Locks API is not supported");return await navigator.locks.request(serviceWorkerRegistrationMutexName,(async o=>{const{serviceWorker:s,serviceWorkerRegistration:a}=await this.getActualServiceWorkerAndRegistration(e);return{cache:(await postMessageToServiceWorkerViaMessageChannel(s,createCacheRequest({type:"CACHE_VIA_CACHE_MANIFEST",path:r},i,t),CACHE_RESOURCES_TIME_LIMIT)).result,serviceWorkerRegistration:a,serviceWorker:s}}))}static async cacheResourcesList(e,r,i=null,t=null){if(!navigator.locks)throw new Error("Web Locks API is not supported");return await navigator.locks.request(serviceWorkerRegistrationMutexName,(async o=>{const{serviceWorker:s,serviceWorkerRegistration:a}=await this.getActualServiceWorkerAndRegistration(e);return{cache:(await postMessageToServiceWorkerViaMessageChannel(s,createCacheRequest({type:"CACHE_RESOURCES_LIST",resourcesList:r},i,t),CACHE_RESOURCES_TIME_LIMIT)).result,serviceWorkerRegistration:a,serviceWorker:s}}))}static async getActualServiceWorkerAndRegistration(e){if(!navigator.serviceWorker)throw new Error("Service workers are not supported");let r=await this.registerOrGetRootServiceWorker(e);const i=await navigator.serviceWorker.getRegistration();return logServiceWorkerMessage(`Active service worker: ${r.scriptURL}, state: ${r.state}, scope: ${i.scope}`),r=await this.actualizeServiceWorker(r,e),logServiceWorkerMessage(`Actualized service worker state: ${r.state}`),{serviceWorker:r,serviceWorkerRegistration:i}}static async registerOrGetRootServiceWorker(e){let r=await navigator.serviceWorker.getRegistration();if(r)return logServiceWorkerMessage("Service worker registration is obtained"),this.waitUntilServiceWorkerIsActivated(r);logServiceWorkerMessage("Service worker registration is absent");const i=await this.registerServiceWorker(e);if(!i){logServiceWorkerMessage("Waiting registration of the service worker by another plugin");return(await this.waitForServiceWorkerRegistration()).active}return logServiceWorkerMessage("Service worker is registered"),this.waitUntilServiceWorkerIsActivated(i)}static async actualizeServiceWorker(e,r){logServiceWorkerMessage("Requesting service worker version...");const i=(await postMessageToServiceWorkerViaMessageChannel(e,{type:"GET_VERSION"},GET_SERVICE_WORKER_VERSION_TIME_LIMIT)).result;if(logServiceWorkerMessage(`Required service worker version: ${requiredRootServiceWorkerVersion}`),logServiceWorkerMessage(`Current service worker version: ${i}`),this.isServiceWorkerVersionNeedsToBeUpdated(i)){let e;logServiceWorkerMessage("The service worker has to be updated");try{e=await this.registerServiceWorker(r)}catch(i){if(!i||"Job rejected for non app-bound domain"!==i.message)throw i;{logServiceWorkerMessage(`Unable to update Service Worker. ${i.message}.`),logServiceWorkerMessage("Attempting to remove Service Worker and register it again.");const t=await navigator.serviceWorker.getRegistrations();if(!t)throw i;await Promise.all(t.map((e=>(logServiceWorkerMessage(`Removing Service Worker Registration for scope "${e.scope}"`),e.unregister())))),e=await this.registerServiceWorker(r)}}return e?this.waitUntilServiceWorkerIsActivated(e):(logServiceWorkerMessage("Waiting registration of the service worker by another plugin"),e=await this.waitForServiceWorkerRegistration(),logServiceWorkerMessage("Obtained service worker registration"),this.actualizeServiceWorker(await this.waitUntilServiceWorkerIsActivated(e),r))}return logServiceWorkerMessage("The service worker version is actual"),e}static async registerServiceWorker(e){logServiceWorkerMessage("Registering new service worker");const r={};serviceWorkerScope&&(r.scope=serviceWorkerScope);const i=await navigator.serviceWorker.register(e,r);return logServiceWorkerMessage(`New service worker is registered. Scope: ${i.scope}`),i}static waitForServiceWorkerRegistration(){return new Promise(((e,r)=>{const i=setTimeout((()=>{r(new Error("Registration waiting time limit is reached"))}),REGISTRATION_WAITING_TIME_LIMIT);navigator.serviceWorker.ready.then((r=>(clearTimeout(i),e(r))))}))}static isServiceWorkerVersionNeedsToBeUpdated(e){if(isNaN(requiredRootServiceWorkerVersion)&&requiredRootServiceWorkerVersion!==e)return!0;if(!isNaN(requiredRootServiceWorkerVersion)&&!isNaN(e)){if(parseInt(e,10)<parseInt(requiredRootServiceWorkerVersion,10))return!0}return!1}static async waitServiceWorkerToBecomeActive(e){if("activated"===e.state)return e;logServiceWorkerMessage(`Service worker: ${e.scriptURL}, state: ${e.state}. Waiting for Service Worker to be activated`);let r=e.state;return new Promise(((i,t)=>{let o=setTimeout((()=>{e.onstatechange=null,t(new Error("Service Worker activation time limit is reached"))}),SW_ACTIVATION_TIME_LIMIT);e.onstatechange=()=>(logServiceWorkerMessage(`Service Worker state change ${r} -> ${e.state}`),"activated"===e.state?(clearTimeout(o),e.onstatechange=null,i(e)):"redundant"===e.state?(e.onstatechange=null,t("Service Worker became redundant")):void 0)}))}static async waitUntilServiceWorkerIsActivated(e){let r=e.active;return e.installing?this.waitServiceWorkerToBecomeActive(e.installing):e.waiting?this.waitServiceWorkerToBecomeActive(e.waiting):(logServiceWorkerMessage(`Service worker is ready: ${r.scriptURL}, state: ${r.state}`),r)}static getServiceWorkerRegistrationMutexName(){return serviceWorkerRegistrationMutexName}static setServiceWorkerRegistrationMutexName(e){serviceWorkerRegistrationMutexName=e}static getRequiredRootServiceWorkerVersion(){return requiredRootServiceWorkerVersion}static setRequiredRootServiceWorkerVersion(e){requiredRootServiceWorkerVersion=e}static setLogMessageFunction(e){logServiceWorkerMessage=e}static getServiceWorkerVersionTimeLimit(){return GET_SERVICE_WORKER_VERSION_TIME_LIMIT}static setServiceWorkerVersionTimeLimit(e){GET_SERVICE_WORKER_VERSION_TIME_LIMIT=e}static getCacheResourcesTimeLimit(){return CACHE_RESOURCES_TIME_LIMIT}static setCacheResourcesTimeLimit(e){CACHE_RESOURCES_TIME_LIMIT=e}static getServiceWorkerActivationTimeLimit(){return SW_ACTIVATION_TIME_LIMIT}static setServiceWorkerActivationTimeLimit(e){SW_ACTIVATION_TIME_LIMIT=e}static getRegistrationWaitingTimeLimit(){return REGISTRATION_WAITING_TIME_LIMIT}static setRegistrationWaitingTimeLimit(e){REGISTRATION_WAITING_TIME_LIMIT=e}static getRootServiceWorkerScriptPath(){return serviceWorkerScriptPath}static setRootServiceWorkerScriptPath(e){serviceWorkerScriptPath=e}static getServiceWorkerScope(){return serviceWorkerScope}static setServiceWorkerScope(e){serviceWorkerScope=e}}function createCacheRequest(e,r,i){return null!==r&&null!==i&&!isNaN(i)&&r.indexOf("#")<0&&(e.cacheName=r,e.cacheVersion=parseInt(i,10)),e}function postMessageToServiceWorkerViaMessageChannel(e,r,i=5e3){return new Promise(((t,o)=>{r&&r.type&&logServiceWorkerMessage(`Sending ${r.type} message to service worker ${e.scriptURL} ...`);let s=!1;const a=setTimeout((()=>{s||o(new Error(`Time limit of ${i}ms is reached`))}),i),c=new MessageChannel;c.port1.onmessage=i=>{clearTimeout(a);const o=i&&i.data;logServiceWorkerMessage(`Received response for ${r.type} message from service worker ${e.scriptURL}`),s=!0,t(o)},e.postMessage(r,[c.port2])}))}window.define&&window.define.amd?define('plugin-service-worker-interface',[],(()=>PluginServiceWorkerInterface)):"object"==typeof exports&&"object"==typeof module?module.exports=PluginServiceWorkerInterface:window.PluginServiceWorkerInterface=PluginServiceWorkerInterface;
const MINIMAL_SERVICE_WORKER_VERSION="240801",CACHE_NAME=null,CACHE_VERSION=null,SERVICE_WORKER_SCOPE="/",SERVICE_WORKER_SCRIPT_PATH="./plugin-service-worker.js",CACHE_MANIFEST_PATH="./manifest.appcache";requirejs.config({baseUrl:"js",paths:{knockout:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/knockout/knockout-3.5.1",jquery:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/jquery/jquery-3.7.1.min","jqueryui-amd":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/jquery/jqueryui-amd-1.14.1.min",promise:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/es6-promise/es6-promise.min",hammerjs:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/hammer/hammer-2.0.8.min",ojdnd:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/dnd-polyfill/dnd-polyfill-1.0.2.min",ojL10n:"libs/oj/18.1.0/ojL10n",persist:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/persist/min",text:"libs/require/text",signals:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/js-signals/signals.min",touchr:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/touchr/touchr","@oracle/oraclejet-preact":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/oraclejet-preact/amd","oj-c":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/../../packs/oj-c/null/min",preact:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/dist/preact.umd","preact/hooks":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/hooks/dist/hooks.umd","preact/compat":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/compat/dist/compat.umd","preact/jsx-runtime":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/jsx-runtime/dist/jsxRuntime.umd","preact/debug":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/debug/dist/debug.umd","preact/devtools":"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/preact/devtools/dist/devtools.umd",proj4:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/proj4js/dist/proj4",css:"libs/require-css/css.min",ojcss:"libs/oj/18.1.0/min/ojcss","ojs/ojcss":"libs/oj/18.1.0/min/ojcss",chai:"https://static.oracle.com/cdn/jet/18.1.0/3rdparty/chai/chai-4.5.0.min","css-builder":"libs/require-css/css-builder",normalize:"libs/require-css/normalize","ojs/normalize":"libs/require-css/normalize","jet-composites":"jet-composites"},shim:{jquery:{exports:["jQuery","$"]}}}),require(["ojs/ojcore","knockout","appController","plugin-service-worker-interface","./errors/application-critical-error","ojs/ojcontext","ojs/ojknockout","ojs/ojmodule","ojs/ojrouter","ojs/ojnavigationlist","ojs/ojbutton","ojs/ojtoolbar"],(function(t,e,r,o,c,s){$((function(){function s(){(o.setRequiredRootServiceWorkerVersion("240801"),o.setServiceWorkerScope("/"),o.setLogMessageFunction(logServiceWorkerMessage),o.cacheViaCacheManifest(SERVICE_WORKER_SCRIPT_PATH,CACHE_MANIFEST_PATH,null,null).then((t=>!0)).catch((t=>(console.error("Service Worker error: ",t),!1)))).then((()=>{let o=new r;t.Router.sync().then((function(){o.load().then((()=>{e.applyBindings(o,document.getElementById("globalBody"))}),(r=>{if(r instanceof c){let c=document.getElementById("alertDialog");t.Context.getContext(c).getBusyContext().whenReady().then((function(){o.errorAlertPopup(r.heading,r.message).then((()=>{o._pluginApiTransport.terminatePlugin()}))})),e.applyBindings(o,document.getElementById("globalBody"))}console.error(r)}))}),(function(e){t.Logger.error("Error in root start: "+e.message)}))}))}$(document.body).hasClass("oj-hybrid")?document.addEventListener("deviceready",s):s()}))}));
define("bundle-temp", function(){});

