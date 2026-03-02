/*
 * src/js/viewModels/asset-detail.js
 *
 * Builds a summary <tr> + expandable detail <tr> per problem_code.
 *
 *  BAT- codes:   2 reading inputs (Low VDC, High VDC) + Components section
 *  non-BAT codes: 3 reading inputs (Low VDC, High VDC, Low SG)
 *
 *  Actions: Close (collapse) | Save (log + flash) | Continue (log + flash + collapse)
 */
"use strict";

var AssetDetail = (function () {

    /* ── Component lists ── */
    var COMP_BAT = ['Cables','Connectors','Contact Tips','Shrouds','Vent Caps','Watering System','Battery Tray','Physical damage'];
    var COMP_OTH = ['Cables','Connectors','Contact Tips','Shrouds','Watering System','Battery Tray','Physical damage'];

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
       createRows() — public entry point
       Returns DocumentFragment with [summary <tr>] + [detail <tr>]
    ═══════════════════════════════════════════════════════════════════════ */
    function createRows(codeIndex, codeLabel, rowIndex) {
        var d    = _buildData(codeIndex, codeLabel);
        var ri   = rowIndex;
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
            '</td>' +
            '<td class="cc-summary-td cc-num">' + d.assetId + '</td>' +
            '<td class="cc-summary-td">' + d.serial + '</td>' +
            '<td class="cc-summary-td">' + d.mfr + '</td>' +
            '<td class="cc-summary-td">' + d.model + '</td>';
        frag.appendChild(sumRow);

        /* ── Detail row ── */
        var detRow = document.createElement('tr');
        detRow.id        = 'cc-det-' + ri;
        detRow.className = 'cc-detail-row';
        var td = document.createElement('td');
        td.colSpan   = 7;
        td.className = 'cc-detail-panel';
        td.innerHTML = _buildPanel(d, codeLabel, codeIndex, ri);
        detRow.appendChild(td);
        frag.appendChild(detRow);

        return frag;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       _buildPanel() — HTML for the expanded card
    ═══════════════════════════════════════════════════════════════════════ */
    function _buildPanel(d, label, code, ri) {
        var isBat = d.isBat;
        var comps = isBat ? COMP_BAT : COMP_OTH;

        /* ── Last Completed chips ── */
        var lcHTML = d.dates.map(function(dt) {
            return '<span class="cc-lc-chip">' + dt + '</span>';
        }).join('');
        if (isBat) lcHTML += '<span class="cc-lc-chip na">N/A</span>';

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
                '<input type="checkbox" class="cc-chk-input cc-comp-chk" id="cc-comp-' + ri + '-' + k + '" ' +
                    'oninput="AssetDetail.updateNote(' + ri + ')"/>' +
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
                        '<div class="cc-lc-box-date">' + d.lcDate + '</div>' +
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

    /* ═══════════════════════════════════════════════════════════════════════
       toggle() — expand / collapse
    ═══════════════════════════════════════════════════════════════════════ */
    function toggle(ri) {
        var det  = document.getElementById('cc-det-'  + ri);
        var sum  = document.getElementById('cc-sum-'  + ri);
        var btn  = document.getElementById('cc-ebtn-' + ri);
        if (!det) return;
        var open = det.classList.toggle('cc-open');
        if (sum) sum.classList.toggle('cc-row-open', open);
        if (btn) btn.innerHTML = open ? '&#8964;' : '&#8250;';
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
            det.querySelectorAll('.cc-comp-chk').forEach(function(cb) {
                var lbl = cb.previousElementSibling ? cb.previousElementSibling.textContent.trim() : cb.id;
                components[lbl] = cb.checked;
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
        det.querySelectorAll('.cc-comp-chk').forEach(function(cb) {
            if (cb.checked) {
                var s = cb.previousElementSibling;
                if (s) comps.push(s.textContent.trim());
            }
        });
        if (comps.length) lines.push('Components: ' + comps.join(', '));

        var rdVals = [];
        det.querySelectorAll('.cc-rd-input').forEach(function(inp) {
            var v = inp.value.trim();
            if (v) rdVals.push((inp.dataset.label || inp.id) + ': ' + v);
        });
        if (rdVals.length) lines.push('Readings: ' + rdVals.join(', '));

        note.value = lines.join('\n');
    }

    /* ═══════════════════════════════════════════════════════════════════════
       closeRow() — collapse without saving
    ═══════════════════════════════════════════════════════════════════════ */
    function closeRow(ri) {
        toggle(ri);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       saveRow() — log to console + flash "Saved!", stay open
    ═══════════════════════════════════════════════════════════════════════ */
    function saveRow(ri) {
        var record  = _collectRecord(ri);
        console.log('[AssetDetail] SAVE:', record);

        var sub     = document.getElementById('cc-sub-' + ri);
        var saveBtn = sub ? sub.querySelector('.cc-btn-save') : null;
        if (saveBtn) {
            var origLabel = saveBtn.innerHTML;
            saveBtn.innerHTML = '&#10003; Saved!';
            setTimeout(function() { saveBtn.innerHTML = origLabel; }, 800);
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════
       continueRow() — log to console + flash "Saved!" + collapse
    ═══════════════════════════════════════════════════════════════════════ */
    function continueRow(ri) {
        var record  = _collectRecord(ri);
        console.log('[AssetDetail] CONTINUE:', record);

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
        createRows:  createRows,
        toggle:      toggle,
        saveRow:     saveRow,
        continueRow: continueRow,
        closeRow:    closeRow,
        updateNote:  updateNote
    };

})();
