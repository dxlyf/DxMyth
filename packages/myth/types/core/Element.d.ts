import { IElement, ElementProps, ElementEvents } from '../../../../../../../../src/types/core/Element';
import { Transformable, ITransformable } from '../../../../../../../../src/math/Transformable';
import { BoundingRect } from '../../../../../../../../src/math/BoundingRect';
import { EventEmitter4 } from '../../../../../../../../src/events';
import { IApplication } from '../../../../../../../../src/types/core/Application';
export interface Element<Props extends ElementProps, Events extends ElementEvents = ElementEvents> extends ITransformable, EventEmitter4<Events & ElementEvents> {
}
/**
 * Element 类是所有可视元素的基类，提供了基本的属性和方法、变换属性、事件处理等。
 */
export declare class Element<Props extends ElementProps, Events extends ElementEvents> extends Transformable<Props> implements IElement<Props, Events & ElementEvents> {
    id: number;
    name: string;
    props: Props;
    type: string;
    _effectFlag: number;
    children: IElement<Props>[] | null;
    parent: IElement<Props> | null;
    _localBounds: BoundingRect | null;
    _globalBounds: BoundingRect | null;
    _owner: IApplication;
    constructor(props?: Props);
    get visible(): boolean;
    set visible(v: boolean);
    get ignore(): boolean;
    set ignore(v: boolean);
    get zIndex(): number;
    set zIndex(v: number);
    get silent(): boolean;
    set silent(v: boolean);
    set effectFlag(value: number);
    get effectFlag(): number;
    get parentNode(): IElement<Props, ElementEvents>;
    get owner(): IApplication;
    set owner(v: IApplication);
    getObjectByName(name: string): IElement<Props, ElementEvents>;
    protected _setProp(target: any, key: string | string, value: any): boolean;
    protected _setProps(target: any, props: any): boolean;
    protected setProps(props: Partial<Props>): boolean;
    defaultProps(): Partial<Props>[];
    shouldInteractive(): boolean;
    shouldRender(): boolean;
    shouldAddToDisplayList(): boolean;
    insert(el: IElement<any>, index?: number): boolean;
    add(el: IElement<any>): boolean;
    remove(el: IElement<any>): boolean;
    removeSelf(): boolean;
    calcLocalBounds(): BoundingRect;
    getLocalBounds(force?: boolean): BoundingRect;
    getGlobalBounds(force?: boolean): BoundingRect;
    onTransformChange(): void;
    traverse(fn: (el: IElement<Props>) => void): void;
    traverseSort(fn: (el: IElement<Props>) => void): void;
    getAllEffectFlag(): number;
    removeAllEffectFlag(flag: number): void;
    resetAllEffectFlag(): void;
    updateEffect(): void;
    dispose(): void;
}
