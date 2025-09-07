import type { IElement, ElementProps, ElementEvents,MergeEvents } from 'src/types/core/Element'
import { Transformable, ITransformable } from 'src/math/Transformable'
import { BoundingRect } from 'src/math/BoundingRect'
import { EventEmitter4 } from 'src/events'
import { merge, applyMixins } from 'src/utils'
import { ElementEffectFlag } from 'src/constants'
import { IApplication } from 'src/types/core/Application'

export interface Element<Props extends ElementProps, Events extends ElementEvents=ElementEvents> extends ITransformable, EventEmitter4<Events&ElementEvents> {
}

let elementId = 0
/**
 * Element 类是所有可视元素的基类，提供了基本的属性和方法、变换属性、事件处理等。
 */
export class Element<Props extends ElementProps, Events extends ElementEvents> extends Transformable<Props> implements IElement<Props,Events&ElementEvents> {
    id: number = 0;
    name: string = ''
    props: Props
    type: string = 'Element'
    _effectFlag: number = ElementEffectFlag.None
    children: IElement<Props>[] | null = null
    parent: IElement<Props> | null = null
    _localBounds: BoundingRect | null = null
    _globalBounds: BoundingRect | null = null
    _owner: IApplication
    constructor(props?: Props) {
        super(props as Props)
        this.props = merge({}, ...this.defaultProps(), props || {})
        this.name = this.props.name || `Element_${elementId}`
        Object.assign(this,  new EventEmitter4())
        this.id = elementId++
    }

    get visible() {
        return this.props.visible
    }
    set visible(v: boolean) {
        if (this.props.visible !== v) {
            this.props.visible = v
            this.effectFlag |= ElementEffectFlag.Style
        }
    }
    get ignore() {
        return this.props.ignore
    }
    set ignore(v: boolean) {
        if (this.props.ignore !== v) {
            this.props.ignore = v
            this.effectFlag |= ElementEffectFlag.Style
        }
    }
    get zIndex() {
        return this.props.zIndex
    }
    set zIndex(v: number) {
        if (this.props.zIndex !== v) {
            this.props.zIndex = v
            this.effectFlag |= ElementEffectFlag.Layout
        }
    }
    get silent() {
        return this.props.silent
    }
    set silent(v: boolean) {
        if (this.props.silent !== v) {
            this.props.silent = v
        }
    }
    set effectFlag(value: number) {
        if ((this._effectFlag ^ value) !== 0) {
            this._effectFlag = value
            this.updateEffect()
        }
    }
    get effectFlag() {
        return this._effectFlag
    }

    get parentNode() {
        return this.parent
    }
    get owner() {
        if (this.parent) {
            return this.parent.owner
        }
        return this._owner
    }
    set owner(v: IApplication) {
        this._owner = v
    }
    getObjectByName(name: string) {
        const children = this.children
        if (children) {
            return children.find(d => d.name === name)
        }
    }
    protected _setProp(target: any, key: string | string, value: any): boolean {
        const oldValue = target[key]
        if (oldValue !== value) {
            target[key] = value
            return true
        }
        return false
    }
    protected _setProps(target: any, props: any): boolean {
        let changed = false
        Object.keys(props).forEach(key => {
            if (this._setProp(target, key, props[key])) {
                changed = true
            }
        })
        return changed
    }
    protected setProps(props: Partial<Props>): boolean {
        return this._setProps(this.props, props)
    }
    defaultProps(): Partial<Props>[] {
        return [{
            zIndex: 0,
            visible: true,
            ignore: false,
            silent: false
        }] as Partial<Props>[]
    }
    shouldInteractive(){
        return this.props.silent !== true&&this.props.ignore!==true
    }
    shouldRender() {
        return this.props.ignore !== true && this.props.visible !== false
    }
    shouldAddToDisplayList() {
        return this.props.ignore !== true
    }
    insert(el: IElement<any>, index?: number): boolean {
        if (this.children == null) {
            this.children = []
        }
        const children = this.children
        index = index !== undefined ? Math.max(0, Math.min(index, children.length)) : children.length
        if (el.parent === this) {
            return false
        }
        if (el.parent) {
            el.parent.remove(el)
        }
        el.parent = this
        this.effectFlag |= ElementEffectFlag.Children | ElementEffectFlag.Layout | ElementEffectFlag.Transform
        children.splice(index, 0, el)
        this.emit('child:add',{el:el})
        return true
    }
    add(el: IElement<any>): boolean {
        return this.insert(el)
    }
    remove(el: IElement<any>): boolean {
        if (!this.children) {
            return false
        }
        const index = this.children!.indexOf(el)
        if (index !== -1) {        
            const el = this.children!.splice(index, 1)[0]
            this.emit('child:remove',{el:el})    
            this.effectFlag |= ElementEffectFlag.Children | ElementEffectFlag.Layout | ElementEffectFlag.Transform
            el.parent = null
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
    calcLocalBounds(): BoundingRect {
        throw new Error('Method not implemented.')
    }
    getLocalBounds(force: boolean = false): BoundingRect {
        let _localBounds = this._localBounds
        if (!_localBounds) {
            force = true
            _localBounds = this._localBounds = BoundingRect.empty()
        }
        if (force) {
            let bounds = this.calcLocalBounds()
            _localBounds.copy(bounds)
            if(this.children&&this.children.length){
                let tmp=BoundingRect.empty()
                for(let i=0;i<this.children!.length;i++){
                    let el=this.children![i]
                    let childBounds = el.getLocalBounds()
                    tmp.copy(childBounds)
                    tmp.applyMatrix(el.matrix)
                    _localBounds.union(tmp)
                }
              
            }
       
        }
        return _localBounds
    }
    getGlobalBounds(force: boolean = false): BoundingRect {
        let _globalBounds = this._globalBounds
        if (!_globalBounds) {
            force = true
            _globalBounds = this._globalBounds = BoundingRect.empty()
        }
        if (force) {
            let bounds = this.getLocalBounds()
            _globalBounds.copy(bounds).applyMatrix(this.worldMatrix)
        }
        return _globalBounds
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
    removeAllEffectFlag(flag:number){
        this.effectFlag&=~flag
        const children = this.children
        if (children) {
            for (const child of children) {
                child.removeAllEffectFlag(flag)
            }
        }
    }
    resetAllEffectFlag() {
        this.effectFlag = 0
        const children = this.children
        if (children) {
            for (const child of children) {
                child.resetAllEffectFlag()
            }
        }
    }
    updateEffect() {
        let _effectFlag=this.getAllEffectFlag()
        // shape属性变化，更新边界框等信息
        if (_effectFlag & ElementEffectFlag.Shape) {
            this._localBounds=null
        }
        // 矩阵和结构发生变化时，应用了矩阵的边界框需要重新计算
        if (_effectFlag & (ElementEffectFlag.Transform | ElementEffectFlag.Shape | ElementEffectFlag.Children)) {
            this._globalBounds = null
        }
    }
    dispose(): void {
        this.removeAllListeners()
    }

}

applyMixins(Element, [EventEmitter4])
