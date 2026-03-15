
import { initCanvasKit,type CanvasKit } from "src/canvaskit"
import { ILyf } from "src/interface/ILyf"

declare module 'src/interface/ILyf' {
    interface ILyf {
        ck:CanvasKit
    }

}

declare module 'src/Lyf' {
    interface Lyf {
        ck:CanvasKit
    }
}
export default (lyf:ILyf)=>{
    lyf.addInitTask(new Promise((resolve)=>{
            return initCanvasKit().then((CanvasKit)=>{
                lyf.ck=CanvasKit
                resolve()
            })
    }))
}
