import initCanvaskit from 'canvaskit-wasm'
import CanvasKitInitWasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url'
import type {CanvasKit} from 'canvaskit-wasm'

export let CK:CanvasKit|null=null
let loadingPromise:Promise<CanvasKit>|null=null
export const getCanvasKit=async ():Promise<CanvasKit>=>{
    if(CK){
        return CK
    }
    CK=await initLoadCanvaskit()
    return CK
}

async function initLoadCanvaskit():Promise<CanvasKit>{
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
await getCanvasKit()