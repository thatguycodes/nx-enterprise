# Designer Guide

## Overview

As a designer, Figma is your workspace. You own the design tokens — the colours, spacing, radii, and other visual values that the entire product is built from. This guide explains how your Figma Variable changes flow into code.

---

## Token Workflow

```
Figma Variables (your changes)
  → Export JSON via Variables 9000 plugin
    → Manually upload JSON to the codebase
      → Developer runs import + build scripts
        → PR review → Merge → Live in the product
```

There is **no automated API integration**. All token updates are fully manual: export from Figma, upload the file, run the build.

---

## Naming Variables in Figma

Variable names use **forward-slash as a path separator** in Figma (e.g. `color/primary`). After import, slashes are converted to nested objects for Style Dictionary.

Each segment of the path must be **lowercase and may contain numbers or hyphens**. If you use uppercase or spaces in Figma, the import script will automatically normalise them to lowercase with hyphens and log a warning, so you know which names to fix in Figma.

| ✅ Valid (or auto-normalised) | ❌ Rejected | Reason |
|---|---|---|
| `color/primary` | `primary` | Missing group |
| `color/Primary` → normalised to `color/primary` | `color//primary` | Empty segment |
| `Color/Blue 500` → normalised to `color/blue-500` | `color_primary` | Use slashes, not underscores |
| `border/radius/sm` | *(none of the above)* | Conforms as-is |

> **Best practice**: Use lowercase and hyphens in Figma variable names to match conventions and avoid normalisation warnings.

---

## Token Layers

Variables are organised in two Figma collections. You should only need to touch **semantic/brand tokens** for day-to-day work.

| Layer | Figma Collection | Example variable | Rule |
|---|---|---|---|
| **Core** | Global | `color/blue/600 = #2563eb` | Raw values. Rarely change. |
| **Semantic** | Brand | `brand/primary = {color/blue/600}` | Purposeful names. Reference core tokens. |

Components use semantic tokens. A rebrand means updating the semantic collection only — without touching any component.

---

## Exporting Tokens from Figma (Variables 9000)

We use the **[Variables 9000](https://www.figma.com/community/plugin/1242548062635934255)** Figma community plugin to export Variables as JSON.

### One-time setup

1. In Figma, open **Plugins** → **Browse plugins in Community**.
2. Search for **Variables 9000** and install it.

### Exporting

1. In your Figma file, open the plugin: **Plugins** → **Variables 9000**.
2. Select the collections and modes you want to export.
3. Click **Export** and download the JSON file.

The exported JSON has this structure:

```json
{
  "Global": {
    "Default": {
      "color/blue/500": "#3b82f6",
      "spacing/sm": "8"
    }
  },
  "Brand": {
    "Light": {
      "color/primary": "#2563eb",
      "color/surface": "#ffffff"
    },
    "Dark": {
      "color/primary": "#60a5fa",
      "color/surface": "#1f2937"
    }
  }
}
```

- **Top-level keys** = collection names (e.g. `Global`, `Brand`)
- **Second-level keys** = mode names (e.g. `Light`, `Dark`, `Default`)
- **Values** = flat key→value pairs with `/` as path separator

---

## Updating Tokens (Step-by-step)

### Step 1 — Make changes in Figma

Update variable values or add new variables in your Figma file.

### Step 2 — Export from Variables 9000

Follow the **Exporting** steps above. Download the JSON file (e.g. `variables-9000-export.json`).

### Step 3 — Upload to the repository

Commit or upload the JSON file to:

```
libs/tokens/design-tokens/src/tokens/figma-exports/variables-9000-export.json
```

> Create the `figma-exports/` directory if it doesn't exist. This directory holds the raw plugin exports for reference and is **not** read by the build directly.

### Step 4 — Run the import script

Convert the Variables 9000 JSON into Style Dictionary–compatible token files:

```bash
node libs/tokens/design-tokens/scripts/import-from-figma-plugin.mjs \
  --input libs/tokens/design-tokens/src/tokens/figma-exports/variables-9000-export.json
```

This writes one JSON file per collection/mode under `src/tokens/`:

```
src/tokens/
  global/
    default.json      ← converted from "Global / Default"
  brand/
    light.json        ← converted from "Brand / Light"
    dark.json         ← converted from "Brand / Dark"
```

**Filtering (optional):** To import only one collection or mode:

```bash
# Import only the "Brand" collection
node ... --collection "Brand"

# Import only "Light" modes across all collections
node ... --mode "Light"
```

### Step 5 — Run the token build

Rebuild the generated CSS variables and TypeScript constants:

```bash
node libs/tokens/design-tokens/scripts/build-tokens.mjs
```

Or via nx:

```bash
npx nx run design-tokens:generate
```

### Step 6 — Commit and open a pull request

Commit all changes:
- `src/tokens/figma-exports/` — the raw plugin export (for audit)
- `src/tokens/{collection}/{mode}.json` — converted token files
- `src/generated/` — rebuilt CSS and TypeScript artefacts

Open a pull request for review.

Alternatively, after committing the converted token files, trigger the **"Token Import (On-Demand)"** GitHub Actions workflow — it will rebuild the generated artefacts and open a PR automatically.

> **Note:** The GitHub Actions workflow only rebuilds from already-committed token files. Always run the import script locally first (steps 4–5 above).

---

## Reviewing the Token PR

In the PR you'll find:

- A diff of every changed token JSON file under `src/tokens/`
- A diff of the rebuilt CSS variables and TypeScript constants
- The git commit hash for audit purposes

**When ready:** Approve and merge. The tokens will be live in the next deployment.

---

## Merge Policy

- A new workflow run **closes the previous open PR** and creates a fresh one.
- If a PR is auto-closed, just trigger a new run after committing your latest token files.

---

## Reverting a Token Change

1. Update the variable in Figma to its previous value.
2. Re-export from Variables 9000.
3. Follow steps 3–6 above.

---

## Questions

For anything token-related, tag `@design-team` in the PR or open an issue in the repository.
