

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { TextStyleConfig } from 'src/types/Text';
import { BoundingRect } from 'src/math';

export interface TextOptions<Shape extends TextShapeConfig = TextShapeConfig, Style extends TextStyleConfig = TextStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
    onDraw?: (obj: Text, renderer: CanvaskitRenderer) => void
}
export interface TextShapeConfig {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
}


export class Text<Options extends TextOptions = TextOptions> extends DisplayObject<Options> {
    type = 'Text'
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
                fillStyle: '#000',
                text: '',
                fontSize: 14,
                fontFamily: 'sans-serif'
            },
            shape: {
                x: 0,
                y: 0
            }
        }] as Options[]
    }
    shouldUpdateBounds(): number {
        return this.effectFlag & (NodeEffectFlags.Style | NodeEffectFlags.Shape)
    }
    innerCalcBounds(): void {
        if (this.owner) {
            this.effectFlag &= ~NodeEffectFlags.Style
            this.effectFlag &= ~NodeEffectFlags.Shape
            const fontMgr = this.owner.renderer._fontMgr
            const width = fontMgr.getTextWidth(this.style.text, this.style.fontSize)
            const metrics = fontMgr.calc(() => {
                return fontMgr.font.getMetrics()
            }) as CanvasKit.FontMetrics
            let rect = BoundingRect.fromXYWH(this.shape.x, metrics.ascent, width, metrics.descent)
            rect.translate(this.shape.x, this.shape.y)
            this._bounds.fromLTRB(rect.x, rect.y, rect.width, rect.height)
        }

    }


    hasFill() {
        return isValidPaintValue(this.style.fillStyle)
    }
    hasStroke() {
        return isValidPaintValue(this.style.strokeStyle)
    }

    startDraw(renderer: CanvaskitRenderer) {
    }
    draw(renderer: CanvaskitRenderer): void {
        renderer.applyCanvasStyle(this.style)
        renderer._fontMgr.font.setEmbolden(this.style.fontWeight === 'bold')
        renderer._fontMgr.font.setSkewX(this.style.fontStyle === 'italic' ? -0.2 : 0)
        if (this.props.onDraw) {
            this.props.onDraw(this, renderer)
        } else {
            renderer.drawTextPaint(this.style.text, this.shape.x, this.shape.y, this.style)
        }
        renderer._fontMgr.font.setEmbolden(false)
        renderer._fontMgr.font.setSkewX(0)
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

