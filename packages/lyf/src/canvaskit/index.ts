import CanvasKitInit from 'canvaskit-wasm'
import CanvasKitInitWasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url'


export * from 'canvaskit-wasm'
export const initCanvasKit = () => {
    return CanvasKitInit({
        locateFile: (file) => {
            return CanvasKitInitWasmUrl;
        }
    }).then((CanvasKit) => {
        return CanvasKit
    })
}