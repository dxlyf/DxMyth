type TickValue = {
    value: number;
    x: number;
    y: number;
};
type TickLine = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
};
export declare class Timeline {
    direction: string;
    offset: number;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    width: number;
    height: number;
    tickSplitStep: number;
    tickMarkHeight: number;
    tickSplitHeight: number;
    tickValues: TickValue[];
    tickLines: TickLine[];
    constructor(options: Partial<Timeline>);
    get rulerUnit(): number;
    get scaleFactor(): number;
    setZoom(value: number): void;
    setOffset(offset: number): void;
    /**
     *
     * @param offset offset偏移量
     * @param rulerUnit 尺子刻度单位
     * @param scaleFactor 缩放因子
     * @returns
     */
    calcStartGraduationValue(offset: number, rulerUnit: number, scaleFactor: number): number;
    calcStartCoordinateValue(offset: number, rulerUnit: number, scaleFactor: number): number;
    getValue(offset: number): number;
    buildTimeline(): void;
    reset(): void;
    build(): void;
}
export {};
