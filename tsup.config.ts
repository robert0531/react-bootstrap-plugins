import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    DatePicker: 'src/components/DatePicker.tsx',
    SearchSelect: 'src/components/SearchSelect.tsx',
    Label: 'src/components/Label.tsx',
    TableLoading: 'src/components/TableLoading.tsx',
    AutoTextarea: 'src/components/AutoTextarea.tsx',
    NavPills: 'src/components/NavPills.tsx',
  },
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  clean: true,
  sourcemap: 'inline',
  splitting: true,
  treeshake: true,
  minify: true,
  dts: true,
  target: 'es2020',
  platform: 'browser',
  outDir: 'dist',
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
