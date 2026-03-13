/*
 * src/js/viewModels/all-asset-details.js
 * Renders the asset summary table with search/filter and injects it into the target container.
 * Depends on: AssetDetail (asset-detail.js)
 */
"use strict";

var AllAssetDetails = (function () {

    var _state = {}; // filter state per containerId: { filter: 'all'|'pending'|'completed' }

    function render(containerId, data) {
        var container = document.getElementById(containerId);
        if (!container) {
            console.error('[AllAssetDetails] Container not found:', containerId);
            return;
        }

        // data is either an IB Assets array or a legacy problem_code enum object
        var isIbMode = Array.isArray(data);
        container.innerHTML = '';
        _state[containerId] = { filter: 'all' };

        var rowCount = isIbMode ? data.length : Object.keys(data || {}).length;
        if (rowCount === 0) {
            container.innerHTML = isIbMode
                ? '<p class="cc-no-data"><strong>No IB Assets found for this customer.</strong></p>'
                : '<p class="cc-no-data">' +
                  '<strong>No problem_code values received.</strong><br>' +
                  'Please ensure <em>problem_code</em> is added to plugin Properties ' +
                  'with Read or Read/Write access.' +
                  '</p>';
            return;
        }

        /* ── Search + filter bar ── */
        var searchWrap = document.createElement('div');
        searchWrap.className = 'cc-search-wrap';
        searchWrap.innerHTML =
            '<div class="cc-search-input-wrap">' +
                '<span class="cc-search-icon">&#128269;</span>' +
                '<input type="text" class="cc-search-input" id="cc-search-' + containerId + '" ' +
                    'placeholder="Enter Asset# or Serial#" ' +
                    'oninput="AllAssetDetails.applyFilter(\'' + containerId + '\')"/>' +
            '</div>' +
            '<div class="cc-filter-tabs" id="cc-tabs-' + containerId + '">' +
                '<button class="cc-tab cc-tab-active" ' +
                    'onclick="AllAssetDetails.setFilter(\'' + containerId + '\', \'all\', this)">All</button>' +
                '<button class="cc-tab" ' +
                    'onclick="AllAssetDetails.setFilter(\'' + containerId + '\', \'pending\', this)">Pending</button>' +
                '<button class="cc-tab" ' +
                    'onclick="AllAssetDetails.setFilter(\'' + containerId + '\', \'completed\', this)">Completed</button>' +
            '</div>';
        container.appendChild(searchWrap);

        /* ── Table ── */
        var table = document.createElement('table');
        table.className = 'cc-asset-table';

        var thead = document.createElement('thead');
        thead.innerHTML =
            '<tr>' +
                '<th style="width:28px;"></th>' +
                '<th style="width:28px;">Actions</th>' +
                '<th>' + (isIbMode ? 'Description' : 'Problem Code') + '</th>' +
                '<th>Serial</th>' +
                '<th>Manufacturer</th>' +
                '<th>Model</th>' +
            '</tr>';
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        tbody.id = 'cc-tbody-' + containerId;
        if (isIbMode) {
            data.forEach(function(asset, idx) {
                tbody.appendChild(AssetDetail.createRows(asset, idx));
            });
        } else {
            Object.keys(data).forEach(function(key, idx) {
                tbody.appendChild(AssetDetail.createRows(key, data[key], idx));
            });
        }
        table.appendChild(tbody);
        container.appendChild(table);

        console.log('[AllAssetDetails] Rendered ' + rowCount + ' row(s) (' + (isIbMode ? 'IB Assets' : 'problem_code enum') + ').');
    }

    /* ── applyFilter() — filter rows by search text and active tab ── */
    function applyFilter(containerId) {
        var searchEl = document.getElementById('cc-search-' + containerId);
        var tbody    = document.getElementById('cc-tbody-'  + containerId);
        if (!tbody) return;

        var query  = searchEl ? searchEl.value.trim().toLowerCase() : '';
        var filter = (_state[containerId] || {}).filter || 'all';

        tbody.querySelectorAll('.cc-asset-row').forEach(function(row) {
            var ri      = row.id.replace('cc-sum-', '');
            var assetId = (row.dataset.assetId || '').toLowerCase();
            var serial  = (row.dataset.serial  || '').toLowerCase();
            var label   = (row.dataset.label   || '').toLowerCase();
            var code    = (row.dataset.code    || '').toLowerCase();
            var detRow  = document.getElementById('cc-det-' + ri);
            var complEl = detRow ? detRow.querySelector('#cc-complete-' + ri) : null;
            var complete = complEl ? complEl.checked : false;
            /* Fall back to localStorage for rows not yet opened in this session */
            if (!complete && typeof AssetDetail !== 'undefined' && AssetDetail.getSavedStatus) {
                var saved = AssetDetail.getSavedStatus(ri);
                if (saved) complete = saved.complete;
            }

            var matchSearch = !query ||
                assetId.indexOf(query) !== -1 ||
                serial.indexOf(query)  !== -1 ||
                label.indexOf(query)   !== -1 ||
                code.indexOf(query)    !== -1;
            var matchFilter = filter === 'all' ||
                              (filter === 'completed' && complete) ||
                              (filter === 'pending'   && !complete);

            var show = matchSearch && matchFilter;
            row.style.display = show ? '' : 'none';
            if (detRow) detRow.style.display = show ? '' : 'none';
        });
    }

    /* ── setFilter() — activate a filter tab and re-apply ── */
    function setFilter(containerId, filterVal, btn) {
        if (!_state[containerId]) _state[containerId] = {};
        _state[containerId].filter = filterVal;

        var tabsEl = document.getElementById('cc-tabs-' + containerId);
        if (tabsEl) {
            tabsEl.querySelectorAll('.cc-tab').forEach(function(t) {
                t.classList.remove('cc-tab-active');
            });
        }
        if (btn) btn.classList.add('cc-tab-active');

        applyFilter(containerId);
    }

    return { render: render, applyFilter: applyFilter, setFilter: setFilter };

})();
