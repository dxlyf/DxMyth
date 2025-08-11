
import type {TransformableProps} from '@dxyl/math/types/2d/math/transformable'
import type {BoundingRect} from '@dxyl/math/types/2d/math/bounding_rect'
import type {Event} from '@dxyl/utils'

export type ElementProps={
    ignore:boolean; // 是否忽略，忽略则不渲染也不响应事件
    silent:boolean; // 是否静默，静默则不触发事件
    visible:boolean // 是否可见，不可见则不渲染，但响应事件
    zIndex:number // 层级
}&TransformableProps



export interface ElementEvents{
    'config:change':{
        field:string
        current:any
        previous:any
    },
    'child:add':{
        el:IElement<any>
    }
    'child:remove':{
        el:IElement<any>
    }
    'dispose':{},
}

export interface IElement<Props extends ElementProps>{
    id:number
    name:string
    type:string
    props:Props
    dirtyFlag:number
    children: IElement<Props>[]|null;
    parent: IElement<Props>|null;
    init():void;
    defaultProps():Partial<Props>[];
    getLocalBounds():BoundingRect;
    getGlobalBounds():BoundingRect;
    add(el:IElement<Props>):boolean
    remove(el:IElement<Props>):boolean
    removeSelf():boolean
    traverse(fn:(el:IElement<Props>)=>void):void;
    traverseSort(fn:(el:IElement<Props>)=>void):void;
    dispose():void;
}
