import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  return {
    plugins: [dts({
      entryRoot: "./src",
      outDir: "./types"
    })],
    define: {},
    build: {
      outDir: 'dist',
      lib: {
        entry: {
          index: './src/index.ts'
        },
        name: 'dxMyth.lyf',
        fileName: (format, name) => `${name}.${format}.js`
      },
      minify: true
    },
    esbuild: {},
    resolve: {
      alias: {
        'src': '/src'
      }
    },
    optimizeDeps: {
      exclude: ['canvaskit-wasm']
    },
    server: {
      port: 8428,
      open: '/examples/basic.html',
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  }
})
