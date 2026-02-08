import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))

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
          name:'dxMyth.dom',
          fileName:(format,name)=>`${name}.${format}.js`
        },
        minify:true
    },
    esbuild:{
      
    },
    resolve:{
        alias:{
            'src':'/src',
            "inferno":"/src/infernos/inferno",
            "inferno-shared":"/src/infernos/inferno-shared",
            "inferno-vnode-flags":"/src/infernos/inferno-vnode-flags",
            "inferno-create-element":["./src/infernos/inferno-create-element"],
            "inferno-utils":["./src/inferno-utils"],
            "inferno-animation":["./src/infernos/inferno-animation"],
            "inferno-clone-vnode":["./src/infernos/inferno-clone-vnode"],
            "inferno-hydrate":["./src/infernos/inferno-hydrate"],
            "inferno-compat":["./src/infernos/inferno-compat"],
            "inferno-extras":["./src/infernos/inferno-extras"]
        }
    }
  }
})