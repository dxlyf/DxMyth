export type RulerDirection = 'horizontal' | 'vertical';
export interface RulerTick {
    /** 标尺上的屏幕像素位置 */
    position: number;
    /** 刻度线长度类型 */
    type: 'short' | 'long';
}
export interface RulerLabel {
    /** 标尺上的屏幕像素位置 */
    position: number;
    /** 世界坐标值 */
    value: number;
}
export type RulerOptions = {
    direction?: RulerDirection;
    /** 标尺起始位置对应的世界坐标值 */
    offset?: number;
    /** 缩放比例 */
    zoom?: number;
};
export declare class Ruler {
    direction: RulerDirection;
    offset: number;
    scaleFactor: number;
    constructor(direction?: RulerDirection);
    setDirection(direction: RulerDirection): this;
    calcStartGraduationValue(offset: number, rulerUnit: number, scaleFactor: number): number;
    calcStartCoordinateValue(offset: number, rulerUnit: number, scaleFactor: number): number;
    getScaleRulerUnit(scale: number): number;
    /**
     * 生成长度为 screenLength 像素的标尺数据。
     * 可通过 opts 临时覆盖 offset/zoom，不改变实例属性。
     * @param screenLength 标尺在屏幕上的像素长度
     * @param opts 临时覆盖 offset / zoom
     */
    generate(screenLength: number, opts: {
        offset: number;
        zoom: number;
        tickSpacingStep?: number;
    }): {
        ticks: RulerTick[];
        labels: RulerLabel[];
    };
    /**
     * 根据标尺上的屏幕像素位置，返回对应的世界坐标值
     */
    getValue(position: number): number;
}
