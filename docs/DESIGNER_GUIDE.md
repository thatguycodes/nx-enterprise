# Designer Guide

## Overview

As a designer, Figma is your workspace. You own the design tokens — the colours, spacing, radii, and other visual values that the entire product is built from. This guide explains how your Figma changes flow into code.

---

## Token Workflow

```
Figma (your changes)
  → Export JSON with free plugin
  → Commit figma.json to a branch
  → GitHub Actions auto-transforms and builds tokens
  → PR review → Merge → Live in the product
```

You never write code. Everything starts in Figma.

---

## Exporting Tokens from Figma

Use the free **Variables to JSON** plugin (no subscription required).

### Step-by-step

1. Open your Figma file.
2. Go to **Plugins → Variables to JSON**.
3. Click **Export** to download `figma.json`.
4. In the repository, replace the file at:
   ```
   libs/tokens/design-tokens/src/tokens/figma.json
   ```
5. Commit the file to a new branch (e.g. `tokens/my-update`) and push it.

GitHub Actions will detect the change, run the transformation and build scripts automatically, and open a pull request for review.

> **Tip:** Do not edit any other files under `src/generated/` manually — those are generated automatically from `src/tokens/figma.json`.

---

## Triggering a Sync Manually

If you need to trigger the token sync without pushing a new `figma.json`:

1. Go to the repository on GitHub.
2. Click the **Actions** tab.
3. Select **"Figma Token Sync (On-Demand)"**.
4. Click **"Run workflow"** → **"Run workflow"**.

A pull request will be created automatically and assigned to you for review.

---

## Naming Tokens in Figma

Tokens must follow **kebab-case with at least one group**. This is required for the sync to work correctly.

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

## Multi-Brand Support

The `figma.json` export supports multiple semantic modes (brands). Add additional top-level keys using the `semantic/<brand-name>` pattern:

```json
{
  "global": { ... },
  "semantic/default": { ... },
  "semantic/brand-purple": { ... }
}
```

Each brand mode is written to `src/tokens/brands/` and can be used as a source for a per-brand Style Dictionary build configuration.

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

## Reviewing the Sync PR

After the sync runs you'll receive a GitHub notification. In the PR you'll find:

- A diff of every changed token
- Updated CSS variables (`generated/css/variables.css`)
- Updated TypeScript constants (`generated/ts/tokens.ts`)

**When ready:** Approve and merge. The tokens will be live in the next deployment.

---

## Merge Policy

- A new sync **closes the previous open PR** and creates a fresh one
- If a PR is auto-closed, just push a new `figma.json` or trigger a manual sync

---

## Reverting a Token Change

Reverting is done through Figma — not through git.

1. Update the token in Figma to its previous value.
2. Export a new `figma.json` and commit it.
3. A new PR will be created — review and merge it.

---

## Questions

For anything token-related, tag `@design-team` in the PR or open an issue in the repository.

