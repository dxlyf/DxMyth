/**
 * 渲染器核心类型定义
 * 提供WebGL和WebGPU之间的类型抽象
 */

// 渲染器配置选项
export interface RendererOptions {
    width?: number;
    height?: number;
    pixelRatio?: number;
    clearColor?: Color;
    preferWebGPU?: boolean;
    enableDebug?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    powerPreference?: 'default' | 'low-power' | 'high-performance';
}

// 颜色类型
export type Color = [number, number, number, number]; // RGBA

// 顶点格式
export interface VertexAttribute {
    name: string;
    size: number;  // 组件数量
    type: 'float' | 'uint8' | 'int8' | 'uint16' | 'int16' | 'uint32' | 'int32';
    normalized?: boolean;
    offset?: number;
    stride?: number;
}

// 顶点缓冲
export interface VertexBuffer {
    data: ArrayBuffer;
    attributes: VertexAttribute[];
    usage?: 'static' | 'dynamic' | 'stream';
    stride?: number;
    count?: number;
}

// 索引缓冲
export interface IndexBuffer {
    data: ArrayBuffer;
    type?: 'uint8' | 'uint16' | 'uint32';
    usage?: 'static' | 'dynamic' | 'stream';
    count?: number;
}

// 纹理格式
export interface TextureOptions {
    width: number;
    height: number;
    data?: ArrayBufferView;
    format?: 'rgba8unorm' | 'rgba8snorm' | 'rgba16float' | 'r32float' | 'depth24plus';
    wrapS?: 'clamp' | 'repeat' | 'mirrored-repeat';
    wrapT?: 'clamp' | 'repeat' | 'mirrored-repeat';
    minFilter?: 'nearest' | 'linear' | 'nearest-mipmap-nearest' | 'linear-mipmap-nearest' | 'nearest-mipmap-linear' | 'linear-mipmap-linear';
    magFilter?: 'nearest' | 'linear';
    mipmaps?: boolean;
    usage?: 'sampled' | 'storage' | 'render-target';
}

// 采样器
export interface SamplerOptions {
    wrapS?: 'clamp' | 'repeat' | 'mirrored-repeat';
    wrapT?: 'clamp' | 'repeat' | 'mirrored-repeat';
    minFilter?: 'nearest' | 'linear' | 'nearest-mipmap-nearest' | 'linear-mipmap-nearest' | 'nearest-mipmap-linear' | 'linear-mipmap-linear';
    magFilter?: 'nearest' | 'linear';
    lodMin?: number;
    lodMax?: number;
    compare?: 'none' | 'less' | 'less-equal' | 'greater' | 'greater-equal' | 'equal' | 'not-equal';
}

// 着色器类型
export type ShaderType = 'vertex' | 'fragment' | 'compute';

// 着色器源
export interface ShaderSource {
    vertex?: string;
    fragment?: string;
    compute?: string;
}

// 管线状态
export interface PipelineState {
    topology?: 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triangle-strip' | 'triangle-fan';
    primitiveRestart?: boolean;
    primitiveRestartIndex?: number;
    cullMode?: 'none' | 'front' | 'back';
    frontFace?: 'ccw' | 'cw';
    depthTest?: boolean;
    depthWrite?: boolean;
    depthCompare?: 'never' | 'less' | 'equal' | 'less-equal' | 'greater' | 'not-equal' | 'greater-equal' | 'always';
    blendEnabled?: boolean;
    blendSrcFactor?: 'zero' | 'one' | 'src-color' | 'one-minus-src-color' | 'src-alpha' | 'one-minus-src-alpha' | 'dst-color' | 'one-minus-dst-color' | 'dst-alpha' | 'one-minus-dst-alpha';
    blendDstFactor?: 'zero' | 'one' | 'src-color' | 'one-minus-src-color' | 'src-alpha' | 'one-minus-src-alpha' | 'dst-color' | 'one-minus-dst-color' | 'dst-alpha' | 'one-minus-dst-alpha';
    blendEquation?: 'add' | 'subtract' | 'reverse-subtract';
}

// 渲染管线配置
export interface PipelineOptions {
    shaders: ShaderSource;
    vertexAttributes: VertexAttribute[];
    pipelineState?: PipelineState;
    uniforms?: UniformDescription[];
    bindGroups?: BindGroupDescription[];
}

//  uniform描述
export interface UniformDescription {
    name: string;
    type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4' | 'uint' | 'uvec2' | 'uvec3' | 'uvec4';
    count?: number;
    offset?: number;
    size?: number;
}

// BindGroup描述
export interface BindGroupDescription {
    entries: {
        binding: number;
        resource: 'uniform' | 'texture' | 'sampler' | 'storage';
        type: string;
        count?: number;
    }[];
    layout?: any;
}

// 渲染通道描述
export interface RenderPassOptions {
    target?: Texture;
    clear?: boolean;
    colorAttachments?: {
        view: Texture;
        clearValue?: Color;
        loadOp?: 'load' | 'clear';
        storeOp?: 'store' | 'discard';
    }[];
    depthStencilAttachment?: {
        view: Texture;
        depthClearValue?: number;
        depthLoadOp?: 'load' | 'clear';
        depthStoreOp?: 'store' | 'discard';
        stencilClearValue?: number;
        stencilLoadOp?: 'load' | 'clear';
        stencilStoreOp?: 'store' | 'discard';
    };
    occlusionQuerySet?: any;
}

// 计算通道描述
export interface ComputePassOptions {
    dispatchX: number;
    dispatchY?: number;
    dispatchZ?: number;
}

// 材质参数
export interface MaterialParams {
    [key: string]: any;
}

// 几何体数据
export interface GeometryData {
    vertexBuffers: VertexBuffer[];
    indexBuffer?: IndexBuffer;
    count?: number;
    instanceCount?: number;
}

// 几何体选项
export interface GeometryOptions {
    topology?: 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triangle-strip' | 'triangle-fan';
    primitiveRestart?: boolean;
    primitiveRestartIndex?: number;
}

// 调试信息
export interface DebugInfo {
    drawCalls: number;
    triangles: number;
    vertices: number;
    textureMemory: number;
    bufferMemory: number;
    shaderCompilations: number;
    frameTime: number;
}

// 渲染器事件类型
export type RendererEvent = 'initialize' | 'resize' | 'frame' | 'error';



// 前置声明
declare class Renderer {}
declare class Texture {}
declare class Material {}
declare class Geometry {}
declare class Pipeline {}
