# OFS Asset Plugin — Project File Reference

> Oracle Field Service plugin for reading `problem_code` and displaying asset detail cards with offline support.
> Built on Oracle JET 18.1.0 + Knockout.js + RequireJS (AMD), communicates with the OFSC container via `postMessage`.

---

## Application Flow

```
index.html
  └── main.js               ← RequireJS bootstrap + Service Worker setup
        └── appController.js ← Creates router (asset / asset-detail / all-asset-details)
              └── ofsc-plugin-api-transport.js ← Sends 'ready', receives 'init' + 'open'
                    └── ofsc-connector.js       ← Low-level postMessage wrapper
```

Once `open` is received:

```
asset.js (ViewModel)
  └── Reads problem_code enum (4 fallback methods)
  └── User clicks "View All Asset Details"
        └── all-asset-details.js   ← Renders search/filter table
              └── asset-detail.js  ← Expandable card row per enum value
```

---

## File-by-File Reference

---

### `src/index.html`
**Role:** Entry point HTML shell.

- Loads Oracle JET 18.1.0 CSS (Redwood theme) and icon fonts from CDN.
- Contains `<div id="globalBody">` with an `ojModule` Knockout binding — OJet's router swaps views here.
- Loads `html2pdf.bundle.js` (vendor, for potential PDF export).
- Loads RequireJS from CDN, then `js/bundle.js` (the built/bundled application).
- Also has an `<div id="alertDialog">` used to show critical error popups before terminating.

---

### `src/js/main.js`
**Role:** Application bootstrap.

- Defines three top-level constants used by the service worker:
  - `MINIMAL_SERVICE_WORKER_VERSION` — minimum SW version; forces update if outdated.
  - `CACHE_NAME` / `CACHE_VERSION` — `null` when plugin is OFS-hosted (OFS manages caching).
  - `SERVICE_WORKER_SCOPE` — `'/'` for root scope.
- Configures RequireJS `paths` for all libraries (OJS, Knockout, jQuery, Preact, etc.).
- On load:
  1. Registers / validates the service worker via `PluginServiceWorkerInterface`.
  2. Creates `ControllerViewModel` (appController).
  3. Calls `app.load()` — waits for OFSC `open` message.
  4. On success → applies Knockout bindings to `#globalBody`.
  5. On `ApplicationCriticalError` → shows error dialog then terminates the plugin.

---

### `src/js/appController.js`
**Role:** Top-level Knockout ViewModel and OJet router.

- Defines three named routes:
  | Route | View | ViewModel |
  |---|---|---|
  | `asset` (default) | `views/asset.html` | `viewModels/asset.js` |
  | `asset-detail` | `views/asset-detail.html` | `viewModels/asset-detail.js` |
  | `all-asset-details` | `views/all-asset-details.html` | `viewModels/all-asset-details.js` |
- Instantiates `OfscPluginApiTransport` and calls `transport.load()`.
- Exposes `this.loaded` (a Promise) so child ViewModels can wait for OFSC data.
- Exposes `this._openData` and `this._attributeDescription` for child use.
- Provides `errorAlertPopup(heading, message)` to show OJet dialog for critical errors.

---

### `src/js/ofsc-connector.js`
**Role:** Low-level postMessage communication with the OFS container.

- Listens on `window.addEventListener("message", ...)` for inbound messages.
- Uses a **signals** library (`js-signals`) for event dispatching:
  - `debugMessageReceivedSignal` — fires on every inbound message.
  - `debugMessageSentSignal` — fires on every outbound message.
  - `debugIncorrectMessageReceivedSignal` — fires when a message fails validation.
  - `messageFromOfscSignal` — fires on valid `open`/`wakeup` push messages.
- `sendMessage(data)` → returns a Promise that resolves with the response.
  - Attaches a unique `callId` to each request for correlation.
- `obtainToken(appName)` → calls `callProcedure` to get an OAuth token.
- `obtainTokenByScope(appName, scope)` → token with scope.
- `shareFile(file)` → calls `callProcedure` with `procedure: 'share'`.
- Static `generateCallId()` — creates incremental unique IDs.

