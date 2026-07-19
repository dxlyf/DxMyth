interface ScaleUnit {
    /** 缩放阈值，当前 zoom <= 此值时使用该单位 */
    zoom: number;
    /** 刻度单位值 */
    unit: number;
    /** 可选的值格式化回调 */
    onValue?: (value: number, scaleFactor: number, unit: ScaleUnit) => number;
}
interface TickLine {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}
interface TickValue {
    value: number;
    x: number;
    y: number;
}
type TimelineDirection = 'Horizontal' | 'Vertical';
type TimelineOptions = {
    scaleUnits?: ScaleUnit[];
    direction?: TimelineDirection;
    offset?: number;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    width?: number;
    height?: number;
    tickSplitStep?: number;
    tickMarkHeight?: number;
    tickSplitHeight?: number;
};
export declare class TimelineControl {
    scaleUnits: ScaleUnit[];
    direction: TimelineDirection;
    offset: number;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    width: number;
    height: number;
    /** 一个大刻度内的小刻度数量 */
    tickSplitStep: number;
    /** 大刻度线高度 */
    tickMarkHeight: number;
    /** 小刻度线高度 */
    tickSplitHeight: number;
    tickValues: TickValue[];
    tickLines: TickLine[];
    private currentScaleUnit;
    constructor(options?: TimelineOptions);
    get rulerUnit(): number;
    get scaleFactor(): number;
    setZoom(value: number): void;
    setOffset(offset: number): void;
    /** 将屏幕像素偏移转换为世界坐标值 */
    getValue(offset: number): number;
    /** 计算第一个大刻度的世界坐标值 */
    private calcStartGraduationValue;
    /** 计算第一个刻度的起始屏幕坐标 */
    private calcStartCoordinateValue;
    build(): void;
    private buildHorizontalTimeline;
}
export {};
