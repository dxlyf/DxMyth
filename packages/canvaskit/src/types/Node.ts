
import { BoundingRect } from 'src/math/BoundingRect';
import {type Transform, type TransformOptions} from 'src/math/Transform'

export interface NodeOptions extends TransformOptions{
    visible?:boolean // 是否显示
    opacity?:number // 为0时，不渲染，但响应事件
    silent?:boolean // 是否静默，不响应事件
    zIndex?:number // 层级
    cache?:boolean // 是否缓存绘制结果，默认为false

}
export interface NodeEvents{

}


// export interface INode<Options=any,E extends NodeEvents=NodeEvents> {
//     type:string
//     parent: INode<Options,E> | null;
//     children: INode<Options,E>[]|null;
//     uid: number;
//     effectFlag:number;// 副作用标志，用于标记需要更新的属性
//     bounds: BoundingRect;
//     localBounds: BoundingRect;
//     props:Options
//     set zIndex(zIndex:number);
//     get zIndex():number;
//     getDefaultProps():Options[];
//     getAllEffectFlag():number;
//     getChildEffectFlag(): number;
//     shouldRender(): boolean;
//     shouldInteraction(): boolean;
//     shouldAddToPendingRenderList(): boolean;
//     add(child: INode<Options,E>): void;
//     remove(child: INode<Options,E>): void;
//     removeSelf(): void;
//     onBeforeUpdate(delta: number): void;
//     onUpdate(delta: number): void;
//     onAfterUpdate(delta: number): void;
//     internalCalcBounds(): void;
//     calcBounds(): void
//     internalCalcLocalBounds(): void;
//     calcLocalBounds(): void;
//     getSortChildren(): INode<Options,E>[]|null;
//     traverse<T extends INode<Options,E>>(fn: (el: T) => void): void;
//     traverseSort<T extends INode<Options,E>>(fn: (el: T) => void): void;
// }
