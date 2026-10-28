class TimelineControl {
  scaleUnits = [];
  direction = "Horizontal";
  offset = 0;
  zoom = 100;
  minZoom = 10;
  maxZoom = 1e3;
  width = typeof window !== "undefined" ? window.innerWidth : 1e3;
  height = 30;
  /** 一个大刻度内的小刻度数量 */
  tickSplitStep = 10;
  /** 大刻度线高度 */
  tickMarkHeight = 10;
  /** 小刻度线高度 */
  tickSplitHeight = 5;
  tickValues = [];
  tickLines = [];
  currentScaleUnit = null;
  constructor(options) {
    if (options) {
      if (options.scaleUnits) this.scaleUnits = options.scaleUnits;
      if (options.direction) this.direction = options.direction;
      if (options.offset !== void 0) this.offset = options.offset;
      if (options.zoom !== void 0) this.zoom = options.zoom;
      if (options.minZoom !== void 0) this.minZoom = options.minZoom;
      if (options.maxZoom !== void 0) this.maxZoom = options.maxZoom;
      if (options.width !== void 0) this.width = options.width;
      if (options.height !== void 0) this.height = options.height;
      if (options.tickSplitStep !== void 0) this.tickSplitStep = options.tickSplitStep;
      if (options.tickMarkHeight !== void 0) this.tickMarkHeight = options.tickMarkHeight;
      if (options.tickSplitHeight !== void 0) this.tickSplitHeight = options.tickSplitHeight;
    }
  }
  get rulerUnit() {
    return this.currentScaleUnit?.unit ?? 100;
  }
  get scaleFactor() {
    return this.zoom / 100;
  }
  setZoom(value) {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value * 100));
    this.currentScaleUnit = this.scaleUnits.find((d) => this.zoom <= d.zoom) ?? null;
  }
  setOffset(offset) {
    this.offset = offset;
  }
  /** 将屏幕像素偏移转换为世界坐标值 */
  getValue(offset) {
    return (offset - this.offset) / this.scaleFactor;
  }
  /** 计算第一个大刻度的世界坐标值 */
  calcStartGraduationValue(offset, rulerUnit, scaleFactor) {
    const rulerUnitScale = Math.round(rulerUnit * scaleFactor);
    return Math.ceil(offset / rulerUnitScale) * -rulerUnit;
  }
  /** 计算第一个刻度的起始屏幕坐标 */
  calcStartCoordinateValue(offset, rulerUnit, scaleFactor) {
    const rulerUnitScale = Math.round(rulerUnit * scaleFactor);
    const remainder = offset % rulerUnitScale;
    return remainder - Math.ceil(remainder / rulerUnitScale) * rulerUnitScale;
  }
  build() {
    this.buildHorizontalTimeline();
  }
  buildHorizontalTimeline() {
    this.tickLines.length = 0;
    this.tickValues.length = 0;
    const { offset, rulerUnit, tickSplitStep, scaleFactor, width, height } = this;
    const scaleRulerUnit = rulerUnit * scaleFactor;
    const splitCount = Math.ceil(width / scaleRulerUnit);
    const step = scaleRulerUnit / tickSplitStep;
    let start = this.calcStartCoordinateValue(offset, rulerUnit, scaleFactor);
    let startGraduatedValue = this.calcStartGraduationValue(offset, rulerUnit, scaleFactor);
    for (let i = 0; i <= splitCount; i++) {
      for (let k = 0; k < tickSplitStep; k++) {
        const isSplitMark = k === 0;
        const x0 = start;
        const x1 = start;
        const y0 = height;
        const y1 = height - (isSplitMark ? this.tickMarkHeight : this.tickSplitHeight);
        this.tickLines.push({ x0, y0, x1, y1 });
        if (isSplitMark) {
          let currentValue = Math.round(startGraduatedValue);
          if (this.currentScaleUnit?.onValue) {
            currentValue = this.currentScaleUnit.onValue(
              currentValue,
              scaleFactor,
              this.currentScaleUnit
            );
          }
          this.tickValues.push({
            value: currentValue,
            x: x0,
            y: y1
          });
        }
        start += step;
      }
      startGraduatedValue += rulerUnit;
    }
  }
}
export {
  TimelineControl
};
