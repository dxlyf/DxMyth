/**
 * Buffer usage.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
 * @see https://www.w3.org/TR/webgpu/#buffer-usage
 */
export declare enum BufferUsage {
    /** Index buffer */
    Index = 16,
    /** Vertex buffer */
    Vertex = 32,
    /** Uniform buffer */
    Uniform = 64,
    /** Data is updated infrequently */
    Dynamic = 4096,
    /** Data is overwritten each frame */
    Stream = 8192
}
/**
 * Texture usage.
 * @see https://www.w3.org/TR/webgpu/#typedefdef-gputextureusageflags
 */
export declare enum TextureUsage {
    /** Use as texture binding */
    TextureBinding = 4,
    /** Use as render target */
    RenderAttachment = 16
}
/**
 * A color write mask.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask
 * @see https://www.w3.org/TR/webgpu/#typedefdef-gpucolorwriteflags
 */
export declare enum ColorWrite {
    Red = 1,
    Green = 2,
    Blue = 4,
    Alpha = 8,
    All = 15
}
/**
 * Texture view dimension type.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
 * @see https://www.w3.org/TR/webgpu/#enumdef-gputextureviewdimension
 */
export declare enum TextureDimension {
    /** 2D texture */
    D2 = 3553,
    /** 2D array texture. */
    D2Array = 35866,
    /** Cube map texture */
    CubeMap = 34067,
    /** 3D texture. */
    D3 = 32879
}
/**
 * Texture format.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage
 * @see https://www.w3.org/TR/webgpu/#texture-formats
 */
export declare enum TextureFormat {
    R8 = 33321,
    R8SNORM = 36756,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    RG8 = 33323,
    RG8SNORM = 36757,
    RG8UI = 33336,
    RG8I = 33335,
    R32UI = 33334,
    R32I = 33333,
    RG16UI = 33338,
    RG16I = 33337,
    RGBA8 = 32856,
    SRGBA8 = 35907,
    RGBA8SNORM = 36759,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGB10A2 = 32857,
    RG32UI = 33340,
    RG32I = 33339,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA32UI = 36208,
    RGBA32I = 36226,
    R16F = 33325,
    RG16F = 33327,
    RG11B10F = 35898,
    RGBA16F = 34842,
    R32F = 33326,
    RG32F = 33328,
    RGBA32F = 34836,
    Depth16 = 33189,
    Depth24 = 33190,
    Depth24Stencil8 = 35056,
    Depth32F = 36012,
    Depth32FStencil8 = 36013
}
/**
 * Texture addressing wrap mode (aka UV wrap).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpuaddressmode
 */
export declare enum AddressMode {
    /** Clamp texture coords to (0.0 .. 1.0) */
    ClampToEdge = 33071,
    /** Repeat texture coords within (0.0 .. 1.0) */
    Repeat = 10497,
    /** Mirror-repeat texture coords (0.0 .. 1.0 .. 0.0) */
    MirrorRepeat = 33648
}
/**
 * Texture sampler filter mode.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpufiltermode
 */
export declare enum FilterMode {
    /** use nearest-filtering (aka point-filtering) */
    Nearest = 9728,
    /** use linear filtering */
    Linear = 9729
}
/**
 * Comparision functions for depth and stencil checks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpucomparefunction
 */
export declare enum CompareFunction {
    /** new value never passes comparion test */
    Never = 512,
    /** new value passses if it is less than the existing value */
    Less = 513,
    /** new value passes if it is equal to existing value */
    Equal = 514,
    /** new value passes if it is less than or equal to existing value */
    LessEqual = 515,
    /** new value passes if it is greater than existing value */
    Greater = 516,
    /** new value passes if it is not equal to existing value */
    NotEqual = 517,
    /** new value passes if it is greater than or equal to existing value */
    GreaterEqual = 518,
    /** new value always passes */
    Always = 519
}
/**
 * Shader stage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createShader
 */
export declare enum ShaderStage {
    /** Vertex shader */
    Vertex = 1,
    /** Fragment shader */
    Fragment = 2
}
/**
 * Primitive topology.
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpuprimitivetopology
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 */
export declare enum PrimitiveTopology {
    /** Point list */
    Points = 0,
    /** Line list */
    Lines = 1,
    /** Line strip */
    LineStrip = 3,
    /** Triangle list */
    Triangles = 4,
    /** Triangle strip */
    TriangleStrip = 5
}
/**
 * Vertex index formats.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat
 */
export declare enum IndexFormat {
    /** 16-bit indices */
    UInt16 = 5123,
    /** 32-bit indices. */
    UInt32 = 5125
}
/**
 * Identify which side is the front face by setting a winding orientation.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/frontFace
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpufrontface
 */
export declare enum FrontFace {
    /** Counter-clockwise winding. */
    CCW = 2305,
    /** Clockwise winding. */
    CW = 2304
}
/**
 * Specify the face to cull.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpucullmode
 */
