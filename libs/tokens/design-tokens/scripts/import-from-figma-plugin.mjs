import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Imports design tokens exported from the **Variables 9000** Figma community plugin
 * and transforms them into Style Dictionary–compatible JSON consumed by build-tokens.mjs.
 *
 * ## Variables 9000 export format
 *
 * The plugin exports one JSON file containing all Figma Variable collections and modes:
 *
 * ```json
 * {
 *   "Global": {
 *     "Default": {
 *       "color/blue/500": "#3b82f6",
 *       "spacing/sm":     "8"
 *     }
 *   },
 *   "Brand": {
 *     "Light": {
 *       "color/primary": "#2563eb",
 *       "color/surface": "#ffffff"
 *     },
 *     "Dark": {
 *       "color/primary": "#60a5fa",
 *       "color/surface": "#1f2937"
 *     }
 *   }
 * }
 * ```
 *
 * Top-level keys   = Figma Variable collection names (brands / global sets)
 * Second-level keys = Mode names (Light, Dark, Default, etc.)
 * Values           = Flat key→value pairs where "/" separates the token path segments
 *
 * ## Output
 *
 * Each collection/mode pair is written as a separate Style Dictionary JSON file:
 *
 *   src/tokens/{collection-slug}/{mode-slug}.json
 *
 * `build-tokens.mjs` already reads all JSON files under `src/tokens/`, so all generated
 * files are automatically picked up by the build without any further changes.
 *
 * ## Usage
 *
 *   node scripts/import-from-figma-plugin.mjs --input path/to/variables-9000-export.json
 *
 * Optional flags:
 *   --collection <name>   Only import the named collection (case-insensitive)
 *   --mode       <name>   Only import the named mode (case-insensitive)
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOKEN_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Slugify a collection/mode name for use as a directory or file name. */
function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/** Returns true when a node is a leaf token (Style Dictionary value wrapper). */
function isTokenLeaf(node) {
    return node !== null && typeof node === 'object' && ('value' in node || '$value' in node);
}

/** Extract the string value from a leaf node. */
function extractValue(node) {
    const raw = node.$value ?? node.value ?? '';
    return String(raw);
}

/**
 * Validate token naming: kebab-case segments separated by dots, at least one group prefix.
 * @param {string} dotPath  e.g. "color.blue.500"
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
    if (flat.split('-').length < 2) {
        return {
            valid: false,
            issue: `Missing token group. Expected: group-name, got: ${flat}`,
        };
    }
    return { valid: true };
}

/**
 * Convert a flat Variables 9000 token map (keys use "/" as path separator)
 * into a nested Style Dictionary object.
 *
 * Input:  { "color/blue/500": "#3b82f6", "spacing/sm": "8" }
 * Output: { color: { blue: { "500": { value: "#3b82f6" } } }, spacing: { sm: { value: "8" } } }
 *
 * @param {Record<string, unknown>} flatTokens
 * @param {Array<{ tokenPath: string, issue: string }>} violations
 * @returns {Record<string, unknown>}
 */
function convertSlashPaths(flatTokens, violations) {
    const output = {};

    for (const [rawPath, rawValue] of Object.entries(flatTokens)) {
        // Normalise path: trim each segment, lower-case, replace spaces with hyphens.
        // Figma variable names may use upper-case; we normalise silently so the
        // generated token files follow kebab-case conventions automatically.
        const parts = rawPath.split('/').map((p) => p.trim().toLowerCase().replace(/\s+/g, '-'));
        const dotPath = parts.join('.');

        // Warn when normalisation changed the original path so the designer
        // is aware and can update the Figma variable name.
        const originalFlat = rawPath.split('/').map((p) => p.trim()).join('-');
        const normalisedFlat = parts.join('-');
        if (originalFlat !== normalisedFlat) {
            console.warn(`  ⚠️  Normalised path: "${rawPath}" → "${parts.join('/')}"`);
        }

        const validation = validateTokenPath(dotPath);
        if (!validation.valid) {
            violations.push({ tokenPath: dotPath, issue: validation.issue });
        }

        // Build nested structure
        let current = output;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }

        const leaf = parts[parts.length - 1];
        if (rawValue !== null && typeof rawValue === 'object' && isTokenLeaf(rawValue)) {
            current[leaf] = { value: extractValue(rawValue) };
        } else {
            current[leaf] = { value: String(rawValue ?? '') };
        }
    }

    return output;
}

/**
 * Recursively walk a generic nested export (Style Dictionary / W3C DTCG /
 * Tokens Studio) and build a Style Dictionary–compatible nested object.
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

/**
 * Detect whether the input is in Variables 9000 format.
 *
 * Heuristic: top-level values are plain objects whose values are also plain
 * objects (collection → mode → tokens) and the token values in at least one
 * mode appear to be flat primitive values rather than { value } wrappers.
 *
 * @param {Record<string, unknown>} data
 * @returns {boolean}
 */
