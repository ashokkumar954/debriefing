/*
 * src/js/viewModels/asset-detail.js
 *
 * Builds a summary <tr> + expandable detail <tr> per problem_code.
 *
 *  BAT- codes:   2 reading inputs (Low VDC, High VDC) + Components section
 *  non-BAT codes: 3 reading inputs (Low VDC, High VDC, Low SG)
 *
 *  Actions: Close (collapse) | Save (persist + flash) | Continue (persist + flash + collapse)
 *
 *  Offline persistence: all form data is saved to localStorage on Save/Continue
 *  and restored automatically when a row is re-opened.
 *  Storage key: mae_record_<activityId>_<codeIndex>
 */
"use strict";

var AssetDetail = (function () {

    /* ── Component lists ── */
    var COMP_BAT = ['Cables','Connectors','Contact Tips','Shrouds','Vent Caps','Watering System','Battery Tray','Physical damage'];
    var COMP_OTH = ['Cables','Connectors','Contact Tips','Shrouds','Watering System','Battery Tray','Physical damage'];

    /* ── Component condition options ── */
    var COMP_OPT_HTML =
        '<option value="1">1 - Good Condition</option>' +
        '<option value="2">2 - Address Customer Request</option>' +
        '<option value="3">3 - Safety Related Issue</option>' +
        '<option value="4">4 - Does not meet design Specification</option>' +
        '<option value="5">5 - Missing</option>';

    /* ── Sample data pools (index by hash of codeIndex+codeLabel) ── */
    var _D = {
        ids:   [29148, 30021, 11553, 44821, 76320, 55019, 38741],
        ser:   ['7970CL','PL111222333','BT44921','HK-0012','DK-7731','CL-8820','PL-3310'],
        mfr:   ['DEKA','HAWKER','DEKA','EnerSys','DEKA','HAWKER','EnerSys'],
        mdl:   ['24-G75-19','18-125F-13','24-85-17','36-125-13','48-G75-19','18-100F-11','24-G85-17'],
        dsc:   ['Sit','Stand','Reach','Sit','Counterbalance','Reach','Stand'],
        mfd:   ['01/11','03/15','07/18','11/20','02/19','06/17','09/21'],
        age:   [99,15,82,55,71,43,38],
        dates: ['08/26/2025','09/10/2025','07/15/2025','10/01/2025','08/01/2025','11/05/2025','06/20/2025'],
        hrs:   [54.0,15.0,null,null,12.0,null,null]
    };

    function _buildData(codeIndex, codeLabel) {
        var i       = (codeIndex.length + codeLabel.length) % 7;
        var isBat   = /^BAT-/i.test(codeIndex);
        var isFlood = /flooded|lead/i.test(codeLabel);
        return {
            isBat:    isBat,
            isFlood:  isFlood,
            assetId:  _D.ids[i],   serial:  _D.ser[i],
            mfr:      _D.mfr[i],   model:   _D.mdl[i],
            desc:     _D.dsc[i],   mfgDate: _D.mfd[i],
            age:      _D.age[i],   barcode: '',
            dates:    [_D.dates[i], _D.dates[i], _D.dates[i], _D.dates[i]],
            lcDate:   _D.dates[i],
            totalHrs: _D.hrs[i],
            lowVdc:   isFlood ? '2.222' : '7.7',
            highVdc:  isFlood ? '2.23'  : '6',
            lowSg:    isBat   ? null    : (isFlood ? '1.111' : '1.280')
        };
    }

    function _e(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ═══════════════════════════════════════════════════════════════════════
       localStorage helpers
    ═══════════════════════════════════════════════════════════════════════ */

    function _storageKey(codeIndex) {
        var aid = (typeof window.__activityId !== 'undefined' && window.__activityId)
            ? window.__activityId : 'local';
        return 'mae_record_' + aid + '_' + codeIndex;
    }

    /* Save all form values for a row to localStorage */
    function _saveRecord(ri) {
        var sumRow = document.getElementById('cc-sum-' + ri);
        if (!sumRow) return;
        var codeIndex = sumRow.dataset.code || String(ri);
        var record = _collectRecord(ri);
        try {
            localStorage.setItem(_storageKey(codeIndex), JSON.stringify(record));
        } catch (e) {
            console.warn('[AssetDetail] localStorage save failed:', e);
        }
        _refreshSummaryStatus(ri);
    }

    /* Restore saved form values from localStorage into the expanded panel */
    function _restoreRecord(ri) {
        var sumRow = document.getElementById('cc-sum-' + ri);
        if (!sumRow) return;
        var codeIndex = sumRow.dataset.code || String(ri);
        var raw;
        try { raw = localStorage.getItem(_storageKey(codeIndex)); } catch (e) { return; }
        if (!raw) return;
        var rec;
        try { rec = JSON.parse(raw); } catch (e) { return; }

        var det = document.getElementById('cc-det-' + ri);
        if (!det) return;

        /* Checklist */
        if (rec.checklist) {
            det.querySelectorAll('.cc-chkl-input').forEach(function (cb) {
                var lbl = cb.nextElementSibling ? cb.nextElementSibling.textContent.trim() : '';
                if (lbl && rec.checklist[lbl] !== undefined) cb.checked = rec.checklist[lbl];
            });
        }

        /* Components */
        if (rec.components) {
            det.querySelectorAll('.cc-comp-sel').forEach(function (sel) {
                var lbl = sel.previousElementSibling ? sel.previousElementSibling.textContent.trim() : '';
                if (lbl && rec.components[lbl] !== undefined) sel.value = rec.components[lbl];
            });
        }

        /* Readings */
        if (rec.readings) {
            det.querySelectorAll('.cc-rd-input').forEach(function (inp) {
                var lbl = inp.dataset.label || inp.id;
                if (rec.readings[lbl] !== undefined) inp.value = rec.readings[lbl];
            });
        }

        /* Note textarea */
        var note = document.getElementById('cc-note-' + ri);
        if (note && rec.note !== undefined) note.value = rec.note;

        /* Needs Repair / Complete checkboxes */
        var repair = document.getElementById('cc-repair-' + ri);
        if (repair && rec.needsRepair !== undefined) repair.checked = rec.needsRepair;

        var complete = document.getElementById('cc-complete-' + ri);
        if (complete && rec.complete !== undefined) complete.checked = rec.complete;
    }

    /* Update the inline status badge on the summary row from localStorage */
    function _refreshSummaryStatus(ri) {
        var badge = document.getElementById('cc-status-' + ri);
        if (!badge) return;
        var sumRow = document.getElementById('cc-sum-' + ri);
        var codeIndex = sumRow ? (sumRow.dataset.code || String(ri)) : String(ri);
        var raw, rec = null;
        try {
            raw = localStorage.getItem(_storageKey(codeIndex));
            if (raw) rec = JSON.parse(raw);
        } catch (e) {}

        if (!rec) {
            badge.style.display = 'none';
            badge.textContent = '';
            return;
        }
        if (rec.complete) {
            badge.textContent = '\u2713 Complete';
            badge.style.cssText = 'display:inline-block;font-size:10px;margin-left:6px;' +
                'background:#2a7a2a;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;';
        } else {
            badge.textContent = '\u25cf Saved';
            badge.style.cssText = 'display:inline-block;font-size:10px;margin-left:6px;' +
                'background:#c67c00;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;';
        }
    }

    /* Public: return saved {complete, needsRepair} for a row — used by AllAssetDetails filter */
    function getSavedStatus(ri) {
        var sumRow = document.getElementById('cc-sum-' + ri);
        if (!sumRow) return null;
        var codeIndex = sumRow.dataset.code || String(ri);
        var raw;
        try { raw = localStorage.getItem(_storageKey(codeIndex)); } catch (e) { return null; }
        if (!raw) return null;
        try {
            var rec = JSON.parse(raw);
            return { complete: !!rec.complete, needsRepair: !!rec.needsRepair };
        } catch (e) { return null; }
    }

    /* ═══════════════════════════════════════════════════════════════════════
       createRows() — public entry point
       Signatures:
         createRows(asset, rowIndex)            — IB Asset object from Fusion API
         createRows(codeIndex, codeLabel, rowIndex) — legacy problem_code enum
       Returns DocumentFragment with [summary <tr>] + [detail <tr>]
    ═══════════════════════════════════════════════════════════════════════ */
    function createRows(codeIndexOrAsset, codeLabelOrRowIndex, rowIndex) {
        var d, codeIndex, codeLabel, ri;

        if (typeof codeIndexOrAsset === 'object' && codeIndexOrAsset !== null) {
            // ── IB Asset mode ──
            var asset = codeIndexOrAsset;
            ri        = codeLabelOrRowIndex;
            codeIndex = String(asset.instanceNumber || asset.assetId || ri);
            codeLabel = (asset.desc || '') + ' (' + (asset.assetId || '') + ')';
            d = {
                isBat:    asset.isBat,
                isFlood:  asset.isFlood,
                assetId:  asset.assetId  || '',
                serial:   asset.serial   || '',
                mfr:      asset.mfr      || '',
                model:    asset.model    || '',
                desc:     asset.desc     || '',
                mfgDate:  asset.mfgDate  || '',
                age:      '',
                barcode:  asset.barcode  || '',
                dates:    ['—', '—', '—', '—'],
                lcDate:   '—',
                totalHrs: null,
                lowVdc:   asset.isFlood ? '2.222' : '7.7',
                highVdc:  asset.isFlood ? '2.23'  : '6',
                lowSg:    asset.isBat   ? null     : (asset.isFlood ? '1.111' : '1.280')
            };
        } else {
            // ── Legacy problem_code enum mode ──
            codeIndex = codeIndexOrAsset;
            codeLabel = codeLabelOrRowIndex;
            ri        = rowIndex;
            d         = _buildData(codeIndex, codeLabel);
        }

        var frag = document.createDocumentFragment();

        /* ── Summary row ── */
        var sumRow = document.createElement('tr');
        sumRow.id              = 'cc-sum-' + ri;
        sumRow.className       = 'cc-asset-row';
        sumRow.dataset.assetId = String(d.assetId);
        sumRow.dataset.serial  = d.serial;
        sumRow.dataset.label   = codeLabel;
        sumRow.dataset.code    = codeIndex;
        sumRow.innerHTML =
            '<td class="cc-summary-td cc-expand-td">' +
                '<button class="cc-expand-btn" id="cc-ebtn-' + ri + '" ' +
                    'onclick="AssetDetail.toggle(' + ri + ')">&#8250;</button>' +
            '</td>' +
            '<td class="cc-summary-td" style="width:34px;text-align:center;">' +
                '<button class="cc-view-btn" title="View" ' +
                    'onclick="AssetDetail.toggle(' + ri + ')">&#128065;</button>' +
            '</td>' +
            '<td class="cc-summary-td">' +
                '<span class="cc-code-pill" title="' + _e(codeIndex) + '">' + _e(codeLabel) + '</span>' +
                '<span id="cc-status-' + ri + '" style="display:none;"></span>' +
            '</td>' +
            '<td class="cc-summary-td">' + d.serial + '</td>' +
            '<td class="cc-summary-td">' + d.mfr + '</td>' +
            '<td class="cc-summary-td">' + d.model + '</td>';
        frag.appendChild(sumRow);

        /* ── Detail row ── */
        var detRow = document.createElement('tr');
        detRow.id        = 'cc-det-' + ri;
        detRow.className = 'cc-detail-row';
        var td = document.createElement('td');
        td.colSpan   = 6;
        td.className = 'cc-detail-panel';
        td.innerHTML = _buildPanel(d, codeLabel, codeIndex, ri);
        detRow.appendChild(td);
        frag.appendChild(detRow);

        /* Refresh status badge once the fragment lands in the DOM */
        setTimeout(function () { _refreshSummaryStatus(ri); }, 0);

        return frag;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       _buildPanel() — HTML for the expanded card
    ═══════════════════════════════════════════════════════════════════════ */
    function _buildPanel(d, label, code, ri) {
        var isBat = d.isBat;
        var comps = isBat ? COMP_BAT : COMP_OTH;

        /* ── Last Completed chips — skip placeholder '—' dates ── */
        var realDates = d.dates.filter(function(dt) { return dt && dt !== '—'; });
        var lcHTML = realDates.map(function(dt) {
            return '<span class="cc-lc-chip">' + dt + '</span>';
        }).join('');
        if (isBat && realDates.length > 0) lcHTML += '<span class="cc-lc-chip na">N/A</span>';
        if (!lcHTML) lcHTML = '<span class="cc-lc-chip na">No history</span>';

        /* ── Checklist (with oninput to auto-populate note) ── */
        var chkItems = ['Visual Inspection', 'Added Water', 'BDR Download', 'Wash'];
        if (isBat) chkItems.push('ICC Torque');
        var chkHTML = chkItems.map(function(l, j) {
            return '<div class="cc-chk-item">' +
                '<input type="checkbox" class="cc-chk-input cc-chkl-input" id="cc-chkl-' + ri + '-' + j + '" ' +
                    'oninput="AssetDetail.updateNote(' + ri + ')"/>' +
                '<span>' + l + '</span>' +
            '</div>';
        }).join('');

        /* ── Reading inputs ──
             BAT-:     Low VDC + High VDC (2 inputs)
             non-BAT:  Low VDC + High VDC + Low SG (3 inputs)            */
        var rdHTML =
            '<div class="cc-rd-col">' +
                '<div class="cc-rd-lbl">Low VDC</div>' +
                '<input type="text" class="cc-rd-input" id="cc-rd-lowvdc-' + ri + '" data-label="Low VDC" ' +
                    'value="' + _e(String(d.lowVdc)) + '" oninput="AssetDetail.updateNote(' + ri + ')"/>' +
            '</div>' +
            '<div class="cc-rd-col">' +
                '<div class="cc-rd-lbl">High VDC</div>' +
                '<input type="text" class="cc-rd-input" id="cc-rd-highvdc-' + ri + '" data-label="High VDC" ' +
                    'value="' + _e(String(d.highVdc)) + '" oninput="AssetDetail.updateNote(' + ri + ')"/>' +
            '</div>';
        if (!isBat) {
            rdHTML +=
                '<div class="cc-rd-col">' +
                    '<div class="cc-rd-lbl">Low SG</div>' +
                    '<input type="text" class="cc-rd-input" id="cc-rd-lowsg-' + ri + '" data-label="Low SG" ' +
                        'value="' + _e(String(d.lowSg || '')) + '" oninput="AssetDetail.updateNote(' + ri + ')"/>' +
                '</div>';
        }

        /* ── Component rows (with oninput) ── */
        var compHTML = comps.map(function(c, k) {
            return '<div class="cc-comp-row">' +
                '<span>' + c + '</span>' +
                '<select class="cc-comp-sel" id="cc-comp-' + ri + '-' + k + '" ' +
                    'oninput="AssetDetail.updateNote(' + ri + ')">' +
                    COMP_OPT_HTML +
                '</select>' +
            '</div>';
        }).join('');

        return (
            /* TOP hazard stripe only */
            '<div class="cc-hazard"></div>' +

            /* Subtitle + action buttons: Close | Save | Continue */
            '<div class="cc-detail-subtitle" id="cc-sub-' + ri + '">' +
                '<span class="cc-sub-label">' + _e(code) + ' &mdash; ' + _e(label) + '</span>' +
                '<div class="cc-action-btns">' +
                    '<button class="cc-btn-close"    onclick="AssetDetail.closeRow('    + ri + ')">&#10005; Close</button>' +
                    '<button class="cc-btn-save"     onclick="AssetDetail.saveRow('     + ri + ')">&#10003; Save</button>' +
                    '<button class="cc-btn-continue" onclick="AssetDetail.continueRow(' + ri + ')">&#8594; Continue</button>' +
                '</div>' +
            '</div>' +

            /* Card body — 4 horizontal sections */
            '<div class="cc-card-body">' +

                /* ─ SEC 1: Asset Info ─────────────────────────────────── */
                '<div class="cc-sec-asset">' +
                    '<div class="cc-fields-grid">' +
                        '<div class="cc-field"><div class="cc-f-lbl">Assets ID</div><div class="cc-f-val cc-f-val-id">'   + d.assetId + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Serial</div><div class="cc-f-val">'                 + d.serial  + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Manufacturer Id</div><div class="cc-f-val">'        + d.mfr     + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Model</div><div class="cc-f-val">'                  + d.model   + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Description</div><div class="cc-f-val">'            + d.desc    + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Mfg Date</div><div class="cc-f-val">'               + d.mfgDate + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Age</div><div class="cc-f-val">'                    + d.age     + '</div></div>' +
                        '<div class="cc-field"><div class="cc-f-lbl">Barcode</div><div class="cc-f-val">'                + (d.barcode || '&mdash;') + '</div></div>' +
                    '</div>' +
                    '<div class="cc-lc-block">' +
                        '<div class="cc-lc-title">Last Completed</div>' +
                        '<div class="cc-lc-dates">' + lcHTML + '</div>' +
                        '<div class="cc-checklist">' + chkHTML + '</div>' +
                    '</div>' +
                '</div>' +

                /* ─ SEC 2: Last Complete + Last Reading ─────────────────── */
                '<div class="cc-sec-reading">' +
                    '<div class="cc-lc-box">' +
                        '<div class="cc-lc-box-lbl">Last<br>Complete</div>' +
                        '<div class="cc-lc-box-date">' + (d.lcDate && d.lcDate !== '—' ? d.lcDate : 'N/A') + '</div>' +
                        '<div class="cc-lc-box-pm">PM</div>' +
                    '</div>' +
                    '<div class="cc-rd-title">Last Reading</div>' +
                    '<div class="cc-rd-row">' + rdHTML + '</div>' +
                '</div>' +

                /* ─ SEC 3: Components — BAT- codes only ─────────────────── */
                (isBat ?
                    '<div class="cc-sec-comps">' +
                        '<div class="cc-sec-title">Components</div>' +
                        compHTML +
                    '</div>'
                : '') +

                /* ─ SEC 4: Problem Note ──────────────────────────────────── */
                '<div class="cc-sec-note">' +
                    '<div class="cc-sec-title">Problem Note</div>' +
                    '<textarea class="cc-note-area" id="cc-note-' + ri + '" ' +
                        'placeholder="Enter problem note\u2026"></textarea>' +
                    '<div class="cc-note-chk">' +
                        '<span>Needs Repair</span>' +
                        '<input type="checkbox" class="cc-chk-input" id="cc-repair-' + ri + '"/>' +
                    '</div>' +
                    '<div class="cc-note-chk">' +
                        '<span>Complete</span>' +
                        '<input type="checkbox" class="cc-chk-input" id="cc-complete-' + ri + '"/>' +
                    '</div>' +
                '</div>' +

            '</div>'
        );
    }

    /* ── Compact select: show only number in collapsed state, full text when open ── */
    function _initCompactSelects(ri) {
        var det = document.getElementById('cc-det-' + ri);
        if (!det) return;
        det.querySelectorAll('.cc-comp-sel').forEach(function(sel) {
            if (sel.dataset.compactInit) return; // already initialised
            sel.dataset.compactInit = '1';
            var fullTexts = Array.from(sel.options).map(function(o) { return o.text; });
            function compact() {
                Array.from(sel.options).forEach(function(o) { o.text = o.value; });
            }
            function expand() {
                Array.from(sel.options).forEach(function(o, i) { o.text = fullTexts[i]; });
            }
            sel.addEventListener('mousedown', expand);
            sel.addEventListener('change', function() { setTimeout(compact, 0); });
            sel.addEventListener('blur', compact);
            compact();
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       toggle() — expand / collapse; restores saved data on open
    ═══════════════════════════════════════════════════════════════════════ */
    function toggle(ri) {
        var det  = document.getElementById('cc-det-'  + ri);
        var sum  = document.getElementById('cc-sum-'  + ri);
        var btn  = document.getElementById('cc-ebtn-' + ri);
        if (!det) return;
        var open = det.classList.toggle('cc-open');
        if (sum) sum.classList.toggle('cc-row-open', open);
        if (btn) btn.innerHTML = open ? '&#8964;' : '&#8250;';
        if (open) {
            _restoreRecord(ri);
            _initCompactSelects(ri);
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════
       _collectRecord() — gather all form values from the expanded panel
    ═══════════════════════════════════════════════════════════════════════ */
    function _collectRecord(ri) {
        var note     = document.getElementById('cc-note-'     + ri);
        var repair   = document.getElementById('cc-repair-'   + ri);
        var complete = document.getElementById('cc-complete-' + ri);
        var det      = document.getElementById('cc-det-'      + ri);

        var checklist = {};
        if (det) {
            det.querySelectorAll('.cc-chkl-input').forEach(function(cb) {
                var lbl = cb.nextElementSibling ? cb.nextElementSibling.textContent.trim() : cb.id;
                checklist[lbl] = cb.checked;
            });
        }

        var components = {};
        if (det) {
            det.querySelectorAll('.cc-comp-sel').forEach(function(sel) {
                var lbl = sel.previousElementSibling ? sel.previousElementSibling.textContent.trim() : sel.id;
                components[lbl] = sel.value;
            });
        }

        var readings = {};
        if (det) {
            det.querySelectorAll('.cc-rd-input').forEach(function(inp) {
                readings[inp.dataset.label || inp.id] = inp.value;
            });
        }

        return {
            rowIndex:    ri,
            note:        note     ? note.value       : '',
            checklist:   checklist,
            components:  components,
            readings:    readings,
            needsRepair: repair   ? repair.checked   : false,
            complete:    complete ? complete.checked  : false,
            savedAt:     new Date().toISOString()
        };
    }

    /* ═══════════════════════════════════════════════════════════════════════
       updateNote() — auto-populate Problem Note from checked items + readings
       Called via oninput on checkboxes and reading inputs.
       The textarea remains manually editable at any time.
    ═══════════════════════════════════════════════════════════════════════ */
    function updateNote(ri) {
        var note = document.getElementById('cc-note-' + ri);
        var det  = document.getElementById('cc-det-'  + ri);
        if (!note || !det) return;

        var lines = [];

        var chkl = [];
        det.querySelectorAll('.cc-chkl-input').forEach(function(cb) {
            if (cb.checked) {
                var s = cb.nextElementSibling;
                if (s) chkl.push(s.textContent.trim());
            }
        });
        if (chkl.length) lines.push('Checklist: ' + chkl.join(', '));

        var comps = [];
        det.querySelectorAll('.cc-comp-sel').forEach(function(sel) {
            if (sel.value && sel.value !== '1') {
                var s = sel.previousElementSibling;
                var name = s ? s.textContent.trim() : sel.id;
                var optText = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : sel.value;
                comps.push(name + ': ' + optText);
            }
        });
        if (comps.length) lines.push('Components: ' + comps.join(', '));

        var rdVals = [];
        det.querySelectorAll('.cc-rd-input').forEach(function(inp) {
            var v = inp.value.trim();
            if (v) rdVals.push((inp.dataset.label || inp.id) + ': ' + v);
        });
        if (rdVals.length) lines.push('Readings: ' + rdVals.join('\n'));

        note.value = lines.join('\n');
    }

    /* ═══════════════════════════════════════════════════════════════════════
       closeRow() — collapse without saving
    ═══════════════════════════════════════════════════════════════════════ */
    function closeRow(ri) {
        toggle(ri);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       saveRow() — persist to localStorage + flash "Saved!", stay open
    ═══════════════════════════════════════════════════════════════════════ */
    function saveRow(ri) {
        _saveRecord(ri);

        var sub     = document.getElementById('cc-sub-' + ri);
        var saveBtn = sub ? sub.querySelector('.cc-btn-save') : null;
        if (saveBtn) {
            var origLabel = saveBtn.innerHTML;
            saveBtn.innerHTML = '&#10003; Saved!';
            setTimeout(function() { saveBtn.innerHTML = origLabel; }, 800);
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════
       continueRow() — persist to localStorage + flash "Saved!" + collapse
    ═══════════════════════════════════════════════════════════════════════ */
    function continueRow(ri) {
        _saveRecord(ri);

        var sub     = document.getElementById('cc-sub-' + ri);
        var contBtn = sub ? sub.querySelector('.cc-btn-continue') : null;
        if (contBtn) {
            var origLabel = contBtn.innerHTML;
            contBtn.innerHTML = '&#10003; Saved!';
            setTimeout(function() {
                contBtn.innerHTML = origLabel;
                toggle(ri);
            }, 800);
        } else {
            toggle(ri);
        }
    }

    return {
        createRows:     createRows,
        toggle:         toggle,
        saveRow:        saveRow,
        continueRow:    continueRow,
        closeRow:       closeRow,
        updateNote:     updateNote,
        getSavedStatus: getSavedStatus
    };

})();
