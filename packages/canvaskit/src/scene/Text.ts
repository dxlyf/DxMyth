

import type { DisplayObjectOptions } from 'src/types/DisplayObject'
import { DisplayObject } from "src/scene/DisplayObject";
import type { ShapeStyleConfig, ShapeConfig } from 'src/types/Shape';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { CK, type CanvasKit } from 'src/canvaskit';
import { isNullOrUndefined, isValidPaintValue, merge } from 'src/utils';
import { NodeEffectFlags } from 'src/consts';

export interface TextOptions<Shape extends TextShapeConfig = TextShapeConfig, Style extends TextStyleConfig = TextStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape
}
export interface TextShapeConfig extends ShapeConfig{
    x?:number,
    y?:number,
}
export interface TextStyleConfig extends ShapeStyleConfig{
    text?:string,
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
                text:''
            },
            shape:{
                x:0,
                y:0
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
    }
    draw(renderer: CanvaskitRenderer): void {
        this.buildInnerPath()
        renderer._currentPath.addPath(this._ckPath)
    }
    endDraw(renderer: CanvaskitRenderer) {
       renderer.drawTextPaint(this.style.text,this.shape.x,this.shape.y,this.style)     
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

