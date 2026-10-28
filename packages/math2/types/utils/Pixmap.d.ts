import { PathBuilder } from '../math/PathBuilder';
import { FillRule } from '../renderer2d/Paint';
/** RGBA 像素值，各分量 0~255（straight alpha，与 canvas ImageData 一致） */
export type RGBA = [number, number, number, number];
/**
 * 像素图（软件光栅化的目标缓冲）
 * RGBA8 存储，每像素 4 字节，行主序排列：
 * data[(y * width + x) * 4 + 0..3] = r, g, b, a
 */
export declare class Pixmap {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(width: number, height: number);
    /** 像素在缓冲中的起始下标 */
    protected index(x: number, y: number): number;
    /** 坐标是否落在图内 */
    contains(x: number, y: number): boolean;
    /** 直写像素（覆盖式，不做混合）；越界忽略，便于光栅化时免裁剪 */
    write(x: number, y: number, rgba: [number, number, number, number]): void;
    /** 读取像素；越界返回透明黑 */
    read(x: number, y: number): RGBA;
    /**
     * source-over 混合写入（straight alpha 合成）
     * outA = srcA + dstA * (1 - srcA)，颜色按双方 alpha 加权
     * 抗锯齿光栅化时先把 coverage 乘进 rgba[3] 再调用本方法
     */
    blend(x: number, y: number, rgba: RGBA): void;
    /** 整图填充（缺省清成透明黑） */
    clear(rgba?: RGBA): void;
    /** 矩形填充，自动裁剪到图内 */
    fillRect(x: number, y: number, width: number, height: number, rgba: RGBA): void;
    /**
     * 把当前像素数据放大后画到 canvas 上（便于观察像素），不改动 data
     * 起点为 margin，每个像素放大成 size×size 的格子；有颜色的像素填成该颜色，网格线为黑色
     */
    drawGrid(ctx: CanvasRenderingContext2D, size: number, margin: number): void;
    /** 转成 ImageData，可配合 2d canvas 的 putImageData 展示 */
    toImageData(): ImageData;
    /** 转成 canvas，便于预览光栅化结果 */
    toCanvas(): HTMLCanvasElement;
}
/**
 * 定点坐标的小数位数（子像素精度）
 *
 * 6 对应 26.6 定点格式（1/64 像素，与 FreeType 默认一致），
 * 8 对应 24.8 定点格式（1/256 像素，抗锯齿更细腻）。
 */
export type PixelBits = 6 | 8;
/**
 * 路径光栅化：参考 FreeType 灰度光栅化（ftgrays.c），分三步：
 * 1. 轮廓按定点数（1/64 或 1/256 像素）拆进格（cell），每格累计 cover 与 area；
 * 2. 逐行扫描格，把覆盖率（0~255）相同的连续像素合成水平区段（span）；
 * 3. 按 span 把覆盖率乘进颜色 alpha，做抗锯齿填充。
 * @param pixmap 输出目标，路径按原有坐标落在图上，超出图外的部分自动裁剪
 * @param path 待填充路径
 * @param color 填充色，alpha 会再乘以像素覆盖率
 * @param fillRule 填充规则：nonzero 按绕数非零判定，evenodd 按绕数奇偶判定，默认 nonzero
 * @param pixelBits 定点坐标小数位数：6 为 26.6（默认），8 为 24.8
 */
export declare function rasterization(pixmap: Pixmap, path: PathBuilder, color?: RGBA, fillRule?: FillRule, pixelBits?: PixelBits): Pixmap;
