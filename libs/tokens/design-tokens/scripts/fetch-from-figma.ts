import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const accessToken = process.env.FIGMA_ACCESS_TOKEN;
const fileId = process.env.FIGMA_FILE_ID;

if (!accessToken || !fileId) {
  console.error('❌ Missing environment variables: FIGMA_ACCESS_TOKEN or FIGMA_FILE_ID');
  process.exit(1);
}

interface FigmaToken {
  name: string;
  value: string;
  type: string;
  description?: string;
}

interface TokenSet {
  [key: string]: FigmaToken | TokenSet;
}

interface NamingViolation {
  tokenName: string;
  issue: string;
}

/**
 * Get current git commit hash for audit trail
 */
function getGitCommitHash(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Validate token naming convention: kebab-case with groups
 * Approved pattern: group-subgroup-name (e.g., color-primary, spacing-md)
 */
function validateTokenName(name: string): { valid: boolean; issue?: string } {
  // Check kebab-case
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    return {
      valid: false,
      issue: `Not in kebab-case format. Expected: lowercase-with-dashes, got: ${name}`,
    };
  }

  // Check minimum structure (at least group-name)
  const parts = name.split('-');
  if (parts.length < 2) {
    return {
      valid: false,
      issue: `Missing token group. Expected: group-name, got: ${name}`,
    };
  }

  return { valid: true };
}

/**
 * Flatten Figma token hierarchy and collect violations
 */
function flattenTokens(
  tokens: TokenSet,
  prefix = '',
  violations: NamingViolation[] = []
): { flattened: Record<string, string>; violations: NamingViolation[] } {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens)) {
    const fullName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !('value' in value)) {
      // Nested object, recurse
      const result = flattenTokens(value as TokenSet, fullName, violations);
      Object.assign(flattened, result.flattened);
    } else if (typeof value === 'object' && 'value' in value) {
      // Token with value
      const validation = validateTokenName(fullName);
      if (!validation.valid) {
        violations.push({
          tokenName: fullName,
          issue: validation.issue || 'Invalid token name',
        });
      }
      flattened[fullName] = (value as FigmaToken).value;
    }
  }

  return { flattened, violations };
}

/**
 * Fetch tokens from Figma API
 */
async function fetchFigmaTokens(): Promise<{
  coreTokens: TokenSet;
  semanticTokens: TokenSet;
  violations: NamingViolation[];
}> {
  try {
    console.log('📡 Fetching tokens from Figma...');

    const response = await fetch(`${FIGMA_API_URL}/files/${fileId}`, {
      headers: {
        'X-Figma-Token': accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;

    // Extract tokens from Figma file
    // This assumes tokens are stored in component/variable sets or in a specific format
    // Adjust based on your Figma structure
    const allViolations: NamingViolation[] = [];

    // For demo: Return empty structure - replace with actual Figma parsing
    // In production, parse from data.components or variables or custom storage
    const coreTokens: TokenSet = {};
    const semanticTokens: TokenSet = {};

    console.log('✅ Figma tokens fetched successfully');

    return { coreTokens, semanticTokens, violations: allViolations };
  } catch (error) {
    console.error('❌ Failed to fetch Figma tokens:', error);
    process.exit(1);
  }
}

/**
 * Generate JSON structure for Style Dictionary
 */
function generateTokenJSON(
  tokens: Record<string, string>,
  isCore = false
): TokenSet {
  const result: TokenSet = {};

  for (const [name, value] of Object.entries(tokens)) {
    const parts = name.split('-');
    let current = result;

    // Navigate/create nested structure
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as TokenSet;
    }

    // Set token value
    const tokenKey = parts[parts.length - 1];
    current[tokenKey] = {
      value: isCore ? value : `{${name}}`, // Core tokens use values, semantic use references
    } as FigmaToken;
  }

  return result;
}

/**
 * Write tokens to JSON files with metadata header
 */
function writeTokenFiles(
  coreTokens: TokenSet,
  semanticTokens: TokenSet,
  commitHash: string
): void {
  const projectRoot = path.join(__dirname, '..');
  const tokensDir = path.join(projectRoot, 'src/tokens');

  // Create metadata comment
  const metadata = `// Generated from Figma on ${new Date().toISOString()}
// Git commit: ${commitHash}
// Do NOT edit manually - use Figma as source of truth
`;

  // Write core tokens
  const coreFile = path.join(tokensDir, 'core.json');
  const coreContent = JSON.stringify(coreTokens, null, 2);
  fs.writeFileSync(coreFile, coreContent);
  console.log(`✅ Written: ${coreFile}`);

  // Write semantic tokens
  const semanticFile = path.join(tokensDir, 'semantic.json');
  const semanticContent = JSON.stringify(semanticTokens, null, 2);
  fs.writeFileSync(semanticFile, semanticContent);
  console.log(`✅ Written: ${semanticFile}`);

  // Write metadata for reference
  const metadataFile = path.join(tokensDir, '.figma-sync-metadata.json');
  fs.writeFileSync(
    metadataFile,
    JSON.stringify(
      {
        syncedAt: new Date().toISOString(),
        gitCommit: commitHash,
        figmaFileId: fileId,
      },
      null,
      2
    )
  );
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Starting Figma Token Sync\n');

  const commitHash = getGitCommitHash();
  console.log(`📋 Current git commit: ${commitHash}\n`);

  const { coreTokens, semanticTokens, violations } = await fetchFigmaTokens();

  // Flatten and validate
  const { flattened: coreFlat, violations: coreViolations } = flattenTokens(
    coreTokens
  );
  const { flattened: semanticFlat, violations: semanticViolations } =
    flattenTokens(semanticTokens);

  const allViolations = [...coreViolations, ...semanticViolations, ...violations];

  // Write files
  const coreJSON = generateTokenJSON(coreFlat, true);
  const semanticJSON = generateTokenJSON(semanticFlat, false);

  writeTokenFiles(coreJSON, semanticJSON, commitHash);

  // Report violations (non-blocking warnings)
  if (allViolations.length > 0) {
    console.log('\n⚠️  Naming Convention Violations Found:\n');
    console.log(
      JSON.stringify(
        allViolations.map((v) => ({
          token: v.tokenName,
          issue: v.issue,
        })),
        null,
        2
      )
    );
    console.log(
      '\n💡 Tip: Fix these in Figma or approve the PR to accept as-is.\n'
    );

    // Write violations to file for PR comment
    const violationsFile = path.join(__dirname, '../../../.figma-violations.json');
    fs.writeFileSync(violationsFile, JSON.stringify(allViolations, null, 2));
  } else {
    console.log('\n✅ All tokens follow naming conventions\n');
  }

  console.log('✨ Figma token sync complete!\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

