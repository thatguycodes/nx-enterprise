# 🎨 Figma Token Sync Setup Guide

This guide walks you through setting up the Figma-to-GitHub token sync system.

## Prerequisites

- Figma account with design file containing tokens
- GitHub repository with secrets access
- Design team assigned in GitHub with CODEOWNERS

## Setup Steps

### 1. Create Figma API Token

1. Go to [Figma Settings → Personal access tokens](https://www.figma.com/settings)
2. Click **"Create a new personal access token"**
3. Name it: `github-nx-enterprise-sync`
4. Copy the token (you won't see it again!)

### 2. Get Figma File ID

1. Open your design file in Figma
2. Look at the URL: `figma.com/file/{FILE_ID}/...`
3. Copy the `{FILE_ID}` part

### 3. Add GitHub Secrets

1. Navigate to **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Add these two secrets:

| Name | Value |
|------|-------|
| `FIGMA_ACCESS_TOKEN` | Your Figma personal access token |
| `FIGMA_FILE_ID` | Your Figma file ID |

### 4. Configure Design Team in CODEOWNERS

The `.github/CODEOWNERS` file is already configured to auto-assign the design team:

```
# Design Tokens - Auto-assign design team for review
libs/shared/tokens/src/tokens/ @design-team
```

**Replace `@design-team` with your actual GitHub team**:
- Get your team handle from Settings → Teams
- Format: `@org/team-name`

Example:
```
libs/shared/tokens/src/tokens/ @acme/design-team
```

### 5. Customize Token Parsing (Optional)

The fetch script is set up for a generic Figma structure. To parse your specific token format:

1. Open `libs/shared/tokens/scripts/fetch-from-figma.ts`
2. In the `fetchFigmaTokens()` function, modify the Figma API response parsing
3. Extract tokens from your Figma variables, components, or custom storage

See [Figma API Documentation](https://www.figma.com/developers/api) for available data structures.

## Triggering a Sync

### Via GitHub UI

1. Go to **Actions → Figma Token Sync (On-Demand)**
2. Click **"Run workflow"**
3. Keep inputs blank (defaults to auto-generated branch)
4. Click **"Run workflow"** again to confirm

### Via GitHub CLI

```bash
gh workflow run figma-token-sync.yml
```

## What Happens

1. ✅ Fetches tokens from Figma API
2. ✅ Validates naming conventions (kebab-case with groups)
3. ✅ Checks for existing open PRs (closes if found)
4. ✅ Creates new PR with violations (if any) as warnings
5. ✅ Auto-assigns design team for review
6. ✅ Includes git commit hash in PR body for audit trail

## Naming Convention Rules

All tokens **must** follow: `group-subgroup-name`

✅ **Valid**:
- `color-primary`
- `spacing-md`
- `typography-heading-large`
- `border-radius-md`

❌ **Invalid**:
- `primary` (missing group)
- `ColorPrimary` (not kebab-case)
- `color_primary` (underscores not allowed)

## Automatic Cleanup

Stale PRs (7+ days old without merge) are automatically closed daily at 2 AM UTC.

To re-sync after stale closure:
1. Go to **Actions → Figma Token Sync (On-Demand)**
2. Click **"Run workflow"**

## Troubleshooting

### ❓ Workflow fails with "Missing environment variables"

**Fix**: Verify `FIGMA_ACCESS_TOKEN` and `FIGMA_FILE_ID` are set in GitHub Secrets.

### ❓ No PR is created even though I triggered sync

**Likely cause**: No changes in Figma since last sync.

**Check**:
- Make sure you actually modified tokens in Figma
- Verify Figma file ID is correct
- Check GitHub Actions logs for detailed errors

### ❓ PR created but design team not assigned

**Fix**: Update CODEOWNERS file with correct team handle:

```
libs/shared/tokens/src/tokens/ @your-org/your-design-team
```

### ❓ Token naming violations appear in PR

**This is expected**! Violations are warnings, not blockers.

**Next steps**:
- Fix tokens in Figma and re-trigger sync, OR
- Approve PR to accept violations as-is

### ❓ PR was auto-closed due to stale policy

This is intentional to prevent conflicts. 

**To proceed**:
1. Trigger a fresh sync from Actions tab
2. New PR will be created with latest tokens

## How to Revert a Merged Token Change

1. In Figma, revert the token to previous value
2. Trigger sync from GitHub Actions
3. New PR created with reverted tokens
4. Design team reviews and merges

## Support

For issues or questions:
- Check GitHub Actions logs: **Actions → Figma Token Sync → Latest run**
- Review ARCHITECTURE.md section on Figma-First Token Sync
- Create an issue with workflow logs attached

