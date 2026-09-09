import { Transform, TransformProps, TransformEvents } from '../math/Transform';
import { PointerEventsMaps } from '../events/PointerEventSystem';
import { BoundingRect } from '../math/BoundingRect';
export type ElementEvents = TransformEvents & PointerEventsMaps & {
    'add:child': [{
        target: Element;
        parent: Element;
    }];
    'remove:child': [{
        target: Element;
        parent: Element;
    }];
    'prop:change': [{
        target: Element;
        name: string;
        value: any;
        prev: any;
    }];
    'update': [instance: Element];
    'dispose': [instance: Element];
};
export type ElementProps = TransformProps & {
    name?: string;
    visible?: boolean;
    ignore?: boolean;
    zIndex?: number;
    pointerEvents?: 'auto' | 'fill' | 'stroke' | 'all' | 'none';
    cursor?: string;
};
export declare const ELEMENT_DIRTY_FLAGS: {
    NONE: number;
    TRANSFORM: number;
    LOCAL_BOUNDS: number;
    CHILDREN: number;
    LAYER_Z_INDEX: number;
    SHAPE: number;
    STYLE: number;
    PROPS: number;
};
export declare abstract class Element<Props extends ElementProps = ElementProps, Events extends TransformEvents = ElementEvents, Owner extends any = any> extends Transform<Events> {
    uid: number;
    name: string;
    owner: Owner | null;
    props: Props;
    flags: number;
    /** 子树中累积的标记（归并自所有子节点） */
    subtreeFlags: number;
    _localBounds: BoundingRect;
    _worldBounds: BoundingRect;
    parent: Element<Props> | null;
    children: Element<Props>[];
    constructor(props?: Partial<Props>);
    getDefaultProps(): Partial<Props>[];
    setProp<K extends keyof Props>(name: K, value: Props[K]): void;
    getProp<K extends keyof Props>(name: K): Props[K];
    set zIndex(value: number);
    get zIndex(): number;
    set visible(value: boolean);
    get visible(): boolean;
    set ignore(value: boolean);
    get ignore(): boolean;
    onTransformChange(): void;
    onAttachParent(): void;
    onDetachParent(): void;
    onAddChild(child: Element): void;
    onRemoveChild(child: Element): void;
    addChild(child: Element<Props>): void;
    addChildAt(child: Element<Props>, index: number): void;
    removeChild(child: Element<Props>): void;
    abstract calcLocalBounds(out: BoundingRect): void;
    get localBounds(): BoundingRect;
    get worldBounds(): BoundingRect;
    updateLocalBounds(forceUpdate?: boolean): void;
    updateWorldBounds(): void;
    updateBefore(): void;
    update(): void;
    updateAfter(): void;
    traverse(callback: ((element: Element) => boolean | void)): boolean;
    dispose(): void;
}
