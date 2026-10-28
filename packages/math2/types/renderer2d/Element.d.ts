import { Transform, TransformProps, TransformEvents } from '../math/Transform';
import { BoundingRect } from '../math/BoundingRect';
import { PointerEvent as ScenePointerEvent } from '../events/PointerEventSystem';
import { Group } from './Group';
export type PointerEvents = 'auto' | 'fill' | 'stroke' | 'none';
export type ElementProps = TransformProps & {
    ignore: boolean;
    visible: boolean;
    pointerEvents: PointerEvents;
    zIndex: number;
};
/**
 * 元素可监听的交互事件。
 *
 * 鼠标与触摸在事件系统中统一以 pointer 语义派发（mouse 输入模式同样会映射成
 * pointerdown / pointermove / pointerup），因此这里不再单独声明 mousedown 系列。
 */
export type ElementPointerEvents = {
    pointerdown: [event: ScenePointerEvent];
    pointermove: [event: ScenePointerEvent];
    pointerup: [event: ScenePointerEvent];
    pointercancel: [event: ScenePointerEvent];
    pointerover: [event: ScenePointerEvent];
    pointerout: [event: ScenePointerEvent];
    pointerenter: [event: ScenePointerEvent];
    pointerleave: [event: ScenePointerEvent];
    click: [event: ScenePointerEvent];
    dblclick: [event: ScenePointerEvent];
    wheel: [event: ScenePointerEvent];
    dragstart: [event: ScenePointerEvent];
    drag: [event: ScenePointerEvent];
    dragend: [event: ScenePointerEvent];
    dragenter: [event: ScenePointerEvent];
    dragleave: [event: ScenePointerEvent];
    dragover: [event: ScenePointerEvent];
    drop: [event: ScenePointerEvent];
};
export type ElementEvents = {
    'prop:change': [options: {
        prop: string | (string | number)[];
        value: any;
        oldValue: any;
    }];
    '*': [event: string, ...args: any[]];
    dispose: [element: Element];
} & ElementPointerEvents & TransformEvents;
export declare const enum ElementFlag {
    NONE = 0,
    /** 局部变换矩阵变化 */
    TRANSFORM = 1,
    /** 局部包围盒需要重算 */
    LOCAL_BOUNDS = 2,
    /** 绘制包围盒需要重算（描边/阴影等效范围） */
    PAINT_BOUNDS = 4,
    /** 子节点结构变化（增删/排序） */
    CHILDREN = 8,
    /** 视觉样式变化（颜色/透明度等），需要重绘 */
    STYLE = 16,
    /** 布局变化（几何/子节点），需要重排 */
    LAYOUT = 32,
    ALL = 63
}
export declare class Element<Props extends ElementProps = ElementProps, Events extends ElementEvents = ElementEvents> extends Transform<Events> {
    type: string;
    /** 元素实例唯一标识，供缓存/去重等场景使用 */
    readonly uid: number;
    isGroup: boolean;
    props: Props;
    data: any;
    flags: ElementFlag;
    subtreeFlags: ElementFlag;
    parent: Group | null;
    private _localBounds;
    /** 局部包围盒版本，重算时自增；世界盒据此判断是否需要重算 */
    private _localBoundsVersion;
    private _worldBounds;
    private _worldBoundsVersion;
    private _worldBoundsLocalVersion;
    private _paintBounds;
    constructor(props?: Partial<Props>);
    get visible(): boolean;
    set visible(value: boolean);
    get ignore(): boolean;
    set ignore(value: boolean);
    get pointerEvents(): PointerEvents;
    set pointerEvents(value: PointerEvents);
    get zIndex(): number;
    set zIndex(value: number);
    onTransformChange(): void;
    private getSelfDefaultProps;
    getDefaultProps(): Partial<Props>;
    getProps(): Props;
    setProp<K extends Extract<keyof Props, string>>(prop: K, value: Props[K]): void;
    getPathValue(path: (string | number)[], defaultValue?: any): any;
    setPathValue(path: (string | number)[], value: any): void;
    /**
     * 标记脏位：自动解析依赖并冒泡到祖先。
     *
     * 容器的缓存包围盒由整棵子树（含子节点局部矩阵）推导，所以 LOCAL_BOUNDS 必须
     * 直接落到祖先自身的 flags；其余脏位只归并到 subtreeFlags，保持惰性。
     * 世界包围盒不占脏位，由「世界矩阵版本 + 局部盒版本」派生判断。
     */
    markFlag(flag: ElementFlag): void;
    /** 清除自身指定标记 */
    clearFlags(flag: ElementFlag): void;
    /** 自身是否包含指定标记 */
    hasFlag(flag: ElementFlag): boolean;
    /** 自身或子树是否包含指定标记 */
    hasSubtreeFlag(flag: ElementFlag): boolean;
    /** 清除子树归并标记（由场景在重排/重绘后调用） */
    clearSubtreeFlags(flag?: ElementFlag): void;
    /** 从父节点移除自身 */
    remove(): this;
    /** 向上遍历祖先（含自身） */
    traverseAncestor(cb: (node: AnyElement) => boolean | void): boolean;
    getLocalBounds(): BoundingRect;
    getWorldBounds(): BoundingRect;
    getPaintBounds(): BoundingRect;
    /**
     * 判断世界坐标点是否落在图元内，供命中测试使用。
     *
     * 入参统一是世界坐标，各图元内部自行用 worldMatrixInvert 换算到自身局部坐标，
     * 因此容器可以直接把同一个点透传给子节点递归判断。
     *
     * 基类没有几何形状，始终返回 false；具体图元按 pointerEvents 的
     * auto / fill / stroke 语义覆写此方法。
     *
     * @param x 世界坐标 X
     * @param y 世界坐标 Y
     */
    hitTest(x: number, y: number): boolean;
    calcBounds(out: BoundingRect): void;
    calcPaintBounds(out: BoundingRect): void;
    /**
     * 触发事件，并额外向通配监听器 `'*'` 派发。
     *
     * 事件表由子类泛型决定，基类无法静态约束事件名与参数，
     * 因此这里放宽签名；监听侧 `on` 仍保留完整类型检查。
     */
    emit(event: string, ...args: any[]): boolean;
    dispose(): void;
}
/** 任意 Props / 事件表的元素类型，用于父子引用与遍历等不关心具体泛型的场景 */
export type AnyElement = Element<any, any>;
