import type { ContainerOptions, ContainerOptionsEvents } from 'src/types/Container'
import { Node } from "./Node";
import { CanvaskitRenderer } from "src/renderer/CanvaskitRenderer";
import { NodeEffectFlags } from 'src/consts';
import { BoundingRect } from 'src/math/BoundingRect';
import { DisplayObject } from './DisplayObject';
import type { CKEngine } from 'src/core/CKEngine';
import { PriorityQueue } from 'src/data/PriorityQueue';

const priorityQueue =  new PriorityQueue<{index:number,node:DisplayObject}>((a, b) => {
    const aZ = a.node.zIndex ?? 0, bZ = b.node.zIndex ?? 0
    if(aZ === bZ){
        return a.index - b.index
    }
    return aZ - bZ
})
class Container extends Node<ContainerOptions, ContainerOptionsEvents> {
    type: string = 'Container'
    engine: CKEngine
    _interactionRenderList: DisplayObject[] = [] // 交互渲染列表
    constructor(engine: CKEngine, options?: ContainerOptions) {
        super(options)
        this.engine=engine
    }
    innerCalcBounds(): void { }
    shouldAddToPendingRenderList(): boolean {
        return false
    }
  
   
    // 更新待渲染列表
    updateRenderList({ viewport, delta }: { viewport: BoundingRect, delta: number }): DisplayObject[] {
        this._interactionRenderList.length = 0
        priorityQueue.clear()
        let index=0
        this.traverse<DisplayObject>(el => {
            el.onBeforeUpdate(delta)
            el.onUpdate(delta)
            el.onAfterUpdate(delta)
            // 添加可渲染的元素到渲染列表中
            if (el.shouldAddToPendingRenderList() && el.isInViewport(viewport)) {
                priorityQueue.push({index:index++,node:el})
            }
        })
        priorityQueue.forEachSorted((el,index) => {
            this._interactionRenderList[index] = el.node
        })
        return this._interactionRenderList
        
    }

}
export {
    Container
}