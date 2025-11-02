import { TransformableProps } from '@dxyl/math/types/2d/math/transformable';
import { BoundingRect } from '@dxyl/math/types/2d/math/bounding_rect';
import { IApplication } from './Application';
import { ITransformable } from '../../../../../../../../../src/math/Transformable';
import { EventEmitter4 } from '../../../../../../../../../src/events';
import { InteractivePointerEvents } from '../events/InteractivePointerEvent';
export interface ElementProps extends TransformableProps {
    name?: string;
    draggable?: boolean;
    rectOver?: boolean;
    ignore?: boolean;
    silent?: boolean;
    visible?: boolean;
    zIndex?: number;
}
export type MergeEvents<A extends Record<string, any[]>, B extends Record<string, any[]>> = {
    [K in keyof A | keyof B]: K extends keyof A ? K extends keyof B ? A[K] | B[K] : A[K] : K extends keyof B ? B[K] : never;
};
export type ElementEvents = {
    'child:add': [
        {
            el: IElement<any>;
        }
    ];
    'child:remove': [
        {
            el: IElement<any>;
        }
    ];
} & InteractivePointerEvents;
export type ElementStateProps = {};
export interface IElement<Props extends ElementProps, E extends ElementEvents = ElementEvents> extends ITransformable, EventEmitter4<E> {
    id: number;
    name: string;
    type: string;
    props: Props;
    effectFlag: number;
    children: IElement<Props>[] | null;
    parent: IElement<Props> | null;
    owner: IApplication;
    defaultProps(): Partial<Props>[];
    shouldInteractive(): boolean;
    shouldAddToDisplayList(): boolean;
    shouldRender(): boolean;
    getObjectByName(name: string): IElement<Props> | void;
    calcLocalBounds(): BoundingRect;
    getLocalBounds(forceReCalc?: boolean): BoundingRect;
    getGlobalBounds(forceReCalc?: boolean): BoundingRect;
    insert(el: IElement<Props>, index?: number): boolean;
    add(el: IElement<Props>): boolean;
    remove(el: IElement<Props>): boolean;
    removeSelf(): boolean;
    traverse(fn: (el: IElement<Props>) => void): void;
    traverseSort(fn: (el: IElement<Props>) => void): void;
    getAllEffectFlag(): number;
    removeAllEffectFlag(flag: number): void;
    resetAllEffectFlag(): void;
    dispose(): void;
}
