import initCanvaskit from 'canvaskit-wasm'
import CanvasKitInitWasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url'
import type {CanvasKit} from 'canvaskit-wasm'
export type * from 'canvaskit-wasm'
export let CK:CanvasKit

export const setCanvasKit=(ck:CanvasKit)=>{
    CK=ck
}
let _canvasKitPromise:Promise<CanvasKit>|null=null
export async function canvasKitPromise():Promise<CanvasKit>{
    if(_canvasKitPromise){
       return _canvasKitPromise
    }
    _canvasKitPromise= new Promise((resolve,reject)=>{
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
    return _canvasKitPromise
}

await canvasKitPromise().then(setCanvasKit)