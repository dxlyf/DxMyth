import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有
  // `VITE_` 前缀。
 // const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [dts({
     // root:__dirname,
      entryRoot:"./src",
      outDir:"./types"
    })],
    // vite 配置
    define: {
      'process.env.DEBUG': JSON.stringify(false)
     // __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build:{
        outDir:'dist',
        lib:{
          entry:{
            index:'./src/index.ts'
          },
          name:'dxMyth.math',
          fileName:(format,name)=>`${name}.${format}.js`
        },
        minify:true
    },
    esbuild:{
      
    },
    resolve:{
        alias:{
            'src':path.resolve(__dirname,'src'),
            'three':path.resolve(__dirname,'src/3d/index.core.ts'),
            'gl-matrix':path.resolve(__dirname,'src/gl-matrix'),
            'eventmitter3':path.resolve(__dirname,'src/eventemitter3')
        }
    }
  }
})