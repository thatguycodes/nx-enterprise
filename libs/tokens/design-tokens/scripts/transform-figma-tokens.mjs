/**
 * Transform Figma plugin JSON export (DTCG format) into per-mode DTCG files
 * consumed by Style Dictionary.
 *
 * Input:  src/tokens/figma.json       — committed by designers after Figma plugin export
 * Output: src/generated/core.json     — global/core raw values (DTCG format)
 *         src/generated/semantic.json — default semantic mappings (DTCG format)
 *         src/generated/brands/<mode>.json — per-brand overrides (DTCG format)
 *
 * Usage:
 *   node scripts/transform-figma-tokens.mjs
 *
 * The input file is produced by a free Figma plugin such as "Variables to JSON".
 * Export the variables from Figma, save the JSON to src/tokens/figma.json, and
 * commit it. This script splits the monolithic multi-mode export into separate
 * DTCG files that Style Dictionary's build step can consume.
 *
 * Top-level keys in figma.json map to output files as follows:
 *   "global"           → src/generated/core.json       (raw primitive values)
 *   "semantic/default" → src/generated/semantic.json   (default semantic aliases)
 *   any other key      → src/generated/brands/<key>.json  (brand/mode override)
 *
 * DTCG format ($value/$type) is preserved verbatim — Style Dictionary v5 resolves
 * it natively when usesDtcg is set to true.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const figmaJsonPath = join(projectRoot, 'src/tokens/*/*.json');
const generatedDir = join(projectRoot, 'src/generated');

/**
 * Recursively pass through a DTCG token tree, stripping top-level metadata
 * keys (those starting with "$") that are not part of a token node itself.
 * Token leaf nodes ($value present) are kept intact with their $value and $type.
 */
function extractDtcg(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;

    if ('$value' in obj) {
        // Token leaf node — preserve $value and $type, drop any other DTCG metadata
        const token = { $value: obj['$value'] };
        if ('$type' in obj) token.$type = obj['$type'];
        return token;
    }

    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith('$')) continue; // skip file-level DTCG metadata ($schema, $metadata, etc.)
        result[key] = extractDtcg(val);
    }
    return result;
}

function writeJsonFile(filePath, data) {
    writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
}

console.log('🔄 Splitting Figma token export into per-mode DTCG files...\n');

let figmaJson;
try {
    figmaJson = JSON.parse(readFileSync(figmaJsonPath, 'utf-8'));
} catch (err) {
    console.error(`❌ Could not read ${figmaJsonPath}`);
    console.error(err);
    console.error(
        '   Ensure a Figma plugin export exists at src/tokens/figma.json\n' +
        '   Export Figma variables using a free plugin (e.g. "Variables to JSON")\n' +
        '   and commit the resulting JSON to that path.'
    );
    process.exit(1);
}

mkdirSync(generatedDir, { recursive: true });

for (const [modeKey, modeTokens] of Object.entries(figmaJson)) {
    if (modeKey.startsWith('$')) continue; // skip metadata keys ($schema, $metadata)

    const dtcg = extractDtcg(modeTokens);

    if (modeKey === 'global') {
        writeJsonFile(join(generatedDir, 'core.json'), dtcg);
        console.log('✅ Written: src/generated/core.json');
    } else if (modeKey === 'semantic/default') {
        writeJsonFile(join(generatedDir, 'semantic.json'), dtcg);
        console.log('✅ Written: src/generated/semantic.json');
    } else {
        // Additional brand/mode overrides — stored under src/generated/brands/
        // They are not included in the default Style Dictionary build to avoid
        // token collisions. Use them as the source for per-brand build configurations.
        const brandsDir = join(generatedDir, 'brands');
        mkdirSync(brandsDir, { recursive: true });
        const filename = modeKey.replace(/\//g, '-') + '.json';
        writeJsonFile(join(brandsDir, filename), dtcg);
        console.log(`✅ Written: src/generated/brands/${filename}`);
    }
}

console.log('\n✨ Transformation complete!');

