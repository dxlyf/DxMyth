import { MagicString } from '../../../utils/MagicString';
/**
 * std140 布局规则：
 *
 * 1. 标量（float, int, uint, bool）：按 4 字节对齐
 * 2. 向量：
 *    - vec2/ivec2/uvec2/bvec2：按 8 字节对齐
 *    - vec3/ivec3/uvec3/bvec3：按 16 字节对齐（⚠️ 重要：不是 12 字节！）
 *    - vec4/ivec4/uvec4/bvec4：按 16 字节对齐
 * 3. 矩阵：
 *    - 列优先存储，每列按向量规则对齐
 *    - mat2：2 列，每列 vec2（8字节对齐），整体 16 字节
 *    - mat3：3 列，每列 vec3（16字节对齐），整体 48 字节
 *    - mat4：4 列，每列 vec4（16字节对齐），整体 64 字节
 * 4. 结构体：
 *    - 整体对齐 = 最大成员的对齐值
 *    - 大小会补齐到对齐值的倍数
 * 5. 数组：
 *    - 元素按 16 字节对齐（vec3 数组每个元素也是 16 字节对齐）
 *    - 整体大小 = 元素大小 × 元素数量（已对齐）
 * 6. Uniform Block：
 *    - 整体对齐 = 最大成员的对齐值
 *    - 总大小会补齐到对齐值的倍数（通常为 16 的倍数）
 */
/**
 * 获取 std140 布局下类型的对齐值（alignment）
 * 对齐值 = 该类型在内存中必须起始于的字节偏移倍数
 */
export declare const GL_STD140_ALIGNMENT: Record<string, number>;
/**
 * 获取 std140 布局下类型的大小（size）
 * 注意：这里返回的是逻辑大小，实际内存大小需要对齐到对齐值的倍数
 */
export declare const GL_STD140_SIZE: Record<string, number>;
export interface GL_STD140Field {
    name: string;
    type: string;
    offset: number;
    alignment: number;
    size: number;
    isArray?: boolean;
    arraySize?: number;
    isStruct?: boolean;
    fields?: GL_STD140Field[];
}
/**
 * std140 对齐计算器
 */
