# 📚 Complete Implementation Guide - Figma Token Sync

**Last Updated**: February 20, 2026  
**Status**: ✅ Ready for Deployment

---

## What Was Built

A complete **Figma-first token management system** that makes Figma the single source of truth for design tokens. Changes flow automatically from Figma → GitHub → Design review → Production.

### Key Features Implemented

✅ **On-Demand Sync** - Manual trigger via GitHub UI or CLI  
✅ **Figma API Integration** - Fetches tokens directly from Figma  
✅ **Naming Validation** - Enforces kebab-case naming conventions  
✅ **Non-Blocking Warnings** - Violations logged but don't block merge  
✅ **Design Team Auto-Assignment** - Via GitHub CODEOWNERS  
✅ **Conflict Prevention** - Auto-closes stale PRs after 7 days  
✅ **Audit Trail** - Git commit hash for traceability  
✅ **Comprehensive Documentation** - Setup, quick ref, troubleshooting

---

## Files Created

### GitHub Automation
- ✅ `.github/CODEOWNERS` - Auto-assigns design team to PRs
- ✅ `.github/workflows/figma-token-sync.yml` - On-demand sync workflow
- ✅ `.github/workflows/stale-token-pr-cleanup.yml` - Auto-closes stale PRs

### Figma Integration
- ✅ `libs/shared/tokens/scripts/fetch-from-figma.ts` - Fetches & validates tokens from Figma API

### Documentation
- ✅ `docs/IMPLEMENTATION_SUMMARY.md` - Full overview of what was built
- ✅ `docs/FIGMA_SETUP.md` - Step-by-step setup guide
- ✅ `docs/FIGMA_QUICK_REFERENCE.md` - Quick reference for team
- ✅ `docs/DEPLOYMENT_CHECKLIST.md` - Pre/post deployment tasks
- ✅ `docs/FIGMA_TROUBLESHOOTING.md` - Common issues & solutions

### Configuration Updates
- ✅ `ARCHITECTURE.md` - Added Figma-First Token Sync section + ADR-006
- ✅ `README.md` - Updated workflow and tech stack
- ✅ `package.json` - Added node-fetch dependency
- ✅ `.gitignore` - Added Figma sync files

---

## 🚀 Quick Start (30 minutes)

### 1. Create Figma API Token (5 min)
```
1. Go to https://www.figma.com/settings
2. Create personal access token
3. Copy token (don't lose it!)
```

### 2. Get Figma File ID (2 min)
```
1. Open your design file in Figma
2. URL: figma.com/file/{FILE_ID}/...
3. Copy the FILE_ID part
```

### 3. Add GitHub Secrets (5 min)
```
Settings → Secrets → Add:
- FIGMA_ACCESS_TOKEN = your token
- FIGMA_FILE_ID = your file ID
```

### 4. Update CODEOWNERS (3 min)
```
Edit .github/CODEOWNERS:
Replace @design-team with @org/actual-team-name
Commit and merge changes
```

### 5. Test First Sync (10 min)
```
Actions → "Figma Token Sync" → Run workflow
Monitor workflow run
Review PR created
Merge if correct
```

**Done!** 🎉 Figma sync is now live

---

## 📖 Documentation Map

**For different needs, start here:**

| Need | Start Here |
|------|-----------|
| **Just getting started** | [FIGMA_SETUP.md](./FIGMA_SETUP.md) (10 min read) |
| **Need quick answers** | [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md) (5 min read) |
| **Deploying to production** | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) (30 min checklist) |
| **Something's broken** | [FIGMA_TROUBLESHOOTING.md](./FIGMA_TROUBLESHOOTING.md) (find your issue) |
| **Understanding architecture** | [ARCHITECTURE.md](../ARCHITECTURE.md#figma-first-token-sync) (20 min read) |
| **Full implementation details** | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) (15 min read) |

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DESIGNER: Updates tokens in Figma                        │
│    • Adds new colors, spacing, typography, etc.             │
│    • Uses kebab-case naming: color-primary, spacing-md      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ENGINEER: Triggers sync from GitHub Actions              │
│    • Goes to Actions tab                                    │
│    • Clicks "Figma Token Sync (On-Demand)"                  │
│    • Runs workflow                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. AUTOMATION: Fetches & validates tokens                   │
│    • Calls Figma API                                        │
│    • Validates naming conventions                           │
│    • Closes existing PR (if any)                            │
│    • Logs violations as warnings (non-blocking)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. AUTOMATION: Creates PR with full details                 │
│    • Shows token changes                                    │
│    • Lists naming violations (if any)                       │
│    • Includes git commit hash (audit trail)                 │
│    • Auto-assigns design team via CODEOWNERS                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DESIGN TEAM: Reviews & approves PR                       │
│    • Reviews changes in Files tab                           │
│    • Checks for violations                                  │
│    • Approves if correct                                    │
│    • Merges to main                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. AUTOMATION: Builds & deploys                             │
│    • Build workflow runs (Style Dictionary)                 │
│    • Generates CSS variables & TypeScript constants         │
│    • Publishes to production                                │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Benefits

