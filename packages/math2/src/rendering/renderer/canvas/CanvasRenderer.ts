import { Color, ColorValue } from "src/math/Color";
import { PathBuilder } from "src/math/PathBuilder";
import { Paint } from "src/rendering/Paint";
import { Renderer, RendererProps, RenderOptions } from "src/rendering/Renderer";


export class CanvasRenderer extends Renderer {
    renderType='canvas'
    domElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    async preInit(options: RendererProps): Promise<void> {
        if(options.canvas){
            this.domElement=options.canvas as HTMLCanvasElement
        }else{
            this.domElement=document.createElement('canvas')

        }
        this.ctx=this.domElement.getContext('2d')!
    }
    clear():void {
        if(this.clearColor){
            this.ctx.fillStyle=Color.toCSS_RGBA(this.clearColor)
            this.ctx.fillRect(0,0,this.domElement.width,this.domElement.height)
        }else{
            this.ctx.clearRect(0,0,this.domElement.width,this.domElement.height)
        }
    }
    render(renderOptions: RenderOptions): void {
      //  throw new Error("Method not implemented.");
    }
    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawPath(path: PathBuilder, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    fillText(text: string, x: number, y: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super()
    }
}