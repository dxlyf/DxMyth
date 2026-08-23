/**
 * texture.mjs —— 纹理对象与采样器
 * ============================================================================
 * 对应 WebGL 的纹理 API：
 *   createTexture / bindTexture / texImage2D / texParameteri / generateMipmap
 *
 * 真实 GPU 中，texImage2D 会把 CPU 上的像素数据上传到显存（VRAM），之后着色器
 * 通过纹理单元（TEXTURE0 + n）采样。本模拟器把像素数据直接保存在 TextureObject
 * 的 pixels 数组里（Uint8ClampedArray，RGBA），采样时由 JS 完成双线性插值。
 *
 * sampleTexture 被 GLSL 解释器的 texture2D() 内建函数调用。
 * ============================================================================
 */

/** 纹理对象：内部保存像素数据与采样参数 */
export class TextureObject {
  constructor(id) {
    this.id = id;
    this.target = 0; // 绑定目标（TEXTURE_2D）
    this.width = 0;
    this.height = 0;
    this.pixels = null; // Uint8ClampedArray RGBA
    this.internalFormat = 0;
    this.format = 0;
    this.type = 0;
    // 采样参数（对应 texParameteri 设置）
    this.params = {
      wrapS: 0x2901, // REPEAT（默认）
      wrapT: 0x2901,
      minFilter: 0x2601, // LINEAR
      magFilter: 0x2601,
    };
  }
}

/** 根据内部格式返回每像素字节数（仅 RGBA8/RGB8 等常见格式） */
export function bytesPerPixel(format) {
  switch (format) {
    case 0x1908: // RGBA
    case 0x8058: // RGBA8
      return 4;
    case 0x1907: // RGB
    case 0x8051: // RGB8
      return 3;
    case 0x1902: // DEPTH_COMPONENT
    case 0x81a5: // DEPTH_COMPONENT16
      return 2;
    default:
      return 4;
  }
}

/**
 * 采样 2D 纹理（对应硬件纹理单元采样）。
 * 实现两种过滤模式：
 *   - NEAREST: 最近邻，取 uv 所在纹素
 *   - LINEAR : 双线性插值，对 uv 周围 4 个纹素按距离加权
 * 支持 REPEAT / CLAMP_TO_EDGE / MIRRORED_REPEAT 三种环绕模式。
 * @returns {number[]} 归一化 RGBA（0~1）
 */
export function sampleTexture(tex, u, v) {
  const w = tex.width, h = tex.height;
  if (!w || !h || !tex.pixels) return [0, 0, 0, 1];

  // 1. 环绕模式：把 uv 变换到 [0,1) 范围内
  const wrapCoord = (c, mode) => {
    switch (mode) {
      case 0x812f: // CLAMP_TO_EDGE
        return Math.min(Math.max(c, 0), 1);
      case 0x8370: // MIRRORED_REPEAT
        {
          const k = Math.floor(c);
          const f = c - k;
          return (k & 1) ? 1 - f : f;
        }
      default: // REPEAT
        return c - Math.floor(c);
    }
  };
  const uu = wrapCoord(u, tex.params.wrapS);
  const vv = wrapCoord(v, tex.params.wrapT);

  // 2. 计算纹素坐标（uv 原点在左下角，与 WebGL 一致）
  const xf = uu * w - 0.5;
  const yf = vv * h - 0.5;

  const readTexel = (tx, ty) => {
    // 处理边缘（纹素索引越界时按 CLAMP_TO_EDGE 兜底）
    tx = Math.min(Math.max(tx, 0), w - 1);
    ty = Math.min(Math.max(ty, 0), h - 1);
    // 注意：像素数组行序是自上而下，而 uv 的 v 自下而上，因此行号取反
    const row = h - 1 - ty;
    const i = (row * w + tx) * 4;
    return [
      tex.pixels[i] / 255,
      tex.pixels[i + 1] / 255,
      tex.pixels[i + 2] / 255,
      tex.pixels[i + 3] / 255,
    ];
  };

  // 3. 按过滤模式采样
  if (tex.params.magFilter === 0x2600 || tex.params.minFilter === 0x2600) {
    // NEAREST：取最近的纹素
    return readTexel(Math.round(xf), Math.round(yf));
  }

  // LINEAR：双线性插值
  const x0 = Math.floor(xf), y0 = Math.floor(yf);
  const fx = xf - x0, fy = yf - y0;
  const c00 = readTexel(x0, y0);
  const c10 = readTexel(x0 + 1, y0);
  const c01 = readTexel(x0, y0 + 1);
  const c11 = readTexel(x0 + 1, y0 + 1);
  const out = new Array(4);
  for (let i = 0; i < 4; i++) {
    const top = c00[i] * (1 - fx) + c10[i] * fx;
    const bottom = c01[i] * (1 - fx) + c11[i] * fx;
    out[i] = top * (1 - fy) + bottom * fy;
  }
  return out;
}

/** 把 TypedArray 像素数据写入纹理（texImage2D 内部） */
export function uploadPixels(tex, data, width, height, format) {
  tex.width = width;
  tex.height = height;
  const bpp = bytesPerPixel(format);
  const srcStride = bpp; // 紧凑存储
  tex.pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * srcStride;
    const d = i * 4;
    if (bpp === 4) {
      tex.pixels[d] = data[s];
      tex.pixels[d + 1] = data[s + 1];
      tex.pixels[d + 2] = data[s + 2];
      tex.pixels[d + 3] = data[s + 3];
    } else if (bpp === 3) {
      tex.pixels[d] = data[s];
      tex.pixels[d + 1] = data[s + 1];
      tex.pixels[d + 2] = data[s + 2];
      tex.pixels[d + 3] = 255;
    } else {
      // 深度纹理：模拟器中仅保留第一个通道
      tex.pixels[d] = data[s];
      tex.pixels[d + 1] = 255;
      tex.pixels[d + 2] = 255;
      tex.pixels[d + 3] = 255;
    }
  }
}
