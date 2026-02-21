# 🚀 Figma Token Sync Deployment Checklist

## Pre-Deployment

### 1. Figma Setup
- [ ] **Create Figma Personal Access Token**
  - Visit: https://www.figma.com/settings
  - Click: "Create a new personal access token"
  - Name: `github-nx-enterprise-sync` (or similar)
  - Copy token (save temporarily - won't be shown again)
  - Scope: Full access to files

- [ ] **Get Figma File ID**
  - Open your design file in Figma
  - URL format: `figma.com/file/{FILE_ID}/...`
  - Copy the `{FILE_ID}` part
  - Keep this handy for next step

### 2. GitHub Configuration

#### Add Secrets
- [ ] Go to **Settings → Secrets and variables → Actions**
- [ ] Click **"New repository secret"** for each:

| Secret Name | Value | Notes |
|------------|-------|-------|
| `FIGMA_ACCESS_TOKEN` | Your token from step 1.3 | Never share this! |
| `FIGMA_FILE_ID` | Your file ID from step 1.4 | File-specific, not sensitive |

- [ ] Verify both secrets are created (list view)

#### Configure Branch Protection
- [ ] Go to **Settings → Branches → Branch protection rules**
- [ ] Create rule for `tokens/figma-sync`:
  - [ ] Require pull request reviews: **1+**
  - [ ] Require approval from CODEOWNERS: ✅
  - [ ] Dismiss stale pull request approvals: ✅
  - [ ] Require status checks to pass: ✅
  - [ ] Require branches to be up to date before merging: ✅

#### Update CODEOWNERS
- [ ] Open `.github/CODEOWNERS`
- [ ] Replace `@design-team` with your actual GitHub team
  - Format: `@organization/team-name`
  - Example: `@acme/design-system`
- [ ] Test: Verify team exists: `https://github.com/orgs/{ORG}/teams/{TEAM_NAME}`
- [ ] Commit and merge changes

### 3. Customize Token Parsing (Optional but Recommended)

- [ ] Open `libs/shared/tokens/scripts/fetch-from-figma.ts`
- [ ] Review the `fetchFigmaTokens()` function
- [ ] Adapt to your Figma structure:
  - How are tokens organized in Figma?
  - Are they in variables, components, or custom storage?
  - See [Figma API docs](https://www.figma.com/developers/api) for data structure

### 4. Naming Convention Rollout

- [ ] **Document naming rules** for design team
  - Use: [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md)
  - Examples: `color-primary`, `spacing-md`, `typography-heading-lg`

- [ ] **Audit existing tokens in Figma**
  - Ensure they follow kebab-case with groups
  - Fix any violations before first sync

- [ ] **Communicate policy to team**
  - Share naming conventions
  - Explain non-blocking violations
  - Set expectations for PR reviews

### 5. Documentation Review

- [ ] Share these documents with team:
  - [ ] [FIGMA_SETUP.md](./FIGMA_SETUP.md) - Setup guide
  - [ ] [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md) - Quick reference
  - [ ] [ARCHITECTURE.md](../ARCHITECTURE.md#figma-first-token-sync) - Architecture details
  - [ ] [README.md](../README.md) - Updated workflow

- [ ] **Design team training**
  - [ ] Explain Figma is now source of truth
  - [ ] Show how to trigger sync
  - [ ] Walk through PR review process
  - [ ] Discuss naming conventions

- [ ] **Development team training**
  - [ ] Explain they can't manually edit JSON tokens
  - [ ] Show how to use generated tokens
  - [ ] Explain sync workflow
  - [ ] Troubleshooting resources

---

## Deployment

### Phase 1: Test Run

- [ ] **Prepare test tokens in Figma**
  - Create 2-3 test tokens in Figma
  - Use proper naming: `test-color-primary`, `test-spacing-sm`
  - Keep test tokens for validation

- [ ] **Trigger first sync**
  - Go to **Actions** tab
  - Click **"Figma Token Sync (On-Demand)"**
  - Click **"Run workflow"**
  - Keep default inputs (empty)
  - Click **"Run workflow"** to confirm

- [ ] **Monitor workflow**
  - Watch the workflow run in real-time
  - Check for any errors in logs
  - Expected time: 1-3 minutes

- [ ] **Verify PR creation**
  - Check **Pull Requests** tab
  - Should see new PR on `tokens/figma-sync` branch
  - Verify:
    - [ ] Title: Contains date/time
    - [ ] Auto-assigned to design team
    - [ ] Shows test token changes
    - [ ] Git commit hash in PR body
    - [ ] No violations (or expected ones listed)

- [ ] **Review and merge test PR**
  - [ ] Design team member reviews
  - [ ] Check changes look correct
  - [ ] Approve
  - [ ] Merge to `main`
  - [ ] Verify token build ran successfully

### Phase 2: Full Rollout

- [ ] **Audit Figma tokens**
  - Review all existing tokens in Figma file
  - Ensure they follow naming conventions
  - Fix any violations

- [ ] **Trigger second sync**
  - This will fetch all actual production tokens
  - Same steps as Phase 1 test run
  - Expect larger PR with more changes

- [ ] **Design team review**
  - [ ] Review all token changes
  - [ ] Check for naming violations
  - [ ] Approve if correct
  - [ ] Merge to `main`

- [ ] **Verify deployment**
  - [ ] Check token build ran successfully
  - [ ] Verify `generated/css/variables.css` updated
  - [ ] Verify `generated/ts/tokens.ts` updated
  - [ ] Test in web app: `npx nx dev web`
  - [ ] Test in Storybook: `npx nx storybook ui`

### Phase 3: Disable Manual Token Editing

- [ ] **Remove manual token editing instructions**
  - [ ] Update internal team docs
  - [ ] Update onboarding materials
  - [ ] Brief developers on new process

- [ ] **Add branch protection** (if not already done)
  - [ ] Prevent direct pushes to `main` for token changes
  - [ ] Require PR + review for all changes
  - [ ] Add automation to prevent accidental edits

---

## Post-Deployment

### Monitoring

- [ ] **Set up notifications**
  - [ ] Watch for PR auto-closes (stale policy)
  - [ ] Monitor workflow failures
  - [ ] Check team Slack/email for alerts

- [ ] **Monitor workflow runs**
  - [ ] Check **Actions** tab weekly
  - [ ] Look for failed workflows
  - [ ] Investigate and fix any issues

- [ ] **Track stale PR auto-closes**
  - [ ] Expected: Daily check at 2 AM UTC
  - [ ] If PR is open 7+ days without merge, it closes
  - [ ] Team can re-trigger sync if needed

### Maintenance

- [ ] **Collect feedback** (week 1)
  - [ ] Ask design team: Was sync easy to use?
  - [ ] Ask dev team: Are tokens working well?
  - [ ] Identify any improvements needed

- [ ] **Update scripts** if needed
  - [ ] Customize `fetch-from-figma.ts` based on actual Figma structure
  - [ ] Add error handling for edge cases
  - [ ] Improve validation rules if needed

- [ ] **Schedule review** (month 1)
  - [ ] Review all sync PRs created
  - [ ] Check for patterns/issues
  - [ ] Plan any adjustments

### Documentation Updates

- [ ] **Keep docs current**
  - [ ] Update screenshots in setup guides
  - [ ] Add team-specific instructions
  - [ ] Document any customizations
  - [ ] Link to this checklist from onboarding

- [ ] **Create runbooks** for common tasks
  - [ ] How to trigger sync
  - [ ] How to review token PRs
  - [ ] How to rollback changes
  - [ ] Troubleshooting guide

---

## Rollback Plan (If Needed)

If you need to disable the Figma sync system:

1. **Stop new syncs**
   - [ ] Disable `figma-token-sync.yml` workflow
   - [ ] Disable `stale-token-pr-cleanup.yml` workflow

2. **Return to manual tokens** (if desired)
   - [ ] Restore manual token editing process
   - [ ] Update documentation
   - [ ] Brief team on new workflow

3. **Keep history**
   - [ ] Don't delete workflows or scripts
   - [ ] Archive documentation for reference
   - [ ] Keep git history intact

---

## Success Criteria

✅ **System is working well when:**

- Sync PRs create cleanly without errors
- Design team is using Figma to manage tokens
- Token changes are reviewed before merge
- No manual JSON token edits happening
- Team is comfortable with the workflow
- Naming conventions are followed consistently
- Stale PR auto-close policy is working

❌ **Issues to watch for:**

- Workflow failures in Actions
- Manual JSON token edits happening
- Design team not reviewing PRs timely
- Naming convention violations increasing
- Missing or unclear violations in PR comments
- Team confusion about the process

---

## Support & Resources

| Need | Resource |
|------|----------|
| **Setup help** | [FIGMA_SETUP.md](./FIGMA_SETUP.md) |
| **Quick answers** | [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md) |
| **Architecture details** | [ARCHITECTURE.md](../ARCHITECTURE.md#figma-first-token-sync) |
| **How to trigger** | README.md or Actions tab |
| **Troubleshooting** | Check GitHub Actions logs |
| **Questions** | Create issue with workflow logs |

---

## Sign-Off

Once all items are checked, the Figma Token Sync system is ready for production!

- **Deployed by**: _________________ 
- **Date**: _________________
- **Approved by**: _________________
- **Notes**: _________________

---

**Questions?** Check the resources above or create an issue with your question and workflow logs.