---

### `src/js/services/ofsc-plugin-api-transport.js`
**Role:** Mid-level protocol layer; orchestrates the OFSC init/open handshake.

**Sequence:**
1. Constructor sets up the `OfscConnector` instance and debug signal handlers.
2. `load()` → sends `{ method: 'ready', sendInitData: true }`.
3. On `init` response:
   - Extracts `attributeDescription` and saves it to localStorage via `PersistentStorage`.
   - Sends `{ method: 'initEnd', wakeupNeeded: false }`.
4. On `open` response:
   - Saves `openData` and reads `attributeDescription` back from localStorage.
   - Runs `_verifyProperties()` against `required-properties.json`.
   - If verification fails → throws `ApplicationCriticalError`.
   - If OK → resolves the Promise (signals the app is ready).
5. `terminatePlugin()` → sends `{ method: 'close' }` to shut down the plugin.
6. `_verifyProperties(json, attrDesc)` → checks each property in `required-properties.json`
   against `attributeDescription`; returns an error string or `''`.

---

### `src/js/constants.js`
**Role:** Centralised string/value constants.

| Constant | Value | Used By |
|---|---|---|
| `DEVICE_TYPE_DESKTOP` | `"desktop"` | device detection |
| `DEVICE_TYPE_MOBILE` | `"mobile"` | device detection |
| `INVENTORY_ENTITY_NAME` | `"inventory"` | entity type checks |
| `INVENTORY_TYPE_PART` | `"part"` | inventory type |
| `INVENTORY_TYPE_PART_SN` | `"part_sn"` | inventory type |
| `DELETE_ACTION_NAME` | `"delete"` | action routing |
| `CRITICAL_ERROR` | `"Critical Error"` | error dialog heading |
| `PROPERTY_MUST_BE_CONFIGURED` | prefix string | property validation |
| `PROPERTIES_MUST_BE_CONFIGURED` | prefix string (plural) | property validation |
| `UNABLE_TO_START` | `"Unable to start application: "` | console error |
| `ERR_AUTHENTICATION` | auth error message | token errors |
| `ERR_SERVER` | `"Server returned an error. HTTP Status: "` | HTTP errors |
| `HASH_SYMBOL` | `"#"` | URL routing |
| `ACTION_CLOSE` | `"close"` | plugin close method |
| `CALL_PROC` | `"callProcedure"` | OFSC procedure call method |

---

### `src/js/errors/application-critical-error.js`
**Role:** Custom error class for fatal startup failures.

- Extends `Error` with two extra fields:
  - `this.heading` — dialog title (e.g. `"Critical Error"`).
  - `this.message` — detailed message (e.g. missing property names).
- Caught in `main.js` to show the error dialog before terminating the plugin.

---

### `src/js/storage/persistent-storage.js`
**Role:** Thin wrapper around `window.localStorage`.

| Method | Behaviour |
|---|---|
| `saveData(key, value)` | `JSON.stringify(value)` then `setItem` |
| `loadData(key)` | `getItem` + `JSON.parse`; returns `{}` on missing/error |
| `removeData(key)` | `removeItem` |

Used by `ofsc-plugin-api-transport.js` to persist `attributeDescription` (key: `plugin_attributeDescription`) across the `init` → `open` lifecycle gap.

---

### `src/js/plugin-service-worker-interface.js`
**Role:** Service worker lifecycle manager for offline caching.

- Registers the service worker at `./plugin-service-worker.js` with scope `'/'`.
- Validates that the active SW meets `MINIMAL_SERVICE_WORKER_VERSION`; triggers update if stale.
- Two caching strategies:
  - `cacheViaCacheManifest(swPath, manifestPath, cacheName, cacheVersion)` — parses `manifest.appcache` and caches listed resources.
  - `cacheResourcesList(swPath, resourcesList, cacheName, cacheVersion)` — caches an explicit array of URLs.
- Waits for SW `activate` event with a timeout before resolving.
- Supports AMD, CommonJS, and global script loading patterns.

---

### `src/js/viewModels/asset.js`
**Role:** Knockout ViewModel for the landing (`asset`) route.

