import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import ClaudeCodePresetPlugin from '../lib/index.js';

console.log('Testing dsh-preset-claude-code plugin...');

// 1. Check entry export
assert.strictEqual(typeof ClaudeCodePresetPlugin, 'function');
assert.strictEqual(ClaudeCodePresetPlugin.name, 'dsh-preset-claude-code');

const dummyCtx = {};
const instance = new ClaudeCodePresetPlugin(dummyCtx);
assert.strictEqual(instance.ctx, dummyCtx);
console.log('✓ Entry point instantiated successfully');

// 2. Validate cordis.patch.yml syntax & structure
const patchPath = path.resolve('cordis.patch.yml');
assert.ok(fs.existsSync(patchPath), 'cordis.patch.yml exists');

const patchContent = fs.readFileSync(patchPath, 'utf8');

assert.ok(patchContent.includes('preset-claude-code'), 'Must define preset-claude-code');
assert.ok(patchContent.includes('@deepseek-ai/dsh-agent-preset'), 'Must use dsh-agent-preset');
assert.ok(patchContent.includes('Claude Code 模式'), 'Must name preset');
assert.ok(patchContent.includes('@deepseek-ai/dsh-persona'), 'Must include persona');
assert.ok(patchContent.includes('@deepseek-ai/dsh-tool-bash'), 'Must include tool-bash');
assert.ok(patchContent.includes('@deepseek-ai/dsh-tool-fs'), 'Must include tool-fs');

// 2b. Multi-line prompt blocks must be literal blocks, not folded scalars:
//     `>-` / `>` collapse newlines and destroy the numbered-list structure.
for (const key of ['prefix', 'section']) {
  assert.ok(
    !new RegExp(`^\\s*${key}:\\s*>-?\\s*$`, 'm').test(patchContent),
    `${key} must not use a folded scalar (>-); use a literal block (|)`
  );
}
assert.ok(/^\s*prefix: \|\s*$/m.test(patchContent), 'prefix must use a literal block (|)');
console.log('✓ cordis.patch.yml verified');

// 3. Validate package.json exports + the dsh.bundle declaration.
//    Without `dsh.bundle.patch` DSH installs the package as a plain dependency
//    instead of a profile layer, and the preset silently never shows up.
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.strictEqual(pkg.name, 'dsh-preset-claude-code');
assert.strictEqual(pkg.exports['.'], './lib/index.js');
assert.strictEqual(pkg.exports['./cordis.patch.yml'], './cordis.patch.yml');

assert.ok(pkg.dsh, 'package.json must declare a "dsh" field');
assert.ok(pkg.dsh.bundle, 'package.json must declare "dsh.bundle"');
assert.strictEqual(
  pkg.dsh.bundle.patch,
  './cordis.patch.yml',
  'dsh.bundle.patch must point at the shipped patch file'
);
assert.ok(
  fs.existsSync(path.resolve(pkg.dsh.bundle.patch)),
  'dsh.bundle.patch must resolve to an existing file'
);
assert.ok(
  pkg.files.includes('cordis.patch.yml'),
  'cordis.patch.yml must be included in the published "files"'
);
console.log('✓ package.json verified (incl. dsh.bundle.patch declaration)');
console.log('\nAll tests passed successfully! 🎉');
