# 🔧 Figma Token Sync Troubleshooting Guide

## Common Issues & Solutions

### 🚨 Workflow Issues

#### ❌ Workflow fails: "Missing environment variables"

**Error message**:
```
❌ Missing environment variables: FIGMA_ACCESS_TOKEN or FIGMA_FILE_ID
```

**Root cause**: GitHub secrets not set up correctly

**Solution**:
1. Go to **Settings → Secrets and variables → Actions**
2. Verify both secrets exist:
   - `FIGMA_ACCESS_TOKEN`
   - `FIGMA_FILE_ID`
3. If missing, add them:
   - Get token from [Figma Settings](https://www.figma.com/settings)
   - Get file ID from Figma file URL: `figma.com/file/{FILE_ID}/...`
4. Re-run workflow

---

#### ❌ Workflow fails: "Figma API error"

**Error message**:
```
❌ Failed to fetch Figma tokens: Figma API error: Unauthorized
```

**Root cause**: Invalid Figma token or expired token

**Solution**:
1. Verify token in GitHub secrets is correct
2. Check if token has expired (tokens can expire)
3. Create new token:
   - Visit [Figma Settings](https://www.figma.com/settings)
   - Click "Create a new personal access token"
   - Copy new token
   - Update `FIGMA_ACCESS_TOKEN` secret in GitHub
4. Re-run workflow

---

#### ❌ Workflow fails: "Cannot find file"

**Error message**:
```
❌ Failed to fetch Figma tokens: Figma API error: Not Found
```

**Root cause**: Wrong Figma file ID

**Solution**:
1. Open your Figma file
2. Copy correct file ID from URL:
   - URL: `figma.com/file/a1b2c3d4e5f6g7h8i9j0/My-Design-File`
   - File ID: `a1b2c3d4e5f6g7h8i9j0`
3. Update `FIGMA_FILE_ID` secret
4. Re-run workflow

---

#### ❌ Workflow timeout

**Error message**:
```
The operation timed out after 360 seconds
```

**Root cause**: Figma file is very large or API is slow

**Solution**:
1. Check Figma API status: [Figma Status](https://www.figmastatus.com/)
2. Try again later
3. If persistent, optimize Figma file:
   - Remove unused pages/components
   - Archive old versions
   - Simplify token structure
4. Re-run workflow

---

### 📋 PR Issues

#### ❌ No PR created even though I triggered sync

**Root cause**: No changes detected in Figma since last sync

**Solution**:
1. Verify you actually changed tokens in Figma
2. Check Figma file ID is correct
3. Look at workflow logs:
   - Go to **Actions** → **Last run** → **Logs**
   - Check for error messages
4. If no changes needed, this is expected behavior ✅
5. To test: Make a test token in Figma and try again

---

#### ❌ PR created but wrong file ID shown

**Problem**: PR shows old file ID or commits seem wrong

**Root cause**: Secret was updated but old workflow references cached value

**Solution**:
1. Wait a few minutes for GitHub to refresh
2. Or, manually trigger workflow again:
   - Go to **Actions** → **Figma Token Sync**
   - Click **"Run workflow"**

---

#### ❌ Design team not auto-assigned to PR

**Problem**: PR created but design team not in reviewers

**Root cause**: CODEOWNERS not set up correctly

**Solution**:
1. Check `.github/CODEOWNERS` file:
   ```
   libs/shared/tokens/src/tokens/ @design-team
   ```
2. Verify `@design-team` is your actual GitHub team:
   - Go to [GitHub Teams](https://github.com/orgs/{ORG}/teams)
   - Find your team
   - Format must be: `@organization/team-name`
3. Update CODEOWNERS with correct team
4. Commit and merge changes
5. Create new sync - PR should now have auto-assigned reviewers

---

#### ❌ PR has too many violations

**Problem**: Token naming violations shown in PR comment

**Root cause**: Tokens in Figma don't follow naming convention

**Solution**:
1. Review violations listed in PR comment
2. In Figma, rename tokens to follow convention:
   - Must be kebab-case: `lowercase-with-dashes`
   - Must have group: `group-name`, not just `name`
   - Examples: `color-primary`, `spacing-md`, `typography-heading-lg`
3. Trigger new sync:
   - Workflow closes old PR automatically
   - Creates new PR with fixed tokens
4. Design team reviews and approves
5. Merge ✅

---

### 🔄 Sync & Merge Issues

#### ❌ PR was auto-closed due to stale policy

**Problem**: PR disappeared and got closed after 7 days

**Root cause**: This is intentional! Stale PR policy auto-closes old PRs

**Solution** (if you still need the changes):
1. In Figma, fix any remaining issues
2. Trigger new sync:
   - Go to **Actions** → **"Figma Token Sync (On-Demand)"**
   - Click **"Run workflow"**
3. Fresh PR will be created with latest tokens
4. Design team reviews and merges

**To prevent future auto-close**:
- Merge PR within 7 days of creation
- Design team should prioritize token sync reviews

---

#### ❌ "merge before next sync" - Previous PR not merged

**Problem**: Trying to trigger sync but old PR is still open

**Root cause**: New sync workflow closes old PR automatically (by design)

**Solution**:
1. Go to **Pull Requests** and find open `tokens/figma-sync` PR
2. Option A - Merge it:
   - Design team reviews and approves
   - Merge to main
   - Now safe to trigger new sync
3. Option B - Discard it:
   - Comment why you're discarding
   - Let it auto-close after 7 days
   - Or manually close it
   - Then trigger new sync

**For next time**: Merge token PRs within 7 days to avoid auto-close

---

#### ❌ Merge conflict on tokens/figma-sync branch

**Problem**: Can't merge due to conflicts

**Root cause**: `main` branch changed since PR was created

**Solution**:
1. Close the conflicted PR
2. Trigger new sync:
   - Workflow creates fresh PR with latest main
   - Conflicts avoided
3. Design team reviews new PR
4. Merge without conflicts

---

### 🏷️ Naming Convention Issues

#### ❌ Violations in PR but I don't understand them

**Problem**: Violations list is confusing

**Solution**:
1. Read each violation in PR comment
2. Common violations:
   - ❌ `primary` → ✅ `color-primary` (add group)
   - ❌ `ColorPrimary` → ✅ `color-primary` (use kebab-case)
   - ❌ `color_primary` → ✅ `color-primary` (use dashes, not underscores)
3. Fix in Figma using correct naming
4. Trigger new sync
5. Violations should disappear ✅

**See also**: [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md#naming-conventions)

---

#### ❌ I want to override naming violations

**Problem**: Tokens don't follow convention but I want to merge anyway

**Root cause**: Violations are warnings (non-blocking)

**Solution**:
1. Violations are logged as warnings, not errors
2. Design team can approve PR with warnings
3. It's allowed but not recommended
4. Better: Fix tokens in Figma to follow convention
5. If truly needed:
   - Document why in PR comment
   - Get design lead approval
   - Merge PR
6. Then fix in Figma for next sync

---

### 🐛 Token Quality Issues

#### ❌ Wrong tokens synced from Figma

**Problem**: Sync created PR with incorrect token values

**Root cause**: Figma tokens weren't set up correctly

**Solution**:
1. Review PR changes carefully
2. If wrong:
   - Close PR (don't merge)
   - Go back to Figma
   - Fix token values
   - Trigger new sync
   - Fresh PR will be created
3. If correct but missed:
   - Approve and merge
   - Team learns for next time

---

#### ❌ Tokens are missing after merge

**Problem**: Merged PR but tokens don't appear in generated files

**Root cause**: Token build might have failed

**Solution**:
1. Check GitHub Actions:
   - Go to **Actions** → **Build** workflow
   - Find the run after your merge
   - Check if "Build tokens" step succeeded
2. If failed, check logs for errors
3. If successful, check files manually:
   ```bash
   cat libs/shared/tokens/generated/css/variables.css
   cat libs/shared/tokens/generated/ts/tokens.ts
   ```
4. Test in app:
   ```bash
   npx nx dev web
   ```
   Are new tokens available? ✅

---

#### ❌ Tokens reverted unexpectedly

**Problem**: Tokens were correct but then changed back

**Root cause**: Someone ran sync again, or PR wasn't merged

**Solution**:
1. Check git history:
   ```bash
   git log --oneline libs/shared/tokens/src/tokens/
   ```
2. Find unexpected commit
3. If sync PR was auto-closed:
   - This is expected (7-day policy)
   - Trigger new sync if you still need those tokens
4. If someone merged wrong PR:
   - Discuss with team
   - Use git revert to undo
   - Trigger new sync with correct tokens

---

### 👥 Team & Permission Issues

#### ❌ "Insufficient permissions" error

**Error message**:
```
Error: Insufficient permissions
```

**Root cause**: User doesn't have admin/write access to repo

**Solution**:
1. Check user permissions:
   - Go to **Settings → Collaborators**
   - Verify user has "Write" or "Admin" access
2. If no access:
   - Add user as collaborator
   - Or grant appropriate team permissions
3. User tries workflow again

---

#### ❌ Design team can't see token sync PRs

**Problem**: PRs not appearing in design team's notifications

**Root cause**: CODEOWNERS not set up or team not watching repo

**Solution**:
1. Verify CODEOWNERS:
   - Check `.github/CODEOWNERS` file
   - Ensure correct team format: `@org/team-name`
2. Verify GitHub team exists:
   - Go to [GitHub Teams](https://github.com/orgs/{ORG}/teams)
   - Make sure team is created
3. Verify team members:
   - Add designers to the GitHub team
   - They need GitHub accounts
4. Enable notifications:
   - Each team member: Go to repo → **"Watch"**
   - Select "Custom" or "All activity"

---

### 🔐 Security Issues

#### ⚠️ I accidentally exposed the Figma token

**Problem**: Token was visible in logs or committed to repo

**Immediate action**:
1. **Revoke old token immediately**:
   - Go to [Figma Settings](https://www.figma.com/settings)
   - Find the exposed token
   - Delete/revoke it
2. **Create new token**:
   - New personal access token
3. **Update GitHub secret**:
   - Go to **Settings → Secrets**
   - Update `FIGMA_ACCESS_TOKEN` with new token
4. **Force re-run failed workflows**:
   - Old token now invalid

---

#### ⚠️ Token is in git history

**Problem**: Token committed to repo accidentally

**Prevention**:
1. GitHub will warn if you try to commit secrets
2. Use `.gitignore` for local files
3. Never commit `.env` or token files

**Cleanup**:
1. Revoke token immediately (see above)
2. To remove from git history (advanced):
   ```bash
   # WARNING: This rewrites history!
   git-secret-removal-tool or git-filter-repo
   ```
3. Involve platform team if sensitive

---

## Workflow Logs

### Where to find logs

1. Go to **Actions** tab
2. Click on workflow run
3. Expand jobs to see detailed logs
4. Look for error messages

### What to share when reporting issues

1. **Screenshot of error** in workflow logs
2. **Full error message** (copy-paste)
3. **Steps to reproduce**
4. **What you expected** vs **what happened**
5. **When it last worked** (if applicable)

---

## Still Having Issues?

### Debug Steps

1. **Check GitHub Actions logs** first (most helpful)
2. **Review [FIGMA_QUICK_REFERENCE.md](./FIGMA_QUICK_REFERENCE.md)**
3. **Check [FIGMA_SETUP.md](./FIGMA_SETUP.md)**
4. **Review [ARCHITECTURE.md](../ARCHITECTURE.md#figma-first-token-sync)**

### Getting Help

- 📖 Check documentation above
- 🔍 Search existing GitHub issues
- 💬 Create new GitHub issue with:
  - Error messages (from workflow logs)
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable

### Escalation

If you're stuck after troubleshooting:
1. Check the "Workflow Logs" section above
2. Gather information listed in "What to share"
3. Create issue with all details
4. Tag `@design-team` and `@engineering-team`
5. Include link to failed workflow run

---

## Prevention Tips

✅ **To avoid issues in the future:**

1. **Keep CODEOWNERS updated** - verify quarterly
2. **Monitor stale PRs** - merge within 7 days
3. **Follow naming conventions** - train team on rules
4. **Review PRs carefully** - catch issues early
5. **Keep secrets secure** - never share tokens
6. **Test changes** - use test tokens first
7. **Document customizations** - if you modify scripts
8. **Update docs** - keep runbooks current

---

**Last updated**: 2026-02-20  
**Report issues**: Create GitHub issue or email team

