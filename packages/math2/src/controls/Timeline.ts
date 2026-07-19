 interface ScaleUnit {
    /** 缩放阈值，当前 zoom <= 此值时使用该单位 */
    zoom: number
    /** 刻度单位值 */
    unit: number
    /** 可选的值格式化回调 */
    onValue?: (value: number, scaleFactor: number, unit: ScaleUnit) => number
}

 interface TickLine {
    x0: number
    y0: number
    x1: number
    y1: number
}

 interface TickValue {
    value: number
    x: number
    y: number
}

 type TimelineDirection = 'Horizontal' | 'Vertical'

 type TimelineOptions = {
    scaleUnits?: ScaleUnit[]
    direction?: TimelineDirection
    offset?: number
    zoom?: number
    minZoom?: number
    maxZoom?: number
    width?: number
    height?: number
    tickSplitStep?: number
    tickMarkHeight?: number
    tickSplitHeight?: number
}

export class TimelineControl {
    scaleUnits: ScaleUnit[] = []
    direction: TimelineDirection = 'Horizontal'
    offset: number = 0
    zoom: number = 100
    minZoom: number = 10
    maxZoom: number = 1000
    width: number = typeof window !== 'undefined' ? window.innerWidth : 1000
    height: number = 30
    /** 一个大刻度内的小刻度数量 */
    tickSplitStep: number = 10
    /** 大刻度线高度 */
    tickMarkHeight: number = 10
    /** 小刻度线高度 */
    tickSplitHeight: number = 5

    tickValues: TickValue[] = []
    tickLines: TickLine[] = []

    private currentScaleUnit: ScaleUnit | null = null

    constructor(options?: TimelineOptions) {
        if (options) {
            if (options.scaleUnits) this.scaleUnits = options.scaleUnits
            if (options.direction) this.direction = options.direction
            if (options.offset !== undefined) this.offset = options.offset
            if (options.zoom !== undefined) this.zoom = options.zoom
            if (options.minZoom !== undefined) this.minZoom = options.minZoom
            if (options.maxZoom !== undefined) this.maxZoom = options.maxZoom
            if (options.width !== undefined) this.width = options.width
            if (options.height !== undefined) this.height = options.height
            if (options.tickSplitStep !== undefined) this.tickSplitStep = options.tickSplitStep
            if (options.tickMarkHeight !== undefined) this.tickMarkHeight = options.tickMarkHeight
            if (options.tickSplitHeight !== undefined) this.tickSplitHeight = options.tickSplitHeight
        }
    }

    get rulerUnit(): number {
        return this.currentScaleUnit?.unit ?? 100
    }

    get scaleFactor(): number {
        return this.zoom / 100
    }

    setZoom(value: number): void {
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value * 100))
        this.currentScaleUnit = this.scaleUnits.find(d => this.zoom <= d.zoom) ?? null
    }

    setOffset(offset: number): void {
        this.offset = offset
    }

    /** 将屏幕像素偏移转换为世界坐标值 */
    getValue(offset: number): number {
        return (offset - this.offset) / this.scaleFactor
    }

    /** 计算第一个大刻度的世界坐标值 */
    private calcStartGraduationValue(offset: number, rulerUnit: number, scaleFactor: number): number {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor)
        return Math.ceil(offset / rulerUnitScale) * -rulerUnit
    }

    /** 计算第一个刻度的起始屏幕坐标 */
    private calcStartCoordinateValue(offset: number, rulerUnit: number, scaleFactor: number): number {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor)
        const remainder = offset % rulerUnitScale
        // return remainder > 0 ? remainder - rulerUnitScale : remainder
        return remainder - Math.ceil(remainder / rulerUnitScale) * rulerUnitScale
    }

    build(): void {
        this.buildHorizontalTimeline()
    }

    private buildHorizontalTimeline(): void {
        this.tickLines.length = 0
        this.tickValues.length = 0

        const { offset, rulerUnit, tickSplitStep, scaleFactor, width, height } = this
        const scaleRulerUnit = rulerUnit * scaleFactor
        const splitCount = Math.ceil(width / scaleRulerUnit)
        const step = scaleRulerUnit / tickSplitStep

        let start = this.calcStartCoordinateValue(offset, rulerUnit, scaleFactor)
        let startGraduatedValue = this.calcStartGraduationValue(offset, rulerUnit, scaleFactor)

        for (let i = 0; i <= splitCount; i++) {
            for (let k = 0; k < tickSplitStep; k++) {
                const isSplitMark = k === 0
                const x0 = start
                const x1 = start
                const y0 = height
                const y1 = height - (isSplitMark ? this.tickMarkHeight : this.tickSplitHeight)

                this.tickLines.push({ x0, y0, x1, y1 })

                if (isSplitMark) {
                    let currentValue = Math.round(startGraduatedValue)
                    if (this.currentScaleUnit?.onValue) {
                        currentValue = this.currentScaleUnit.onValue(
                            currentValue,
                            scaleFactor,
                            this.currentScaleUnit,
                        )
                    }
                    this.tickValues.push({
                        value: currentValue,
                        x: x0,
                        y: y1,
                    })
                }
                start += step
            }
            startGraduatedValue += rulerUnit
        }
    }
}
