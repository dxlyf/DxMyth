/**
 * state.mjs —— 渲染状态管理
 * ============================================================================
 * GPU 是一个巨大的状态机：渲染结果不仅取决于顶点数据与着色器，还取决于一堆
 * 全局状态（是否开启深度测试、混合函数、视口大小……）。真实 WebGL 中这些状态
 * 由 gl.enable / gl.depthFunc / gl.blendFunc 等命令设置，并保存在驱动内部。
 *
 * RenderState 类集中保存这些状态，供光栅化阶段查询。所有字段都有默认值，
 * 与真实 WebGL 的初始状态保持一致。
 * ============================================================================
 */

export class RenderState {
  constructor() {
    // —— 视口与裁剪（对应 gl.viewport / gl.scissor）——
    this.viewport = { x: 0, y: 0, width: 0, height: 0 };
    this.scissor = { x: 0, y: 0, width: 0, height: 0 };

    // —— 可开关能力（对应 gl.enable/disable）——
    this.enabled = new Set();

    // —— 清除值（对应 gl.clearColor / clearDepth / clearStencil）——
    this.clearColor = [0, 0, 0, 0]; // 默认透明黑
    this.clearDepth = 1; // 默认 1.0（最远）
    this.clearStencil = 0;

    // —— 写入掩码（对应 gl.colorMask / depthMask / stencilMask）——
    this.colorMask = [true, true, true, true];
    this.depthMask = true;
    this.stencilMask = 0xff;
    this.stencilMaskBack = 0xff;

    // —— 深度测试（对应 gl.depthFunc / gl.depthRange）——
    this.depthFunc = 0x0203; // LEQUAL
    this.depthRange = { near: 0, far: 1 };

    // —— 混合（对应 gl.blendFunc / blendEquation / blendColor）——
    this.blendEnabled = false;
    this.blendSrcRGB = 1; // ONE
    this.blendDstRGB = 0; // ZERO
    this.blendSrcAlpha = 1;
    this.blendDstAlpha = 0;
    this.blendEquationRGB = 0x8006; // FUNC_ADD
    this.blendEquationAlpha = 0x8006;
    this.blendColor = [0, 0, 0, 0];

    // —— 模板测试（对应 gl.stencilFunc / stencilOp / stencilMask）——
    this.stencilFunc = 0x0207; // ALWAYS
    this.stencilRef = 0;
    this.stencilMaskTest = 0xff;
    this.stencilFuncBack = 0x0207;
    this.stencilRefBack = 0;
    this.stencilMaskBackTest = 0xff;
    this.stencilOpFail = 0x1e00; // KEEP
    this.stencilOpZFail = 0x1e00;
    this.stencilOpZPass = 0x1e00;
    this.stencilOpFailBack = 0x1e00;
    this.stencilOpZFailBack = 0x1e00;
    this.stencilOpZPassBack = 0x1e00;

    // —— 面剔除（对应 gl.cullFace / frontFace）——
    this.cullFace = 0x0405; // BACK
    this.frontFace = 0x0901; // CCW

    // —— 线与点 ——
    this.lineWidth = 1;

    // —— 纹理单元（对应 gl.activeTexture / bindTexture）——
    this.activeTextureUnit = 0; // 当前活动单元
    this.textureUnits = []; // unit → TextureObject（最多 16 个）

    // —— 缓冲绑定（ARRAY_BUFFER / ELEMENT_ARRAY_BUFFER）——
    this.boundBuffers = {}; // target → BufferObject

    // —— 帧缓冲 / 渲染缓冲绑定 ——
    this.boundFramebuffer = null; // null 表示默认帧缓冲
    this.boundRenderbuffer = null;

    // —— 程序 ——
    this.program = null;

    // —— VAO ——
    this.vertexArray = null; // 当前绑定的 VAO
  }

  isEnabled(cap) { return this.enabled.has(cap); }
}
