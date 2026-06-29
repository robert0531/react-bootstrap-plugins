import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.js',
    DatePicker: 'src/components/DatePicker.jsx',
    SearchSelect: 'src/components/SearchSelect.jsx',
    Label: 'src/components/Label.jsx',
  },
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  minify: true,
  dts: false, // We handle DTS separately via tsc for reliability with JSX files
  target: 'es2020',
  platform: 'browser',
  outDir: 'dist',
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
