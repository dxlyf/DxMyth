import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        'core/index': 'src/core/index.ts',
        'backends/webgl/index': 'src/backends/webgl/index.ts',
        'backends/webgl2/index': 'src/backends/webgl2/index.ts',
        'backends/webgpu/index': 'src/backends/webgpu/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
    }),
  ],
});
