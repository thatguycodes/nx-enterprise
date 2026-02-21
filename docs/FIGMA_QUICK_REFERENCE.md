# Quick Reference: Figma Token Sync

## Naming Conventions

All tokens **must** follow kebab-case with at least one group:

```
group-name
group-subgroup-name
```

### ✅ Valid Examples
- `color-primary`
- `color-brand-blue-600`
- `spacing-md`
- `spacing-lg`
- `typography-heading-large`
- `border-radius-md`
- `shadow-sm`

### ❌ Invalid Examples
- `primary` (no group)
- `ColorPrimary` (not kebab-case)
- `color_primary` (underscores)
- `color--primary` (double dash)

## Triggering a Sync

### GitHub UI
1. Go to **Actions**
2. Select **"Figma Token Sync (On-Demand)"**
3. Click **"Run workflow"**
4. Confirm

### GitHub CLI
```bash
gh workflow run figma-token-sync.yml
```

## What Happens During Sync

1. Closes any existing open `tokens/figma-sync` PR
2. Fetches tokens from Figma API
3. Validates naming conventions
4. Creates new PR with:
   - Token changes
   - Naming violations (as warnings, not blockers)
   - Git commit hash for audit trail
5. Auto-assigns design team via CODEOWNERS

## PR Review

Design team will:
- Review token changes in Files tab
- Check for naming violations
- Approve if correct
- Merge to main

## Auto-Close Policy

PRs older than 7 days without merge are automatically closed.

To re-sync after closure:
1. Fix any issues in Figma
2. Trigger new sync from Actions
3. Fresh PR will be created

## Rollback Process

1. Revert token in Figma
2. Trigger sync from Actions
3. New PR created with reverted values
4. Design team reviews and merges

## Common Issues

| Issue | Solution |
|-------|----------|
| No PR created | Check if tokens actually changed in Figma |
| Naming violations | Fix in Figma or approve PR to accept |
| Design team not assigned | Update CODEOWNERS with correct team handle |
| PR auto-closed | Trigger fresh sync from Actions tab |

## Files & Locations

| File | Purpose |
|------|---------|
| `.github/CODEOWNERS` | Auto-assigns design team to PRs |
| `.github/workflows/figma-token-sync.yml` | On-demand sync workflow |
| `.github/workflows/stale-token-pr-cleanup.yml` | Auto-closes stale PRs (runs daily) |
| `libs/shared/tokens/scripts/fetch-from-figma.ts` | Fetches and validates tokens from Figma |
| `libs/shared/tokens/src/tokens/core.json` | Auto-generated - do not edit! |
| `libs/shared/tokens/src/tokens/semantic.json` | Auto-generated - do not edit! |

## GitHub Secrets Required

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `FIGMA_ACCESS_TOKEN` | Your Figma personal access token |
| `FIGMA_FILE_ID` | Your Figma file ID |

## Support

- 📖 Full guide: [Figma Setup Guide](./FIGMA_SETUP.md)
- 🏗️ Architecture: [ARCHITECTURE.md](../ARCHITECTURE.md)
- 🚀 Implementation: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

