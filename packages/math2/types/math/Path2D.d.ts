import { Matrix2DLike } from './Matrix2D';
/**
 * Path2D 记录到的单条命令。
 *
 * 每个成员对应一个 canvas Path2D 方法，参数原样保存，
 * 便于后续自行序列化、重放或转换成其他路径表示。
 */
export type Path2DCommand = {
    type: 'moveTo';
    x: number;
    y: number;
} | {
    type: 'lineTo';
    x: number;
    y: number;
} | {
    type: 'bezierCurveTo';
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    x: number;
    y: number;
} | {
    type: 'quadraticCurveTo';
    cpx: number;
    cpy: number;
    x: number;
    y: number;
} | {
    type: 'closePath';
} | {
    type: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
} | {
    type: 'roundRect';
    x: number;
    y: number;
    w: number;
    h: number;
    radii?: number | number[];
} | {
    type: 'arc';
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: boolean;
} | {
    type: 'arcTo';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    radius: number;
} | {
    type: 'ellipse';
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    rotation: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: boolean;
};
/**
 * 路径绘制接口，只包含 canvas 的路径构建方法。
 *
 * 供只关心「怎么画」而无需命令记录、SVG 解析等能力的调用方使用。
 */
export interface IPath2D {
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    closePath(): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
}
/**
 * 命令访问者：按命令类型提供回调，未提供的类型会被跳过。
 */
export type Path2DVisitor = {
    [K in Path2DCommand['type']]?: (cmd: Extract<Path2DCommand, {
        type: K;
    }>) => void;
};
/**
 * 可读路径接口：在 IPath2D 的构建能力之外，提供读取命令流的能力。
 *
 * Canvas 后端可以直接把命令重放给原生 Path2D，只需 IPath2D；
 * WebGL / WebGPU 等后端必须遍历命令自行三角化，因此绘制入口要求此接口。
 */
export interface IPath2DReadable extends IPath2D {
    /** 命令版本号，每次命令变化自增，供几何缓存判断是否需要重建 */
    readonly version: number;
    /** 以访问者模式按顺序回调每条命令 */
    visit(visitor: Path2DVisitor): void;
}
/**
 * canvas 2D Path2D 的命令记录器。
 *
 * 只负责按调用顺序保存命令，不做曲线离散、包围盒等几何处理：
 *
 * ```ts
 * const path = new Path2D()
 * path.moveTo(10, 10)
 * path.lineTo(100, 10)
 * path.arc(100, 60, 50, 0, Math.PI)
 * path.closePath()
 * path.commands.length // 4
 * ```
 */
export declare class Path2D implements IPath2DReadable, Iterable<Path2DCommand> {
    /** 按调用顺序记录的全部命令 */
    readonly commands: Path2DCommand[];
    /** 命令版本号，每次命令变化自增，供几何缓存判断是否需要重建 */
    private _version;
    /** 当前命令版本号 */
    get version(): number;
    /** 已记录的命令数量 */
    get size(): number;
    /** 追加一条命令并更新版本号 */
    addCommand(cmd: Path2DCommand): void;
    /** 清空已记录的命令 */
    clear(): void;
    /** 按记录顺序遍历命令，支持 for...of 与展开语法 */
    [Symbol.iterator](): IterableIterator<Path2DCommand>;
    /**
     * 以访问者模式按顺序回调每条命令。
     *
     * 只回调访问者中已声明的命令类型，便于做序列化、包围盒统计等遍历处理。
     */
    visit(visitor: Path2DVisitor): void;
    /**
     * 从 SVG path 的 `d` 字符串创建路径。
     *
     * 支持 M / L / H / V / C / S / Q / T / A / Z 全部命令（大小写均可），
     * 隐式重复参数与 moveto 后的隐式 lineto 都会按规范展开；
     * 其中椭圆弧 A 会换算为中心参数化后记录成 ellipse 命令，不转成贝塞尔。
     *
     * @param d SVG path 数据，如 `"M10 10 L20 20 C30 30 40 40 50 50Z"`
     * @returns 记录了解析结果的 Path2D
     */
    static fromSvg(d: string): Path2D;
    /**
     * 把另一个路径的命令经 transform 变换后追加到当前路径。
     *
     * 点与贝塞尔控制点按仿射矩阵精确变换；圆弧 / 椭圆的半径取矩阵的
     * 几何平均缩放量、角度随矩阵 X 轴旋转、行列式为负时翻转绘制方向，
     * 因此在旋转和等比缩放下精确，在非等比缩放或错切下为近似结果。
     *
     * @param path 源路径
     * @param transform 仿射矩阵 [a, b, c, d, tx, ty]，默认单位矩阵
     */
    addPath(path: Path2D, transform?: Matrix2DLike): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    closePath(): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
    /** 逐条变换并追加命令 */
    private appendCommands;
}
