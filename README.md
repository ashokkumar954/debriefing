# BHM — Bulk Health Metrics Plugin for Oracle Field Service

## Overview

BHM (Bulk Health Metrics) is a custom Oracle Field Service (OFS) plugin built for **Concentric** to support field technicians who service multiple assets in a single activity.

When a technician opens an activity, BHM loads all assets associated with that activity (via the customer account). For each asset, the technician records service details — readings, checklist items, components inspected, and a problem note. Once all assets are updated and the technician ends the activity, the collected data is pushed to Oracle Integration Cloud (OIC), which routes it to the appropriate back-end integration.

### Key capabilities

* View all assets linked to the current activity, with Asset ID, serial number, manufacturer, and model.
* Expand each asset to capture:
  * Maintenance checklist (Visual Inspection, Water Added, BDR Download, Wash, ICC Torque)
  * Electrical readings (Low VDC, High VDC, Low SG)
  * Component condition flags (Cables, Connectors, Contact Tips, Shrouds, etc.)
  * Problem note (auto-populated from checked items; fully editable)
  * Needs Repair / Complete status
* Search and filter assets by Asset ID, serial number, or problem code.
* Offline persistence — all form data is saved to localStorage on Save/Continue and restored when re-opened.
* Status badges on each asset row (Saved / Complete) without needing to expand the row.
* Data submission to OIC via REST APIs secured with OAuth (see Authentication below).


## Authentication

BHM uses two OFSC application keys configured on the *Configuration > Forms & Plugins > Applications* screen:

| Key label | OFSC application name | Purpose |
|-----------|----------------------|---------|
| **Ext** (`fusionOAuthUserAssertionApplication`) | Concentric - Oracle Fusion Applications - User Asserted | External REST API calls to FFS/Fusion using OAuth user-assertion |
| **Int** (`ofsApiApplication`) | App CX Service | Internal Field Service API calls |

These keys are exposed as `Constants.KEY_EXT` and `Constants.KEY_INT` in `src/js/constants.js`.


## Installation

### Prerequisites

* [Node.js](https://nodejs.org) (NPM is bundled)
* [Grunt CLI](https://gruntjs.com/)

```bash
npm install -g grunt-cli
npm install
```

### Build

```bash
grunt
# or
ojet build --release
```

This produces the minimized plugin package in `./build/`.

### OFS Configuration

**1. Plugin registration** — Using *Configuration > Forms & Plugins*, add a new plugin:

| Field | Value |
|-------|-------|
| Plugin Type | Plugin Archive (or External Plugin for dev) |
| Label | `bulk_health_metrics` |
| Name | `BHM` |

**2. Applications** — Add both application entries (Ext and Int) as described in the Authentication section above.

**3. Properties** — Ensure `problem_code` is added to the plugin's Available Properties with at least **Read** access. This is how BHM receives the list of asset types for the activity.

**4. Screen button** — Using *Configuration > User Types > Screen Configuration*, add the BHM button to the "Edit/View activity" screen for all relevant user types.


## Development

BHM is an [Oracle JET](https://www.oracle.com/webfolder/technetwork/jet/index.html) web application. It uses the [OFS Plugin API](https://docs.oracle.com/en/cloud/saas/field-service/19b/fapcf/toc.htm) to communicate with OFSC.

### Source structure

| Path | Description |
|------|-------------|
| `src/js/viewModels/asset.js` | Landing screen — loads problem codes, navigates to asset list |
| `src/js/viewModels/asset-detail.js` | Per-asset detail panel — readings, checklist, components, note |
| `src/js/viewModels/all-asset-details.js` | Asset table with search/filter and row rendering |
| `src/js/views/asset.html` | Landing and inline asset list view |
| `src/js/constants.js` | Application-wide constants including `KEY_EXT` and `KEY_INT` |
| `src/js/required-properties.json` | Plugin metadata — label, name, and application key definitions |
| `src/js/ofsc-connector.js` | OFS postMessage communication layer |
| `src/js/services/ofsc-plugin-api-transport.js` | Plugin lifecycle (ready → init → open) and property validation |

### Local development

```bash
grunt serve
# or
ojet serve
```

Since OFS requires HTTPS, front the JET dev server with a reverse proxy (e.g. nginx):

```nginx
server {
    listen *:443 ssl http2;
    ssl_certificate     /etc/nginx/cert/ssl.crt;
    ssl_certificate_key /etc/nginx/cert/ssl.key;
    location ~* ^/jet/ {
        rewrite    ^/jet/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

Register the plugin in OFS as an **External Plugin** pointing to `https://localhost/jet/index.html`.

### Available build tasks

| Command | Description |
|---------|-------------|
| `ojet build --release` / `grunt` | Minimized package for hosted plugin upload |
| `ojet build` / `grunt devBuild` | Unminified package for externally hosted plugin |
| `ojet serve` / `grunt serve` | Dev HTTP server with live rebuild |


## Versioning

The build version is updated automatically on every build (`package.json`). Commit `package.json` after each build to keep source and package in sync.

A `.bumpignore` file in the repo root disables automatic version bumping.

To bump major or minor version manually:

```bash
grunt bumpup:major
grunt bumpup:minor
```

Run a build after a manual version bump to regenerate the timestamp portion.
