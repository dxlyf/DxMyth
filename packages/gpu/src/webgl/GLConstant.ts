// webgl-constants.js
export const WebGLConstants = {
    // 清除缓冲掩码（ClearBufferMask，按位或组合使用）
    DEPTH_BUFFER_BIT: 0x00000100, // 清除深度缓冲
    STENCIL_BUFFER_BIT: 0x00000400, // 清除模板缓冲
    COLOR_BUFFER_BIT: 0x00004000, // 清除颜色缓冲

    // 图元绘制模式（BeginMode）
    POINTS: 0x0000, // 点
    LINES: 0x0001, // 线段（每两个顶点一条）
    LINE_LOOP: 0x0002, // 线段环（首尾相连）
    LINE_STRIP: 0x0003, // 线段带（连续折线）
    TRIANGLES: 0x0004, // 三角形（每三个顶点一个）
    TRIANGLE_STRIP: 0x0005, // 三角形带
    TRIANGLE_FAN: 0x0006, // 三角形扇

    // 混合目标因子（BlendingFactorDest）
    ZERO: 0, // 因子为 0
    ONE: 1, // 因子为 1
    SRC_COLOR: 0x0300, // 源颜色作为目标因子
    ONE_MINUS_SRC_COLOR: 0x0301, // 1 - 源颜色作为目标因子
    SRC_ALPHA: 0x0302, // 源 alpha 作为目标因子
    ONE_MINUS_SRC_ALPHA: 0x0303, // 1 - 源 alpha 作为目标因子
    DST_ALPHA: 0x0304, // 目标 alpha 作为目标因子
    ONE_MINUS_DST_ALPHA: 0x0305, // 1 - 目标 alpha 作为目标因子

    // 混合源因子（BlendingFactorSrc）
    DST_COLOR: 0x0306, // 目标颜色作为源因子
    ONE_MINUS_DST_COLOR: 0x0307, // 1 - 目标颜色作为源因子
    SRC_ALPHA_SATURATE: 0x0308, // 源 alpha 取饱和值 min(srcA, 1-dstA)

    // 混合方程（BlendEquationSeparate）
    FUNC_ADD: 0x8006, // 相加混合
    BLEND_EQUATION: 0x8009, // 混合方程
    BLEND_EQUATION_RGB: 0x8009, // RGB 混合方程（与 BLEND_EQUATION 相同）
    BLEND_EQUATION_ALPHA: 0x883D, // Alpha 混合方程

    // 混合相减（BlendSubtract）
    FUNC_SUBTRACT: 0x800A, // 相减混合
    FUNC_REVERSE_SUBTRACT: 0x800B, // 反向相减混合

    // 分离混合函数（Separate Blend Functions）
    BLEND_DST_RGB: 0x80C8, // 目标 RGB 混合函数
    BLEND_SRC_RGB: 0x80C9, // 源 RGB 混合函数
    BLEND_DST_ALPHA: 0x80CA, // 目标 Alpha 混合函数
    BLEND_SRC_ALPHA: 0x80CB, // 源 Alpha 混合函数
    CONSTANT_COLOR: 0x8001, // 常量颜色（blendColor 设定值）
    ONE_MINUS_CONSTANT_COLOR: 0x8002, // 1 - 常量颜色
    CONSTANT_ALPHA: 0x8003, // 常量 Alpha
    ONE_MINUS_CONSTANT_ALPHA: 0x8004, // 1 - 常量 Alpha
    BLEND_COLOR: 0x8005, // 设置混合常量颜色

    // 缓冲对象（Buffer Objects）
    ARRAY_BUFFER: 0x8892, // 顶点数组缓冲
    ELEMENT_ARRAY_BUFFER: 0x8893, // 元素（索引）数组缓冲
    ARRAY_BUFFER_BINDING: 0x8894, // 顶点数组缓冲绑定
    ELEMENT_ARRAY_BUFFER_BINDING: 0x8895, // 元素数组缓冲绑定
    STREAM_DRAW: 0x88E0, // 流式绘制（数据每帧变化）
    STATIC_DRAW: 0x88E4, // 静态绘制（数据不常变）
    DYNAMIC_DRAW: 0x88E8, // 动态绘制（数据经常变）
    BUFFER_SIZE: 0x8764, // 缓冲大小
    BUFFER_USAGE: 0x8765, // 缓冲用途
    CURRENT_VERTEX_ATTRIB: 0x8626, // 当前顶点属性

    // 面剔除模式（CullFaceMode）
    FRONT: 0x0404, // 剔除正面
    BACK: 0x0405, // 剔除背面
    FRONT_AND_BACK: 0x0408, // 正反两面都剔除

    // 启用能力（EnableCap）
    CULL_FACE: 0x0B44, // 面剔除
    BLEND: 0x0BE2, // 颜色混合
    DITHER: 0x0BD0, // 抖动
    STENCIL_TEST: 0x0B90, // 模板测试
    DEPTH_TEST: 0x0B71, // 深度测试
    SCISSOR_TEST: 0x0C11, // 裁剪测试
    POLYGON_OFFSET_FILL: 0x8037, // 多边形偏移填充
    SAMPLE_ALPHA_TO_COVERAGE: 0x809E, // 采样 alpha 转覆盖率
    SAMPLE_COVERAGE: 0x80A0, // 采样覆盖率

    // 错误码（ErrorCode）
    NO_ERROR: 0, // 无错误
    INVALID_ENUM: 0x0500, // 非法枚举
    INVALID_VALUE: 0x0501, // 非法值
    INVALID_OPERATION: 0x0502, // 非法操作
    OUT_OF_MEMORY: 0x0505, // 内存不足

    // 正面方向（FrontFaceDirection）
    CW: 0x0900, // 顺时针
    CCW: 0x0901, // 逆时针

    // 查询参数（GetPName）
    LINE_WIDTH: 0x0B21, // 线宽
    ALIASED_POINT_SIZE_RANGE: 0x846D, // 点大小范围（抗锯齿）
    ALIASED_LINE_WIDTH_RANGE: 0x846E, // 线宽范围（抗锯齿）
    CULL_FACE_MODE: 0x0B45, // 剔除模式
    FRONT_FACE: 0x0B46, // 正面方向
    DEPTH_RANGE: 0x0B70, // 深度范围
    DEPTH_WRITEMASK: 0x0B72, // 深度写入掩码
    DEPTH_CLEAR_VALUE: 0x0B73, // 深度清除值
    DEPTH_FUNC: 0x0B74, // 深度比较函数
    STENCIL_CLEAR_VALUE: 0x0B91, // 模板清除值
    STENCIL_FUNC: 0x0B92, // 模板比较函数
    STENCIL_FAIL: 0x0B94, // 模板测试失败动作
    STENCIL_PASS_DEPTH_FAIL: 0x0B95, // 模板通过但深度测试失败动作
    STENCIL_PASS_DEPTH_PASS: 0x0B96, // 模板与深度测试都通过动作
    STENCIL_REF: 0x0B97, // 模板参考值
    STENCIL_VALUE_MASK: 0x0B93, // 模板值掩码
    STENCIL_WRITEMASK: 0x0B98, // 模板写入掩码
    STENCIL_BACK_FUNC: 0x8800, // 背面模板比较函数
    STENCIL_BACK_FAIL: 0x8801, // 背面模板测试失败动作
    STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802, // 背面模板过深度失败动作
    STENCIL_BACK_PASS_DEPTH_PASS: 0x8803, // 背面模板与深度都通过动作
    STENCIL_BACK_REF: 0x8CA3, // 背面模板参考值
    STENCIL_BACK_VALUE_MASK: 0x8CA4, // 背面模板值掩码
    STENCIL_BACK_WRITEMASK: 0x8CA5, // 背面模板写入掩码
    VIEWPORT: 0x0BA2, // 视口
    SCISSOR_BOX: 0x0C10, // 裁剪盒
    COLOR_CLEAR_VALUE: 0x0C22, // 颜色清除值
    COLOR_WRITEMASK: 0x0C23, // 颜色写入掩码
    UNPACK_ALIGNMENT: 0x0CF5, // 解包像素行对齐字节数
    PACK_ALIGNMENT: 0x0D05, // 打包像素行对齐字节数
    MAX_TEXTURE_SIZE: 0x0D33, // 最大纹理尺寸
    MAX_VIEWPORT_DIMS: 0x0D3A, // 最大视口尺寸
    SUBPIXEL_BITS: 0x0D50, // 亚像素精度位数
    RED_BITS: 0x0D52, // 红色分量位数
    GREEN_BITS: 0x0D53, // 绿色分量位数
    BLUE_BITS: 0x0D54, // 蓝色分量位数
    ALPHA_BITS: 0x0D55, // Alpha 分量位数
    DEPTH_BITS: 0x0D56, // 深度分量位数
    STENCIL_BITS: 0x0D57, // 模板分量位数
    POLYGON_OFFSET_UNITS: 0x2A00, // 多边形偏移单位
    POLYGON_OFFSET_FACTOR: 0x8038, // 多边形偏移因子
    TEXTURE_BINDING_2D: 0x8069, // 二维纹理绑定
    SAMPLE_BUFFERS: 0x80A8, // 采样缓冲数量
    SAMPLES: 0x80A9, // 采样数
    SAMPLE_COVERAGE_VALUE: 0x80AA, // 采样覆盖率值
    SAMPLE_COVERAGE_INVERT: 0x80AB, // 采样覆盖率是否反转
    COMPRESSED_TEXTURE_FORMATS: 0x86A3, // 支持的压缩纹理格式

    // 提示模式（HintMode）
    DONT_CARE: 0x1100, // 不关心（交给驱动决定）
    FASTEST: 0x1101, // 优先速度
    NICEST: 0x1102, // 优先质量

    // 提示目标（HintTarget）
    GENERATE_MIPMAP_HINT: 0x8192, // mipmap 生成质量提示

    // 数据类型（DataType）
    BYTE: 0x1400, // 有符号 8 位整数
    UNSIGNED_BYTE: 0x1401, // 无符号 8 位整数
    SHORT: 0x1402, // 有符号 16 位整数
    UNSIGNED_SHORT: 0x1403, // 无符号 16 位整数
    INT: 0x1404, // 有符号 32 位整数
    UNSIGNED_INT: 0x1405, // 无符号 32 位整数
    FLOAT: 0x1406, // 32 位浮点数

    // 像素格式（PixelFormat）
    DEPTH_COMPONENT: 0x1902, // 深度分量
    ALPHA: 0x1906, // Alpha 分量
    RGB: 0x1907, // RGB 三通道
    RGBA: 0x1908, // RGBA 四通道
    LUMINANCE: 0x1909, // 亮度
    LUMINANCE_ALPHA: 0x190A, // 亮度 + Alpha

    // 像素类型（PixelType）
    UNSIGNED_SHORT_4_4_4_4: 0x8033, // 16 位 RGBA（每分量 4 位）
    UNSIGNED_SHORT_5_5_5_1: 0x8034, // 16 位 RGBA（RGB 各 5 位、A 1 位）
    UNSIGNED_SHORT_5_6_5: 0x8363, // 16 位 RGB（R 5 位、G 6 位、B 5 位）

    // 着色器（Shaders）
    FRAGMENT_SHADER: 0x8B30, // 片元着色器
    VERTEX_SHADER: 0x8B31, // 顶点着色器
    MAX_VERTEX_ATTRIBS: 0x8869, // 最大顶点属性数量
    MAX_VERTEX_UNIFORM_VECTORS: 0x8DFB, // 顶点着色器最大 uniform 向量数
    MAX_VARYING_VECTORS: 0x8DFC, // 最大 vary 向量数
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8B4D, // 组合纹理图像单元最大数
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8B4C, // 顶点着色器纹理单元最大数
    MAX_TEXTURE_IMAGE_UNITS: 0x8872, // 片元着色器纹理单元最大数
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD, // 片元着色器最大 uniform 向量数
    SHADER_TYPE: 0x8B4F, // 着色器类型
    DELETE_STATUS: 0x8B80, // 删除状态
    LINK_STATUS: 0x8B82, // 链接状态
    VALIDATE_STATUS: 0x8B83, // 校验状态
    ATTACHED_SHADERS: 0x8B85, // 已附加的着色器数量
    ACTIVE_UNIFORMS: 0x8B86, // 活跃 uniform 数量
    ACTIVE_ATTRIBUTES: 0x8B89, // 活跃属性数量
    SHADING_LANGUAGE_VERSION: 0x8B8C, // 着色语言版本
    CURRENT_PROGRAM: 0x8B8D, // 当前程序对象

    // 模板比较函数（StencilFunction）
    NEVER: 0x0200, // 从不通过
    LESS: 0x0201, // 小于
    EQUAL: 0x0202, // 等于
    LEQUAL: 0x0203, // 小于等于
    GREATER: 0x0204, // 大于
    NOTEQUAL: 0x0205, // 不等于
    GEQUAL: 0x0206, // 大于等于
    ALWAYS: 0x0207, // 总是通过

    // 模板操作（StencilOp）
    KEEP: 0x1E00, // 保持原值
    REPLACE: 0x1E01, // 替换为参考值
    INCR: 0x1E02, // 加 1（封顶最大值）
    DECR: 0x1E03, // 减 1（下限 0）
    INVERT: 0x150A, // 按位取反
    INCR_WRAP: 0x8507, // 加 1（回绕）
    DECR_WRAP: 0x8508, // 减 1（回绕）

    // 字符串名称（StringName）
    VENDOR: 0x1F00, // 厂商
    RENDERER: 0x1F01, // 渲染器
    VERSION: 0x1F02, // 版本

    // 纹理放大过滤（TextureMagFilter）
    NEAREST: 0x2600, // 最近邻采样
    LINEAR: 0x2601, // 线性插值

    // 纹理缩小过滤（TextureMinFilter）
    NEAREST_MIPMAP_NEAREST: 0x2700, // 最近邻 + 最近 mipmap
    LINEAR_MIPMAP_NEAREST: 0x2701, // 线性 + 最近 mipmap
    NEAREST_MIPMAP_LINEAR: 0x2702, // 最近邻 + 线性 mipmap
    LINEAR_MIPMAP_LINEAR: 0x2703, // 线性 + 线性 mipmap（三线性）

    // 纹理参数名（TextureParameterName）
    TEXTURE_MAG_FILTER: 0x2800, // 纹理放大过滤方式
    TEXTURE_MIN_FILTER: 0x2801, // 纹理缩小过滤方式
    TEXTURE_WRAP_S: 0x2802, // 纹理 S 方向环绕方式
    TEXTURE_WRAP_T: 0x2803, // 纹理 T 方向环绕方式

    // 纹理目标（TextureTarget）
    TEXTURE_2D: 0x0DE1, // 二维纹理
    TEXTURE: 0x1702, // 纹理
    TEXTURE_CUBE_MAP: 0x8513, // 立方体纹理
    TEXTURE_BINDING_CUBE_MAP: 0x8514, // 立方体纹理绑定
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515, // 立方体 +X 面
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516, // 立方体 -X 面
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517, // 立方体 +Y 面
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518, // 立方体 -Y 面
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519, // 立方体 +Z 面
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A, // 立方体 -Z 面
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851C, // 最大立方体纹理尺寸

    // 纹理单元（TextureUnit）
    TEXTURE0: 0x84C0, // 纹理单元 0
    TEXTURE1: 0x84C1, // 纹理单元 1
    TEXTURE2: 0x84C2, // 纹理单元 2
    TEXTURE3: 0x84C3, // 纹理单元 3
    TEXTURE4: 0x84C4, // 纹理单元 4
    TEXTURE5: 0x84C5, // 纹理单元 5
    TEXTURE6: 0x84C6, // 纹理单元 6
    TEXTURE7: 0x84C7, // 纹理单元 7
    TEXTURE8: 0x84C8, // 纹理单元 8
    TEXTURE9: 0x84C9, // 纹理单元 9
    TEXTURE10: 0x84CA, // 纹理单元 10
    TEXTURE11: 0x84CB, // 纹理单元 11
    TEXTURE12: 0x84CC, // 纹理单元 12
    TEXTURE13: 0x84CD, // 纹理单元 13
    TEXTURE14: 0x84CE, // 纹理单元 14
    TEXTURE15: 0x84CF, // 纹理单元 15
    TEXTURE16: 0x84D0, // 纹理单元 16
    TEXTURE17: 0x84D1, // 纹理单元 17
    TEXTURE18: 0x84D2, // 纹理单元 18
    TEXTURE19: 0x84D3, // 纹理单元 19
    TEXTURE20: 0x84D4, // 纹理单元 20
    TEXTURE21: 0x84D5, // 纹理单元 21
    TEXTURE22: 0x84D6, // 纹理单元 22
    TEXTURE23: 0x84D7, // 纹理单元 23
    TEXTURE24: 0x84D8, // 纹理单元 24
    TEXTURE25: 0x84D9, // 纹理单元 25
    TEXTURE26: 0x84DA, // 纹理单元 26
    TEXTURE27: 0x84DB, // 纹理单元 27
    TEXTURE28: 0x84DC, // 纹理单元 28
    TEXTURE29: 0x84DD, // 纹理单元 29
    TEXTURE30: 0x84DE, // 纹理单元 30
    TEXTURE31: 0x84DF, // 纹理单元 31
    ACTIVE_TEXTURE: 0x84E0, // 当前激活的纹理单元

    // 纹理环绕方式（TextureWrapMode）
    REPEAT: 0x2901, // 重复
    CLAMP_TO_EDGE: 0x812F, // 钳制到边缘
    MIRRORED_REPEAT: 0x8370, // 镜像重复

    // Uniform 类型（Uniform Types）
    FLOAT_VEC2: 0x8B50, // vec2 浮点向量
    FLOAT_VEC3: 0x8B51, // vec3 浮点向量
    FLOAT_VEC4: 0x8B52, // vec4 浮点向量
    INT_VEC2: 0x8B53, // ivec2 整型向量
    INT_VEC3: 0x8B54, // ivec3 整型向量
    INT_VEC4: 0x8B55, // ivec4 整型向量
    BOOL: 0x8B56, // bool 布尔值
    BOOL_VEC2: 0x8B57, // bvec2 布尔向量
    BOOL_VEC3: 0x8B58, // bvec3 布尔向量
    BOOL_VEC4: 0x8B59, // bvec4 布尔向量
    FLOAT_MAT2: 0x8B5A, // mat2 2x2 浮点矩阵
    FLOAT_MAT3: 0x8B5B, // mat3 3x3 浮点矩阵
    FLOAT_MAT4: 0x8B5C, // mat4 4x4 浮点矩阵
    SAMPLER_2D: 0x8B5E, // 二维纹理采样器
    SAMPLER_CUBE: 0x8B60, // 立方体纹理采样器

    // 顶点数组（Vertex Arrays）
    VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622, // 顶点属性数组是否启用
    VERTEX_ATTRIB_ARRAY_SIZE: 0x8623, // 顶点属性数组分量数
    VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624, // 顶点属性数组步长
    VERTEX_ATTRIB_ARRAY_TYPE: 0x8625, // 顶点属性数组类型
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886A, // 顶点属性是否归一化
    VERTEX_ATTRIB_ARRAY_POINTER: 0x8645, // 顶点属性数组指针
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889F, // 顶点属性数组绑定的缓冲

    // 读取格式（Read Format）
    IMPLEMENTATION_COLOR_READ_TYPE: 0x8B9A, // 实现支持的颜色读取类型
    IMPLEMENTATION_COLOR_READ_FORMAT: 0x8B9B, // 实现支持的颜色读取格式

    // 着色器源（Shader Source）
    COMPILE_STATUS: 0x8B81, // 编译状态

    // 着色器精度（Shader Precision-Specified Types）
    LOW_FLOAT: 0x8DF0, // 低精度浮点
    MEDIUM_FLOAT: 0x8DF1, // 中精度浮点
    HIGH_FLOAT: 0x8DF2, // 高精度浮点
    LOW_INT: 0x8DF3, // 低精度整型
    MEDIUM_INT: 0x8DF4, // 中精度整型
    HIGH_INT: 0x8DF5, // 高精度整型

    // 帧缓冲对象（Framebuffer Object）
    FRAMEBUFFER: 0x8D40, // 帧缓冲
    RENDERBUFFER: 0x8D41, // 渲染缓冲
    RGBA4: 0x8056, // RGBA4 格式
    RGB5_A1: 0x8057, // RGB5_A1 格式
    RGB565: 0x8D62, // RGB565 格式
    DEPTH_COMPONENT16: 0x81A5, // 16 位深度分量格式
    STENCIL_INDEX8: 0x8D48, // 8 位模板索引格式
    DEPTH_STENCIL: 0x84F9, // 深度模板组合格式
    RENDERBUFFER_WIDTH: 0x8D42, // 渲染缓冲宽度
    RENDERBUFFER_HEIGHT: 0x8D43, // 渲染缓冲高度
    RENDERBUFFER_INTERNAL_FORMAT: 0x8D44, // 渲染缓冲内部格式
    RENDERBUFFER_RED_SIZE: 0x8D50, // 渲染缓冲红色位数
    RENDERBUFFER_GREEN_SIZE: 0x8D51, // 渲染缓冲绿色位数
    RENDERBUFFER_BLUE_SIZE: 0x8D52, // 渲染缓冲蓝色位数
    RENDERBUFFER_ALPHA_SIZE: 0x8D53, // 渲染缓冲 Alpha 位数
    RENDERBUFFER_DEPTH_SIZE: 0x8D54, // 渲染缓冲深度位数
    RENDERBUFFER_STENCIL_SIZE: 0x8D55, // 渲染缓冲模板位数
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8CD0, // 帧缓冲附件对象类型
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8CD1, // 帧缓冲附件对象名称
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8CD2, // 帧缓冲附件纹理层级
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8CD3, // 帧缓冲附件立方体贴图面
    COLOR_ATTACHMENT0: 0x8CE0, // 颜色附件 0
    DEPTH_ATTACHMENT: 0x8D00, // 深度附件
    STENCIL_ATTACHMENT: 0x8D20, // 模板附件
    DEPTH_STENCIL_ATTACHMENT: 0x821A, // 深度模板附件
    NONE: 0, // 无附件
    FRAMEBUFFER_COMPLETE: 0x8CD5, // 帧缓冲完整
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8CD6, // 帧缓冲附件不完整
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8CD7, // 帧缓冲缺少附件
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8CD9, // 帧缓冲附件尺寸不一致
    FRAMEBUFFER_UNSUPPORTED: 0x8CDD, // 帧缓冲组合不支持
    FRAMEBUFFER_BINDING: 0x8CA6, // 帧缓冲绑定
    RENDERBUFFER_BINDING: 0x8CA7, // 渲染缓冲绑定
    MAX_RENDERBUFFER_SIZE: 0x84E8, // 最大渲染缓冲尺寸
    INVALID_FRAMEBUFFER_OPERATION: 0x0506, // 非法帧缓冲操作

    // WebGL 专有枚举（WebGL-specific enums）
    UNPACK_FLIP_Y_WEBGL: 0x9240, // 解包时垂直翻转图像
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241, // 解包时预乘 Alpha
    CONTEXT_LOST_WEBGL: 0x9242, // WebGL 上下文丢失
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243, // 解包颜色空间转换
    BROWSER_DEFAULT_WEBGL: 0x9244, // 浏览器默认 WebGL 值
};

// 使用 CommonJS 的话，用 module.exports = WebGLConstants;
