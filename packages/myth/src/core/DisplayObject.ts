import {Element} from './Element'
import {IElement} from 'src/types/core/Element'
import {IDisplayObject} from 'src/types/core/DisplayObject'
import {DisplayObjectProps,DisplayObjectEvents} from 'src/types/core/DisplayObject'
import { ElementEffectFlag } from 'src/constants'
import { IBaseRenderer } from 'src/types/core/BaseRenderer'
import { FillRule, LineCap, LineJoin } from 'src/types/core/Paint'
import { IViewport } from 'src/types/core/Viewport'

/**
 * 容器类，用于管理子元素。
 */
export abstract class DisplayObject<ShapeProps extends{},Events extends DisplayObjectEvents=DisplayObjectEvents> extends Element<DisplayObjectProps<ShapeProps>,Events> implements IDisplayObject<DisplayObjectProps<ShapeProps>>{
    type: string='DisplayObject'
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
    initialize(): void {
        super.initialize()
    }
    shouldRender(){
        return this.visible && this.style.opacity>0
    }
    isInViewport(viewport:IViewport){
        return true
    }
    abstract render(renderer:IBaseRenderer):void
}