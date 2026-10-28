const DEFAULT_FONT_SIZE = 12;
const DEFAULT_FONT_FAMILY = "sans-serif";
const DEFAULT_FONT = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
const OFFSET = 20;
const SCALE = 100;
const defaultWidthMapStr = `007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N`;
function getTextWidthMap(mapStr) {
  const map = {};
  if (typeof JSON === "undefined") {
    return map;
  }
  for (let i = 0; i < mapStr.length; i++) {
    const char = String.fromCharCode(i + 32);
    const size = (mapStr.charCodeAt(i) - OFFSET) / SCALE;
    map[char] = size;
  }
  return map;
}
const DEFAULT_TEXT_WIDTH_MAP = getTextWidthMap(defaultWidthMapStr);
const platformApi = {
  // Export methods
  createCanvas() {
    return typeof document !== "undefined" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ function() {
    let _ctx;
    let _cachedFont;
    return (text, font) => {
      if (!_ctx) {
        const canvas = platformApi.createCanvas();
        _ctx = canvas && canvas.getContext("2d");
      }
      if (_ctx) {
        if (_cachedFont !== font) {
          _cachedFont = _ctx.font = font || DEFAULT_FONT;
        }
        return _ctx.measureText(text);
      } else {
        text = text || "";
        font = font || DEFAULT_FONT;
        const res = /((?:\d+)?\.?\d*)px/.exec(font);
        const fontSize = res && +res[1] || DEFAULT_FONT_SIZE;
        let width = 0;
        if (font.indexOf("mono") >= 0) {
          width = fontSize * text.length;
        } else {
          for (let i = 0; i < text.length; i++) {
            const preCalcWidth = DEFAULT_TEXT_WIDTH_MAP[text[i]];
            width += preCalcWidth == null ? fontSize : preCalcWidth * fontSize;
          }
        }
        return { width };
      }
    };
  }(),
  loadImage(src, onload, onerror) {
    const image = new Image();
    image.onload = onload;
    image.onerror = onerror;
    image.src = src;
    return image;
  }
};
export {
  DEFAULT_FONT,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_WIDTH_MAP,
  platformApi
};
