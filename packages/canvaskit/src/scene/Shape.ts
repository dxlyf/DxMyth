

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import type { ShapeStyleConfig, ShapeConfig } from 'src/types/Shape';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, toLineCap, toLineJoin, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';
import { BorderSide, LineCap, LineJoin } from 'src/enum';

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
    get ckPath() {
        if (!this._ckPath) {
            this.buildInnerPath()
        }
        return this._ckPath
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
                firstFill: true,
                miterLimit:10,
                lineWidth: 1,
                // fillRule:FillRule.NonZero,
                lineJoin: LineJoin.Miter,
                lineCap: LineCap.Butt,
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
        // if (this.hasStroke()) {
        //     const { borderSide, lineWidth, lineJoin, lineCap } = this.style      
        //     if(borderSide===BorderSide.Middle){
        //         this._bounds.outset(lineWidth/2,lineWidth/2)
        //     } 
        //     if(borderSide===BorderSide.Outside){
        //         this._bounds.outset(lineWidth,lineWidth)
        //     }
        // }
    }
    // 构建内部路径，用于hit
    buildInnerPath() {
        let needUpdatePath = !!(this.effectFlag & (NodeEffectFlags.Shape | NodeEffectFlags.Style))
        if (!this._ckPath) {
            this._ckPath = new CK.Path()
            needUpdatePath = true
        }
        if (needUpdatePath) {

            this.effectFlag &= ~NodeEffectFlags.Shape
            this.effectFlag &= ~NodeEffectFlags.Style
            this._ckPath.rewind()
            this.buildPath(this._ckPath)
             const { borderSide, lineWidth, lineJoin, lineCap,miterLimit } = this.style 
            if (this.hasStroke()&&lineWidth>=1) { 
                if(borderSide===BorderSide.Middle){
                    let strokePath=this._ckPath.copy()
                    strokePath.stroke({
                        width:lineWidth,
                        join:toLineJoin(lineJoin),
                        cap:toLineCap(lineCap),
                        miter_limit:miterLimit
                    })
                    if(this.hasFill()){
                           strokePath.op(this._ckPath,CK.PathOp.Union)
                    }
                    this._ckPath.rewind()
                    this._ckPath.addPath(strokePath)
                    strokePath.dispose()
                } 
                if(borderSide===BorderSide.Outside){
                    let strokePath=this._ckPath.copy()
                    strokePath.stroke({
                        width:lineWidth*2,
                        join:toLineJoin(lineJoin),
                        cap:toLineCap(lineCap),
                        miter_limit:miterLimit
                    })  
                    if(this.hasFill()){
                        strokePath.op(this._ckPath,CK.PathOp.Union)
                    }else{
                        let tmp=strokePath.copy()
                        tmp.op(this._ckPath,CK.PathOp.Intersect)
                        strokePath.op(tmp,CK.PathOp.Difference)
                        tmp.dispose()
                    }
                    this._ckPath.rewind()
                    this._ckPath.addPath(strokePath)
                    strokePath.dispose()
                }
                if(!this.hasFill()&&borderSide===BorderSide.Inside){
                    let strokePath=this._ckPath.copy()
                    strokePath.stroke({
                        width:lineWidth*2,
                        join:toLineJoin(lineJoin),
                        cap:toLineCap(lineCap),
                        miter_limit:miterLimit
                    })
                    strokePath.op(this._ckPath,CK.PathOp.Intersect)
                    
                    this._ckPath.rewind()
                    this._ckPath.addPath(strokePath)
                    strokePath.dispose()
                }
            }
        }
    }
    // 构建路径，用于draw
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
    }
    draw(renderer: CanvaskitRenderer): void {
        renderer.beginPath()
        this.buildInnerPath()
        this.buildPath(renderer._currentPath)
        renderer.applyCanvasStyle(this.style)
        renderer.drawPathPaint(renderer._currentPath, this.style)
    }
    endDraw(renderer: CanvaskitRenderer) {

    }
    hitPath(x: number, y: number) {
        return this.ckPath.contains(x, y)
    }
    dispose(): void {
        if (this._ckPath) {
            this._ckPath.dispose()
            this._ckPath = null
        }
        super.dispose()
    }
}