export declare class STD140Calculator {
    /**
     * 获取类型的对齐值
     */
    static getAlignment(type: string): number;
    /**
     * 获取类型的大小（逻辑大小）
     */
    static getSize(type: string): number;
    /**
     * 计算结构体的内存布局
     */
    static calculateStructLayout(fields: Array<{
        name: string;
        type: string;
        arraySize?: number;
    }>): {
        fields: GL_STD140Field[];
        totalSize: number;
        alignment: number;
    };
    /**
     * 将偏移量对齐到指定的对齐值
     */
    static alignOffset(offset: number, alignment: number): number;
    /**
     * 将大小对齐到指定的对齐值
     */
    static alignSize(size: number, alignment: number): number;
    /**
     * 计算 Uniform Block 的总大小
     */
    static calculateUniformBlockSize(fields: Array<{
        name: string;
        type: string;
        arraySize?: number;
    }>): {
        totalSize: number;
        alignment: number;
        fields: GL_STD140Field[];
    };
}
export type GLSLScalar = 'void' | 'bool' | 'int' | 'uint' | 'float' | 'double';
export type GLSLFloatVector = 'vec2' | 'vec3' | 'vec4';
export type GLSLIntVector = 'ivec2' | 'ivec3' | 'ivec4';
export type GLSLUintVector = 'uvec2' | 'uvec3' | 'uvec4';
export type GLSLBoolVector = 'bvec2' | 'bvec3' | 'bvec4';
export type GLSLDoubleVector = 'dvec2' | 'dvec3' | 'dvec4';
export type GLSLVector = GLSLFloatVector | GLSLIntVector | GLSLUintVector | GLSLBoolVector | GLSLDoubleVector;
export type GLSLFloatMatrix = 'mat2' | 'mat3' | 'mat4' | 'mat2x3' | 'mat2x4' | 'mat3x2' | 'mat3x4' | 'mat4x2' | 'mat4x3';
export type GLSLDoubleMatrix = 'dmat2' | 'dmat3' | 'dmat4' | 'dmat2x3' | 'dmat2x4' | 'dmat3x2' | 'dmat3x4' | 'dmat4x2' | 'dmat4x3';
export type GLSLMatrix = GLSLFloatMatrix | GLSLDoubleMatrix;
export type GLSLStandardSampler = 'sampler2D' | 'sampler3D' | 'samplerCube' | 'sampler2DArray' | 'samplerCubeArray';
export type GLSLShadowSampler = 'sampler2DShadow' | 'samplerCubeShadow' | 'sampler2DArrayShadow';
export type GLSLMSSampler = 'sampler2DMS' | 'sampler2DMSArray';
export type GLSLIntSampler = 'isampler2D' | 'isampler3D' | 'isamplerCube' | 'isampler2DArray' | 'isamplerCubeArray' | 'isampler2DMS' | 'isampler2DMSArray';
export type GLSLUintSampler = 'usampler2D' | 'usampler3D' | 'usamplerCube' | 'usampler2DArray' | 'usamplerCubeArray' | 'usampler2DMS' | 'usampler2DMSArray';
export type GLSLSampler = GLSLStandardSampler | GLSLShadowSampler | GLSLMSSampler | GLSLIntSampler | GLSLUintSampler;
export type GLSLStandardImage = 'image2D' | 'image3D' | 'imageCube' | 'image2DArray' | 'imageCubeArray' | 'image2DMS' | 'image2DMSArray';
export type GLSLIntImage = 'iimage2D' | 'iimage3D' | 'iimageCube' | 'iimage2DArray' | 'iimageCubeArray' | 'iimage2DMS' | 'iimage2DMSArray';
export type GLSLUintImage = 'uimage2D' | 'uimage3D' | 'uimageCube' | 'uimage2DArray' | 'uimageCubeArray' | 'uimage2DMS' | 'uimage2DMSArray';
export type GLSLImage = GLSLStandardImage | GLSLIntImage | GLSLUintImage;
export type GLSLAtomic = 'atomic_uint';
export type GLSLPrimitiveType = GLSLScalar | GLSLVector | GLSLMatrix | GLSLSampler | GLSLImage | GLSLAtomic;
export type GLSLType = GLSLPrimitiveType | 'struct' | 'array';
export type GLSLPrecision = 'highp' | 'mediump' | 'lowp';
export type GLSLStorage = 'const' | 'in' | 'out' | 'inout' | 'uniform' | 'buffer' | 'shared' | 'coherent' | 'volatile' | 'restrict';
export type GLSLLayout = 'std140' | 'std430' | 'shared' | 'packed' | 'row_major' | 'column_major';
export type GLSLInterpolation = 'flat' | 'noperspective' | 'centroid' | 'sample' | 'smooth';
export interface GLSLStruct {
    name: string;
    fields: {
        name: string;
        type: GLSLType | string;
        precision?: GLSLPrecision;
        layout?: GLSLLayout;
        arraySize?: number | 'dynamic';
    }[];
    layout?: GLSLLayout;
    binding?: number;
}
export interface GLSLUniformBlock {
    name: string;
    layout: GLSLLayout;
    binding: number;
    members: {
        name: string;
        type: GLSLType | string;
        arraySize?: number;
        precision?: GLSLPrecision;
    }[];
}
export interface GLSLFunctionParameter {
    name: string;
    type: GLSLType | string;
    storage: 'in' | 'out' | 'inout';
    precision?: GLSLPrecision;
}
export interface GLSLShaderInterface {
    attributes: {
        name: string;
        type: GLSLVector | 'float' | 'int' | 'uint';
        location: number;
        precision?: GLSLPrecision;
    }[];
    uniforms: {
        name: string;
        type: GLSLType | string;
        precision?: GLSLPrecision;
        binding?: number;
    }[];
    uniformBlocks: GLSLUniformBlock[];
    outputs: {
        name: string;
        type: GLSLType | string;
        location?: number;
        interpolation?: GLSLInterpolation;
    }[];
    structs: GLSLStruct[];
}
export type GLSLVertexBuiltIn = 'gl_Position' | 'gl_PointSize' | 'gl_VertexID' | 'gl_InstanceID' | 'gl_DrawID' | 'gl_BaseVertex' | 'gl_BaseInstance';
export type GLSLFragmentBuiltIn = 'gl_FragCoord' | 'gl_FrontFacing' | 'gl_PointCoord' | 'gl_FragDepth' | 'gl_SampleID' | 'gl_SamplePosition' | 'gl_SampleMask' | 'gl_HelperInvocation' | 'gl_LastFragData';
export type GLSLComputeBuiltIn = 'gl_NumWorkGroups' | 'gl_WorkGroupID' | 'gl_LocalInvocationID' | 'gl_GlobalInvocationID' | 'gl_LocalInvocationIndex' | 'gl_WorkGroupSize';
export declare function isVectorType(type: string): type is GLSLVector;
export declare const GLSLTypeSize: Record<GLSLPrimitiveType, number>;
export type GLProgramOptions = {
    vertexShader: string;
    fragmentShader: string;
    uniforms?: Record<string, number>;
    attributes?: Record<string, number>;
};
export type AttributeMate = {
    name: string;
    location: number;
    type: number;
    size: number;
};
export type UnifromBlcokMemberMate = {
    name: string;
    type: number;
    size: number;
    offset: number;
};
export type UnifromMate = {
    king: string;
    name: string;
    location: WebGLUniformLocation | null;
    type?: number;
    size?: number;
    index?: number;
    blockIndex?: number | null;
    binding?: number | null;
    members?: UnifromBlcokMemberMate[];
};
/**
 * #version 300 es

// ============================================
// 精度声明
// ============================================
precision highp float;
precision highp int;

// ============================================
// 1. layout 用于 attribute (in) - 指定位置
// ============================================
// 显式指定 attribute 的位置索引，方便与 JavaScript 绑定
layout(location = 0) in vec3 aPosition;   // 位置索引 0
layout(location = 1) in vec3 aNormal;     // 位置索引 1
layout(location = 2) in vec2 aUv;         // 位置索引 2
layout(location = 3) in vec4 aColor;      // 位置索引 3
layout(location = 4) in int aIndex;       // 位置索引 4（整型也支持）

// 如果不指定 location，编译器会自动分配
// in vec3 aTangent;  // 自动分配 location

// ============================================
// 2. layout 用于 uniform block - 绑定点 + 内存布局
// ============================================

// 2.1 最常用的写法：指定绑定点 + std140 布局
layout(std140, binding = 0) uniform TransformBlock {
    mat4 model;
    mat4 view;
    mat4 projection;
    mat3 normalMatrix;
} transforms;  // 实例名

// 2.2 也可以只指定布局，不指定绑定（在 JavaScript 中通过 uniformBlockBinding 设置）
layout(std140) uniform MaterialBlock {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
} material;

// 2.3 使用 std430 布局（更紧凑，适合大量数据）
layout(std430, binding = 1) uniform LightBlock {
    vec4 positions[100];  // 100 盏灯的位置
    vec4 colors[100];     // 100 盏灯的颜色
    float intensities[100];
} lights;

// 2.4 无实例名的 uniform block（直接访问成员名）
layout(std140, binding = 2) uniform ConfigBlock {
    float uTime;
    vec3 uCameraPosition;
    int uMaxLights;
};  // 注意没有实例名，直接使用 uTime, uCameraPosition 等

// ============================================
// 3. layout 用于 struct 内的成员（很少用，但支持）
// ============================================
struct LightData {
    layout(offset = 0) vec3 position;   // 指定偏移量（字节）
    layout(offset = 16) vec3 color;     // 手动对齐
    layout(offset = 32) float intensity;
    layout(offset = 36) bool enabled;
};  // 总大小会按 std140 规则自动补齐

// 在 uniform block 中使用这个结构体
layout(std140, binding = 3) uniform SceneBlock {
    LightData mainLight;
    LightData fillLight;
};

// ============================================
// 4. layout 用于 out（输出变量）- 指定位置
// ============================================
// 顶点着色器的输出变量可以指定位置，用于与片元着色器的输入匹配
layout(location = 0) out vec3 vNormal;        // 输出位置 0
layout(location = 1) out vec2 vUv;            // 输出位置 1
layout(location = 2) out vec4 vColor;         // 输出位置 2
layout(location = 3) out vec3 vWorldPosition; // 输出位置 3
layout(location = 4) out vec3 vViewPosition;  // 输出位置 4
layout(location = 5) out float vIntensity;    // 输出位置 5

// 也可以不指定 location，编译器自动分配
// out vec3 vTangent;  // 自动分配

// ============================================
// 5. layout 用于常量数组（指定字节对齐）
// ============================================
// 部分实现支持在全局常量上使用 layout（较少用）
layout(offset = 0) const float PI = 3.14159265359;

// ============================================
// 6. layout 用于共享/隔离的接口（较少用）
// ============================================
// 在多个着色器阶段间共享变量
// layout(shared) uniform SharedBlock { ... };
// layout(packed) uniform PackedBlock { ... };

// ============================================
// 结构体定义（不包含 layout）
// ============================================
struct Light {
    vec3 position;
    vec3 color;
    float intensity;
};

// 使用结构体的数组（在 uniform block 中）
layout(std140, binding = 4) uniform LightArrayBlock {
    Light lights[10];  // 结构体数组
    int activeCount;
};

// ============================================
// 普通 uniform（不含 layout）
// ============================================
uniform float uTime;
uniform int uFrameCount;

// ============================================
// 数组的多种用法
// ============================================
// 基本类型数组
uniform vec3 uPositions[8];

// 结构体数组（已在上面展示）
// Light uLights[4];

// ============================================
// 函数定义
// ============================================
vec3 calculateNormal(vec3 normal) {
    return normalize(normal);
}

// ============================================
// main 函数
// ============================================
void main() {
    // ---- 使用普通 uniform ----
    float time = uTime;
    
    // ---- 使用 uniform block（带实例名） ----
    mat4 modelMatrix = transforms.model;
    mat4 viewMatrix = transforms.view;
    mat4 projectionMatrix = transforms.projection;
    mat3 normalMat = transforms.normalMatrix;
    
    // ---- 使用 uniform block（无实例名） ----
    vec3 cameraPos = uCameraPosition;  // 直接使用
    float deltaTime = uTime;           // 直接使用
    
    // ---- 计算世界坐标 ----
    vec4 worldPos = modelMatrix * vec4(aPosition, 1.0);
    vWorldPosition = worldPos.xyz;
    
    // ---- 计算视图坐标 ----
    vec4 viewPos = viewMatrix * worldPos;
    vViewPosition = viewPos.xyz;
    
    // ---- 计算法线 ----
    vNormal = normalize(normalMat * aNormal);
    
    // ---- 传递 UV 和颜色 ----
    vUv = aUv;
    vColor = aColor;
    
    // ---- 使用结构体数组（LightArrayBlock） ----
    float totalIntensity = 0.0;
    for (int i = 0; i < activeCount && i < 10; i++) {
        totalIntensity += lights.lights[i].intensity;
    }
    vIntensity = totalIntensity;
    
    // ---- 使用 LightBlock（std430 布局的 block） ----
    // 注意：std430 布局访问方式与 std140 相同
    vec3 lightPos = lights.positions[0].xyz;
    vec3 lightColor = lights.colors[0].xyz;
    
    // ---- 使用 SceneBlock 中的结构体 ----
    vec3 mainLightPos = mainLight.position;
    vec3 fillLightPos = fillLight.position;
    
    // ---- 计算最终位置 ----
    gl_Position = projectionMatrix * viewMatrix * worldPos;
    
    // ---- 设置点大小（如果需要） ----
    gl_PointSize = 2.0;
}

分类	类型列表
标量	bool, int, uint, float, double
向量	vec2/3/4, ivec2/3/4, uvec2/3/4, bvec2/3/4, dvec2/3/4
矩阵	mat2/3/4, mat2x3/4, mat3x2/4, mat4x2/3, dmat2/3/4
纹理	sampler2D/3D/Cube/2DArray/2DShadow/2DMS, isampler*, usampler*
图像	image2D/3D/Cube, iimage*, uimage*
结构体	struct Name { ... }
数组	Type name[size]
其他	void, atomic_uint
 */
