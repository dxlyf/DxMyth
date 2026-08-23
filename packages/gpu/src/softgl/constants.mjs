/**
 * constants.mjs —— WebGL2 常量表
 * ================================================================
 * 在真实的 WebGL 中，所有枚举常量都挂在 gl 上下文对象上（如 gl.ARRAY_BUFFER）。
 * 这些常量其实是无符号整数（0xXXXX），GPU 驱动根据它们的数值识别指令参数。
 * 我们在软件模拟器中同样以整数值定义它们，并统一挂到 SimGL 对象上，
 * 这样用户代码可以完全像调用真实 WebGL 一样书写。
 */

/** 创建全部常量并挂载到目标对象上（模拟 gl.xxx 常量访问） */
export function defineConstants(gl) {
  const C = {
    /* ---------------- 清除掩码（clear 的参数，可进行按位或组合） ---------------- */
    COLOR_BUFFER_BIT: 0x00004000, // 清除颜色附件
    DEPTH_BUFFER_BIT: 0x00000100, // 清除深度附件
    STENCIL_BUFFER_BIT: 0x00000400, // 清除模板附件

    /* ---------------- 缓冲区目标（bufferData / bindBuffer 的第一个参数） ---------------- */
    ARRAY_BUFFER: 0x8892, // 顶点数据缓冲区（VBO）
    ELEMENT_ARRAY_BUFFER: 0x8893, // 索引缓冲区（IBO），注意它属于当前 VAO 状态
    UNIFORM_BUFFER: 0x8a11, // Uniform 缓冲区（本模拟器仅记录，不真正实现 UBO）

    /* ---------------- 缓冲区数据用途（提示驱动如何优化存储位置） ---------------- */
    STATIC_DRAW: 0x88e4, // 数据几乎不变，应放在显存中
    DYNAMIC_DRAW: 0x88e8, // 数据频繁更新
    STREAM_DRAW: 0x88e0, // 每次绘制都更新

    /* ---------------- 顶点属性数据类型（vertexAttribPointer 的 type 参数） ---------------- */
    BYTE: 0x1400, // 1 字节有符号整数
    UNSIGNED_BYTE: 0x1401, // 1 字节无符号整数
    SHORT: 0x1402, // 2 字节有符号整数
    UNSIGNED_SHORT: 0x1403, // 2 字节无符号整数
    INT: 0x1404, // 4 字节有符号整数
    UNSIGNED_INT: 0x1405, // 4 字节无符号整数
    FLOAT: 0x1406, // 4 字节浮点数（最常见的顶点属性类型）

    /* ---------------- 索引缓冲区类型（drawElements 的 type 参数） ---------------- */
    UNSIGNED_BYTE_INDEX: 0x1401, // WebGL2 允许 UNSIGNED_BYTE 索引
    UNSIGNED_SHORT_INDEX: 0x1403,
    UNSIGNED_INT_INDEX: 0x1405,

    /* ---------------- 图元类型（drawArrays / drawElements 的 mode 参数） ---------------- */
    POINTS: 0x0000, // 点
    LINES: 0x0001, // 线段（每 2 个顶点一条）
    LINE_LOOP: 0x0002, // 线段环（首尾相连）
    LINE_STRIP: 0x0003, // 线段带（连续折线）
    TRIANGLES: 0x0004, // 三角形（每 3 个顶点一个）
    TRIANGLE_STRIP: 0x0005, // 三角形带（每相邻 3 顶点一个）
    TRIANGLE_FAN: 0x0006, // 三角形扇（第一个顶点固定）

    /* ---------------- 着色器类型 ---------------- */
    VERTEX_SHADER: 0x8b31, // 顶点着色器
    FRAGMENT_SHADER: 0x8b30, // 片段着色器
    COMPILE_STATUS: 0x8b81, // 查询着色器编译状态
    LINK_STATUS: 0x8b82, // 查询程序链接状态
    DELETE_STATUS: 0x8b80, // 查询对象是否被标记删除

    /* ---------------- 深度测试函数 ---------------- */
    NEVER: 0x0200, // 永不过
    LESS: 0x0201, // 深度 < 缓冲值 通过
    EQUAL: 0x0202,
    LEQUAL: 0x0203, // 默认：深度 <= 缓冲值 通过
    GREATER: 0x0204,
    NOTEQUAL: 0x0205,
    GEQUAL: 0x0206,
    ALWAYS: 0x0207, // 总是通过

    /* ---------------- 模板测试函数 ---------------- */
    KEEP: 0x1e00, // 保持原模板值
    REPLACE: 0x1e01, // 用参考值覆盖
    INCR: 0x1e02, // 加 1（饱和，255 封顶）
    DECR: 0x1e03, // 减 1（饱和，0 封底）
    INVERT: 0x150a, // 按位取反
    INCR_WRAP: 0x8507, // 加 1（回绕）
    DECR_WRAP: 0x8508, // 减 1（回绕）

    /* ---------------- 混合因子 ---------------- */
    ZERO: 0, // 因子 = 0
    ONE: 1, // 因子 = 1
    SRC_COLOR: 0x0300,
    ONE_MINUS_SRC_COLOR: 0x0301,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    DST_ALPHA: 0x0304,
    ONE_MINUS_DST_ALPHA: 0x0305,
    DST_COLOR: 0x0306,
    ONE_MINUS_DST_COLOR: 0x0307,
    SRC_ALPHA_SATURATE: 0x0308,
    CONSTANT_COLOR: 0x8001,
    ONE_MINUS_CONSTANT_COLOR: 0x8002,
    CONSTANT_ALPHA: 0x8003,
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,

    /* ---------------- 混合方程 ---------------- */
    FUNC_ADD: 0x8006, // 默认：src + dst
    FUNC_SUBTRACT: 0x800a, // src - dst
    FUNC_REVERSE_SUBTRACT: 0x800b, // dst - src

    /* ---------------- 面剔除 ---------------- */
    FRONT: 0x0404,
    BACK: 0x0405,
    FRONT_AND_BACK: 0x0408,
    CW: 0x0900, // 顺时针
    CCW: 0x0901, // 逆时针（默认正面）

    /* ---------------- 可开关的渲染能力（enable/disable 参数） ---------------- */
    DEPTH_TEST: 0x0b71, // 深度测试
    STENCIL_TEST: 0x0b90, // 模板测试
    BLEND: 0x0be2, // 混合
    SCISSOR_TEST: 0x0c11, // 裁剪矩形测试
    CULL_FACE: 0x0b44, // 面剔除
    DITHER: 0x0bd0, // 抖动（模拟器不做抖动，仅记录开关）
    POLYGON_OFFSET_FILL: 0x8037, // 多边形偏移（模拟器简化，仅记录开关）

    /* ---------------- 颜色/深度掩码 ---------------- */
    DEPTH_WRITEMASK: 0x0b72,

    /* ---------------- 纹理目标 ---------------- */
    TEXTURE_2D: 0x0de1,
    TEXTURE_CUBE_MAP: 0x8513,

    /* ---------------- 纹理参数 ---------------- */
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    NEAREST: 0x2600, // 最近邻采样
    LINEAR: 0x2601, // 双线性插值采样
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    REPEAT: 0x2901, // 纹理坐标循环重复
    CLAMP_TO_EDGE: 0x812f, // 纹理坐标钳制到边缘
    MIRRORED_REPEAT: 0x8370,

    /* ---------------- 纹理内部格式（texImage2D 的 internalformat） ---------------- */
    RGBA: 0x1908,
    RGB: 0x1907,
    RGBA8: 0x8058,
    RGB8: 0x8051,
    DEPTH_COMPONENT: 0x1902,
    DEPTH_COMPONENT16: 0x81a5,
    DEPTH_COMPONENT24: 0x81a6,
    DEPTH_COMPONENT32F: 0x8cac,
    DEPTH_STENCIL: 0x84f9,
    DEPTH24_STENCIL8: 0x88f0,
    STENCIL_INDEX8: 0x8d48,

    /* ---------------- 像素数据类型 ---------------- */
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403,
    UNSIGNED_INT: 0x1405,

    /* ---------------- 帧缓冲附件 ---------------- */
    COLOR_ATTACHMENT0: 0x8ce0,
    DEPTH_ATTACHMENT: 0x8d00,
    STENCIL_ATTACHMENT: 0x8d20,
    DEPTH_STENCIL_ATTACHMENT: 0x821a,
    FRAMEBUFFER: 0x8d40, // 帧缓冲目标
    RENDERBUFFER: 0x8d41, // 渲染缓冲目标
    RENDERBUFFER_WIDTH: 0x8d42,
    RENDERBUFFER_HEIGHT: 0x8d43,
    RENDERBUFFER_INTERNAL_FORMAT: 0x8d44,
    FRAMEBUFFER_COMPLETE: 0x8cd5, // 完整性检查通过
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9,
    FRAMEBUFFER_UNSUPPORTED: 0x8cdd,

    /* ---------------- 纹理单元（activeTexture） ---------------- */
    TEXTURE0: 0x84c0, // TEXTURE0 + n 表示第 n 个单元

    /* ---------------- 混合时的常量颜色（blendColor） ---------------- */
    BLEND_COLOR: 0x8005,

    /* ---------------- getParameter 常用查询 ---------------- */
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_DRAW_BUFFERS: 0x8824,
    VERSION: 0x1f02,
    SHADING_LANGUAGE_VERSION: 0x8b8c,
    VIEWPORT: 0x0ba2,
    SCISSOR_BOX: 0x0c10,
    MAX_RENDERBUFFER_SIZE: 0x84e8,

    /* ---------------- 错误码 ---------------- */
    NO_ERROR: 0,
    INVALID_ENUM: 0x0500,
    INVALID_VALUE: 0x0501,
    INVALID_OPERATION: 0x0502,
    OUT_OF_MEMORY: 0x0505,

    /* ---------------- 其他 ---------------- */
    NONE: 0,
  };

  // 将常量复制到 gl 对象（类似真实 WebGL 上下文挂载常量的行为）
  Object.assign(gl, C);

  // TEXTUREn 系列常量：TEXTURE0+n
  for (let i = 1; i < 16; i++) {
    gl['TEXTURE' + i] = C.TEXTURE0 + i;
  }
}
