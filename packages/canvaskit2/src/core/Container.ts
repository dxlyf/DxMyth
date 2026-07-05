
import { BoundingRect } from 'src/math/BoundingRect'
import { Element, type ElementProps } from './Element'
import { ElementFlag } from './ElementFlags'
import { Shape } from './Shape'


export type ContainerProps = {
    children?: Element<ElementProps>[]
} & ElementProps

export class Container extends Element<ContainerProps> {
    type = 'Container'
    children: Element<ContainerProps>[] = []
    renderList: Shape[] = []
    constructor(props?: ContainerProps) {
        super(props)

    }
    shouldAddToRenderList(): boolean {
        return false
    }
    add(child: Element) {
        this.addAt(child, this.children.length)
    }
    remove(child: Element) {
        const index = this.children.indexOf(child)
        if (index > -1) {
            child.parent = null
            child.transform.parent=null
            child.flags.parent = null
            this.children.splice(index, 1)
            this.flags.add(ElementFlag.CHILDREN)
        }
    }
    addAt(child: Element, index: number) {
        if (child.parent) {
            (child.parent as Container).remove(child)
        }
        child.parent = this
        child.flags.parent = this.flags
        child.transform.parent=this.transform
        this.children.splice(index, 0, child)
        this.flags.add(ElementFlag.CHILDREN)
    }
    hitTest(x: number, y: number): boolean {
        for (let child of this.children) {
            if (child.hitTest(x, y)) {
                return true
            }
        }
        return false
    }
    calcLocalBounds(out: BoundingRect): BoundingRect {
        let bounds = BoundingRect.pool.get()
        for (let child of this.children) {
            let childBounds = BoundingRect.pool.get()
            if (child.shouldRender()) {
                child.calcLocalBounds(childBounds)
                bounds.union(childBounds)
            }
            BoundingRect.pool.release(childBounds)
            //   bounds.union(child.calcLocalBounds(new BoundingRect()))
        }
        out.copy(bounds)
        BoundingRect.pool.release(bounds)
        return out
    }
    /** 收集所有需要渲染的元素
     * @param out 输出数组
     * */
    collectRenderElements() {
        const renderList: Shape[] = this.renderList
        // 如果子树有变化，或者可见性有变化，需要重新收集渲染列表
        if (this.flags.include(ElementFlag.CHILDREN | ElementFlag.VISIBILITY)) {
            renderList.length = 0
            this.traverseDescendant((el) => {
                el.onUpdate()
                if (el.shouldAddToRenderList()) {
                    renderList.push(el as Shape)
                }
            })
            renderList.sort((a, b) => {
                return a.props.zIndex - b.props.zIndex
            })
        }
        return renderList
    }

}