**Observables:**
- `problemCodeOptions` — array of `{ index, label }` objects built from the `problem_code` enum.
- `hasOptions` — computed; `true` when enum has at least one value.
- `problemCodeCount` — computed; number of enum entries.
- `showAllAssets` — boolean; controls switching between landing and inline table views.

**`_loadProblemCodes()`** — waits for `app.loaded`, then calls `_processOpenData()`.

**`_processOpenData(openData, attributeDescription)`** — resolves the `problem_code` enum via 4 cascading fallbacks:
1. `openParams.enum.problem_code` (direct enum from OFS open message).
2. `openParams.attributeDescription.problem_code.enum` or passed `attributeDescription.problem_code.enum`.
3. `openData.attributeDescription.problem_code.enum`.
4. `localStorage` key `plugin_attributeDescription` → `.problem_code.enum`.

Sets `window.__problemCodeEnum` and `window.__activityId` for use by the vanilla-JS detail modules.

**`navigateToAllAssets()`** — sets `showAllAssets(true)`, dynamically loads `asset-detail.js` and `all-asset-details.js` scripts (and `asset-details.css`), then calls `AllAssetDetails.render()`.

**`goBack()`** — sets `showAllAssets(false)` and clears the inline container's HTML.

---

### `src/js/views/asset.html`
**Role:** Knockout-bound HTML template for the landing page.

- Shows a message with the problem code count, or a warning if none are found.
- "View All Asset Details" button → calls `navigateToAllAssets()`.
- Contains `<div id="all-assets-inline-container">` which `AllAssetDetails.render()` populates.
- Uses OJet (`oj-button`, `oj-bind-if`, etc.) for UI components.

---

### `src/js/viewModels/asset-detail.js`
**Role:** Vanilla JS IIFE that creates expandable detail card rows for each asset/problem code.

> **Note:** This is NOT an AMD module — it is loaded dynamically via `<script>` tag and exposes a global `AssetDetail` object.

**Key methods on `window.AssetDetail`:**
- `createRows(codeIndex, codeLabel, rowIndex)` → returns `{ summaryRow, detailRow }` DOM elements.
- `toggle(rowIndex)` → expand/collapse the detail panel for a row.
- `updateNote(rowIndex)` → auto-generates the Problem Note textarea from checked items + readings.
- `saveRow(rowIndex)` → collects form data, logs record, shows "Saved!" feedback.
- `continueRow(rowIndex)` → saves and collapses.
- `closeRow(rowIndex)` → collapses without saving.
- `_collectRecord(rowIndex)` → builds a plain JS object with all form values.

**Card sections rendered per row:**
| Section | Notes |
|---|---|
| Asset Info Grid | ID, Serial#, Manufacturer, Model, Description, Mfg Date, Age (years), Barcode |
| Last Completed | Dates + checklist: Visual Inspection, Added Water, BDR Download, Wash, ICC Torque (BAT- codes only) |
| Last Reading | Low VDC, High VDC, Low SG inputs (non-BAT codes) |
| Components | Cables, Connectors, Contact Tips, Rings, Plates, Felt Pads, Cover (BAT- codes only) |
| Problem Note | Free-text textarea; auto-populated; "Needs Repair" and "Complete" checkboxes |

---

### `src/js/viewModels/all-asset-details.js`
**Role:** Vanilla JS IIFE that renders the full asset table with search and filter.

> **Note:** Not an AMD module — loaded dynamically, exposes global `AllAssetDetails`.

**Key methods on `window.AllAssetDetails`:**
- `render(containerId, enumValues)` → builds the table into the target container. Calls `AssetDetail.createRows()` for each `problem_code` enum entry.
- `applyFilter(containerId)` → filters visible rows by the search input text and active tab (All / Pending / Completed).
- `setFilter(containerId, filterValue, buttonElement)` → activates a filter tab.

**Features:**
- Search bar: matches Asset#, Serial#, code label, or code index.
- Three filter tabs: **All**, **Pending** (not yet completed), **Completed**.
- Row expand/collapse via `AssetDetail.toggle()`.
- Tracks per-container state to avoid conflicts if rendered multiple times.

