import { IRendererService } from "src/interface/Renderer";
import {CK} from 'src/canvaskit'
import type * as CanvasKit from 'src/canvaskit'
import type {CanvaskitRenderer} from './Renderer'

export class FontService {
    renderer:CanvaskitRenderer
    font:CanvasKit.Font
    fonts:Map<string,CanvasKit.Typeface>
    constructor(renderer:CanvaskitRenderer){
        this.renderer=renderer
        this.font=new CK.Font(CK.Typeface.GetDefault(),10)
        this.font.setSubpixel(true)
    }
    get surface(){
        return this.renderer.surface
    }
    addFont(font:any){
        
    }
    setFont(font:string){

    }
}