/**
 * Builds and minifies CSS for react-bootstrap-plugins.
 * Uses Lightning CSS for minification — zero-config, fast native binary.
 *
 * Output:
 *   dist/css/plugins.css   — minified CSS (primary import path)
 *   dist/css/datepicker.css — backward-compat alias (same content)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from 'lightningcss'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const srcDir = resolve(root, 'src', 'css')
const distDir = resolve(root, 'dist', 'css')

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

const cssFile = resolve(srcDir, 'plugins.css')
const raw = readFileSync(cssFile, 'utf-8')

const result = transform({
  filename: 'plugins.css',
  code: Buffer.from(raw),
  minify: true,
  sourceMap: false,
  targets: {
    // Modern browsers that support ES modules (matching es2020 target)
    chrome: 90 << 16,
    firefox: 90 << 16,
    safari: 14 << 16,
    edge: 90 << 16,
  },
})

// Write primary file
writeFileSync(resolve(distDir, 'plugins.css'), result.code)
console.log('  ✓ plugins.css (minified)')

// Backward-compat alias for consumers using the old import path
writeFileSync(resolve(distDir, 'datepicker.css'), result.code)
console.log('  ✓ datepicker.css (backward-compat alias)')
console.log('CSS built successfully.')
