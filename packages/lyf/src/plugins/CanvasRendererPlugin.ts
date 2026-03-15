import { ILyf } from "src/interface/ILyf"
import { CanvasRenderer } from "src/renderer/canvas"

export default (lyf:ILyf)=>{
    const config=lyf.config
    const canvasRenderer=new CanvasRenderer(lyf)
    lyf.setRenderer('canvas',canvasRenderer)
}