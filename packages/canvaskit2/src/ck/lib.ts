import CanvasKitInit from 'canvaskit-wasm'
import CanvasKitURL from 'canvaskit-wasm/bin/canvaskit.wasm?url'
import type * as CanvasKit from 'canvaskit-wasm'
export type {
    CanvasKit
}
let ck: CanvasKit.CanvasKit
// 缓存初始化 Promise，防止并发调用触发多次 CanvasKitInit 导致
// 产生两个独立的 WASM 实例（embind 类注册表互不识别，会出现
// "Expected null or instance of Path, got an instance of Path" 错误）。
let ckPromise: Promise<CanvasKit.CanvasKit> | null = null
let _initCallCount = 0
export const getCanvasKit = async (): Promise<CanvasKit.CanvasKit> => {
    if (ck) {
        console.log('[getCanvasKit] returning cached ck instance')
        return ck
    }
    if (!ckPromise) {
        _initCallCount++
        console.log(`[getCanvasKit] INITIALIZING CanvasKit (call #${_initCallCount}), creating new promise`)
        ckPromise = CanvasKitInit({
            locateFile(file) {
                return CanvasKitURL
            }
        }).then((kit) => {
            ck = kit
            console.log('[getCanvasKit] CanvasKitInit resolved, ck set')
            return ck
        }).catch((err) => {
            console.error('[getCanvasKit] CanvasKitInit FAILED:', err)
            ckPromise = null
            throw err
        })
    } else {
        console.log('[getCanvasKit] returning existing promise (cached)')
    }
    return ckPromise
}

export {
    ck
}