export declare class GLSLShaderSource {
    static shareSources: Map<string, GLSLShaderSource>;
    name: string;
    source: MagicString;
    glslVersion: number;
    constructor(name: string);
    version(version: number): this;
    include(name: string): this;
    definePrecision(type: string, precision: 'highp' | 'mediump' | 'lowp'): this;
    defineMacro(name: string, value?: string): this;
    defineAttribute(type: GLSLPrimitiveType | string, name: string, location?: number): this;
    defineUniform<T extends string>(type: T, name: string): this;
    defineUniformBlock(name: string, members: [type: string, name: string][], binding?: number, layout?: 'std140' | 'std430' | 'shared' | 'packed'): this;
    defineUniformStruct(name: string, members: [type: string, name: string][], varName: string): this;
    defineStruct(name: string, members: ([type: string, name: string])[]): this;
    defineVarying(type: string, name: string): this;
    defineMain(body: string): this;
    defineVariable(type: string, name: string): this;
    append(source: string): this;
    appendLine(source: string): this;
    toString(): any;
}
/** 由 gl.getActiveAttrib / gl.getActiveUniform 返回的 WebGL 类型对应的布局信息 */
export type GLTypeInfo = {
    /** GLSL 类型名，如 'vec2'、'ivec3' */
    type: string;
    /** 标量分量个数（vec3=3、mat3=9） */
    itemSize: number;
    /** 字节大小（vec3=12、mat4=64） */
    size: number;
    /** std140 对齐字节数（vec2=8、vec3/vec4=16） */
    align: number;
};
export declare class GLProgram {
    static programs: Map<string, GLProgram>;
    static getProgram(gl: WebGL2RenderingContext, options: GLProgramOptions): GLProgram;
    program: WebGLProgram;
    gl: WebGL2RenderingContext;
    attributes: Map<string, AttributeMate>;
    uniforms: Map<string, UnifromMate>;
    options: GLProgramOptions;
    private _typeInfoMap;
    constructor(gl: WebGL2RenderingContext, options?: GLProgramOptions);
    use(): void;
    createShader(type: number, source: string): WebGLShader;
    compile(): void;
    fetchActiveProgram(): void;
    fetchActiveAttributes(): void;
    fetchActiveUniforms(): void;
    drawArrayObject(): void;
    drawElementObject(): void;
}
