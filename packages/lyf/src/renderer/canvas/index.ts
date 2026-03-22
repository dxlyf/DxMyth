
import type { IRenderer } from "src/interface/IRenderer";
import { CANVAS_RENDERER_EVENTS, CanvasRendererOptions, type CanvasRendererEventMap } from "src/interface/renderer/ICanvasRenderer";

import { EventEmitter } from "src/utils/EventEmitter";
import { useElementResize } from "src/utils/resize";


export class CanvasRenderer extends EventEmitter<CanvasRendererEventMap> implements IRenderer {
    type = 'canvas'
    domElement: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    options: CanvasRendererOptions
    constructor(options: CanvasRendererOptions) {
        super()
        this.options = options
        this.createDomElement()
        this.domElement.style.display = 'block'
        if (this.options.width && this.options.height) {
            this.setSize(this.options.width, this.options.height)
        } else {
            this.on(CANVAS_RENDERER_EVENTS.DISPOSE, useElementResize({
                element: this.domElement,
                resizeTo: this.options.resizeTo,
                onResize: (width, height) => {
                    this.setSize(width, height)
                }
            }))
        }
    }
    createDomElement() {
        const container = this.options.canvas
        if (container instanceof HTMLCanvasElement) {
            this.domElement = container
        } else {
            this.domElement = document.createElement('canvas') as HTMLCanvasElement
            (container as Element).appendChild(this.domElement)
        }
    }
    setSize(width: number, height: number) {
        const dpr = this.options.dpr
        this.domElement.width = width * dpr >> 0
        this.domElement.height = height * dpr >> 0
        if (dpr > 1) {
            this.domElement.style.width = `${width}px`
            this.domElement.style.height = `${height}px`
        }
        this.emit(CANVAS_RENDERER_EVENTS.RESIZE, width, height)

    }
    dispose() {
        this.emit(CANVAS_RENDERER_EVENTS.DISPOSE)
    }
}
