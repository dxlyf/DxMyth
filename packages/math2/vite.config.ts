import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 构建产出两套：
 *   - 默认（`vite build --mode esm`）：保留模块结构的 ESM（dist 下每个源文件一个 .js），
 *     使用方打包器可以按 import 实际用到的模块做 tree shaking；
 *   - `vite build --mode umd`：单文件 UMD，供 <script> 直接引用或 require 的旧场景。
 *
 * 之所以分两次构建，是因为 rollup 的 preserveModules 与单文件 UMD 输出互斥。
 */
export default defineConfig(({ mode }) => {
  const umd = mode === 'umd'
  return {
    // 类型声明由 ESM 那次构建生成，UMD 构建不重复生成
    plugins: umd ? [] : [dts({
      entryRoot: './src',
      outDir: './types'
    })],
    // vite 配置
    define: {
      //ENV: JSON.stringify(env.APP_ENV),
    },
    build: {
      outDir: 'dist',
      // 先跑 ESM 清空 dist，再跑 UMD 追加
      emptyOutDir: !umd,
      // ESM 不压缩：体积交给使用方打包器处理，同时便于调试与 tree shaking
      minify: umd,
      lib: {
        entry: {
          index: './src/index.ts'
        },
        name: 'dxMyth.Math2',
        formats: umd ? ['umd'] : ['es'],
        fileName: (format, name) => `${name}.${format}.js`
      },
      rollupOptions: {
        output: umd
          ? { exports: 'named' }
          : {
            // 保留模块结构，一个源文件对应一个产物文件
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            exports: 'named'
          }
      }
    },
    esbuild: {

    },
    resolve: {
      alias: {
        'src': path.resolve(__dirname, 'src')
      }
    }
  }
})
