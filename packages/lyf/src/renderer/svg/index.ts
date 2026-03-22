
import type { IRenderer } from "src/interface/IRenderer";
import { SVG_RENDERER_EVENTS, SvgRendererOptions, type SvgRendererEventMap } from "src/interface/renderer/ISvgRenderer";

import { EventEmitter } from "src/utils/EventEmitter";
import { useElementResize } from "src/utils/resize";
import { createSvgElement } from "src/utils/svg/util";


export class SvgRenderer extends EventEmitter<SvgRendererEventMap> implements IRenderer {
    type = 'svg'
    domElement: SVGElement
    options: SvgRendererOptions
    constructor(options: SvgRendererOptions) {
        super()
        this.options = options
        this.createDomElement()
        this.domElement.style.display = 'block'
        if (this.options.width && this.options.height) {
            this.setSize(this.options.width, this.options.height)
        } else {
            this.on(SVG_RENDERER_EVENTS.DISPOSE, useElementResize({
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
            this.domElement = createSvgElement('svg');
            (container as Element).appendChild(this.domElement)
        }
    }
    setSize(width: number, height: number) {
      //  const dpr = this.options.dpr
        this.domElement.style.width = `${width}px`
        this.domElement.style.height = `${height}px`
        this.emit(SVG_RENDERER_EVENTS.RESIZE, width, height)

    }
    dispose() {
        this.emit(SVG_RENDERER_EVENTS.DISPOSE)
    }
}
