
import type {TransformableProps} from '@dxyl/math/types/2d/math/transformable'
import type {BoundingRect} from '@dxyl/math/types/2d/math/bounding_rect'
import type {IStateProp} from './StateProps'
export interface ElementProps extends TransformableProps{
    name?:string
    rectOver:boolean; // 如果为true则忽略rect的区域检测，直接渲染整个元素
    ignore:boolean; // 是否忽略，忽略则不渲染也不响应事件
    silent:boolean; // 是否静默，静默则不触发事件
    visible:boolean // 是否可见，不可见则不渲染，但响应事件
    zIndex:number // 层级
}


export interface ElementEvents{
    'prop:change':{
        field:string
        current:any
        previous:any
    }
    'child:add':{
        el:IElement<any>
    }
    'child:remove':{
        el:IElement<any>
    }
    'dispose':{}
}
export type ElementStateProps={

}
export interface IElement<Props extends ElementProps>{
    id:number
    name:string
    type:string
    props:Props
    effectFlag:number
    children: IElement<Props>[]|null;
    parent: IElement<Props>|null;
    initialize():void;
    defaultProps():Partial<Props>[];
   // getStateProps():Record<string,IStateProp<any,any>>;
    shouldAddToDisplayList():boolean; // 是否应该添加到显示列表中，如ignore,group
    shouldRender():boolean;// 是否可以渲染，如visible ignore opacity==0
    getObjectByName(name:string):IElement<Props>|void;
    getLocalBounds():BoundingRect;
    getGlobalBounds():BoundingRect;
    insert(el: IElement<Props>, index?: number): boolean
    add(el:IElement<Props>):boolean
    remove(el:IElement<Props>):boolean
    removeSelf():boolean
    traverse(fn:(el:IElement<Props>)=>void):void;
    traverseSort(fn:(el:IElement<Props>)=>void):void;
    getAllEffectFlag():number;
    dispose():void;
}
