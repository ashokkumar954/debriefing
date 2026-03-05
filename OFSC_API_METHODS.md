# OFSC Plugin API Methods — Reference

> Cross-reference of Oracle Field Service Plugin API methods (per Oracle docs) vs what is actively used in this project.
> Doc reference: https://docs.oracle.com/en/cloud/saas/field-service/fapcf/r-using-the-environment-object.html#u30263555

---

## All Methods in the Oracle Docs

### OFSC → Plugin (inbound lifecycle messages)

| Method | Key Payload Fields | Description |
|--------|--------------------|-------------|
| `init` | `attributeDescription`, `environment` (`environmentName`, `fsUrl`, `faUrl`) | First message received; carries attribute metadata and environment URLs |
| `open` | `openParams`, `activity`, `inventories`, `environment` | Sent when a user opens the plugin; carries live activity/inventory data |
| `updateResult` | `environment` | Sent after the plugin calls `update`; carries the updated entity back |
| `wakeup` | `environment` | Sent on a timer or online event for background synchronisation |

### Plugin → OFSC (outbound messages)

| Method | Key Payload Fields | Description |
|--------|--------------------|-------------|
| `ready` | `sendInitData` (bool) | Signals the plugin is loaded; pass `sendInitData: true` to receive `init` first |
| `initEnd` | `wakeupNeeded` (bool) | Confirms init processing is complete; set `wakeupNeeded: false` to disable offline wake-ups |
| `close` | — | Terminates the plugin session |
| `callProcedure` | `callId`, `procedure`, `params` | Calls a named OFS procedure; response comes back as `callProcedureResult` |

### `callProcedure` Procedure Names

| Procedure | Params | Returns |
|-----------|--------|---------|
| `getAccessToken` | `appName` | OAuth token for the named app |
| `getAccessTokenByScope` | `appName`, `scope` | Scoped OAuth token |
| `share` | `title`, `fileObject`, `text` | Opens the native device share dialog |

---

## Methods IN USE in This Project

### Plugin → OFSC (outbound) — **actively used**

| Method | File | Line | How Used |
|--------|------|------|----------|
| `ready` | [services/ofsc-plugin-api-transport.js](src/js/services/ofsc-plugin-api-transport.js#L58) | 58 | Sent on `load()` with `sendInitData: true` to start the handshake |
| `initEnd` | [services/ofsc-plugin-api-transport.js](src/js/services/ofsc-plugin-api-transport.js#L66) | 66 | Sent after handling `init`; `wakeupNeeded: false` |
| `close` | [services/ofsc-plugin-api-transport.js](src/js/services/ofsc-plugin-api-transport.js#L47) | 47 | Sent by `terminatePlugin()` after a critical error dialog |
| `callProcedure` → `getAccessToken` | [ofsc-connector.js](src/js/ofsc-connector.js#L142) | 142 | `obtainToken(appName)` — fetches OAuth token |
| `callProcedure` → `getAccessTokenByScope` | [ofsc-connector.js](src/js/ofsc-connector.js#L165) | 165 | `obtainTokenByScope(appName, scope)` — fetches scoped OAuth token |
| `callProcedure` → `share` | [ofsc-connector.js](src/js/ofsc-connector.js#L190) | 190 | `shareFile(file)` — triggers native share dialog |

### OFSC → Plugin (inbound) — **actively handled**

| Method | File | Line | What the Code Does |
|--------|------|------|--------------------|
| `init` | [services/ofsc-plugin-api-transport.js](src/js/services/ofsc-plugin-api-transport.js#L63) | 63 | Extracts `attributeDescription`, saves to `localStorage` key `plugin_attributeDescription`, then sends `initEnd` |
| `open` | [services/ofsc-plugin-api-transport.js](src/js/services/ofsc-plugin-api-transport.js#L71) | 71 | Stores `openData`; reads back `attributeDescription` from localStorage; validates required properties; resolves the `load()` Promise so the UI can render |

### Open Message Fields Actually Read

| Field | Where | File |
|-------|-------|------|
| `message.attributeDescription` | `init` handler | [ofsc-plugin-api-transport.js:64](src/js/services/ofsc-plugin-api-transport.js#L64) |
| `openData.openParams` | `_processOpenData()` | [viewModels/asset.js:45](src/js/viewModels/asset.js#L45) |
| `openData.openParams.enum.problem_code` | Enum fallback #1 | [viewModels/asset.js:68](src/js/viewModels/asset.js#L68) |
| `openData.openParams.attributeDescription` | Enum fallback #2 | [viewModels/asset.js:75](src/js/viewModels/asset.js#L75) |
| `openData.attributeDescription` | Enum fallback #3 | [viewModels/asset.js:84](src/js/viewModels/asset.js#L84) |
| `openData.activity.aid` | Sets `window.__activityId` | [viewModels/asset.js:113](src/js/viewModels/asset.js#L113) |

---

## Methods NOT Used (available in docs but absent from project)

| Method | Reason |
|--------|--------|
| `updateResult` (inbound) | No write-back of activity/inventory data to OFS is needed in this plugin |
| `wakeup` (inbound) | Disabled via `wakeupNeeded: false`; was part of the old debrief offline sync cycle, removed during cleanup |
| `environment.environmentName` / `fsUrl` / `faUrl` | Not accessed; the plugin doesn't call OFS/Fusion REST APIs directly — it only reads `problem_code` from the `open` message |

---

## Quick Summary

```
Total active API interactions: 8
  ├─ Inbound handled : init, open                               (2)
  ├─ Outbound direct : ready, initEnd, close                    (3)
  └─ callProcedure   : getAccessToken, getAccessTokenByScope, share  (3)

Docs methods NOT used: updateResult, wakeup, environment object fields
```
