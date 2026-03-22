
import {CanvasKitInit,CanvasKitInitWasmUrl,type CanvasKit} from './export'
let canvaskKitPromise:Promise<CanvasKit>|null
let _ck:CanvasKit|null=null
export type * as CanvasKit from 'canvaskit-wasm'
const getCanvasKit =  () => {
    if(canvaskKitPromise){
        return canvaskKitPromise
    }
    canvaskKitPromise= CanvasKitInit({
        locateFile: (file) => {
            return CanvasKitInitWasmUrl;
        }
    }).then((CanvasKit) => {
        _ck=CanvasKit
        return CanvasKit
    })
    return canvaskKitPromise
}
export default {
    getCanvasKit,
    get ck():CanvasKit{
        if(!_ck){
            throw new Error('CanvasKit not initialized')
        }
        return _ck
    }
}
 
