import {Element} from './Element'
import {IElement} from 'src/types/core/Element'
import {IDisplayObject} from 'src/types/core/DisplayObject'
import {DisplayObjectProps,DisplayObjectEvents} from 'src/types/core/DisplayObject'
import { ElementEffectFlag } from 'src/constants'
import { IBaseRenderer } from 'src/types/core/BaseRenderer'

/**
 * 容器类，用于管理子元素。
 */
export abstract class DisplayObject<Props extends DisplayObjectProps=DisplayObjectProps,Events extends DisplayObjectEvents=DisplayObjectEvents> extends Element<Props,Events> implements IDisplayObject<Props>{
    type: string='DisplayObject'
    get style(){
        return this.props.style!
    }
    get shape(){
        return this.props.shape!
    }
    initialize(): void {
        super.initialize()
    }
    shouldRender(){
        return this.visible && this.style.opacity>0
    }
    abstract render(renderer:IBaseRenderer):void
}