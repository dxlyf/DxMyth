

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import type { ShapeStyleConfig, ShapeConfig } from 'src/types/Shape';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';

export interface ShapeOptions<Shape extends ShapeConfig = ShapeConfig, Style extends ShapeStyleConfig = ShapeStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
}


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
                fillStyle:'#000',
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
   
    startDraw(renderer: CanvaskitRenderer) {
        renderer.beginPath()
    }
    draw(renderer: CanvaskitRenderer): void {
        this.buildInnerPath()
        renderer._currentPath.addPath(this._ckPath)
    }
    endDraw(renderer: CanvaskitRenderer) {
        renderer.applyCanvasStyle(this.style)
        renderer.drawPathPaint(renderer._currentPath, this.style)
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

