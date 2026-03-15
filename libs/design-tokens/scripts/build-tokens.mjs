import * as fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { StyleDictionary, groups } from './style-dictionary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const tokensRoot = join(projectRoot, 'src/tokens');
const outputPath = join(projectRoot, 'src/generated');

// ── Source layers ────────────────────────────────────────────────────────────
// Load order is critical: primitives → scale → semantic base → theme override

const primitiveSources = [
  join(tokensRoot, 'primitive/color/*.json'),
  join(tokensRoot, 'primitive/spacing.json'),
  join(tokensRoot, 'primitive/radius.json'),
  join(tokensRoot, 'primitive/typography.json'),
  join(tokensRoot, 'primitive/shadow.json'),
  join(tokensRoot, 'primitive/motion.json'),
];

const scaleSources = [
  join(tokensRoot, 'scale/*.json'),
];

const semanticBase = join(tokensRoot, 'semantic/brands/quartz/tokens.json');

// ── Build config factory ─────────────────────────────────────────────────────

/**
 * Build a Style Dictionary config for a named token set.
 * @param {string} name - Output file name (without extension)
 * @param {string[]} sources - Source JSON file paths
 * @param {string} selector - CSS selector for custom properties
 */
function buildConfig({ name, sources, selector = ':root' }) {
  return {
    source: sources,
    platforms: {
      css: {
        buildPath: join(outputPath, 'css/'),
        transforms: groups.css,
        files: [
          {
            destination: `${name}.css`,
            format: 'css/variables',
            options: { outputReferences: false, selector },
          },
        ],
      },
      scss: {
        buildPath: join(outputPath, 'scss/'),
        transforms: groups.scss,
        files: [
          {
            destination: `${name}.scss`,
            format: 'scss/variables',
            options: { outputReferences: false },
          },
        ],
      },
      js: {
        buildPath: join(outputPath, 'js/'),
        transforms: groups.js,
        files: [
          {
            destination: `es6/${name}.js`,
            format: 'javascript/es6',
            options: { outputReferences: false },
          },
          {
            destination: `es6/${name}.d.ts`,
            format: 'typescript/es6-declarations',
            options: { outputReferences: false },
          },
          {
            destination: `common/${name}.js`,
            format: 'javascript/module',
            options: { outputReferences: false },
          },
          {
            destination: `common/${name}.d.ts`,
            format: 'typescript/module-declarations',
            options: { outputReferences: false },
          },
        ],
      },
      json: {
        buildPath: join(outputPath, 'json/'),
        transforms: groups.json,
        files: [
          {
            destination: `${name}.json`,
            format: 'json/flat',
            options: { outputReferences: false },
          },
        ],
      },
    },
    log: {
      warnings: 'warn',
      verbosity: 'verbose',
      errors: { brokenReferences: 'throw' },
    },
  };
}

// ── Build 1: Primitives (:root) ──────────────────────────────────────────────
// Outputs raw primitive vars: --ember-500, --storm-20, --spacing-step-4, etc.

const primitivesSD = new StyleDictionary(
  buildConfig({ name: 'primitives', sources: primitiveSources, selector: ':root' })
);
await primitivesSD.buildAllPlatforms();

// ── Build 2: Light theme ([data-theme="light"]) ──────────────────────────────
// Outputs all layers: primitives + scale vars + semantic light overrides

const lightSD = new StyleDictionary(
  buildConfig({
    name: 'light',
    sources: [
      ...primitiveSources,
      ...scaleSources,
      semanticBase,
      join(tokensRoot, 'semantic/themes/light.json'),
    ],
    selector: '[data-theme="light"]',
  })
);
await lightSD.buildAllPlatforms();

// ── Build 3: Dark theme ([data-theme="dark"]) ────────────────────────────────
// Outputs all layers: primitives + scale vars + semantic dark overrides

const darkSD = new StyleDictionary(
  buildConfig({
    name: 'dark',
    sources: [
      ...primitiveSources,
      ...scaleSources,
      semanticBase,
      join(tokensRoot, 'semantic/themes/dark.json'),
    ],
    selector: '[data-theme="dark"]',
  })
);
await darkSD.buildAllPlatforms();

// ── Bundle CSS ───────────────────────────────────────────────────────────────

try {
  const bundleContent = [
    '/** Auto-generated CSS bundle — import this to get all token layers */',
    '@import "./primitives.css";',
    '@import "./light.css";',
    '@import "./dark.css";',
  ].join('\n');

  fs.writeFileSync(join(outputPath, 'css/bundle.css'), bundleContent);
  console.log('Generated CSS bundle at generated/css/bundle.css');
} catch (e) {
  console.warn('Failed to generate CSS bundle:', e.message);
}

// ── Default JS entry (light tokens) ─────────────────────────────────────────

try {
  const sourceJs  = join(outputPath, 'js/es6/light.js');
  const sourceDts = join(outputPath, 'js/es6/light.d.ts');
  const targetJs  = join(outputPath, 'js/es6/tokens.js');
  const targetDts = join(outputPath, 'js/es6/tokens.d.ts');

  if (fs.existsSync(sourceJs)) {
    fs.copyFileSync(sourceJs, targetJs);
    fs.copyFileSync(sourceDts, targetDts);
    console.log('Exposed light tokens at generated/js/es6/tokens.js');
  }
} catch (e) {
  console.warn('Failed to expose light tokens:', e.message);
}