function isVariables9000Format(data) {
    const topValues = Object.values(data);
    if (topValues.length === 0) return false;

    return topValues.every((collectionModes) => {
        if (collectionModes === null || typeof collectionModes !== 'object') return false;
        if (isTokenLeaf(collectionModes)) return false;

        const modeValues = Object.values(collectionModes);
        return modeValues.length > 0 && modeValues.every((modeTokens) => {
            if (modeTokens === null || typeof modeTokens !== 'object') return false;
            if (isTokenLeaf(modeTokens)) return false;
            // Mode tokens should be flat key→value pairs (primitives or leaf objects).
            // Use every() to ensure the whole mode is flat, not just some values.
            return Object.values(modeTokens).every(
                (v) => typeof v === 'string' || typeof v === 'number' || isTokenLeaf(v)
            );
        });
    });
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
    const args = argv.slice(2);
    let inputFile = '';
    let filterCollection = '';
    let filterMode = '';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input' && i + 1 < args.length) {
            inputFile = args[++i];
        } else if (args[i] === '--collection' && i + 1 < args.length) {
            filterCollection = args[++i].toLowerCase();
        } else if (args[i] === '--mode' && i + 1 < args.length) {
            filterMode = args[++i].toLowerCase();
        }
    }

    if (!inputFile) {
        console.error(
            '❌  Usage: node import-from-figma-plugin.mjs --input <path/to/variables-9000-export.json>\n' +
            '           [--collection <collection-name>]  filter to a single collection\n' +
            '           [--mode <mode-name>]              filter to a single mode'
        );
        process.exit(1);
    }

    return { inputFile, filterCollection, filterMode };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(function main() {
    const { inputFile, filterCollection, filterMode } = parseArgs(process.argv);

    if (!existsSync(inputFile)) {
        console.error(`❌  File not found: ${inputFile}`);
        process.exit(1);
    }

    console.log(`\n🚀  Importing tokens from: ${inputFile}\n`);

    let exportData;
    try {
        const raw = readFileSync(inputFile, 'utf-8');
        exportData = JSON.parse(raw);
    } catch (err) {
        console.error('❌  Failed to parse input JSON:', err);
        process.exit(1);
    }

    const violations = [];
    const projectRoot = join(__dirname, '..');
    const tokensDir = join(projectRoot, 'src/tokens');

    if (isVariables9000Format(exportData)) {
        // ----------------------------------------------------------------
        // Variables 9000 format: collection → mode → flat "/" paths
        // ----------------------------------------------------------------
        console.log('📦  Detected Variables 9000 export format (collections + modes)\n');

        let collectionsWritten = 0;

        for (const [collectionName, modes] of Object.entries(exportData)) {
            if (filterCollection && collectionName.toLowerCase() !== filterCollection) {
                continue;
            }

            const collectionSlug = slugify(collectionName);
            const collectionDir = join(tokensDir, collectionSlug);
            mkdirSync(collectionDir, { recursive: true });

            for (const [modeName, modeTokens] of Object.entries(modes)) {
                if (filterMode && modeName.toLowerCase() !== filterMode) {
                    continue;
                }

                const modeSlug = slugify(modeName);
                const outputPath = join(collectionDir, `${modeSlug}.json`);

                const converted = convertSlashPaths(modeTokens, violations);
                writeFileSync(outputPath, JSON.stringify(converted, null, 4));
                console.log(`✅  Written: ${outputPath}  (collection: "${collectionName}", mode: "${modeName}")`);
                collectionsWritten++;
            }
        }

        if (collectionsWritten === 0) {
            console.warn('⚠️   No collections/modes matched the given filters. No files were written.');
        }
    } else {
        // ----------------------------------------------------------------
        // Fallback: generic Style Dictionary / W3C DTCG / Tokens Studio
        // ----------------------------------------------------------------
        console.log('📦  Detected generic token export format\n');

        const coreOutput = transformGroup(exportData, [], violations);
        const corePath = join(tokensDir, 'core.json');
        writeFileSync(corePath, JSON.stringify(coreOutput, null, 4));
        console.log(`✅  Written: ${corePath}`);
    }

    // Report violations (non-blocking)
    if (violations.length > 0) {
        console.log('\n⚠️   Naming Convention Violations:\n');
        violations.forEach((v) => console.log(`  - ${v.tokenPath}: ${v.issue}`));
        console.log(
            '\n💡  Tip: Fix these variable names in Figma and re-export, or edit the generated JSON files manually.\n'
        );
    } else {
        console.log('\n✅  All tokens follow naming conventions\n');
    }

    console.log('✨  Import complete! Run `nx run design-tokens:generate` to rebuild.\n');
})();

