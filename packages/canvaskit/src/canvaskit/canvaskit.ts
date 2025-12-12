import initCanvaskit from 'canvaskit-wasm'
import CanvasKitInitWasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url'
import type {CanvasKit as CanvasKitImp} from 'canvaskit-wasm'
export type * as CanvasKit from 'canvaskit-wasm'

export let CK:CanvasKitImp|null=null
let loadingPromise:Promise<CanvasKitImp>|null=null
export const getCanvasKit=async ():Promise<CanvasKitImp>=>{
    if(CK){
        return CK
    }
    CK=await initLoadCanvaskit()
    return CK
}

async function initLoadCanvaskit():Promise<CanvasKitImp>{
    if(loadingPromise){
        return loadingPromise
    }
    loadingPromise= new Promise((resolve,reject)=>{
        initCanvaskit({
            locateFile(){
                return CanvasKitInitWasmUrl
            }
        }).then((ck)=>{
            resolve(ck)
        },()=>{
            reject()
        })
    })
    return loadingPromise
}
