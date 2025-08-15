import type { IElement, ElementProps, ElementEvents } from 'src/types/core/Element'
import { m2d } from '@dxyl/math'
import { EventTarget,Event } from '@dxyl/utils'
import { merge,assignDeepWith, applyMixins } from 'src/utils'
import { ElementEffectFlag } from 'src/constants'

export interface Element<Props extends ElementProps, Events extends {}> extends m2d.ITransformable, EventTarget<Events & ElementEvents> {
}

let elementId = 0
/**
 * Element 类是所有可视元素的基类，提供了基本的属性和方法、变换属性、事件处理等。
 */
export class Element<Props extends ElementProps, Events extends {}> extends m2d.Transformable<Props> implements IElement<Props> {
    id: number = 0;
    name: string = ''
    props: Props
    type: string = 'Element'
    effectFlag: number = ElementEffectFlag.None
    children: Element<Props, Events>[] | null = null
    parent: Element<Props, Events> | null = null
    _localBounds: m2d.BoundingRect | null = null
    _globalBounds: m2d.BoundingRect | null = null
    constructor(props: Partial<Props>) {
        super(props as Props)
        this.name=props.name||`Element_${elementId}`
        this.id = elementId++
        Object.assign(this, new EventTarget())
        this.props = merge({}, ...this.defaultProps(), props)
        this.initialize()
    }

    initialize(): void {

    }
    get visible(){
        return this.props.visible
    }
    set visible(v:boolean) {
        if(this.props.visible!==v) {
            this.props.visible=v
            this.effectFlag|=ElementEffectFlag.Style
        }
    } 
    get ignore(){
        return this.props.ignore
    }
    set ignore(v:boolean) {
        if(this.props.ignore!==v) {
            this.props.ignore=v
            this.effectFlag|=ElementEffectFlag.Style
        }
    } 
    get zIndex(){
        return this.props.zIndex
    }
    set zIndex(v:number) {
        if(this.props.zIndex!==v) {
            this.props.zIndex=v
            this.effectFlag|=ElementEffectFlag.Layout
        }
    }
    get silent(){
        return this.props.silent
    }
    set silent(v:boolean) {
        if(this.props.silent!==v) {
            this.props.silent=v
        }
    }
    getObjectByName(name:string){
        const children=this.children
        if(children){
            return children.find(d=>d.name===name)
        }
    }
    protected _setProp(target:any, key: string|string, value: any): boolean{
        const oldValue = target[key]
        if(oldValue!==value){
            target[key]=value
            return true
        }
        return false
    }
    protected _setProps(target:any,props:any): boolean {
        let changed=false
        Object.keys(props).forEach(key=>{
            if(this._setProp(target, key, props[key])){
                changed=true
            }
        })
        return changed
    }
    protected setProps(props:Partial<Props>):boolean{
       return  this._setProps(this.props, props)
    }
    get parentNode() {
        return this.parent
    }

    defaultProps(): Partial<Props>[] {
        return [{
            zIndex: 0,
            visible: true,
            ignore: false,
            silent: false
        }] as Partial<Props>[]
    }
    shouldRender() {
        return this.props.ignore !== true && this.props.visible !== false
    }
    shouldAddToDisplayList() {
        return this.props.ignore !== true
    }
    insert(el: Element<Props, Events>, index?: number): boolean {
        if (this.children == null) {
            this.children = []
        }
        const children=this.children
        index=index!==undefined?Math.max(0,Math.min(index,children.length)):children.length
        if(el.parent===this){
            return false
        }
        if(el.parent){
            el.parent.remove(el)
        }
        el.parent=this
        this.effectFlag |= ElementEffectFlag.Children|ElementEffectFlag.Layout
        children.splice(index,0,el)
        return true
    }
    add(el: Element<Props, Events>): boolean {
        return this.insert(el)
    }
    remove(el: Element<Props, Events>): boolean {
        if (!this.children) {
            return false
        }
        const index = this.children!.indexOf(el)
        if (index !== -1) {
            const el = this.children!.splice(index, 1)
            this.effectFlag |= ElementEffectFlag.Children|ElementEffectFlag.Layout
            el[0].parent = null
            return true
        }
        return false
    }
    removeSelf(): boolean {
        if (this.parent) {
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
        this.effectFlag |= ElementEffectFlag.Transform
    }
    traverse(fn: (el: IElement<Props>) => void): void {
        fn(this);
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverse(fn)
            }
        }
    }
    traverseSort(fn: (el: IElement<Props>) => void): void {
        fn(this);
        const children = this.children
        if (children) {
            const sort_children = children.slice().sort((a, b) => a.props.zIndex - b.props.zIndex)
            for (let i = 0, len = sort_children.length; i < len; i++) {
                sort_children[i].traverse(fn)
            }
        }
    }
    getAllEffectFlag() {
        let flag = this.effectFlag
        const children = this.children
        if (children) {
            for (const child of children) {
                flag |= child.getAllEffectFlag()
            }
        }
        return flag
    }
    dispose(): void {
        this.removeAllListeners()
    }

}

applyMixins(Element, [EventTarget])