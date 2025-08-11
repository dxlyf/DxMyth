import type {IElement,ElementProps,ElementEvents} from 'src/types/core/Element'
import {m2d} from '@dxyl/math'
import {EventTarget} from '@dxyl/utils'
import {merge,applyMixins} from 'src/utils'
import { DirtyFlag } from 'src/constants'

export interface Element<Props extends ElementProps,Events extends {}>  extends  m2d.ITransformable,EventTarget<Events&ElementEvents>{
}
let elementId=0
export  class Element<Props extends ElementProps,Events extends {}>  extends m2d.Transformable<Props> implements IElement<Props>  {
    id:number=0;
    name:string=''
    props: Props
    type: string='Element'
    dirtyFlag: number=DirtyFlag.None
    children: Element<Props,Events>[]|null=null
    parent:Element<Props,Events> | null=null
    constructor(props:Partial<Props>){
        super(props as Props)
        this.id=elementId++
        Object.assign(this,new EventTarget())
        this.props=merge({},...this.defaultProps(),props)
        this.init()
       
    }

    init(): void {
        throw new Error('Method not implemented.')
    }
    defaultProps(): Partial<Props>[] {
        return [{
                zIndex:0,
                visible:true,
                ignore:false,
                silent:false
        }] as Partial<Props>[] 
    }
    add(el:Element<Props,Events>):boolean{
        if(this.children==null){
            this.children=[]
        }
        if(el.parent!==this){
            if(el.parent){
                el.parent.remove(el)
            }
            el.parent=this
            this.children.push(el)
            return true
        }
        return false
    }
    remove(el:Element<Props,Events>):boolean{
        if(!this.children){
            return false
        }
        const index=this.children!.indexOf(el)
        if(index!==-1){
            const el=this.children!.splice(index,1)
            el[0].parent=null
            return true
        }
        return false
    }
    removeSelf():boolean{
        if(this.parent){
            return this.parent.remove(this)
        }
        return false
    }

    getLocalBounds(): m2d.BoundingRect {
        throw new Error('Method not implemented.')
    }
    getGlobalBounds(): m2d.BoundingRect {
        throw new Error('Method not implemented.')
    }
    onTransformChange(): void {
        this.dirtyFlag|=DirtyFlag.Transform
    }
    traverse(fn: (el: IElement<Props>) => void): void {
         fn(this);
         const children=this.children
         if(children){
            for(let i=0,len=children.length;i<len;i++){
                children[i].traverse(fn)
            }
         }
    }
    traverseSort(fn: (el: IElement<Props>) => void): void {
        throw new Error('Method not implemented.')
    }
    dispose(): void {
        throw new Error('Method not implemented.')
    }

}

applyMixins(Element,[EventTarget])