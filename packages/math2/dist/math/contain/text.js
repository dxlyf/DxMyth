import { BoundingRect } from "../BoundingRect.js";
import LRU from "../LRU.js";
import { platformApi, DEFAULT_FONT } from "../platform.js";
function getWidth(text, font) {
  return measureWidth(ensureFontMeasureInfo(font), text);
}
function ensureFontMeasureInfo(font) {
  if (!_fontMeasureInfoCache) {
    _fontMeasureInfoCache = new LRU(100);
  }
  font = font || DEFAULT_FONT;
  let measureInfo = _fontMeasureInfoCache.get(font);
  if (!measureInfo) {
    measureInfo = {
      font,
      strWidthCache: new LRU(500),
      asciiWidthMap: null,
      // Init lazily for performance.
      asciiWidthMapTried: false,
      // FIXME
      // Other languages?
      // FIXME
      // Consider proportional font?
      stWideCharWidth: platformApi.measureText("国", font).width,
      asciiCharWidth: platformApi.measureText("a", font).width
    };
    _fontMeasureInfoCache.put(font, measureInfo);
  }
  return measureInfo;
}
let _fontMeasureInfoCache;
function tryCreateASCIIWidthMap(font) {
  if (_getASCIIWidthMapLongCount >= GET_ASCII_WIDTH_LONG_COUNT_MAX) {
    return;
  }
  font = font || DEFAULT_FONT;
  const asciiWidthMap = [];
  const start = +/* @__PURE__ */ new Date();
  for (let code = 0; code <= 127; code++) {
    asciiWidthMap[code] = platformApi.measureText(String.fromCharCode(code), font).width;
  }
  const cost = +/* @__PURE__ */ new Date() - start;
  if (cost > 16) {
    _getASCIIWidthMapLongCount = GET_ASCII_WIDTH_LONG_COUNT_MAX;
  } else if (cost > 2) {
    _getASCIIWidthMapLongCount++;
  }
  return asciiWidthMap;
}
let _getASCIIWidthMapLongCount = 0;
const GET_ASCII_WIDTH_LONG_COUNT_MAX = 5;
function measureCharWidth(fontMeasureInfo, charCode) {
  if (!fontMeasureInfo.asciiWidthMapTried) {
    fontMeasureInfo.asciiWidthMap = tryCreateASCIIWidthMap(fontMeasureInfo.font);
    fontMeasureInfo.asciiWidthMapTried = true;
  }
  return 0 <= charCode && charCode <= 127 ? fontMeasureInfo.asciiWidthMap != null ? fontMeasureInfo.asciiWidthMap[charCode] : fontMeasureInfo.asciiCharWidth : fontMeasureInfo.stWideCharWidth;
}
function measureWidth(fontMeasureInfo, text) {
  const strWidthCache = fontMeasureInfo.strWidthCache;
  let width = strWidthCache.get(text);
  if (width == null) {
    width = platformApi.measureText(text, fontMeasureInfo.font).width;
    strWidthCache.put(text, width);
  }
  return width;
}
function innerGetBoundingRect(text, font, textAlign, textBaseline) {
  const width = measureWidth(ensureFontMeasureInfo(font), text);
  const height = getLineHeight(font);
  const x = adjustTextX(0, width, textAlign);
  const y = adjustTextY(0, height, textBaseline);
  const rect = new BoundingRect(x, y, width, height);
  return rect;
}
function getBoundingRect(text, font, textAlign, textBaseline) {
  const textLines = ((text || "") + "").split("\n");
  const len = textLines.length;
  if (len === 1) {
    return innerGetBoundingRect(textLines[0], font, textAlign, textBaseline);
  } else {
    const uniondRect = new BoundingRect(0, 0, 0, 0);
    for (let i = 0; i < textLines.length; i++) {
      const rect = innerGetBoundingRect(textLines[i], font, textAlign, textBaseline);
      i === 0 ? uniondRect.copy(rect) : uniondRect.union(rect);
    }
    return uniondRect;
  }
}
function adjustTextX(x, width, textAlign, inverse) {
  if (textAlign === "right") {
    !inverse ? x -= width : x += width;
  } else if (textAlign === "center") {
    !inverse ? x -= width / 2 : x += width / 2;
  }
  return x;
}
function adjustTextY(y, height, verticalAlign, inverse) {
  if (verticalAlign === "middle") {
    !inverse ? y -= height / 2 : y += height / 2;
  } else if (verticalAlign === "bottom") {
    !inverse ? y -= height : y += height;
  }
  return y;
}
function getLineHeight(font) {
  return ensureFontMeasureInfo(font).stWideCharWidth;
}
function measureText(text, font) {
  return platformApi.measureText(text, font);
}
function parsePercent(value, maxValue) {
  if (typeof value === "string") {
    if (value.lastIndexOf("%") >= 0) {
      return parseFloat(value) / 100 * maxValue;
    }
    return parseFloat(value);
  }
  return value;
}
function calculateTextPosition(out, opts, rect) {
  const textPosition = opts.position || "inside";
  const distance = opts.distance != null ? opts.distance : 5;
  const height = rect.height;
  const width = rect.width;
  const halfHeight = height / 2;
  let x = rect.x;
  let y = rect.y;
  let textAlign = "left";
  let textVerticalAlign = "top";
  if (textPosition instanceof Array) {
    x += parsePercent(textPosition[0], rect.width);
    y += parsePercent(textPosition[1], rect.height);
    textAlign = null;
    textVerticalAlign = null;
  } else {
    switch (textPosition) {
      case "left":
        x -= distance;
        y += halfHeight;
        textAlign = "right";
        textVerticalAlign = "middle";
        break;
      case "right":
        x += distance + width;
        y += halfHeight;
        textVerticalAlign = "middle";
        break;
      case "top":
        x += width / 2;
        y -= distance;
        textAlign = "center";
        textVerticalAlign = "bottom";
        break;
      case "bottom":
        x += width / 2;
        y += height + distance;
        textAlign = "center";
        break;
      case "inside":
        x += width / 2;
        y += halfHeight;
        textAlign = "center";
        textVerticalAlign = "middle";
        break;
      case "insideLeft":
        x += distance;
        y += halfHeight;
        textVerticalAlign = "middle";
        break;
      case "insideRight":
        x += width - distance;
        y += halfHeight;
        textAlign = "right";
        textVerticalAlign = "middle";
        break;
      case "insideTop":
        x += width / 2;
        y += distance;
        textAlign = "center";
        break;
      case "insideBottom":
        x += width / 2;
        y += height - distance;
        textAlign = "center";
        textVerticalAlign = "bottom";
        break;
      case "insideTopLeft":
        x += distance;
        y += distance;
        break;
      case "insideTopRight":
        x += width - distance;
        y += distance;
        textAlign = "right";
        break;
      case "insideBottomLeft":
        x += distance;
        y += height - distance;
        textVerticalAlign = "bottom";
        break;
      case "insideBottomRight":
        x += width - distance;
        y += height - distance;
        textAlign = "right";
        textVerticalAlign = "bottom";
        break;
    }
  }
  out = out || {};
  out.x = x;
  out.y = y;
  out.align = textAlign;
  out.verticalAlign = textVerticalAlign;
  return out;
}
export {
  adjustTextX,
  adjustTextY,
  calculateTextPosition,
  ensureFontMeasureInfo,
  getBoundingRect,
  getLineHeight,
  getWidth,
  innerGetBoundingRect,
  measureCharWidth,
  measureText,
  measureWidth,
  parsePercent
};
