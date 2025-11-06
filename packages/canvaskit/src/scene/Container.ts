import type {ContainerOptions,ContainerOptionsEvents} from 'src/types/Container'
import { Node } from "./Node";
import { CanvaskitRenderer } from "src/renderer/CanvaskitRenderer";
import { NodeEffectFlags } from 'src/consts';
import { BoundingRect } from 'src/math/BoundingRect';
import { DisplayObject } from './DisplayObject';
import timsort from 'src/utils/timsort';

interface ISpatialIndex<T> {
    insert(item: T): void;
    remove(item: T): void;
    update(item: T): void; // 当节点位置或大小改变
    queryRange(rect: { x: number, y: number, width: number, height: number }): T[];
}

class Container extends Node<ContainerOptions,ContainerOptionsEvents> {
    type: string='Container'
    _pendingRenderList: DisplayObject[] = []
    _viewport: BoundingRect=null

    constructor(options?:ContainerOptions){
          super(options)
    }
    innerCalcLocalBounds(): void {}
    shouldAddToPendingRenderList(): boolean {
        return false
    }
    // 获取待渲染列表
    getPendingRenderList(){
        const effectFlag=this.getAllEffectFlag()
        // 如果子元素有变化，则需要重新计算渲染列表
        if(effectFlag&NodeEffectFlags.Reflow){
            this._pendingRenderList.length=0
            this.traverse<DisplayObject>(el=>{
                // 添加可渲染的元素到渲染列表中
                if(el.shouldAddToPendingRenderList()){
                    this._pendingRenderList.push(el)
                }
                //el.effectFlag=NodeEffectFlags.None
            })
            timsort(this._pendingRenderList,(a,b)=>{
                const aZ=a.zIndex??0,bZ=b.zIndex??0
                return aZ-bZ
            })
        }
        return this._pendingRenderList
    }

}
export {
    Container
}