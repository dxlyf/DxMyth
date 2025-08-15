import { ProxyPath2D } from "skia-path2d";
import { BaseRenderer } from "src/core/BaseRenderer";
import { BaseRendererOptions } from "src/types/core/BaseRenderer";

export interface CanvasRendererOptions extends BaseRendererOptions{

}

export class CanvasRenderer extends BaseRenderer<CanvasRenderingContext2D,{}>{
    renderMode='canvas'
    constructor(options:Partial<CanvasRendererOptions>){
        super(options)
    }
    createContext(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d')!;
    }
    drawPath(path: ProxyPath2D): void {
        throw new Error("Method not implemented.");
    }
    render(){

    }
}