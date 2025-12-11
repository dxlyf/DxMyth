

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { Color } from 'src/math/Color';
import { TextAlign } from 'src/enum';
import { ParagraphStyleConfig } from 'src/types/Paragraph';

export interface ParagraphOptions<Shape extends ParagraphShapeConfig = ParagraphShapeConfig, Style extends ParagraphStyleConfig = ParagraphStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
    onDraw?: (obj: Paragraph, renderer: CanvaskitRenderer) => void
}
export interface ParagraphShapeConfig {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
}




export class Paragraph<Options extends ParagraphOptions = ParagraphOptions> extends DisplayObject<Options> {
    type = 'Paragraph'
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
                content: [],
            },
            shape: {
                x: 0,
                y: 0,
                width: 100,
                height: 20
            }
        }] as Options[]
    }
    shouldUpdateBounds(): number {
        return this.effectFlag & (NodeEffectFlags.Style | NodeEffectFlags.Shape)
    }
    innerCalcBounds(): void {
        if (this.owner) {
            this.effectFlag &= ~NodeEffectFlags.Shape
            this.effectFlag &= ~NodeEffectFlags.Style

            const p = this.createParagraph()
            let height = p.getHeight()
            p.delete()
            this._bounds.fromXYWH(this.shape.x, this.shape.y, this.shape.width, height)
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
    createParagraph(fontProvider?: CanvasKit.TypefaceFontProvider) {
        if (!fontProvider) {
            fontProvider = this.owner.renderer._fontMgr.fontProvider
        }
        const paragraphStyle = new CK.ParagraphStyle({
            textAlign: CK.TextAlign.Start,
            textStyle: {
                color: Color.parse(this.style.fillStyle).normalize(),
                fontFamilies: ['sans-serif'],
                fontSize: 14,
                ...(this.style.textStyle || {})
            }
        })
        const paragraphBuilder = CK.ParagraphBuilder.MakeFromFontProvider(paragraphStyle, fontProvider)
        this.style.content.some(config => {
            if (config.textStyle) {
                paragraphBuilder.pushStyle({
                    ...paragraphStyle.textStyle,
                    ...config.textStyle
                })
            }
            if (config.placeholder) {
                paragraphBuilder.addPlaceholder(config.placeholder.width, config.placeholder.height, config.placeholder.align)
            }
            if (config.text != null) {
                paragraphBuilder.addText(config.text)
            }
            return false
        })
        const paragraph = paragraphBuilder.build()
        paragraph.layout(this.shape.width)

        paragraphBuilder.delete()
        return paragraph
    }
    draw(renderer: CanvaskitRenderer): void {
        if (this.props.onDraw) {
            this.props.onDraw(this, renderer)
        } else {
            const paragraph = this.createParagraph()
            renderer.drawParagraph(paragraph, this.shape.x, this.shape.y)
            paragraph.delete()
        }
        //paragraphBuilder.delete()
    }
    endDraw(renderer: CanvaskitRenderer) {

    }
    hitPath(x: number, y: number) {
        return false
    }
    dispose(): void {
        super.dispose()
    }
}

