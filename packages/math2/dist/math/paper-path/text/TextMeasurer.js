let measurer = null;
function setTextMeasurer(value) {
  measurer = value;
}
function getTextMeasurer() {
  if (!measurer) {
    const doc = globalThis.document;
    if (typeof doc !== "undefined") {
      measurer = createCanvasTextMeasurer();
    } else {
      throw new Error(
        "当前环境没有 document，也没有设置文本测量器。请先调用 setTextMeasurer() 提供一个实现。"
      );
    }
  }
  return measurer;
}
function createCanvasTextMeasurer() {
  const doc = globalThis.document;
  if (!doc) {
    throw new Error("当前环境没有 document，无法创建 canvas 文本测量器。");
  }
  const canvas = doc.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("无法创建用于测量文本的 canvas 上下文。");
  }
  return {
    getTextWidth(font, lines, letterSpacing, direction) {
      const prevFont = ctx.font, prevLetterSpacing = ctx.letterSpacing, prevDirection = ctx.direction, textDirection = direction || "ltr";
      ctx.font = font;
      try {
        if (letterSpacing !== void 0)
          ctx.letterSpacing = letterSpacing;
      } catch (e) {
      }
      try {
        if (prevDirection !== textDirection)
          ctx.direction = textDirection;
      } catch (e) {
      }
      let width = 0;
      for (let i = 0; i < lines.length; i++) {
        width = Math.max(width, ctx.measureText(lines[i]).width);
      }
      ctx.font = prevFont;
      try {
        ctx.letterSpacing = prevLetterSpacing;
      } catch (e) {
      }
      try {
        if (prevDirection !== textDirection)
          ctx.direction = prevDirection;
      } catch (e) {
      }
      return width;
    },
    getFontMetrics(font) {
      const prevFont = ctx.font;
      ctx.font = font;
      const measured = ctx.measureText("H");
      let ascent = measured.fontBoundingBoxAscent, descent = measured.fontBoundingBoxDescent;
      if (ascent === void 0) {
        ascent = measured.emHeightAscent;
        descent = measured.emHeightDescent;
      }
      ctx.font = prevFont;
      return ascent !== void 0 ? { ascent, descent } : null;
    }
  };
}
export {
  createCanvasTextMeasurer,
  getTextMeasurer,
  setTextMeasurer
};
