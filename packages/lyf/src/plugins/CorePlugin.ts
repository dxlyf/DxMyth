import { ILyf } from "src/interface/ILyf"
import CanvasPlugin from "./CanvasPlugin"
import SvgPlugin from "./SvgPlugin"
import CanvasKitPlugin from "./CanvasKitPlugin"

export default (lyf:ILyf)=>{
    lyf.registerPlugin(CanvasPlugin,CanvasKitPlugin,SvgPlugin)

}
