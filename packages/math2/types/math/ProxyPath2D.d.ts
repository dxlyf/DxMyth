/**
 * ProxyPath2D - Path2D 代理类
 *
 * 与浏览器原生 Path2D 接口保持一致，同时将所有绘制命令编码为扁平数字数组
 * （而非 PathCommand 对象），大幅降低内存开销。
 *
 * 扁平编码格式（每个命令可变长）：
 *   [cmdType, arg1, arg2, ..., cmdType, arg1, arg2, ...]
 *
 * 各命令的 arg 数量固定，无需存储长度：
 *   BeginPath(10):     [10]
 *   ClosePath(0):      [0]
 *   MoveTo(1):         [1, x, y]
 *   LineTo(2):         [2, x, y]
 *   QuadCurveTo(3):    [3, cpx, cpy, x, y]
 *   BezierCurveTo(4):  [4, cp1x, cp1y, cp2x, cp2y, x, y]
 *   Arc(5):            [5, x, y, r, startA, endA, ccw(0|1)]
 *   ArcTo(6):          [6, x1, y1, x2, y2, r]
 *   Ellipse(7):        [7, x, y, rx, ry, rot, startA, endA, ccw(0|1)]
 *   Rect(8):           [8, x, y, w, h]
 *   RoundRect(9):      [9, x, y, w, h, r]  (仅单半径，复杂 radii 不常用)
 *
 * 内存对比（1000 条 MoveTo）：
 *   PathCommand 对象: ~80KB（1000 对象 + 1000 args 数组 + 字符串属性）
 *   扁平数组:        ~24KB（2000 个 number，含 1000 个 cmd 头 = 16000 bytes + 数组开销）
 */
/** 命令类型索引（数字编码，避免字符串比较） */
declare const enum Cmd {
    ClosePath = 0,
    MoveTo = 1,
    LineTo = 2,
    QuadraticCurveTo = 3,
    BezierCurveTo = 4,
    Arc = 5,
    ArcTo = 6,
    Ellipse = 7,
    Rect = 8,
    RoundRect = 9,
    BeginPath = 10
}
type DOMPointInit = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
interface DOMMatrix2DInit {
    a?: number;
    b?: number;
    c?: number;
    d?: number;
    e?: number;
    f?: number;
    m11?: number;
    m12?: number;
    m21?: number;
    m22?: number;
    m41?: number;
    m42?: number;
}
export interface IProxyPath2D {
    addPath(path: IProxyPath2D, transform?: DOMMatrix2DInit): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
}
export declare class ProxyPath2D implements IProxyPath2D {
    /** 底层原生 Path2D（可能为空） */
    ctx?: globalThis.Path2D;
    /** 扁平编码的命令数组 */
    commandData: any[];
    dirty: boolean;
    constructor(proxy?: globalThis.Path2D);
    addPath(path: ProxyPath2D, transform?: DOMMatrix2DInit): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    closePath(): void;
    rect(x: number, y: number, w: number, h: number): void;
    /** roundRect: 复杂 radii 降级为 PathCommand 存储（罕见） */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    /** 向 commandData 末尾追加一条命令 */
    private _push;
    /** 直接拼接另一个扁平数组 */
    private _appendRaw;
    clear(): void;
    isEmpty(): boolean;
    /** 克隆（深拷贝扁平数组） */
    clone(): ProxyPath2D;
    /** 将命令回放到目标 Path2D / CanvasRenderingContext2D */
    replayTo(target: globalThis.Path2D | CanvasRenderingContext2D): void;
    /** 按命令类型遍历（回调接收 cmd 类型和 arg 数组引用） */
    forEach(cb: (cmd: Cmd, args: number[], offset: number) => void): void;
    /** 转换为原生 Path2D */
    applyContext(ctx: globalThis.Path2D | CanvasRenderingContext2D): void;
}
export {};
