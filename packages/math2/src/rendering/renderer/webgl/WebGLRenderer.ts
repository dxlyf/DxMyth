import { PathBuilder } from "src/math/PathBuilder";
import { Paint } from "src/rendering/Paint";
import { Renderer, RendererProps, RenderOptions } from "src/rendering/Renderer";


export class WebGLRenderer extends Renderer {
    renderType='webgl'
    domElement: HTMLElement;
    preInit(options: RendererProps): Promise<void> {
        throw new Error("Method not implemented.");
    }
    render(renderOptions: RenderOptions): void {
        throw new Error("Method not implemented.");
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