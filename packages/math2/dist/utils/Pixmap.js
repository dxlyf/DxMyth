class Pixmap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
  data;
  /** 像素在缓冲中的起始下标 */
  index(x, y) {
    return y * this.width + x << 2;
  }
  /** 坐标是否落在图内 */
  contains(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  /** 直写像素（覆盖式，不做混合）；越界忽略，便于光栅化时免裁剪 */
  write(x, y, rgba) {
    if (!this.contains(x, y)) {
      return;
    }
    const i = this.index(x, y);
    this.data[i] = rgba[0];
    this.data[i + 1] = rgba[1];
    this.data[i + 2] = rgba[2];
    this.data[i + 3] = rgba[3];
  }
  /** 读取像素；越界返回透明黑 */
  read(x, y) {
    if (!this.contains(x, y)) {
      return [0, 0, 0, 0];
    }
    const i = this.index(x, y);
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
  }
  /**
   * source-over 混合写入（straight alpha 合成）
   * outA = srcA + dstA * (1 - srcA)，颜色按双方 alpha 加权
   * 抗锯齿光栅化时先把 coverage 乘进 rgba[3] 再调用本方法
   */
  blend(x, y, rgba) {
    if (!this.contains(x, y)) {
      return;
    }
    const srcA = rgba[3] / 255;
    if (srcA <= 0) {
      return;
    }
    if (srcA >= 1) {
      this.write(x, y, rgba);
      return;
    }
    const i = this.index(x, y);
    const dstA = this.data[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) {
      this.data[i] = this.data[i + 1] = this.data[i + 2] = this.data[i + 3] = 0;
      return;
    }
    for (let c = 0; c < 3; c++) {
      const src = rgba[c] / 255;
      const dst = this.data[i + c] / 255;
      this.data[i + c] = (src * srcA + dst * dstA * (1 - srcA)) / outA * 255;
    }
    this.data[i + 3] = outA * 255;
  }
  /** 整图填充（缺省清成透明黑） */
  clear(rgba = [0, 0, 0, 0]) {
    const data = this.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = rgba[0];
      data[i + 1] = rgba[1];
      data[i + 2] = rgba[2];
      data[i + 3] = rgba[3];
    }
  }
  /** 矩形填充，自动裁剪到图内 */
  fillRect(x, y, width, height, rgba) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.ceil(x + width));
    const y1 = Math.min(this.height, Math.ceil(y + height));
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) {
        this.write(xx, yy, rgba);
      }
    }
  }
  /**
   * 把当前像素数据放大后画到 canvas 上（便于观察像素），不改动 data
   * 起点为 margin，每个像素放大成 size×size 的格子；有颜色的像素填成该颜色，网格线为黑色
   */
  drawGrid(ctx, size, margin) {
    if (size <= 0) {
      return;
    }
    const cols = this.width;
    const rows = this.height;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = this.index(col, row);
        const alpha = this.data[i + 3];
        if (alpha > 0) {
          ctx.fillStyle = `rgba(${this.data[i]},${this.data[i + 1]},${this.data[i + 2]},${alpha / 255})`;
          ctx.fillRect(margin + col * size, margin + row * size, size, size);
        }
      }
    }
    const gridWidth = cols * size;
    const gridHeight = rows * size;
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      const x = margin + col * size + 0.5;
      ctx.moveTo(x, margin);
      ctx.lineTo(x, margin + gridHeight);
    }
    for (let row = 0; row <= rows; row++) {
      const y = margin + row * size + 0.5;
      ctx.moveTo(margin, y);
      ctx.lineTo(margin + gridWidth, y);
    }
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  /** 转成 ImageData，可配合 2d canvas 的 putImageData 展示 */
  toImageData() {
    const image = new ImageData(this.width, this.height);
    image.data.set(this.data);
    return image;
  }
  /** 转成 canvas，便于预览光栅化结果 */
  toCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(this.toImageData(), 0, 0);
    }
    return canvas;
  }
}
function rasterization(pixmap, path, color = [0, 0, 0, 255], fillRule = "nonzero", pixelBits = 6) {
  const onePixel = 1 << pixelBits;
  const polygons = path.toPolygons(true).map((polygon) => polygon.map((p) => ({
    x: Math.round(p.x * onePixel),
    y: Math.round(p.y * onePixel)
  })));
  const width = pixmap.width;
  const height = pixmap.height;
  if (width <= 0 || height <= 0 || polygons.length === 0) {
    return pixmap;
  }
  const ycells = new Array(height).fill(null);
  const getCell = (x, y) => {
    let cell = ycells[y];
    let prev = null;
    while (cell && cell.x < x) {
      prev = cell;
      cell = cell.next;
    }
    if (cell && cell.x === x) {
      return cell;
    }
    const created = { x, cover: 0, area: 0, next: cell };
    if (prev) {
      prev.next = created;
    } else {
      ycells[y] = created;
    }
    return created;
  };
  const addCell = (x, y, cover, area) => {
    const cell = getCell(x, y);
    cell.cover += cover;
    cell.area += area;
  };
  const limitY = height * onePixel;
  const addEdge = (x0, y0, x1, y1) => {
    if (y0 === y1) {
      return;
    }
    let dir = 1;
    if (y1 < y0) {
      dir = -1;
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
    }
    if (y1 <= 0 || y0 >= limitY) {
      return;
    }
    if (y0 < 0) {
      x0 += Math.trunc((x1 - x0) * (0 - y0) / (y1 - y0));
      y0 = 0;
    }
    if (y1 > limitY) {
      x1 = x0 + Math.trunc((x1 - x0) * (limitY - y0) / (y1 - y0));
      y1 = limitY;
    }
    const dx = x1 - x0;
    const dy = y1 - y0;
    if (dy <= 0) {
      return;
    }
    for (let y = y0 >> pixelBits; y * onePixel < y1; y++) {
      const top = y * onePixel;
      const bottom = Math.min(top + onePixel, y1);
      const ya = top > y0 ? top : y0;
      if (bottom <= ya) {
        continue;
      }
      const xa = x0 + Math.trunc(dx * (ya - y0) / dy);
      const xb = x0 + Math.trunc(dx * (bottom - y0) / dy);
      const end = Math.floor(xb / onePixel);
      const step = xb >= xa ? 1 : -1;
      let ex = Math.floor(xa / onePixel);
      let px = xa;
      let py = ya;
      while (ex !== end) {
        const boundary = (step > 0 ? ex + 1 : ex) * onePixel;
        const ny = ya + Math.trunc((boundary - xa) * (bottom - ya) / (xb - xa));
        const dv2 = ny - py;
        if (dv2 > 0) {
          addCell(ex, y, dir * dv2, dir * (px - ex * onePixel + (boundary - ex * onePixel)) * dv2);
        }
        px = boundary;
        py = ny;
        ex += step;
      }
      const dv = bottom - py;
      if (dv > 0) {
        addCell(end, y, dir * dv, dir * (px - end * onePixel + (xb - end * onePixel)) * dv);
      }
    }
  };
  for (const polygon of polygons) {
    const count = polygon.length;
    if (count < 2) {
      continue;
    }
    for (let i = 0; i < count; i++) {
      const p = polygon[i];
      const q = polygon[(i + 1) % count];
      addEdge(p.x, p.y, q.x, q.y);
    }
  }
  const fullArea = 2 * onePixel * onePixel;
  const shift = pixelBits * 2 - 7;
  const round = 1 << pixelBits * 2 - 8;
  const coverageOf = (area) => {
    let a = area < 0 ? -area : area;
    if (fillRule === "evenodd") {
      a %= fullArea * 2;
      if (a > fullArea) {
        a = fullArea * 2 - a;
      }
    } else if (a > fullArea) {
      a = fullArea;
    }
    const coverage = a + round >> shift;
    return coverage > 255 ? 255 : coverage;
  };
  const spans = [];
  for (let y = 0; y < height; y++) {
    let cover = 0;
    let x = 0;
    for (let cell = ycells[y]; cell; cell = cell.next) {
      const left = x > 0 ? x : 0;
      if (cell.x > left && cover !== 0) {
        spans.push({ x: left, y, len: cell.x - left, coverage: coverageOf(cover * onePixel * 2) });
      }
      cover += cell.cover;
      const area = cover * onePixel * 2 - cell.area;
      if (area !== 0 && cell.x >= 0 && cell.x < width) {
        spans.push({ x: cell.x, y, len: 1, coverage: coverageOf(area) });
      }
      x = cell.x + 1;
    }
    if (cover !== 0 && x < width) {
      const left = x > 0 ? x : 0;
      if (left < width) {
        spans.push({ x: left, y, len: width - left, coverage: coverageOf(cover * onePixel * 2) });
      }
    }
  }
  for (const span of spans) {
    const alpha = Math.round(color[3] * span.coverage / 255);
    if (alpha <= 0) {
      continue;
    }
    const rgba = [color[0], color[1], color[2], alpha];
    for (let i = 0; i < span.len; i++) {
      pixmap.blend(span.x + i, span.y, rgba);
    }
  }
  return pixmap;
}
export {
  Pixmap,
  rasterization
};
