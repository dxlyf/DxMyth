import {Element} from './Element'
import {DisplayObjectStyleProps, IDisplayObject} from 'src/types/core/DisplayObject'
import {DisplayObjectProps,DisplayObjectEvents} from 'src/types/core/DisplayObject'
import { ElementEffectFlag } from 'src/constants'
import { IBaseRenderer } from 'src/types/core/BaseRenderer'
import { FillRule, LineCap, LineJoin, PaintStyle, RenderObject } from 'src/types/core/Paint'
import { IViewport } from 'src/types/core/Viewport'
import { isValidStyle } from './Paint'
import {Path2D,PathStroker,PathStrokeDash} from 'skia-path2d'
import { BoundingRect } from 'src/math/BoundingRect'
import { Vector2 } from 'src/math/Vec2'

const tmp_vec0=Vector2.default()
/**
 * 容器类，用于管理子元素。
 */
export abstract class DisplayObject<ShapeProps extends{},Events extends DisplayObjectEvents=DisplayObjectEvents> extends Element<DisplayObjectProps<ShapeProps>,Events> implements IDisplayObject<DisplayObjectProps<ShapeProps>>{
    type: string='DisplayObject'
    _fillPath:Path2D
    _strokePath:Path2D
    init(): void {
        super.init()
    }
    get style(){
        return this.props.style!
    }
    get shape(){
        return this.props.shape! 
    }
    defaultProps(){
        return [...super.defaultProps(),{
            style:{
                opacity:1,
                fillStyle:'#000',
                miterLimit:10,
                lineJoin:LineJoin.Miter,
                lineCap:LineCap.Butt,
                lineWidth:1,
                fillRule:FillRule.NonZero,
                firstFill:true
            } 
        } as DisplayObjectProps<ShapeProps>]
    }
    setShape(shape: Partial<ShapeProps>): void {
       if( this._setProps(this.shape,shape)){
        this.effectFlag!=ElementEffectFlag.Shape
       }
    }
    setStyle(styles: Partial<DisplayObjectStyleProps>): void {
        if( this._setProps(this.style,styles)){
            this.effectFlag!=ElementEffectFlag.Style
         }
    }
    hasStrokeDash(){
        return !!this.style.lineDash&& this.style.lineDash.length>0
    }
    hasFill(){
        return isValidStyle(this.style.fillStyle)
    }
    hasStroke(){
        return isValidStyle(this.style.strokeStyle)
    }
    shouldRender(){
        return this.visible && this.style.opacity>0
    }
    isInViewport(viewport:IViewport){
        return viewport.intersect(this.getGlobalBounds())
    }
    contains(x: number, y: number): boolean {
        return this.isPointInPath(x,y)
    }
    isPointInPath(x:number,y:number): boolean {
        const hasFill=this.hasFill()
        const hasStroke=this.hasStroke()
        tmp_vec0.set(x,y)
        this.invertWorldMatrix.mapPoint(tmp_vec0,tmp_vec0)
        x=tmp_vec0.x
        y=tmp_vec0.y

        if(hasFill || hasStroke){
            let bounds=this.getLocalBounds()
            if(!bounds.containsPoint(tmp_vec0)){
                return false
            }
            if(hasFill&&hasStroke){
                if(this._fillPath.contains(x,y,this.style.fillRule)){
                    return true
                }
                if(this._strokePath.contains(x,y,'nonzero')){
                    return true
                }
            }else if(hasFill&&this._fillPath.contains(x,y,this.style.fillRule)){
                return true
            }else if(hasStroke&&this._strokePath.contains(x,y,'nonzero')){
                return true
            }
        }
        return false
    }
    calcLocalBounds(){
        this.buildRenderPath()
        const hasFill=this.hasFill()
        const hasStroke=this.hasStroke()
        let rect:any;
        if(hasStroke){
            rect= this._strokePath.computeTightBounds()
        }else if(hasFill){
            rect= this._fillPath.computeTightBounds()
        }
        if(rect){
            return BoundingRect.fromLTRB(rect.left,rect.top,rect.right,rect.bottom)
        }
        return BoundingRect.empty()
    }
    buildRenderPath(){
        if(this.effectFlag&ElementEffectFlag.Shape&&(this.hasFill()||this.hasStroke())||!this._fillPath){
            if(!this._fillPath){
                this._fillPath=Path2D.default()
            }
            this.buildPath(this._fillPath)
        }
        if(this.effectFlag&ElementEffectFlag.Shape||this.hasStroke()&&!this._strokePath){
            if(!this._strokePath){
                this._strokePath=Path2D.default()
            }
            this._strokePath.getPath().copy(this._fillPath.getPath())
            if(this.hasStrokeDash()){
                let lineDash=this.style.lineDash.slice()
                if(lineDash.length%2!==0){
                    lineDash=lineDash.concat(lineDash)
                }
                let dash=new PathStrokeDash(lineDash,this.style.lineDashOffset)
                let dashPath=dash.dash(this._strokePath.getPath())
                if(dashPath){
                    this._strokePath.getPath().copy(dashPath)
                }
            }
            let pathStroker=new PathStroker()
            let newPath=pathStroker.stroke(this._strokePath.getPath(),{
                strokeWidth:this.style.lineWidth,
                miterLimit:this.style.miterLimit,
                lineCap:this.style.lineCap,
                lineJoin:this.style.lineJoin,
            })
            this._strokePath.getPath().copy(newPath)
        }
        this.effectFlag&=~ElementEffectFlag.Shape
    }
    render(renderer:IBaseRenderer,renderObject:RenderObject):void{
        const {object,paints}=renderObject
        this.buildRenderPath()
        renderer.drawPath(object._fillPath)
        paints.forEach(paint=>{
            renderer.drawPaint(paint)
        })
    }
    abstract buildPath(path:Path2D):void;
}