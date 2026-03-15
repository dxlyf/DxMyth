import { ILyf } from "src/interface/ILyf";
import { IRenderer } from "src/interface/IRenderer";
import { CanvasLayer, type CanvasLayerOptions } from "./CanvasLayer";

export class CanvasRenderer implements IRenderer {
    type = 'canvas'
    owner: ILyf
    layers: CanvasLayer[] = []
    mainLayer: CanvasLayer
    constructor(owner: ILyf) {
        this.owner = owner
        this.mainLayer=this.createLayer({
            canvas: this.owner.config.canvas,
        })
    }
    createLayer(options: CanvasLayerOptions = {}) {
        const layer = new CanvasLayer({
            width: this.owner.config.width,
            height: this.owner.config.height,
            dpr: this.owner.config.dpr,
            ...options
        })
        return layer
    }
    addLayer(layer: CanvasLayer) {
        this.layers.push(layer)
    }
    updateLyaerId() {
        this.layers.forEach((layer, index) => {
            layer.id = 'canvas_layer_' + index
        })
    }
    appendTo(container: HTMLDivElement) {
        this.layers.forEach(layer => {
             container.appendChild(layer.canvas)
        })
    }
}