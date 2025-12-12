

import type { DisplayObjectOptions, DisplayObjectStyle } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { Color } from 'src/math/Color';
import { TextAlign } from 'src/enum';
import { BoundingRect } from 'src/math';
import { CanvasDrawBaseStyle } from 'src/types/Renderer';
import {Image as ImageMgr} from 'src/core/Image'

export interface ImageOptions<Shape extends ImageShapeConfig = ImageShapeConfig, Style extends ImageStyleConfig = ImageStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
    onDraw?: (obj: Text, renderer: CanvaskitRenderer) => void
}
export interface ImageShapeConfig {
    sx?: number, 
    sy?: number, 
    sw?: number, 
    sh?: number, 
    x?: number,
    y?: number, 
    width?: number,
    height?: number,
    image?:ImageMgr
}
export interface ImageStyleConfig extends DisplayObjectStyle,CanvasDrawBaseStyle{
    
}

export class Image<Options extends ImageOptions = ImageOptions> extends DisplayObject<Options> {
    static fromUrl(url: string) {
        return new Image({
            shape: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            style: {
                fillStyle: '#000'
            }
        })
    }
    type = 'Image'
    _ckPath: CanvasKit.Path
    constructor(options?: Options) {
        super(options)
    }
    get shape(): Options['shape'] {
        return this.props.shape
    }
    setShape(shape: Options['shape']) {
        merge(this.props.shape, shape)
        this.dirtyShape()
    }
    dirtyShape() {
        this.effectFlag |= NodeEffectFlags.Repaint | NodeEffectFlags.Shape
    }
    getDefaultProps() {
        return [...super.getDefaultProps(), {
            style: {
            },
            shape: {
                x: 0,
                y: 0,
                width:100,
                height:100
            }
        }] as Options[]
    }
    shouldUpdateBounds(): number {
        return this.effectFlag & (NodeEffectFlags.Style | NodeEffectFlags.Shape)
    }
    innerCalcBounds(): void {
        if (this.owner) {
            this.effectFlag &= ~NodeEffectFlags.Shape
            if(this.shape.image){
                this._bounds.fromLTRB(this.shape.x, this.shape.y, this.shape.width, this.shape.height)
            }
        }
    }

    startDraw(renderer: CanvaskitRenderer) {
    }
    draw(renderer: CanvaskitRenderer): void {
        renderer.applyCanvasStyle(this.style)
        const image=this.shape.image
        if(image.complete){
            const {sx = 0, sy = 0, sw = image.width(), sh = image.height(), x = 0, y = 0, width = image.width(), height = image.height()} = this.shape
            renderer.drawImage(this.shape.image, sx, sy, sw, sh, x, y, width, height)
        }
    }
    endDraw(renderer: CanvaskitRenderer) {

    }
    hitPath(x: number, y: number) {
        return false
    }
    dispose(): void {
        if (this._ckPath) {
            this._ckPath.dispose()
            this._ckPath = null
        }
        super.dispose()
    }
}

