type TickValue={
    value:number
    x:number
    y:number
}
type TickLine={
    x0:number
    y0:number
    x1:number
    y1:number
}
export class Timeline {
    direction = 'Horizontal'
    offset = 0 // 偏移量
    zoom = 100 // 当前缩放
    minZoom = 1 
    maxZoom = 10
    width =800 // 宽度
    height = 30 // 高度
    tickSplitStep = 10 // 刻度标记之间的个数
    tickMarkHeight = 10 // 刻度标记高度
    tickSplitHeight = 5 // 刻度分割线高度thickness
    tickValues:TickValue[] = [] // 刻度值 {value:number,x,y}
    tickLines:TickLine[] = [] // 刻度线 {x0,y0,x1,y1}
    constructor(options:Partial<Timeline>) {
        Object.assign(this, options || {})
    }
    get rulerUnit() {
        const zoom = this.zoom;
        if (zoom >= 400) {
            return 10
        }
        if (zoom >= 200) {
            return 20
        }
        if (zoom >= 100) {
            return 100
        }
        if (zoom >= 59) {
            return 100
        }
        if (zoom >= 25) {
            return 200
        }
        return Math.max(this.width, Math.floor(1000 / zoom))
    }
    get scaleFactor() {
        return Number(Number(this.zoom/100).toFixed(2));
    }
    setZoom(value:number) {
        this.zoom = value;
    }
    setOffset(offset:number) {
        this.offset = offset
    }
    // 计算起始刻度值
    /**
     * 
     * @param offset offset偏移量
     * @param rulerUnit 尺子刻度单位
     * @param scaleFactor 缩放因子
     * @returns 
     */
    calcStartGraduationValue(offset:number, rulerUnit:number, scaleFactor:number) {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor) 
        // 以rulerUnit为基准，计算出起始刻度值
        return Math.ceil(offset / rulerUnitScale) * -rulerUnit
    }
    // 计算起始坐标值
    calcStartCoordinateValue(offset:number, rulerUnit:number, scaleFactor:number) {
        const rulerUnitScale = Math.round(rulerUnit * scaleFactor)
        const remainder = offset % rulerUnitScale
        // 计算起始偏移在[-rulerUnitScale,rulerUnitScale]
        return remainder - Math.ceil(remainder / rulerUnitScale) * rulerUnitScale
    }
    getValue(offset:number) {
        return (offset - this.offset) / this.scaleFactor
    }
    buildTimeline() {
        const tickLines = this.tickLines
        const tickValues = this.tickValues
        let offset = this.offset, rulerUnit = this.rulerUnit, tickSplitStep = this.tickSplitStep;
        let scaleFactor = this.scaleFactor, scaleRulerUnit = rulerUnit * scaleFactor
        let width = this.width, height = this.height;
        // 假设宽度为width=1000,unit=100,spitCount=round(width/unit)
        const splitCount = Math.ceil(width / scaleRulerUnit);
        // 假设unit=100,tickSplitStep=10,那每次递进step=unit/tickSplitStep
        const step = scaleRulerUnit / tickSplitStep; // 每个小废度坐标的步进

        // 刻度起始坐标
        let start = this.calcStartCoordinateValue(offset, rulerUnit, scaleFactor), x0, y0, x1, y1;
        // 废度起始值
        let startGraduatedValue = this.calcStartGraduationValue(offset, rulerUnit, scaleFactor)
        // 大刻度
        for (let i = 0; i <= splitCount; i++) {
            // 小刻度
            for (let k = 0; k < tickSplitStep; k++) {
                const isSplitMark = k === 0
                x0 = start
                x1 = start
                y0 = height
                y1 = height - (isSplitMark ? this.tickMarkHeight : this.tickSplitHeight)
                tickLines.push({
                    x0,
                    y0,
                    x1,
                    y1
                })
                if (isSplitMark) {
                    // 添加刻度值
                    tickValues.push({
                        x: x0,
                        y: y1,
                        value:startGraduatedValue
                    })
                }
                start += step;
            }
            startGraduatedValue += rulerUnit;
        }
    }
    reset(){
        this.tickValues.length=0
        this.tickLines.length=0
    }
    build() {
        this.reset()
        this.buildTimeline()
    }
}