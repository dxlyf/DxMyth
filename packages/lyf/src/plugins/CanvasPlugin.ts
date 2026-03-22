import { ILyf, LYF_EVENTS } from "src/interface/ILyf"
import { CanvasRenderer } from "src/renderer/canvas"

export default (lyf: ILyf) => {
    lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf: ILyf) => {
        const config = lyf.config
        if (config.rendererType === 'canvas') {
            const canvasRenderer = new CanvasRenderer({
                canvas:config.canvas as HTMLCanvasElement,
                width:config.width,
                height:config.height,
                resizeTo:config.resizeTo,
                dpr:config.dpr,
            })
            lyf.registerRenderer('canvas', canvasRenderer)
        }
    })
}