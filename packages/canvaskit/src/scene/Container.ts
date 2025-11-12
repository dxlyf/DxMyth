import type { ContainerOptions, ContainerOptionsEvents } from 'src/types/Container'
import { Node } from "./Node";
import { CanvaskitRenderer } from "src/renderer/CanvaskitRenderer";
import { NodeEffectFlags } from 'src/consts';
import { BoundingRect } from 'src/math/BoundingRect';
import { DisplayObject } from './DisplayObject';
import timsort from 'src/utils/timsort';
import { Vector2 } from 'src/math';

interface ISpatialIndex<T> {
    insert(item: T): void;
    remove(item: T): void;
    update(item: T): void; // 当节点位置或大小改变
    queryRange(rect: { x: number, y: number, width: number, height: number }): T[];
}

class Container extends Node<ContainerOptions, ContainerOptionsEvents> {
    type: string = 'Container'
    _interactionRenderList: DisplayObject[] = [] // 交互渲染列表
    constructor(options?: ContainerOptions) {
        super(options)
    }
    innerCalcBounds(): void { }
    shouldAddToPendingRenderList(): boolean {
        return false
    }
    // 根据鼠标查找目标元素
    findTarget(x: number, y: number) {
        const list = this._interactionRenderList
        const len = list.length
        const tmp = Vector2.getPool(0, 0)
        for (let i = len - 1; i >= 0; i--) {
            const obj = list[i]
            // 是否可以响应交互事件
            if (obj.shouldInteraction()) {
                tmp.set(x, y)
                tmp.applyMatrix(obj.worldInverseMatrix)
                if (obj.hit(tmp[0], tmp[1])) {
                    tmp.releasePool()
                    return obj
                }
            }
        }
        tmp.releasePool()
        return null
    }
    // 更新待渲染列表
    updateRenderList({ viewport, delta }: { viewport: BoundingRect, delta: number }): DisplayObject[] {

        this._interactionRenderList.length = 0
        this.traverse<DisplayObject>(el => {
            el.onBeforeUpdate(delta)
            el.onUpdate(delta)
            el.onAfterUpdate(delta)
            // 添加可渲染的元素到渲染列表中
            if (el.shouldAddToPendingRenderList() && el.isInViewport(viewport)) {
                this._interactionRenderList.push(el)
            }

        })
        timsort(this._interactionRenderList, (a, b) => {
            const aZ = a.zIndex ?? 0, bZ = b.zIndex ?? 0
            return aZ - bZ
        })
        return this._interactionRenderList
    }

}
export {
    Container
}