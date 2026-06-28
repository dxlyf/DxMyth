import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  return {
    plugins: [dts({
      entryRoot: "./src",
      outDir: "./types"
    })],
    define: {
      // 避免 Node.js 全局变量在浏览器中报错
      global: 'globalThis',
    },
    mode:"development",
    build: {
      outDir: 'dist',
      lib: {
        entry: {
          index: './src/index.ts',
          canvaskit: './src/canvaskit/export.ts'
        },
      //  name: 'dxMyth.lyf',
        formats:['es'],
        fileName: (format, name) => `${name}.${format}.js`
      },
      minify: false,
    },
    esbuild: {},
    resolve: {
      alias: {
        'src': path.resolve(__dirname, 'src')
      },
      external: ['canvaskit-wasm']
    },
    optimizeDeps: {
     // exclude: ['canvaskit-wasm']
    },
    server: {
      port: 8428,
    //  open: '/examples/basic.html',
      // headers: {
      //   'Cross-Origin-Opener-Policy': 'same-origin',
      //   'Cross-Origin-Embedder-Policy': 'require-corp'
      // }
    }
  }
})
