import { ILyf, LYF_EVENTS } from "src/interface/ILyf"
import { SvgRenderer } from "src/renderer/svg"

export default (lyf: ILyf) => {
    lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf: ILyf) => {
        const config = lyf.config
        if (config.rendererType === 'svg') {
            const renderer = new SvgRenderer(config as any)
            lyf.registerRenderer('svg', renderer)
        }
    })
}