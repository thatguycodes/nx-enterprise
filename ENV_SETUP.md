# 🔐 Environment Variables Setup

## Overview

This project uses environment variables for local development secrets. These files manage Figma API credentials and other sensitive configuration.

## Files

### `.env.example` ✅ (Committed to git)
**Purpose**: Template showing required environment variables  
**What it contains**: Variable names and examples (NO actual secrets)  
**When to use**: Reference for what variables you need  
**Security**: Safe to commit - contains no sensitive data

**How to use**:
```bash
# Copy to .env.local to get started
cp .env.example .env.local
```

### `.env.local` ⚠️ (IGNORED by git)
**Purpose**: Your local development secrets  
**What it contains**: Your actual API tokens and credentials  
**When to use**: Fill this in with your real secrets  
**Security**: NEVER commit this file - it's in .gitignore

**How to use**:
```bash
# Create from template (if not already created)
cp .env.example .env.local

# Edit with your real secrets
vi .env.local  # or use your editor

# Fill in:
FIGMA_ACCESS_TOKEN=your_actual_token_here
FIGMA_FILE_ID=your_actual_file_id_here
```

## Getting Your Secrets

### Figma Access Token
1. Visit: https://www.figma.com/settings
2. Scroll to "Personal access tokens"
3. Click "Create a new personal access token"
4. Name it: `nx-enterprise-local`
5. Copy the token
6. Paste into `.env.local` as `FIGMA_ACCESS_TOKEN`

### Figma File ID
1. Open your design file in Figma
2. Look at the URL: `figma.com/file/{FILE_ID}/filename`
3. Copy the `{FILE_ID}` part
4. Paste into `.env.local` as `FIGMA_FILE_ID`

## Security Best Practices

✅ **Do**
- Keep `.env.local` in `.gitignore` (already configured)
- Use unique tokens for local development
- Rotate tokens periodically
- Never share `.env.local` file
- Use `.env.example` as reference only

❌ **Don't**
- Commit `.env.local` to git
- Share your `FIGMA_ACCESS_TOKEN` with anyone
- Put production secrets in local `.env.local`
- Store `.env.local` in cloud storage
- Commit secrets to git history

## Usage in Development

### Load Environment Variables

**Option 1: Manually before running commands**
```bash
export FIGMA_ACCESS_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env.local | cut -d '=' -f2)
export FIGMA_FILE_ID=$(grep FIGMA_FILE_ID .env.local | cut -d '=' -f2)
npx nx build tokens
```

**Option 2: Using dotenv CLI**
```bash
# Install dotenv-cli (optional)
npm install -g dotenv-cli

# Run with env vars loaded
dotenv -e .env.local npx nx build tokens
```

**Option 3: Source the file (bash)**
```bash
set -a
source .env.local
set +a
npx nx build tokens
```

**Option 4: In package.json scripts** (if needed)
```json
{
  "scripts": {
    "build:tokens": "dotenv -e .env.local npx nx build tokens"
  }
}
```

### GitHub Actions
Environment variables should be set as GitHub Secrets, **not** via `.env.local`:
- Go to **Settings → Secrets and variables → Actions**
- Add: `FIGMA_ACCESS_TOKEN`
- Add: `FIGMA_FILE_ID`

The workflows already reference these secrets:
```yaml
env:
  FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
  FIGMA_FILE_ID: ${{ secrets.FIGMA_FILE_ID }}
```

## Git Ignore Configuration

The `.gitignore` file is already configured to ignore environment files:

```gitignore
# Environment & Secrets
.env
.env.local
.env.*.local
.env.production.local
```

This means git will **never** accidentally commit your secrets.

**Verify it's working**:
```bash
git check-ignore .env.local
# Output: .env.local (if properly ignored)
```

## Troubleshooting

### "File .env.local not found"
**Solution**: Copy from template
```bash
cp .env.example .env.local
```

### "Environment variables not loading"
**Possible causes**:
1. `.env.local` not created yet → Create it
2. Typo in variable names → Check `.env.example`
3. Not sourcing before command → Use one of the methods above
4. Wrong format → Check `KEY=VALUE` syntax

### "Figma API token is invalid"
1. Verify token in `.env.local` is correct
2. Visit https://www.figma.com/settings
3. Delete old token (if expired)
4. Create new token
5. Update `.env.local`

### "I accidentally committed .env.local"
⚠️ **Emergency**: Your secrets may be exposed!

1. **Immediately revoke** all tokens in `.env.local`
   - https://www.figma.com/settings → Delete token
   - Any other services → Revoke/regenerate

2. **Clean git history**:
   ```bash
   # WARNING: This rewrites history!
   git filter-branch --tree-filter 'rm -f .env.local' -- --all
   git push origin --force --all
   ```

3. **Create new tokens** and update `.env.local`

4. **Brief your team** about the incident

## Reference

- [Figma API Documentation](https://www.figma.com/developers/api)
- [dotenv Documentation](https://www.npmjs.com/package/dotenv)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Figma Setup Guide](./docs/FIGMA_SETUP.md)

---

**Summary**: Use `.env.example` as reference, create `.env.local` with your secrets, and never commit it to git.

