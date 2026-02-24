# Designer Guide

## Overview

As a designer, Figma is your workspace. You own the design tokens — the colours, spacing, radii, and other visual values that the entire product is built from. This guide explains how your Figma changes flow into code.

---

## Token Workflow

```
Figma (your changes) → Export JSON (free plugin) → Developer updates token files → PR review → Merge → Live in the product
```

Figma API access is not required. All token updates are done by exporting a JSON file from a free Figma community plugin and having a developer apply it.

---

## Naming Tokens in Figma

Tokens must follow **kebab-case with at least one group**. This is required for the import to work correctly.

**Format:** `group-name` or `group-subgroup-name`

| ✅ Valid | ❌ Invalid | Reason |
|---|---|---|
| `color-primary` | `primary` | Missing group |
| `spacing-md` | `SpacingMd` | Must be lowercase |
| `typography-heading-lg` | `color_primary` | Use dashes, not underscores |
| `border-radius-sm` | `color--primary` | No double dashes |

---

## Token Layers

Tokens are organised in two layers. You should only need to touch **semantic tokens** for day-to-day work.

| Layer | Example | Rule |
|---|---|---|
| **Core** | `color-blue-600 = #2563eb` | Raw values. Rarely change. |
| **Semantic** | `brand-primary = {color-blue-600}` | Purposeful names. Reference core tokens. |

Components use semantic tokens. A rebrand means updating the semantic layer only — without touching any component.

---

## Available Token Categories

| Category | Example tokens |
|---|---|
| Brand colours | `brand-primary`, `brand-hover` |
| Surface colours | `surface-base`, `surface-muted` |
| Text colours | `text-base`, `text-muted`, `text-on-brand` |
| Border | `border-default` |
| Spacing | `spacing-xs`, `spacing-sm`, `spacing-md`, `spacing-lg`, `spacing-xl` |
| Border radius | `border-radius-sm`, `border-radius-md`, `border-radius-lg` |

---

## Exporting Tokens from Figma

Use any free Figma community plugin that exports design tokens as JSON. Recommended options:

- **[Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978)** — exports a `tokens.json` file with named sets (e.g. `global`, `semantic`).
- **[Design Tokens (by Jan Six)](https://www.figma.com/community/plugin/888356646278934516)** — exports W3C DTCG–style JSON.

### Steps

1. Install the plugin in Figma (one-time).
2. Make your token changes in Figma.
3. Open the plugin and export/download the JSON file.
4. Share the JSON file with a developer (Slack, email, or attach to a GitHub issue).

---

## Applying Token Changes (Developer Steps)

Once you receive the exported JSON file from the designer:

1. Run the import script to convert the plugin JSON into `core.json` / `semantic.json`:

   ```bash
   npx nx run design-tokens:import-tokens -- --input path/to/figma-export.json
   ```

   Pass `--core <group>` and/or `--semantic <group>` if the plugin exported different group names than `global` / `semantic`.

2. Verify the diff in `libs/tokens/design-tokens/src/tokens/`.

3. Rebuild the generated CSS and TypeScript artefacts:

   ```bash
   npx nx run design-tokens:generate
   ```

4. Commit all changes (`core.json`, `semantic.json`, and the rebuilt `src/generated/` files) and open a pull request for review.

Alternatively, after committing only the updated `core.json` / `semantic.json` files, trigger the **"Token Import (On-Demand)"** GitHub Actions workflow — it will rebuild the generated artefacts and open a PR automatically.

> **Note:** The GitHub Actions workflow does **not** run the import script; it only rebuilds the generated CSS / TypeScript files from already-committed `core.json` / `semantic.json`. Always run the import script locally first (step 2 above) to convert the Figma plugin export into these source files.

---

## Reviewing the Token PR

In the PR you'll find:

- A diff of every changed token in `core.json` / `semantic.json`
- A diff of the rebuilt CSS variables and TypeScript constants
- The git commit hash for audit purposes

**When ready:** Approve and merge. The tokens will be live in the next deployment.

---

## Merge Policy

- A new workflow run **closes the previous open PR** and creates a fresh one.
- If a PR is auto-closed, just trigger a new run after committing your latest token files.

---

## Reverting a Token Change

1. Update the token in Figma to its previous value.
2. Export the JSON file and share it with a developer.
3. The developer runs the import script, rebuilds, and opens a new PR.

---

## Questions

For anything token-related, tag `@design-team` in the PR or open an issue in the repository.