### For Designers
- ✅ Stay in Figma (no context switching)
- ✅ No manual JSON editing
- ✅ Changes apply automatically
- ✅ Full control over tokens

### For Developers
- ✅ Tokens always in sync with Figma
- ✅ Type-safe tokens (TypeScript constants)
- ✅ No manual token maintenance
- ✅ Clear audit trail (git commit hash)

### For Organization
- ✅ Single source of truth (Figma)
- ✅ Governance (design team review required)
- ✅ Conflict prevention (merge-before-sync policy)
- ✅ Traceability (full audit trail)
- ✅ Scalability (works for any team size)

---

## 🔄 Token Workflow

### Adding a New Token

**Old Way** (❌ Don't do this anymore):
```
1. Edit core.json or semantic.json manually
2. Run npx nx build tokens
3. Commit & create PR
4. Review & merge
```

**New Way** (✅ Do this now):
```
1. Add token to Figma file
2. Trigger sync from GitHub Actions
3. PR automatically created
4. Design team reviews & merges
5. Tokens auto-build & deploy
```

### Naming Conventions

All tokens **must** be kebab-case with a group:

```
✅ Valid patterns:
  color-primary
  spacing-md
  typography-heading-lg
  border-radius-sm

❌ Invalid patterns:
  primary (no group)
  ColorPrimary (not kebab-case)
  color_primary (underscore instead of dash)
  primary--color (double dash)
```

Violations are logged as warnings in PR - design team can approve anyway if needed.

---

## 🎛️ Configuration

### Required Setup

| Item | Where | What |
|------|-------|------|
| **Figma Token** | GitHub Settings → Secrets | `FIGMA_ACCESS_TOKEN` |
| **Figma File ID** | GitHub Settings → Secrets | `FIGMA_FILE_ID` |
| **Design Team** | `.github/CODEOWNERS` | Replace `@design-team` with actual team |

### Optional Customization

- **Token Parsing**: Edit `fetch-from-figma.ts` to match your Figma structure
- **Naming Rules**: Modify validation in `fetch-from-figma.ts` if needed
- **Stale PR Policy**: Adjust 7-day timeout in `stale-token-pr-cleanup.yml`
- **Sync Frequency**: Already on-demand; add schedule trigger if desired

---

## 🔒 Security

### Secrets Protection
- ✅ Figma token is stored securely in GitHub secrets
- ✅ Never logged in workflow output
- ✅ Only accessible to workflows
- ✅ File ID is non-sensitive (could be public)

### Best Practices
1. **Never commit secrets** to repo
2. **Revoke immediately** if token is exposed
3. **Use strong tokens** (personal access tokens are secure)
4. **Rotate periodically** (consider quarterly)
5. **Limit token scope** to just read access if possible

---

## 🧪 Testing

### Before Going Live

1. **Create test tokens in Figma**
   - Use naming: `test-color-primary`, `test-spacing-sm`
   - Keep for validation

2. **Run test sync**
   - Go to Actions → Figma Token Sync
   - Watch workflow run
   - Verify PR is created correctly

3. **Review test PR**
   - Check token changes are correct
   - Verify git commit hash in body
   - Merge if all looks good

4. **Verify in app**
   - Check generated files were created
   - Test in web app: `npx nx dev web`
   - Test in Storybook: `npx nx storybook ui`

### Full Production Rollout

1. Audit all existing tokens in Figma
2. Ensure they follow naming conventions
3. Trigger production sync
4. Design team reviews (expect larger PR)
5. Merge and verify deployment

---

## ⚠️ Important Notes

### Don't Do This ❌
```
# NEVER manually edit these files:
libs/shared/tokens/src/tokens/core.json
libs/shared/tokens/src/tokens/semantic.json

# They are auto-generated from Figma sync
# Manual edits will be overwritten
```

### Do Do This ✅
```
# Always make token changes in Figma first
# Then trigger sync from GitHub Actions
# Let design team review & merge
```

### Remember These Policies
- **Merge before next sync**: Close old PRs within 7 days or they auto-close
- **Naming conventions required**: Kebab-case with groups (violations are warnings)
- **Design team reviews**: All token changes must be approved
- **Audit trail tracked**: Git commit hash logged for every sync

---

## 🎓 Training Checklist

### For Design Team

- [ ] Understand Figma is now source of truth
- [ ] Learn naming conventions (kebab-case with groups)
- [ ] Know how to trigger sync (Actions tab)
- [ ] Understand PR review process
- [ ] Know what violations mean (and can approve anyway)
- [ ] Can rollback if needed (via Figma + re-sync)

### For Development Team

- [ ] Understand tokens are auto-generated from Figma
- [ ] Can't manually edit token JSON files
- [ ] Know to check generated files (not source)
- [ ] Can trigger sync when needed
- [ ] Can review PRs for correctness
- [ ] Can read and understand violations

### For Management

- [ ] Figma is now single source of truth
- [ ] Reduces design-dev communication overhead
- [ ] All token changes have audit trail
- [ ] Design team has approval authority
- [ ] Scalable for growing design system

---

## 📞 Support Resources

### Self-Service

1. **[FIGMA_SETUP.md](./FIGMA_SETUP.md)** - Start here for setup help
2. **[FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md)** - Quick answers
3. **[FIGMA_TROUBLESHOOTING.md](./FIGMA_TROUBLESHOOTING.md)** - Problem solver
4. **[ARCHITECTURE.md](../ARCHITECTURE.md#figma-first-token-sync)** - Deep dive
5. **GitHub Actions logs** - Detailed error messages

### Getting Help

- Check documentation above first (usually fastest)
- Search GitHub issues for your problem
- Check workflow logs (most helpful for debugging)
- Create issue with error log + reproduction steps
- Tag design and engineering leads

---

## ✅ Success Metrics

The system is working well when:

- PRs create cleanly without errors
- Design team actively using Figma for tokens
- Tokens reviewed before merge
- No manual JSON token edits happening
- Naming conventions followed consistently
- Team comfortable with workflow

---

## 🚀 Next Steps

### Immediately
1. Follow [FIGMA_SETUP.md](./FIGMA_SETUP.md) to get started
2. Do test run with 2-3 test tokens
3. Verify system works end-to-end

### Within Week
1. Audit all existing tokens in Figma
2. Fix any naming convention violations
3. Do full production sync
4. Train design & dev teams

### Ongoing
1. Monitor workflow runs (check Actions weekly)
2. Review token PRs promptly (within 7 days)
3. Collect feedback from team
4. Make adjustments as needed
5. Keep documentation updated

---

## 📝 File Reference

### Core Files
- `.github/CODEOWNERS` - Design team assignment
- `.github/workflows/figma-token-sync.yml` - Main sync workflow
- `.github/workflows/stale-token-pr-cleanup.yml` - Auto-close workflow
- `libs/shared/tokens/scripts/fetch-from-figma.ts` - Figma integration

### Documentation
- `docs/FIGMA_SETUP.md` - Setup instructions
- `docs/FIGMA_QUICK_REFERENCE.md` - Quick answers
- `docs/DEPLOYMENT_CHECKLIST.md` - Deployment tasks
- `docs/FIGMA_TROUBLESHOOTING.md` - Problem solving
- `docs/IMPLEMENTATION_SUMMARY.md` - Full overview
- `ARCHITECTURE.md` - Architecture & ADR-006
- `README.md` - Project overview

---

## 🎉 You're All Set!

Everything is ready for deployment. Follow the checklist above and you'll have a fully functional Figma-first token management system in under 30 minutes.

**Questions?** Check the docs or create an issue!

---

**Built with ❤️ for enterprise design systems**  
**Status**: ✅ Ready for Production  
**Last Updated**: February 20, 2026