export declare enum CullMode {
    /** Disable culling */
    None = 0,
    /** Cull front face */
    Front = 1028,
    /** Cull back face */
    Back = 1029
}
/**
 * Stencil-buffer operation.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/stencilOpSeparate
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpustenciloperation
 */
export declare enum StencilOperation {
    /** keep the current stencil value */
    Keep = 7680,
    /** set the stencil value to zero */
    Zero = 0,
    /** replace the stencil value with stencil reference value */
    Replace = 7681,
    /** perform a logical bitwise invert operation on the stencil value */
    Invert = 5386,
    /** increment the current stencil value, clamp to max */
    Increment = 7682,
    /** decrement the current stencil value, clamp to zero */
    Decrement = 7683,
    /** increment the current stencil value, with wrap-around */
    IncrementWrap = 34055,
    /** decrement the current stencil value, with wrap-around */
    DecrementWrap = 34056
}
/**
 * Alpha-blending factors.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpublendfactor
 */
export declare enum BlendFactor {
    /** blend factor of zero */
    Zero = 0,
    /** blend factor of one */
    One = 1,
    /** blend factor of source color */
    Src = 768,
    /** blend factor of one minus source color */
    OneMinusSrc = 769,
    /** blend factor of source alpha */
    SrcAlpha = 770,
    /** blend factor of one minus source alpha */
    OneMinusSrcAlpha = 771,
    /** blend factor of destination color */
    Dst = 774,
    /** blend factor of one minus destination alpha */
    OneMinusDst = 775,
    /** blend factor of destination alpha */
    DstAlpha = 772,
    /** blend factor of one minus destination alpha */
    OneMinusDstAlpha = 773,
    /** blend factor of the minimum of either source alpha or one minus destination alpha */
    SrcAlphaSaturated = 776,
    /** blend factor of constant color */
    Constant = 32769,
    /** blend factor of one minus constant color */
    OneMinusConstant = 32770
}
/**
 * Blend operation.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquation
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpublendoperation
 */
export declare enum BlendOperation {
    /** Add source and destination pixel values */
    Add = 32774,
    /** Subtract destination from source pixel values */
    Subtract = 32778,
    /** Subtract source from destination pixel values */
    ReverseSubtract = 32779,
    /** The minimum of the source and destination pixel values. */
    Min = 32775,
    /** The maximum of the source and destination pixel values. */
    Max = 32776
}
export declare enum VertexStepMode {
    /** Per vertex */
    Vertex = 0,
    /** Instanced */
    Instance = 1
}
/**
 * Vertex component format.
 * Enum values encode the properties of the formats:
 * - bits 0-3 encodes the number of components (1, 2, 3 or 4)
 * - bits 4-7 encodes the number of bytes per component (1, 2 or 4)
 * - bits 8-11 encodes the data type (1 = int, 2 = float)
 * - bits 12-13 encodes the signedness and normalization for int (0 = unsigned, 1 = signed, 2 = unsigned normalized, 3 = signed normalized)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 * @see https://www.w3.org/TR/webgpu/#enumdef-gpuvertexformat
 */
export declare enum VertexFormat {
    UI8x2 = 274,
    UI8x4 = 276,
    I8x2 = 4370,
    I8x4 = 4372,
    UNORM8x2 = 8466,
    UNORM8x4 = 8468,
    SNORM8x2 = 12562,
    SNORM8x4 = 12564,
    UI16x2 = 290,
    UI16x4 = 292,
    I16x2 = 4386,
    I16x4 = 4388,
    UNORM16x2 = 8482,
    UNORM16x4 = 8484,
    SNORM16x2 = 12578,
    SNORM16x4 = 12580,
    F16x2 = 546,
    F16x4 = 548,
    F32 = 577,
    F32x2 = 578,
    F32x3 = 579,
    F32x4 = 580
}
/**
 * Binding type.
 */
export declare enum BindingType {
    /** Uniform buffer type */
    Buffer = 0,
    /** Sampler type */
    Sampler = 1,
    /** Texture type */
    Texture = 2
}
/**
 * Sampler binding type.
 */
export declare enum SamplerBindingType {
    Filtering = 0,
    NonFiltering = 1,
    Comparison = 2
}
/**
 * Texture sample type
 */
export declare enum TextureSampleType {
    Float = 0,
    Depth = 1,
    Int = 2,
    UInt = 3,
    UnfilterableFloat = 4
}
/**
 * Cube map face.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
 */
export declare enum CubeMapFace {
    /** Positive X face */
    X = 0,
    /** Negative X face */
    NegativeX = 1,
    /** Positive Y face */
    Y = 2,
    /** Negative Y face */
    NegativeY = 3,
    /** Positive Z face */
    Z = 4,
    /** Negative Z face */
    NegativeZ = 5
}
/**
 * Hint for mipmap generation.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/hint
 */
export declare enum MipmapHint {
    /** The most efficient option should be chosen. */
    Fast = 4353,
    /** The most correct, or highest quality, option should be chosen. */
    Nice = 4354
}
//# sourceMappingURL=type.d.ts.map