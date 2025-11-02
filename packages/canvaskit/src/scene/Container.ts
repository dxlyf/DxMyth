import type {ContainerOptions,ContainerOptionsEvents,IContainer} from 'src/interface/Container'
import { Node } from "./Node";
import { ICanvaskitRenderer } from "src/interface/Renderer";
import { IDisplayObject } from 'src/interface/DisplayObject';
import { NodeEffectFlags } from 'src/consts';
import { BoundingRect } from 'src/math/BoundingRect';

interface ISpatialIndex<T> {
    insert(item: T): void;
    remove(item: T): void;
    update(item: T): void; // 当节点位置或大小改变
    queryRange(rect: { x: number, y: number, width: number, height: number }): T[];
}

class Container extends Node<ContainerOptions,ContainerOptionsEvents> implements IContainer {
    type: string='Container'
    _pendingRenderList: IDisplayObject[] = []
    _viewport: BoundingRect=null

    constructor(options?:ContainerOptions){
          super(options)
    }
    shouldAddToPendingRenderList(): boolean {
        return false
    }
    // 获取待渲染列表
    getPendingRenderList(){
        const effectFlag=this.getAllEffectFlag()
        // 如果子元素有变化，则需要重新计算渲染列表
        if(effectFlag&NodeEffectFlags.Reflow){
            this._pendingRenderList.length=0
            this.traverseSort<IDisplayObject>(el=>{
                // 添加可渲染的元素到渲染列表中
                if(el.shouldAddToPendingRenderList()){
                    this._pendingRenderList.push(el)
                }
            })
        }
        return this._pendingRenderList
    }

}
export {
    Container
}