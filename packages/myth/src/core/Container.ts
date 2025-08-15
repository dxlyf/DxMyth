import {Element} from './Element'
import {IElement} from 'src/types/core/Element'
import {IDisplayObject} from 'src/types/core/DisplayObject'
import {ContainerProps,ContainerEvents,IContainer} from 'src/types/core/Container'
import { ElementEffectFlag } from 'src/constants'

/**
 * 容器类，用于管理子元素。
 */
export class Container<Props extends ContainerProps=ContainerProps,Events extends ContainerEvents=ContainerEvents> extends Element<Props,Events> implements IContainer<Props>{
    type: string='Container'
    _displayList:IDisplayObject<Props>[]|null=null 
    shouldAddToDisplayList(){
        return false
    }
    getDisplayList(){
        if(this._displayList===null){
            this._displayList=[]
        }
        const displayList=this._displayList
        const dirtyFlag=this.getAllEffectFlag()
        if(dirtyFlag&(ElementEffectFlag.Children|ElementEffectFlag.Layout)){
            displayList.length=0
            this.traverseSort((el)=>{
                // 删除副作用标记
                el.effectFlag&=~(ElementEffectFlag.Children|ElementEffectFlag.Layout)
                // 只收集非容器元素，并且是可见的元素
                if(el.shouldAddToDisplayList()){
                    displayList.push(el as IDisplayObject<any>)
                }
            })
        }
        return displayList as IDisplayObject<any>[]
    }
}