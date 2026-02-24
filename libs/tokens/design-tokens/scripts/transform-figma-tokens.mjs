/**
 * Transform Figma plugin JSON export (DTCG format) to Style Dictionary format.
 *
 * Input:  src/generated/figma.json  — committed by designers after Figma plugin export
 * Output: src/tokens/core.json      — global/core raw values
 *         src/tokens/semantic.json  — default semantic mappings
 *         src/tokens/<mode>.json    — per-brand overrides, one file per additional mode
 *
 * Usage:
 *   node scripts/transform-figma-tokens.mjs
 *
 * The input file is produced by a free Figma plugin such as "Variables to JSON" or
 * "TokensBrücke". Export the variables from Figma, save the JSON to
 * src/generated/figma.json, and commit it. This script (and the subsequent
 * generate/build steps) will handle the rest.
 *
 * Top-level keys in figma.json map to output files as follows:
 *   "global"           → src/tokens/core.json       (raw primitive values)
 *   "semantic/default" → src/tokens/semantic.json   (default semantic aliases)
 *   any other key      → src/tokens/<key>.json      (brand/mode override)
 *
 * DTCG token objects use "$value" / "$type"; Style Dictionary uses "value".
 * References like "{color.blue.600}" are preserved verbatim — Style Dictionary
 * resolves them during its build step.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const figmaJsonPath = join(projectRoot, 'src/generated/figma.json');
const tokensDir = join(projectRoot, 'src/tokens');

/**
 * Recursively convert DTCG token objects ($value/$type) to Style Dictionary
 * format (value). Top-level metadata keys starting with "$" are skipped.
 */
function dtcgToStyleDictionary(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;

    if ('$value' in obj) {
        // Token leaf node: convert $value → value, drop $type and other DTCG keys
        return { value: obj['$value'] };
    }

    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith('$')) continue; // skip DTCG metadata ($schema, $description, etc.)
        result[key] = dtcgToStyleDictionary(val);
    }
    return result;
}

function writeJsonFile(filePath, data) {
    writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
}

console.log('🔄 Transforming Figma token export to Style Dictionary format...\n');

let figmaJson;
try {
    figmaJson = JSON.parse(readFileSync(figmaJsonPath, 'utf-8'));
} catch (err) {
    console.error(`❌ Could not read ${figmaJsonPath}`);
    console.error(err);
    console.error(
        '   Ensure a Figma plugin export exists at src/generated/figma.json\n' +
        '   Export Figma variables using a free plugin (e.g. "Variables to JSON")\n' +
        '   and commit the resulting JSON to that path.'
    );
    process.exit(1);
}

mkdirSync(tokensDir, { recursive: true });

for (const [modeKey, modeTokens] of Object.entries(figmaJson)) {
    if (modeKey.startsWith('$')) continue; // skip metadata keys ($schema, $metadata)

    const transformed = dtcgToStyleDictionary(modeTokens);

    if (modeKey === 'global') {
        writeJsonFile(join(tokensDir, 'core.json'), transformed);
        console.log('✅ Written: src/tokens/core.json');
    } else if (modeKey === 'semantic/default') {
        writeJsonFile(join(tokensDir, 'semantic.json'), transformed);
        console.log('✅ Written: src/tokens/semantic.json');
    } else {
        // Additional brand/mode overrides — stored under src/tokens/brands/
        // They are not included in the default Style Dictionary build to avoid
        // token collisions. Use them as the source for per-brand build configurations.
        const brandsDir = join(tokensDir, 'brands');
        mkdirSync(brandsDir, { recursive: true });
        const filename = modeKey.replace(/\//g, '-') + '.json';
        writeJsonFile(join(brandsDir, filename), transformed);
        console.log(`✅ Written: src/tokens/brands/${filename}`);
    }
}

console.log('\n✨ Transformation complete!');
