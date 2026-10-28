
import type { Matrix2D } from '../math/Matrix2D';
import type { Vector2, Vector2Like } from '../math/Vector2';
import type { ImageSource, Paint, PaintSource,FillRule, PaintColor } from './Paint';
import type { IPath2D, IPath2DReadable } from '../math/Path2D';
import { ColorValue } from 'src/math/Color';

export interface TextMeasurement {
  width: number;
  height: number;
  ascent: number;
  descent: number;
  lineHeight: number;
  lines: number;
}

export interface FrameOptions {
  /** Clear the canvas with this color/gradient. Omit to leave contents intact. */
  clear?: PaintSource | null;
  /** Reset the transform at the start of the frame (default true). */
  resetTransform?: boolean;
}

/**
 * Common 2D renderer surface. CanvasRenderer is the first implementation;
 * other backends (WebGL/WebGPU/SVG) can implement the same contract.
 */
export interface Renderer2D extends IPath2D {
  readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  /** Logical (CSS pixel) width. */
  readonly width: number;
  /** Logical (CSS pixel) height. */
  readonly height: number;
  readonly pixelRatio: number;
  /** 当前变换总矩阵（累积了 translate/rotate/scale/transform 的结果） */
  readonly currentTransform: Readonly<Matrix2D>;

  resize(width: number, height: number, pixelRatio?: number): this;
  /** Clear the full drawing buffer (ignores the current transform). */
  clear(color?: PaintColor | null): void;
  /** Clear a rectangle in the current coordinate system. */
  clearRect(x: number, y: number, width: number, height: number): void;

  save(): void;
  restore(): void;
  resetTransform(): void;
  setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
  /** Multiply the current transform by the given matrix (post-multiply). */
  transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
  getTransform(out?: Matrix2D): Matrix2D;
  translate(x: number, y: number): void;
  rotate(radians: number): void;
  scale(x: number, y?: number): void;

  /** 开始一条新路径，清空当前累积的路径命令 */
  beginPath(): void;
  /** 以给定路径作为裁剪区域（后端需能读取命令流，WebGL 才能真正生效） */
  clip(path: IPath2DReadable, fillRule?: FillRule): void;
  /** 以当前路径（beginPath 后累积的命令）作为裁剪区域 */
  clip(fillRule?: FillRule): void;

  drawImage(image: ImageSource, dx: number, dy: number, paint?: Paint): void;
  drawImage(image: ImageSource, dx: number, dy: number, dw: number, dh: number, paint?: Paint): void;
  drawImage(
    image: ImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    paint?: Paint,
  ): void;

  /** 绘制给定路径；WebGL 等后端需要通过 version + visit 读取命令流做几何缓存 */
  drawPath(path: IPath2DReadable, paint: Paint): void;
  drawRect(x: number, y: number, width: number, height: number, paint: Paint): void;
  drawRoundRect(x: number, y: number, width: number, height: number, radius: number|number[], paint: Paint): void;
  drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number, paint: Paint): void;
  drawEllipseArc(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterClockwise: boolean,
    paint: Paint,
  ): void;
  drawCircle(cx: number, cy: number, radius: number, paint: Paint): void;
  drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void;
  drawPolyline(points: Vector2Like[], paint: Paint, closed?: boolean): void;
  drawArc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterClockwise: boolean,
    paint: Paint,
  ): void;
  drawText(text: string, x: number, y: number, paint: Paint): void;
  measureText(text: string, paint: Paint): TextMeasurement;
  /** 立即提交当前累积的绘制批次（合批后端用于控制提交时机） */
  flush(): void;

  dispose(): void;
}
