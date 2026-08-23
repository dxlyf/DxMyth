/**
 * framebuffer.mjs —— 帧缓冲对象（FBO）与渲染缓冲对象（RBO）
 * ============================================================================
 * 对应 WebGL 的帧缓冲 API：
 *   createFramebuffer / bindFramebuffer / framebufferTexture2D
 *   framebufferRenderbuffer / checkFramebufferStatus
 *   createRenderbuffer / bindRenderbuffer / renderbufferStorage
 *
 * 真实 GPU 中，FBO 是"离屏渲染目标"：把渲染结果写入绑定的颜色/深度/模板附件
 * 而不是默认的屏幕缓冲。附件可以是纹理（framebufferTexture2D，之后可在着色器里
 * 采样，实现后处理/阴影贴图等）或渲染缓冲（framebufferRenderbuffer，离屏专用）。
 *
 * 本模拟器里，每个附件就是一个 JS 数组（颜色 Uint8ClampedArray、
 * 深度 Float32Array、模板 Uint8Array），渲染时 rasterizer 直接写入这些数组。
 * ============================================================================
 */

/** 渲染缓冲对象：一块离屏存储（只能作为附件，不能采样） */
export class RenderbufferObject {
  constructor(id) {
    this.id = id;
    this.width = 0;
    this.height = 0;
    this.internalFormat = 0;
    this.data = null; // 由 storage 分配
  }
}

/** 帧缓冲对象：持有三类附件的引用 */
export class FramebufferObject {
  constructor(id) {
    this.id = id;
    this.colorAttachment = null; // { kind: 'texture'|'renderbuffer', obj }
    this.depthAttachment = null;
    this.stencilAttachment = null;
    this.width = 0;
    this.height = 0;
  }
}

/** 生成默认帧缓冲（模拟"屏幕"：即内部离屏画布） */
export function createDefaultFramebuffer(width, height) {
  return {
    isDefault: true,
    width,
    height,
    color: new Uint8ClampedArray(width * height * 4),
    depth: new Float32Array(width * height),
    stencil: new Uint8Array(width * height),
  };
}

/** 调整默认帧缓冲大小（canvas resize 时触发） */
export function resizeDefaultFramebuffer(fb, width, height) {
  fb.width = width;
  fb.height = height;
  fb.color = new Uint8ClampedArray(width * height * 4);
  fb.depth = new Float32Array(width * height);
  fb.stencil = new Uint8Array(width * height);
}

/**
 * 获取指定附件的像素存储数组。
 * 返回 { color?, depth?, stencil?, width, height }：
 * 颜色附件必须存在（否则无法渲染颜色），深度/模板可选。
 */
export function resolveAttachment(obj, kind) {
  // obj 是 FramebufferObject
  if (kind === 'color') {
    const a = obj.colorAttachment;
    if (!a) return null;
    if (a.kind === 'texture') return a.obj.pixels;
    return a.obj.data;
  }
  if (kind === 'depth') {
    const a = obj.depthAttachment;
    if (!a) return null;
    if (a.kind === 'texture') return null; // 深度纹理在本模拟器不支持直接读写，仅作完整性检查
    return a.obj.data;
  }
  if (kind === 'stencil') {
    const a = obj.stencilAttachment;
    if (!a) return null;
    if (a.kind === 'texture') return null;
    return a.obj.data;
  }
  return null;
}

/**
 * 检查帧缓冲完整性（对应 checkFramebufferStatus）。
 * 返回 FRAMEBUFFER_COMPLETE 或错误码。
 */
export function checkFramebuffer(gl, fb) {
  if (fb.isDefault) return gl.FRAMEBUFFER_COMPLETE;

  const color = fb.colorAttachment;
  const depth = fb.depthAttachment;
  const stencil = fb.stencilAttachment;
  if (!color && !depth && !stencil) return gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;

  // 计算所有附件的公共尺寸，尺寸不一致视为不完整
  let w = 0, h = 0;
  const all = [color, depth, stencil].filter(Boolean);
  for (const a of all) {
    const aw = a.kind === 'texture' ? a.obj.width : a.obj.width;
    const ah = a.kind === 'texture' ? a.obj.height : a.obj.height;
    if (w === 0) { w = aw; h = ah; }
    else if (w !== aw || h !== ah) return gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
    if (a.kind === 'texture' && !a.obj.pixels) return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
    if (a.kind === 'renderbuffer' && !a.obj.data) return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
  }
  fb.width = w;
  fb.height = h;
  return gl.FRAMEBUFFER_COMPLETE;
}
