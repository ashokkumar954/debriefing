define([
    'knockout'
], function (ko) {

    'use strict';

    class AssetViewModel {

        constructor(params) {
            this.app = params && params.app ? params.app : null;

            this.problemCodeOptions = ko.observableArray([]);
            this.hasOptions = ko.computed(() => this.problemCodeOptions().length > 0);
            this.problemCodeCount = ko.computed(() => this.problemCodeOptions().length);
            this.showAllAssets = ko.observable(false);

            this._enumValues = {};

            this._loadProblemCodes();
        }

        _loadProblemCodes() {
            if (!this.app) {
                console.warn('[AssetViewModel] No app instance');
                return;
            }

            this.app.loaded.then(() => {
                var openData = this.app._openData;
                var attrDesc = this.app._attributeDescription;

                console.log('[AssetViewModel] openData received:', openData);
                console.log('[AssetViewModel] attrDesc:', attrDesc);

                if (!openData) {
                    console.warn('[AssetViewModel] No openData available');
                    return;
                }

                this._processOpenData(openData, attrDesc);
            });
        }

        _processOpenData(openData, attributeDescription) {
            var openParams = openData.openParams || {};

            // ── TEMPORARY DEBUG: log everything ──────────────────────────────
            console.log('[DEBUG] openData keys:', Object.keys(openData));
            console.log('[DEBUG] openParams keys:', Object.keys(openParams));
            console.log('[DEBUG] openData.activity:', openData.activity);
            console.log('[DEBUG] openParams.enum:', openParams.enum);
            console.log('[DEBUG] openParams.properties:', openParams.properties);
            console.log('[DEBUG] attributeDescription keys:', Object.keys(attributeDescription || {}));
            console.log('[DEBUG] attrDesc problem_code entry:', attributeDescription && attributeDescription.problem_code);

            // Check localStorage directly
            try {
                var stored = localStorage.getItem('debriefing_attributeDescription');
                var storedAttr = stored ? JSON.parse(stored) : {};
                console.log('[DEBUG] localStorage attrDesc keys:', Object.keys(storedAttr));
                console.log('[DEBUG] localStorage problem_code:', storedAttr.problem_code);
            } catch(e) {}
            // ── END DEBUG ────────────────────────────────────────────────────

            var enumValues = {};

            // Method 1: openParams.enum.problem_code
            if (openParams.enum && openParams.enum.problem_code) {
                enumValues = openParams.enum.problem_code;
                console.log('[AssetViewModel] enum from openParams.enum:', enumValues);
            }

            // Method 2: passed attributeDescription
            if (Object.keys(enumValues).length === 0) {
                var ad = openParams.attributeDescription || attributeDescription || {};
                if (ad.problem_code && ad.problem_code.enum) {
                    Object.entries(ad.problem_code.enum).forEach(([id, d]) => {
                        if (!d.inactive) enumValues[id] = typeof d === 'object' ? d.text : d;
                    });
                }
            }

            // Method 3: top-level openData.attributeDescription
            if (Object.keys(enumValues).length === 0 && openData.attributeDescription) {
                var ta = openData.attributeDescription;
                if (ta.problem_code && ta.problem_code.enum) {
                    Object.entries(ta.problem_code.enum).forEach(([id, d]) => {
                        if (!d.inactive) enumValues[id] = typeof d === 'object' ? d.text : d;
                    });
                }
            }

            // Method 4: localStorage (transport saves attributeDescription from init here)
            if (Object.keys(enumValues).length === 0) {
                try {
                    var ls = localStorage.getItem('debriefing_attributeDescription');
                    if (ls) {
                        var lsAttr = JSON.parse(ls);
                        if (lsAttr.problem_code && lsAttr.problem_code.enum) {
                            Object.entries(lsAttr.problem_code.enum).forEach(([id, d]) => {
                                if (!d.inactive) enumValues[id] = typeof d === 'object' ? d.text : d;
                            });
                            console.log('[AssetViewModel] enum from localStorage:', enumValues);
                        }
                    }
                } catch(e) { console.warn('[AssetViewModel] localStorage error:', e); }
            }

            console.log('[AssetViewModel] Final enumValues:', enumValues);

            this._enumValues = enumValues;
            window.__problemCodeEnum = enumValues;
            window.__activityId = (openData.activity && openData.activity.aid) || '';

            this.problemCodeOptions(
                Object.keys(enumValues).map(key => ({ index: key, label: enumValues[key] }))
            );
        }
        navigateToAllAssets() {
            this.showAllAssets(true);
            setTimeout(() => {
                this._ensureAssetsLoaded(() => {
                    if (typeof AllAssetDetails !== 'undefined') {
                        AllAssetDetails.render('all-assets-inline-container', this._enumValues);
                    }
                });
            }, 80);
        }

        _ensureAssetsLoaded(callback) {
            if (!document.getElementById('cc-asset-styles')) {
                var link = document.createElement('link');
                link.id = 'cc-asset-styles';
                link.rel = 'stylesheet';
                link.href = 'asset-details.css';
                document.head.appendChild(link);
            }

            if (typeof AllAssetDetails !== 'undefined') {
                callback();
                return;
            }

            var s1 = document.createElement('script');
            s1.src = 'asset-detail.js';
            s1.onload = () => {
                var s2 = document.createElement('script');
                s2.src = 'all-asset-details.js';
                s2.onload = callback;
                s2.onerror = () => console.error('[AssetViewModel] Failed to load all-asset-details.js');
                document.head.appendChild(s2);
            };
            s1.onerror = () => console.error('[AssetViewModel] Failed to load asset-detail.js');
            document.head.appendChild(s1);
        }

        goBack() {
            this.showAllAssets(false);
            var c = document.getElementById('all-assets-inline-container');
            if (c) c.innerHTML = '';
        }
    }

    return AssetViewModel;
});