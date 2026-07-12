import { PathCommand } from './PathCommand';
/**
 * PathCommandData - 以 PathCommand 列表形式存储的路径数据
 * API 与 Path2D / CanvasRenderingContext2D 路径方法一致，
 * 但不直接绘制，而是将每次调用记录为 PathCommand，便于序列化、回放和跨渲染器复用。
 */
export declare class PathCommandData {
    /** 命令列表 */
    readonly commands: PathCommand[];
    constructor(commands?: PathCommand[]);
    /** 命令数量 */
    get length(): number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
    beginPath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void;
    /** 追加一条命令 */
    push(command: PathCommand): void;
    /** 追加多条命令 */
    pushAll(commands: PathCommand[]): void;
    /** 清空所有命令 */
    clear(): void;
    /** 克隆当前路径数据 */
    clone(): PathCommandData;
    /**
     * 将所有命令应用到目标对象（Path2D / CanvasRenderingContext2D / PathBuilder 等）
     */
    applyTo(target: Path2D | CanvasRenderingContext2D): void;
    /** 遍历命令 */
    forEach(callback: (cmd: PathCommand, index: number) => void): void;
    /** 转换为 Path2D（DOM 原生） */
    toPath2D(): Path2D;
}
