

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import type { ShapeStyleConfig, ShapeConfig } from 'src/types/Shape';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { BorderSide } from 'src/enum';

export interface ShapeOptions<Shape extends ShapeConfig = ShapeConfig, Style extends ShapeStyleConfig = ShapeStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
}
const stylePropertiesMap = {
    lineWidth: 'lineWidth',
    lineJoin: 'lineJoin',
    lineCap: 'lineCap',
    miterLimit: 'miterLimit',
    opacity: 'globalAlpha',
    strokeStyle: 'strokeStyle',
    fillStyle: 'fillStyle',
    shadowColor: 'shadowColor',
    shadowBlur: 'shadowBlur',
    shadowOffsetX: 'shadowOffsetX',
    shadowOffsetY: 'shadowOffsetY',
} as const
type StylePropertiesMapType = typeof stylePropertiesMap
type StylePropertyNames = {
    [K in keyof StylePropertiesMapType as StylePropertiesMapType[K]]: K
}
type StylePropertyName = keyof StylePropertyNames
const styleProperties = Object.keys(stylePropertiesMap)


export class Shape<Options extends ShapeOptions = ShapeOptions> extends DisplayObject<Options> {
    type = 'Shape'
    _ckPath: CanvasKit.Path
    constructor(options?: Options) {
        super(options)
    }
    get shape(): Options['shape'] {
        return this.props.shape
    }
    get ckPath(){
        if(!this._ckPath){
            this.buildInnerPath()
        }
        return this._ckPath
    }
    setShape(shape: Options['shape']) {
        merge(this.props.shape, shape)
        this.dirtyShape()
    }
    dirtyShape(){
        this.effectFlag |= NodeEffectFlags.Repaint | NodeEffectFlags.Shape
    }
    getDefaultProps() {
        return [...super.getDefaultProps(), {
            style: {
               // lineWidth: 1,
               // fillRule:FillRule.NonZero,
               // lineJoin: LineJoin.Miter,
               // lineCap: LineCap.Butt,
               // miterLimit: 10,
               // borderSide: BorderSide.Middle,
               // opacity: 1,
                // shadowColor:null,
                // shadowBlur:0,
                // shadowOffsetX:0,
                // shadowOffsetY:0,
            }
        }] as Options[]
    }
    innerCalcBounds(): void {
        this.buildInnerPath()
        let bounds = this._ckPath.computeTightBounds()
        this._bounds.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
    }
    buildInnerPath() {
        let needUpdatePath = !!(this.effectFlag & NodeEffectFlags.Shape)
        if (!this._ckPath) {
            this._ckPath = new CK.Path()
            needUpdatePath = true
        }
        if (needUpdatePath) {
            this.effectFlag &= ~NodeEffectFlags.Shape
            this._ckPath.rewind()
            this.buildPath(this._ckPath)
        }
    }
    buildPath(path: CanvasKit.Path) {
        this.shape.buildPath?.(path)
    }
    hasFill() {
        return isValidPaintValue(this.style.fillStyle)
    }
    hasStroke() {
        return isValidPaintValue(this.style.strokeStyle)
    }
    applyPathBorderSide(path: CanvasKit.Path, renderer: CanvaskitRenderer) {
        const style = this.style, canvas = renderer.canvas
        let { borderSide, lineWidth } = style
        if (borderSide === BorderSide.Outside) {
            let innerPath = path.copy()
            innerPath.setFillType(CK.FillType.EvenOdd)
            canvas.clipPath(innerPath, CK.ClipOp.Difference, true)
            innerPath.dispose()
            renderer.lineWidth = lineWidth * 2

        } else if (borderSide === BorderSide.Inside) {
            let innerPath = path.copy()
            innerPath.setFillType(CK.FillType.EvenOdd)
            canvas.clipPath(innerPath, CK.ClipOp.Intersect, true)
            innerPath.dispose()
            renderer.lineWidth = lineWidth * 2
        }
    }
    applyPathStyle(renderer: CanvaskitRenderer) {
        const style = this.style
        styleProperties.forEach((name) => {
            const propName = name as keyof typeof style
            if (!isNullOrUndefined(style[propName])) {
                const setPropName = stylePropertiesMap[name as keyof StylePropertiesMapType] as keyof Pick<CanvaskitRenderer, StylePropertyName>
                renderer[setPropName] = style[propName] as never
            }
        })
    }
    renderBefore(renderer: CanvaskitRenderer) {
        renderer.beginPath()
    }
    render(renderer: CanvaskitRenderer): void {
        this.buildInnerPath()
        this.applyPathStyle(renderer)
        renderer._currentPath.addPath(this._ckPath)
    }
    renderAfter(renderer: CanvaskitRenderer) {
        if (this.style.firstFill) {
            if (this.hasFill()) {
                renderer.fill(this.style.fillRule)
            }
            if (this.hasStroke()) {
                this.applyPathBorderSide(renderer._currentPath, renderer)
                renderer.stroke()
            }
        }else{
            if (this.hasStroke()) {
                this.applyPathBorderSide(renderer._currentPath, renderer)
                renderer.stroke()
            }
            if (this.hasFill()) {
                renderer.fill(this.style.fillRule)
            }
        }
    }
    hit(x:number,y:number){
       if(super.hit(x,y)){
         return true
       }
       return this.ckPath.contains(x,y)
    }
    dispose(): void {
        if (this._ckPath) {
            this._ckPath.dispose()
            this._ckPath = null
        }
        super.dispose()
    }
}

