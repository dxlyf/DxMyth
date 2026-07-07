import CanvasKitInit from 'canvaskit-wasm'
import CanvasKitURL from 'canvaskit-wasm/bin/canvaskit.wasm?url'
import type * as CanvasKit from 'canvaskit-wasm'
export type {
    CanvasKit
}
let ck:CanvasKit.CanvasKit
export const getCanvasKit = async () => {
    if(ck){
        return ck
    }
    return CanvasKitInit({
        locateFile(file){
            return CanvasKitURL
        }
    }).then((kit)=>{
        ck=kit
        return ck
    })
}

export {
    ck
}