---

### `src/js/views/asset-detail.html` and `src/js/views/all-asset-details.html`
**Role:** OJet router stub views for the `asset-detail` and `all-asset-details` named routes.

These are thin HTML templates used by the OJet router. The actual rendering for the inline (same-page) experience is done by the vanilla JS modules above, injected into `#all-assets-inline-container` inside `asset.html`.

---

### `src/js/required-properties.json`
**Role:** Declares plugin configuration requirements loaded by `ofsc-plugin-api-transport.js`.

```json
{
  "format": 1,
  "product": "19.5.0",
  "properties": [],          // empty — no mandatory OFS properties required at startup
  "pluginAppsObj": [
    { "name": "FUSION", "type": "oauth_user_assertion", "key": "fusionOAuthUserAssertionApplication" },
    { "name": "FFS",    "type": "ofs",                  "key": "ofsApiApplication" }
  ],
  "plugin": { "label": "debriefing_plugin", "lang": "en", "val": "Debrief" }
}
```

> The `plugin.label` field (`debriefing_plugin`) is the OFS internal identifier inherited from the source plugin. It does not affect runtime behaviour.

---

### `src/js/path_mapping.json`
**Role:** Oracle JET build-tool path configuration (used by Grunt/ojet CLI).

Maps each library logical name to:
- `cwd` — local `node_modules` source path (for local builds).
- `debug.cdnPath` / `release.cdnPath` — CDN path under `https://static.oracle.com/cdn/jet/18.1.0/`.

Covers: OJS (Oracle JET), Knockout, jQuery, jQueryUI, Preact (+ hooks/compat/jsx-runtime/debug/devtools), Hammer.js, DnD polyfill, signals, touchr, proj4, requirejs-text, require-css, chai.

---

### `src/manifest.appcache`
**Role:** HTML5 Application Cache manifest listing files to cache for offline use.

Referenced by `plugin-service-worker-interface.js → cacheViaCacheManifest()`. Lists all static assets (JS bundles, CSS, HTML, fonts) that should be available when the device has no network connection.

---

### `src/js/vendor/html2pdf/html2pdf.bundle.js`
**Role:** Bundled third-party PDF generation library.

Loaded in `index.html`. Provides `html2pdf()` globally for potential future document/report export. Not currently wired to any active UI action in the plugin.

---

## localStorage Keys

| Key | Written By | Read By | Content |
|---|---|---|---|
| `plugin_attributeDescription` | `ofsc-plugin-api-transport.js` (on `init`) | `asset.js` (fallback method 4), `ofsc-plugin-api-transport.js` (on `open`) | Full OFS `attributeDescription` object (JSON) |

---

## Dependency Map

```
main.js
  ├── appController.js
  │     └── ofsc-plugin-api-transport.js
  │           ├── ofsc-connector.js
  │           ├── errors/application-critical-error.js
  │           ├── storage/persistent-storage.js
  │           ├── constants.js
  │           └── required-properties.json  (text! loader)
  └── plugin-service-worker-interface.js

viewModels/asset.js
  └── (runtime) asset-detail.js      [loaded via <script>]
  └── (runtime) all-asset-details.js [loaded via <script>]
```

---

## Key Design Patterns

| Pattern | Where Used | Why |
|---|---|---|
| AMD modules (`define`) | All `src/js/*.js` core files | RequireJS dependency injection |
| Vanilla JS IIFEs + globals | `asset-detail.js`, `all-asset-details.js` | Dynamically injected at runtime; must be callable without module loader |
| Knockout observables | `asset.js`, `appController.js`, `ofsc-plugin-api-transport.js` | Two-way data binding to HTML templates |
| Promise-based lifecycle | `ofsc-connector.js`, `ofsc-plugin-api-transport.js`, `appController.js` | Async OFS message round-trips |
| 4-step enum fallback | `asset.js → _processOpenData()` | Robustness: OFS may deliver enum in different locations depending on version/config |
| localStorage bridge | `persistent-storage.js` | Bridges `init` and `open` lifecycle phases (separate postMessage calls) |
