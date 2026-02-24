import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Imports design tokens exported from a Figma community plugin (e.g. Tokens Studio,
 * Design Tokens by Jan Six) and transforms them into the core.json / semantic.json
 * format consumed by build-tokens.mjs (Style Dictionary).
 *
 * Usage:
 *   node scripts/import-from-figma-plugin.mjs --input path/to/figma-export.json
 *   node scripts/import-from-figma-plugin.mjs --input figma-export.json --core global --semantic semantic
 *
 * Supported export shapes
 * -----------------------
 * 1. Flat top-level groups (Tokens Studio default):
 *    { "global": { "color": { "blue-500": { "value": "#3b82f6", "type": "color" } } } }
 *
 * 2. W3C DTCG draft ($value / $type):
 *    { "color": { "blue": { "500": { "$value": "#3b82f6", "$type": "color" } } } }
 *
 * 3. Style Dictionary native (value only — already matches our target format):
 *    { "color": { "blue": { "500": { "value": "#3b82f6" } } } }
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOKEN_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true when a node represents a leaf token (has a value). */
function isTokenLeaf(node) {
    return node !== null && typeof node === 'object' && ('value' in node || '$value' in node);
}

/** Extract the string value from a leaf node (handles both `value` and `$value`). */
function extractValue(node) {
    const raw = node.$value ?? node.value ?? '';
    return String(raw);
}

/**
 * Validate token naming: kebab-case, at least one group prefix.
 * @param {string} dotPath  dot-separated token path, e.g. "color.blue.500"
 * @returns {{ valid: boolean, issue?: string }}
 */
function validateTokenPath(dotPath) {
    const flat = dotPath.replace(/\./g, '-');
    if (!TOKEN_NAME_PATTERN.test(flat)) {
        return {
            valid: false,
            issue: `Not in kebab-case format. Expected: lowercase-with-dashes, got: ${flat}`,
        };
    }
    const parts = flat.split('-');
    if (parts.length < 2) {
        return {
            valid: false,
            issue: `Missing token group. Expected: group-name, got: ${flat}`,
        };
    }
    return { valid: true };
}

/**
 * Recursively walk the plugin export and build a Style Dictionary–compatible
 * nested object. Leaf nodes are normalised to `{ value: "..." }`.
 *
 * @param {Record<string, unknown>} input
 * @param {string[]} pathParts
 * @param {Array<{ tokenPath: string, issue: string }>} violations
 * @returns {Record<string, unknown>}
 */
function transformGroup(input, pathParts, violations) {
    const output = {};

    for (const [key, node] of Object.entries(input)) {
        const currentPath = [...pathParts, key];

        if (isTokenLeaf(node)) {
            const dotPath = currentPath.join('.');
            const validation = validateTokenPath(dotPath);
            if (!validation.valid) {
                violations.push({ tokenPath: dotPath, issue: validation.issue });
            }
            const entry = { value: extractValue(node) };
            if (node.description) {
                entry.comment = String(node.description);
            }
            output[key] = entry;
        } else if (node !== null && typeof node === 'object') {
            output[key] = transformGroup(node, currentPath, violations);
        }
    }

    return output;
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
    const args = argv.slice(2);
    let inputFile = '';
    let coreGroup = 'global';
    let semanticGroup = 'semantic';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input' && i + 1 < args.length) {
            inputFile = args[++i];
        } else if (args[i] === '--core' && i + 1 < args.length) {
            coreGroup = args[++i];
        } else if (args[i] === '--semantic' && i + 1 < args.length) {
            semanticGroup = args[++i];
        }
    }

    if (!inputFile) {
        console.error(
            '❌  Usage: node import-from-figma-plugin.mjs --input <path/to/export.json> [--core <group>] [--semantic <group>]'
        );
        process.exit(1);
    }

    return { inputFile, coreGroup, semanticGroup };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(function main() {
    const { inputFile, coreGroup, semanticGroup } = parseArgs(process.argv);

    if (!existsSync(inputFile)) {
        console.error(`❌  File not found: ${inputFile}`);
        process.exit(1);
    }

    console.log(`\n🚀  Importing tokens from: ${inputFile}\n`);

    let pluginExport;
    try {
        const raw = readFileSync(inputFile, 'utf-8');
        pluginExport = JSON.parse(raw);
    } catch (err) {
        console.error('❌  Failed to parse input JSON:', err);
        process.exit(1);
    }

    const violations = [];
    const projectRoot = join(__dirname, '..');
    const tokensDir = join(projectRoot, 'src/tokens');

    // ------------------------------------------------------------------
    // Determine whether the export has named top-level groups (Tokens
    // Studio style) or is already in a flat Style Dictionary layout.
    // ------------------------------------------------------------------
    const topLevelKeys = Object.keys(pluginExport);
    const hasCoreGroup = topLevelKeys.includes(coreGroup);
    const hasSemanticGroup = topLevelKeys.includes(semanticGroup);

    let coreInput;
    let semanticInput;

    if (hasCoreGroup || hasSemanticGroup) {
        // Named-group format: { "global": {...}, "semantic": {...} }
        coreInput = hasCoreGroup ? pluginExport[coreGroup] : {};
        semanticInput = hasSemanticGroup ? pluginExport[semanticGroup] : {};
    } else {
        // Flat format — treat the whole file as core tokens
        coreInput = pluginExport;
        semanticInput = {};
    }

    const coreOutput = transformGroup(coreInput, [], violations);
    const semanticOutput = transformGroup(semanticInput, [], violations);

    // Write core.json
    const corePath = join(tokensDir, 'core.json');
    writeFileSync(corePath, JSON.stringify(coreOutput, null, 4));
    console.log(`✅  Written: ${corePath}`);

    // Write semantic.json
    const semanticPath = join(tokensDir, 'semantic.json');
    writeFileSync(semanticPath, JSON.stringify(semanticOutput, null, 4));
    console.log(`✅  Written: ${semanticPath}`);

    // Report violations (non-blocking)
    if (violations.length > 0) {
        console.log('\n⚠️   Naming Convention Violations:\n');
        violations.forEach((v) => console.log(`  - ${v.tokenPath}: ${v.issue}`));
        console.log(
            '\n💡  Tip: Fix these token names in Figma and re-export, or edit core.json / semantic.json manually.\n'
        );
    } else {
        console.log('\n✅  All tokens follow naming conventions\n');
    }

    console.log('✨  Import complete! Run `nx run design-tokens:generate` to rebuild.\n');
})();
