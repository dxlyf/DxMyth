
import { BoundingRect } from '@dxyl/math2'
import { Element, type ElementProps } from './Element'
import { ElementFlag } from './ElementFlags'
import { Shape } from './Shape'


export type GroupProps = {
   
} & ElementProps

export class Group extends Element<GroupProps> {
    type = 'Group'
    isGroup:boolean=true
    children: Element<GroupProps>[] = []
    constructor(props?: GroupProps) {
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
            child.setParent(null)
            this.children.splice(index, 1)
            this.flags.add(ElementFlag.CHILDREN)
            this.emit('remove:child',{target:this,child})
        }
    }
    addAt(child: Element, index: number) {
        if (child.parent) {
            (child.parent as Group).remove(child)
        }
        child.setParent(this)
        this.children.splice(index, 0, child)
        this.flags.add(ElementFlag.CHILDREN)
        this.emit('add:child',{target:this,child})
    }
    setParent(parent:Group){
        const currentParent=this.parent
        super.setParent(parent)
        if(parent){
            
        }else{

        }
    }
    hitTest(x: number, y: number): boolean {
        let children = this.children
        if(!this.shouldInteractive()){
            return false
        }
        for (let i = children.length - 1; i >= 0; i--) {
            const el=children[i]
            const local = el.transform.worldToLocal({ x, y }, { x: 0, y: 0 })
            if (el.shouldInteractive() && el.hitTest(local.x, local.y)) {
                return true
            }
        }
        return false
    }
    calcLocalBounds(out: BoundingRect): BoundingRect {
        let bounds = BoundingRect.pool.get()
        for (let child of this.children) {
            if (child.shouldRender()) {
                let childBounds = child.getLocalBounds()
                bounds.union(childBounds)
            }
        }
        out.copy(bounds)
        BoundingRect.pool.release(bounds)
        return out
    }
    calcLocalPaintBounds(out: BoundingRect): BoundingRect {
        let bounds = BoundingRect.pool.get()
        for (let child of this.children) {
            if (child.shouldRender()) {
                let childBounds = child.getPaintBounds()
                bounds.union(childBounds)
            }
        }
        out.copy(bounds)
        BoundingRect.pool.release(bounds)
        return out
    }
    

}