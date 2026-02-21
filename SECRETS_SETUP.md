# 🔐 Secrets Setup Guide

Complete guide for setting up all required environment variables in `.env.local`.

---

## Overview

Your repository uses the following secrets for automation and publishing:

| Secret | Purpose | Where to Get |
|--------|---------|--------------|
| `FIGMA_ACCESS_TOKEN` | Figma API access | Figma Settings |
| `FIGMA_FILE_ID` | Figma design file | Figma File URL |
| `ADMIN_ACCESS_TOKEN` | GitHub access | GitHub Settings |
| `NPM_TOKEN` | NPM publishing | NPM Settings |
| `GPG_PRIVATE_KEY` | Commit signing | GPG local |
| `GPG_PASSPHRASE` | GPG key password | Your passphrase |
| `GIT_COMMITTER_EMAIL` | Git author email | Your email |

---

## 1️⃣ Figma Access Token

### Purpose
Allows the system to fetch design tokens from Figma via API.

### How to Get

1. **Visit Figma Settings**
   - Go to: https://www.figma.com/settings

2. **Create Personal Access Token**
   - Scroll to "Personal access tokens"
   - Click "Create a new personal access token"
   - Name: `nx-enterprise-local` (or similar)

3. **Copy Token**
   - The token will be displayed once
   - Copy immediately (you won't see it again!)

4. **Add to `.env.local`**
   ```
   FIGMA_ACCESS_TOKEN=figd_your_actual_token_here
   ```

---

## 2️⃣ Figma File ID

### Purpose
Identifies which Figma file contains your design tokens.

### How to Get

1. **Open Your Design File**
   - Open in Figma

2. **Copy File ID from URL**
   - URL format: `figma.com/file/{FILE_ID}/ProjectName`
   - Copy just the `{FILE_ID}` part
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

3. **Add to `.env.local`**
   ```
   FIGMA_FILE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

---

## 3️⃣ GitHub Admin Token (for Semantic Release)

### Purpose
Allows semantic-release to create releases, tags, and manage GitHub workflows.

### How to Get

1. **Visit GitHub Settings**
   - Go to: https://github.com/settings/tokens

2. **Create New Personal Access Token (classic)**
   - Click "Generate new token" → "Generate new token (classic)"

3. **Configure Token**
   - Name: `semantic-release-local` (or similar)
   - Expiration: 90 days (or longer if you prefer)
   - Select scopes:
     - ☑️ `repo` (full control of repositories)
     - ☑️ `workflow` (update GitHub Action workflows)
     - ☑️ `packages` (upload to GitHub Packages)

4. **Copy Token**
   - Copy immediately (won't be shown again)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **Add to `.env.local`**
   ```
   ADMIN_ACCESS_TOKEN=ghp_your_actual_token_here
   ```

### ⚠️ Security Note
This token has high permissions. 
- Keep it secret!
- Rotate every 90 days
- Never commit to git

---

## 4️⃣ NPM Token (for Publishing)

### Purpose
Allows semantic-release to publish packages to npm.

### How to Get

1. **Visit NPM Settings**
   - Go to: https://www.npmjs.com/settings/~/tokens

2. **Create New Token**
   - Click "Generate New Token"
   - Select: **Automation** (recommended for CI/CD)
   - This is less restrictive but safer for automated publishing

3. **Copy Token**
   - Copy immediately (won't be shown again)
   - Format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Add to `.env.local`**
   ```
   NPM_TOKEN=npm_your_actual_token_here
   ```

### ⚠️ Security Note
- Use **Automation** token type (safest for CI/CD)
- Rotate periodically
- Never commit to git

---

## 5️⃣ GPG Private Key (for Commit Signing)

### Purpose
Signs commits made by semantic-release so they show as "verified" on GitHub.

### How to Get

#### Option A: Create New GPG Key (Recommended)

1. **Generate Key**
   ```bash
   gpg --full-generate-key
   ```

2. **Answer Prompts**
   - Kind: RSA and RSA (default)
   - Key size: 4096
   - Expiration: 0 (no expiration) or 1y (1 year)
   - Name: Your name
   - Email: Your email (must match git config!)
   - Comment: `semantic-release local` (optional)

3. **List Keys**
   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```
   
   Output example:
   ```
   /Users/user/.gnupg/pubring.gpg
   ─────────────────────────────────
   sec   rsa4096/A1B2C3D4E5F6G7H8 2026-02-21 [SC]
         ABCDEF1234567890ABCDEF1234567890ABCDEF12
   uid                 [ultimate] Your Name <your.email@example.com>
   ```

4. **Export Private Key**
   ```bash
   gpg --armor --export-secret-keys A1B2C3D4E5F6G7H8 > private-key.asc
   ```

5. **Display Private Key**
   ```bash
   cat private-key.asc
   ```

6. **Copy Private Key**
   - Copy the entire output (including `-----BEGIN PGP PRIVATE KEY BLOCK-----` and `-----END PGP PRIVATE KEY BLOCK-----`)

7. **Add to `.env.local`**
   ```
   GPG_PRIVATE_KEY="-----BEGIN PGP PRIVATE KEY BLOCK-----
   ...paste entire key here...
   -----END PGP PRIVATE KEY BLOCK-----"
   ```

#### Option B: Use Existing GPG Key

1. **List Keys**
   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

2. **Export Private Key**
   ```bash
   gpg --armor --export-secret-keys {KEY_ID} > private-key.asc
   ```

3. **Display and Copy**
   ```bash
   cat private-key.asc
   ```

4. **Add to `.env.local`** (see above)

---

## 6️⃣ GPG Passphrase

### Purpose
Password to unlock your GPG private key during signing.

### How to Get

1. **Use Your GPG Key Passphrase**
   - This is the passphrase you created when generating the GPG key
   - If you don't remember it, you'll need to create a new key

2. **Add to `.env.local`**
   ```
   GPG_PASSPHRASE=your_gpg_passphrase_here
   ```

### ⚠️ Security Note
- Never share your passphrase
- This is stored locally in `.env.local` (ignored by git)
- In production, use GitHub Secrets

---

## 7️⃣ Git Committer Email

### Purpose
Email address shown in commit history for semantic-release commits.

### How to Get

1. **Use Your Git Email**
   - Should match your GitHub account email
   - Or your local git config: `git config user.email`

2. **Add to `.env.local`**
   ```
   GIT_COMMITTER_EMAIL=your.email@example.com
   ```

### ℹ️ Note
- Should match your GPG key email (for commit verification)
- Should match your GitHub email

---

## Complete Setup Checklist

- [ ] **Figma Access Token**
  - [ ] Visit https://www.figma.com/settings
  - [ ] Create personal access token
  - [ ] Copy token
  - [ ] Add to `.env.local` as `FIGMA_ACCESS_TOKEN`

- [ ] **Figma File ID**
  - [ ] Open your design file
  - [ ] Copy FILE_ID from URL
  - [ ] Add to `.env.local` as `FIGMA_FILE_ID`

- [ ] **GitHub Admin Token**
  - [ ] Visit https://github.com/settings/tokens
  - [ ] Create personal access token (classic)
  - [ ] Select scopes: repo, workflow, packages
  - [ ] Copy token
  - [ ] Add to `.env.local` as `ADMIN_ACCESS_TOKEN`

- [ ] **NPM Token**
  - [ ] Visit https://www.npmjs.com/settings/~/tokens
  - [ ] Create Automation token
  - [ ] Copy token
  - [ ] Add to `.env.local` as `NPM_TOKEN`

- [ ] **GPG Private Key**
  - [ ] Generate or get existing GPG key
  - [ ] Export as armor format
  - [ ] Copy full key (including BEGIN/END lines)
  - [ ] Add to `.env.local` as `GPG_PRIVATE_KEY`

- [ ] **GPG Passphrase**
  - [ ] Use your GPG key passphrase
  - [ ] Add to `.env.local` as `GPG_PASSPHRASE`

- [ ] **Git Committer Email**
  - [ ] Use your email
  - [ ] Add to `.env.local` as `GIT_COMMITTER_EMAIL`

---

## How to Use Secrets

### In Local Development

Load from `.env.local` before running commands:

```bash
# Bash/Zsh
set -a
source .env.local
set +a

# Now run your commands
npm run build
npx semantic-release --dry-run
```

Or use dotenv:
```bash
npm install -g dotenv-cli
dotenv -e .env.local npm run build
```

### In GitHub Actions (Production)

**Do NOT use `.env.local` in GitHub Actions!**

Instead, set GitHub Secrets:
1. Go to **Settings → Secrets and variables → Actions**
2. Add each secret with the same name as in `.env.local`
3. GitHub workflows access them as `${{ secrets.SECRET_NAME }}`

Example in workflow:
```yaml
env:
  FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Troubleshooting

### "Invalid Figma token"
- [ ] Verify token is correct in `.env.local`
- [ ] Check token hasn't expired
- [ ] Create new token at https://www.figma.com/settings

### "GitHub token doesn't have permission"
- [ ] Verify token has correct scopes: repo, workflow, packages
- [ ] Check token hasn't expired
- [ ] Create new token at https://github.com/settings/tokens

### "GPG private key invalid"
- [ ] Ensure full key is copied (including BEGIN/END lines)
- [ ] Check for extra spaces or line breaks
- [ ] Verify key is in armor format (--armor flag)
- [ ] Test locally: `gpg --import private-key.asc`

### "Commit not signing"
- [ ] Verify GPG_PASSPHRASE is correct
- [ ] Check GIT_COMMITTER_EMAIL matches GPG key email
- [ ] Test locally: `gpg --sign test.txt`

### ".env.local accidentally committed"
⚠️ **Emergency**: Your secrets may be exposed!

1. **Revoke immediately**:
   - GitHub: https://github.com/settings/tokens
   - Figma: https://www.figma.com/settings
   - NPM: https://www.npmjs.com/settings/~/tokens
   - GPG: `gpg --delete-secret-keys {KEY_ID}`

2. **Remove from git history**:
   ```bash
   git filter-branch --tree-filter 'rm -f .env.local' -- --all
   git push origin --force --all
   ```

3. **Create new secrets** and update `.env.local`

---

## Security Best Practices

✅ **Do**
- Keep `.env.local` in `.gitignore` (already configured)
- Use unique tokens for local development
- Rotate tokens periodically (every 90 days)
- Use GitHub Secrets for CI/CD (never `.env.local`)
- Store `.env.local` only locally
- Use automation tokens for CI/CD

❌ **Don't**
- Commit `.env.local` to git
- Share your tokens with anyone
- Use production secrets locally (if possible)
- Store `.env.local` in cloud storage
- Use weak passphrases
- Reuse tokens across services

---

## Reference

- [Figma API Docs](https://www.figma.com/developers/api)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [NPM Tokens](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GPG Key Generation](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [Semantic Release](https://semantic-release.gitbook.io/)

---

## Next Steps

1. Follow checklist above to get all secrets
2. Add to `.env.local` file
3. Load with `source .env.local` before running commands
4. Test: `npx semantic-release --dry-run`
5. For GitHub Actions: Add secrets via **Settings → Secrets and variables → Actions**

**Done!** Your local environment is ready. 🎉

