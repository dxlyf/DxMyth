import { ILyf, LYF_EVENTS } from "src/interface/ILyf"
import { CanvasKitRenderer } from "src/renderer/canvaskit"
import canvasKit,{type CanvasKit } from "src/canvaskit"

declare module 'src/interface/ILyf' {
    interface ILyf {
        ck:CanvasKit.CanvasKit
    }

}

declare module 'src/Lyf' {
    interface Lyf {
        ck:CanvasKit.CanvasKit
    }
}
export default (lyf: ILyf) => {
    lyf.addInitTask(new Promise((resolve) => {
        canvasKit.getCanvasKit().then((CanvasKit) => {
            lyf.ck = CanvasKit
            resolve()
        })
    }))
    lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf: ILyf) => {
        const config = lyf.config
        if (config.rendererType === 'canvaskit') {
            const renderer = new CanvasKitRenderer(config as any)
            lyf.registerRenderer('canvaskit', renderer)
        }
    })
}