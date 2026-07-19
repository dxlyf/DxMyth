export type RulerDirection = 'horizontal' | 'vertical'

export interface RulerTick {
    /** 标尺上的屏幕像素位置 */
    position: number
    /** 刻度线长度类型 */
    type: 'short' | 'long'
}

export interface RulerLabel {
    /** 标尺上的屏幕像素位置 */
    position: number
    /** 世界坐标值 */
    value: number
}

export type RulerOptions = {
    direction?: RulerDirection
    /** 标尺起始位置对应的世界坐标值 */
    offset?: number
    /** 缩放比例 */
    zoom?: number
}

/**
 * 取最接近的"好看"步长值（1, 2, 5, 10, 20, 50, 100...）
 */
function niceStep(approx: number): number {
    const log = Math.floor(Math.log10(approx))
    const pow10 = Math.pow(10, log)
    const factor = approx / pow10
    let nice: number
    if (factor <= 1.5) nice = 1
    else if (factor <= 3.5) nice = 2
    else if (factor <= 7.5) nice = 5
    else nice = 10
    return nice * pow10
}

export class Ruler {
    direction: RulerDirection = 'horizontal'
    offset:number
    scaleFactor:number
    constructor(direction:RulerDirection='horizontal') {
        this.direction=direction
    }
    setDirection(direction: RulerDirection): this {
        this.direction = direction
        return this
    }

    calcStartGraduationValue(offset:number, rulerUnit:number, scaleFactor:number) {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor)
        return Math.ceil(offset / rulerUnitScale) * -rulerUnit
    }
    calcStartCoordinateValue(offset:number, rulerUnit:number, scaleFactor:number) {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor)
        const remainder = offset % rulerUnitScale
        return remainder - Math.ceil(remainder / rulerUnitScale) * rulerUnitScale
    }
    getScaleRulerUnit(scale:number) {
        const zoom = Math.round(scale * 100)
        if (zoom >= 400) {
            return 10;
        }
        if (zoom >= 200) {
            return 20;
        }
        if (zoom >= 100) {
            return 50;
        }
        if (zoom >= 50) {
            return 100;
        }
        if (zoom > 25) {
            return 200;
        }
        let ratio = 400;
        if (zoom >= 15 && zoom <= 20) {
            ratio = 500;
        } else if (zoom < 15) {
            ratio = 600;
        }
        return Math.round((Math.round(ratio / zoom) * zoom) / 10) * 10;
    }
    
    /**
     * 生成长度为 screenLength 像素的标尺数据。
     * 可通过 opts 临时覆盖 offset/zoom，不改变实例属性。
     * @param screenLength 标尺在屏幕上的像素长度
     * @param opts 临时覆盖 offset / zoom
     */
    generate(screenLength: number, opts: { offset: number; zoom: number,tickSpacingStep?:number }): { ticks: RulerTick[]; labels: RulerLabel[] } {
        const offset = opts.offset
        const scaleFactor = opts.zoom
        const tickSpacingStep=opts.tickSpacingStep??10
        if (screenLength <= 0 || scaleFactor <= 0) {
            return { ticks: [], labels: [] }
        }
        this.offset=offset
        this.scaleFactor=scaleFactor

        // 计算刻度步长：约 10px 为小刻度间距
        const rulerUnit=this.getScaleRulerUnit(scaleFactor)
        const rulerScalerUnit = Math.round(rulerUnit * scaleFactor)
        const tickSpacing = rulerScalerUnit / tickSpacingStep;
        const majorTickSpacingStep = Math.ceil(screenLength / rulerScalerUnit)

        let startPosition = this.calcStartCoordinateValue(offset, rulerUnit, scaleFactor);
        let value = this.calcStartGraduationValue(offset, rulerUnit, scaleFactor);

        const ticks: RulerTick[] = []
        const labels: RulerLabel[] = []

         for (let i = 0; i <= majorTickSpacingStep; i++) {
            labels.push({
                value:value,
                position:startPosition
            })
            for (let k = 0; k < tickSpacingStep; k++) {
                ticks.push({
                    type:k===0?'long':'short',
                    position:startPosition
                })
                startPosition += tickSpacing
            }
            value += rulerUnit
        }

        return { ticks, labels }
    }
    // /**
    //  * 生成长度为 screenLength 像素的标尺数据。
    //  * 可通过 opts 临时覆盖 offset/zoom，不改变实例属性。
    //  * @param screenLength 标尺在屏幕上的像素长度
    //  * @param opts 临时覆盖 offset / zoom
    //  */
    // generate(screenLength: number, opts?: { offset?: number; zoom?: number }): { ticks: RulerTick[]; labels: RulerLabel[] } {
    //     const offset = opts?.offset ?? this.offset
    //     const zoom = opts?.zoom ?? this.zoom
    //     if (screenLength <= 0 || zoom <= 0) {
    //         return { ticks: [], labels: [] }
    //     }

    //     // 可见世界坐标范围
    //     const worldStart = offset
    //     const worldEnd = offset + screenLength / zoom

    //     // 计算刻度步长：约 10px 为小刻度间距
    //     const minorStep = niceStep(10 / zoom)
    //     const majorDivisions = 5
    //     const majorStep = minorStep * majorDivisions

    //     // 对齐到步长的整数倍
    //     const firstMinor = Math.ceil(worldStart / minorStep) * minorStep
    //     const firstMajor = Math.ceil(worldStart / majorStep) * majorStep

    //     const ticks: RulerTick[] = []
    //     const labels: RulerLabel[] = []

    //     const toScreen = (world: number) => (world - offset) * zoom

    //     // 生成小刻度
    //     for (let w = firstMinor; w <= worldEnd; w += minorStep) {
    //         ticks.push({
    //             position: toScreen(w),
    //             type: 'short',
    //         })
    //     }

    //     // 生成长刻度和标签
    //     for (let w = firstMajor; w <= worldEnd; w += majorStep) {
    //         ticks.push({
    //             position: toScreen(w),
    //             type: 'long',
    //         })
    //         labels.push({
    //             position: toScreen(w),
    //             value: Math.round(w),
    //         })
    //     }

    //     // // 按位置排序（短刻度在前、长刻度在后，以便渲染时长刻度覆盖短刻度）
    //     // ticks.sort((a, b) => {
    //     //     if (a.type !== b.type) return a.type === 'long' ? 1 : -1
    //     //     return a.position - b.position
    //     // })

    //     return { ticks, labels }
    // }

    /**
     * 根据标尺上的屏幕像素位置，返回对应的世界坐标值
     */
    getValue(position: number): number {
        return Math.round(position / this.scaleFactor + this.offset)
    }
}
