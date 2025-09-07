

type GL = WebGL2RenderingContext;

export type ShaderProgramConfig = {
    vert: string
    frag: string
    uniforms: Record<string, UniformInfo>,
    attributes: Record<string, AttributeInfo>
}
type UniformInfoType='single' | 'array' | 'struct' | 'block'|'block-member'
export type UniformInfo<T extends UniformInfoType=UniformInfoType,Value=any> = {
    name: string;
    locationName?: string;
    type: T;
    glType: number,
    size: number;
    location: WebGLUniformLocation | null;
    uniforms?: Record<string, UniformInfo>|UniformInfo[] | null
    blockIndex?: number;
    blockBinding?:number;
    value?:Value
};

export type AttributeInfo = {
    name: string;
    type: number;
    size: number;
    location: number;
    isArray: boolean;
};

export type UniformBlockInfo = {
    name: string;
    index: number;
    size: number;
    activeUniforms: number;
    binding: number;
};
export type UniformInfos = Record<string, UniformInfo>
export type AttributeInfos = Record<string, AttributeInfo>

export type PrecisionType = 'lowp' | 'mediump' | 'highp';

export type CreateProgramFactoryConfig={

}
export function createProgramFactory(factoryConfig:CreateProgramFactoryConfig){
        
}
/**
     * 创建 WebGL 程序
     * @param {GL} gl WebGL2 上下文
     * @param {string} vertexShaderSource 顶点着色器源码
     * @param {string} fragmentShaderSource 片段着色器源码
     * @returns 创建的程序对象
     */
export function createWebGLProgram(gl: GL, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null {

    const program = gl.createProgram()
    if (!program) {
        console.error('Failed to create WebGL program')
        return null
    }
    const vertexShader = createWebGLShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createWebGLShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) {
        vertexShader && gl.deleteShader(vertexShader);
        fragmentShader && gl.deleteShader(fragmentShader);
        return null;
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program
}
function handleSource(string: string, errorLine: number) {

    const lines = string.split('\n');
    const lines2 = [];

    const from = Math.max(errorLine - 6, 0);
    const to = Math.min(errorLine + 6, lines.length);

    for (let i = from; i < to; i++) {

        const line = i + 1;
        lines2.push(`${line === errorLine ? '>' : ' '} ${line}: ${lines[i]}`);

    }

    return lines2.join('\n');

}
function getShaderErrors(gl: GL, shader: WebGLShader, type: string) {

    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    const errors = gl.getShaderInfoLog(shader)?.trim() || '';

    if (status && errors === '') return '';

    const errorMatches = /ERROR: 0:(\d+)/.exec(errors);
    if (errorMatches) {

        // --enable-privileged-webgl-extension
        // console.log( '**' + type + '**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

        const errorLine = parseInt(errorMatches[1]);
        return type.toUpperCase() + '\n\n' + errors + '\n\n' + handleSource(gl.getShaderSource(shader)!, errorLine);

    } else {

        return errors;

    }

}
/**
 * 编译着色器
 * @param gl WebGL2 上下文
 * @param type 着色器类型
 * @param source 着色器源码
 * @returns 编译后的着色器
 */
export function createWebGLShader(gl: GL, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type)
    if (shader === null) {
        console.error('Failed to create WebGL shader')
        return null
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error: \n' + getShaderErrors(gl, shader, type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'))
        gl.deleteShader(shader);
        return null
    }
    return shader
}


// ----- 缓冲区管理 -----
/**
 * 创建缓冲区
 * @param gl WebGL2 上下文
 * @param data 缓冲区数据
 * @param usage 使用方式 (默认为 gl.STATIC_DRAW)
 * @returns 创建的缓冲区
 */
export function createBuffer(gl: GL, data: ArrayBufferView, usage: number = gl.STATIC_DRAW): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) return null;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}
/**
 * 创建索引缓冲区
 * @param gl WebGL2 上下文
 * @param indices 索引数据
 * @param usage 使用方式 (默认为 gl.STATIC_DRAW)
 * @returns 创建的索引缓冲区
 */
export function createIndexBuffer(gl: GL, indices: ArrayBufferView, usage: number = gl.STATIC_DRAW): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) return null;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, usage);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return buffer;
}

/**
 * 创建纹理
 * @param gl WebGL2 上下文
 * @param options 纹理选项
 * @returns 创建的纹理
 */
export function createTexture(
    gl: GL,
    options: {
        src?: TexImageSource | null;
        width?: number;
        height?: number;
        format?: number;
        internalFormat?: number;
        type?: number;
        wrapS?: number;
        wrapT?: number;
        minFilter?: number;
        magFilter?: number;
        generateMipmap?: boolean;
    } = {}
): WebGLTexture | null {
    const texture = gl.createTexture();
    if (!texture) return null;

    const {
        src = null,
        width = 1,
        height = 1,
        format = gl.RGBA,
        internalFormat = gl.RGBA,
        type = gl.UNSIGNED_BYTE,
        wrapS = gl.CLAMP_TO_EDGE,
        wrapT = gl.CLAMP_TO_EDGE,
        minFilter = gl.LINEAR,
        magFilter = gl.LINEAR,
        generateMipmap = false
    } = options;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    if (src) {
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, src);
    } else {
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            internalFormat,
            width,
            height,
            0,
            format,
            type,
            null
        );
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);// 设置纹理的环绕方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);// 设置纹理的环绕方式

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter); // 设置纹理的放大和缩小过滤方式

    if (generateMipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}


/**
 * 设置顶点属性指针
 * @param gl WebGL2 上下文
 * @param program 程序对象
 * @param name 属性名
 * @param size 每个顶点分量数
 * @param type 数据类型
 * @param normalized 是否归一化
 * @param stride 步长
 * @param offset 偏移量
 */
export function setAttributePointer(
    gl: GL,
    program: WebGLProgram,
    name: string,
    size: number,
    type: number,
    normalized: boolean = false,
    stride: number = 0,
    offset: number = 0
): void {
    const location = gl.getAttribLocation(program, name);
    if (location === -1) {
        console.warn(`Attribute "${name}" not found in program`);
        return;
    }

    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
        location,
        size,
        type,
        normalized,
        stride,
        offset
    );
}

/**
 * 设置统一变量(uniform)
 * @param gl WebGL2 上下文
 * @param location 位置
 * @param name uniform名称
 * @param value 值
 */
export function setUniform(
    gl: GL,
    location: WebGLUniformLocation,
    name: string,
    value: number | number[] | Float32List | Int32List
): void {

    if (typeof value === 'number') {
        gl.uniform1f(location, value);
    } else if (value.length === 2) {
        gl.uniform2fv(location, value);
    } else if (value.length === 3) {
        gl.uniform3fv(location, value);
    } else if (value.length === 4) {
        gl.uniform4fv(location, value);
    } else if (value.length === 9) {
        gl.uniformMatrix3fv(location, false, value);
    } else if (value.length === 16) {
        gl.uniformMatrix4fv(location, false, value);
    } else {
        console.warn(`Unsupported uniform type for "${name}"`);
    }
}

/**
 * 清除画布
 * @param gl WebGL2 上下文
 * @param color 清除颜色 [r, g, b, a]
 */
export function clear(gl: GL, color: [number, number, number, number] = [0, 0, 0, 1]): void {
    gl.clearColor(...color);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
// 辅助函数：获取 GLSL 类型名称
export function getGLSLTypeName(gl: GL, type: number) {
    const typeMap = {
        [gl.FLOAT]: 'float',
        [gl.FLOAT_VEC2]: 'vec2',
        [gl.FLOAT_VEC3]: 'vec3',
        [gl.FLOAT_VEC4]: 'vec4',
        [gl.INT]: 'int',
        [gl.INT_VEC2]: 'ivec2',
        [gl.INT_VEC3]: 'ivec3',
        [gl.INT_VEC4]: 'ivec4',
        [gl.BOOL]: 'bool',
        [gl.BOOL_VEC2]: 'bvec2',
        [gl.BOOL_VEC3]: 'bvec3',
        [gl.BOOL_VEC4]: 'bvec4',
        [gl.FLOAT_MAT2]: 'mat2',
        [gl.FLOAT_MAT3]: 'mat3',
        [gl.FLOAT_MAT4]: 'mat4',
        [gl.FLOAT_MAT2x3]: 'mat2x3',
        [gl.FLOAT_MAT2x4]: 'mat2x4',
        [gl.FLOAT_MAT3x2]: 'mat3x2',
        [gl.FLOAT_MAT3x4]: 'mat3x4',
        [gl.FLOAT_MAT4x2]: 'mat4x2',
        [gl.FLOAT_MAT4x3]: 'mat4x3',
        [gl.SAMPLER_2D]: 'sampler2D',
        [gl.SAMPLER_CUBE]: 'samplerCube',
        [gl.SAMPLER_3D]: 'sampler3D',
        [gl.SAMPLER_2D_ARRAY]: 'sampler2DArray',
        [gl.SAMPLER_2D_SHADOW]: 'sampler2DShadow',
        [gl.SAMPLER_CUBE_SHADOW]: 'samplerCubeShadow',
        [gl.UNSIGNED_INT]: 'uint',
        [gl.UNSIGNED_INT_SAMPLER_2D]: 'usampler2D'
    };
    return typeMap[type as keyof typeof typeMap] || `unknown(0x${type.toString(16)})`;
}

/**
 * 获取程序中所有激活的uniform信息
 * @param gl WebGL2上下文
 * @param program 程序对象
 * @returns uniform信息数组
 */
export function getActiveUniforms(gl: GL, program: WebGLProgram): UniformInfos {
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const uniforms: UniformInfos = {};

    function processUniform(info: { name: string, size: number, type: number,locationName?:string }, uniforms: UniformInfos) {
        // 解析数组uniform名称 (如"array[0]")
        const name=info.name
        const isArray = info.size > 1 || /\[\d*\]$/.test(name);
        const isStruct = /\./.test(name)
         if (isStruct) {
            // struct uniform
            processUniformStruct(info, uniforms)
        }else if (isArray) {
            processUniformArray(info, uniforms);
        }else {
            const locationName=info.locationName||info.name
            uniforms[name] = {
                name: name,
                locationName:locationName,
                type: 'single',
                glType: info.type,
                size: info.size,
                location: gl.getUniformLocation(program, locationName)
            }
        }
    }
    function processUniformArray(info: { name: string, size: number, type: number }, uniforms: UniformInfos): void {
        const m = info.name.match(/\[(\d*)\]$/)
        if (m) {
            const baseName = info.name.slice(0,m.index), arrayLength =info.size
            const subUniforms: UniformInfo[] = []
            for (let i = 0; i < arrayLength; ++i) {
                const uniformName = `${baseName}[${i}]`;
                const location = gl.getUniformLocation(program, uniformName);
                subUniforms.push({
                    name: uniformName,
                    locationName:uniformName,
                    type: 'single',
                    glType: info.type,
                    size: 1,
                    location: location
                })
            }
            uniforms[baseName] = {
                name: baseName,
                type: 'array',
                glType: info.type,
                size: info.size,
                location: null, // 数组的location为null
                uniforms: subUniforms
            }

        }
    }
    function processUniformStruct(info: { name: string, size: number, type: number }, uniforms: UniformInfos): void {
        const names = info.name.split('.')
        const structName = names[0], memberName  = names[1]
        if (!uniforms[structName]) {
            uniforms[structName] = {
                name: structName,
                type: 'struct',
                glType: info.type,
                size: 1,
                location: null,
                uniforms: {}
            }
        }
        processUniform({ name: memberName, size: info.size, type: info.type,locationName:info.name }, uniforms[structName].uniforms! as UniformInfos)
    }
    for (let i = 0; i < numUniforms; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        processUniform(info, uniforms);
    }

    // 检查uniform blocks
    const numBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
    for (let i = 0; i < numBlocks; i++) {
        const blockName = gl.getActiveUniformBlockName(program, i);
        if (!blockName) continue;
        const blockSize = gl.getActiveUniformBlockParameter(
            program, i, gl.UNIFORM_BLOCK_DATA_SIZE
        );
        const blockBinding = gl.getActiveUniformBlockParameter(
            program, i, gl.UNIFORM_BLOCK_BINDING
        );
        const activeUniforms = gl.getActiveUniformBlockParameter(
            program, i, gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS
        );

        // 获取块内 uniform 信息
        const uniformIndices = gl.getActiveUniformBlockParameter(
            program, i, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES
        ) as number[];

        uniforms[blockName]={
            name:blockName,
            type:'block', // 无类型
            glType:0,
            size: blockSize,
            location: null,
            blockIndex: i,
            blockBinding:blockBinding,
            uniforms:{}
        };
        uniformIndices.forEach(idx => {
            const info = gl.getActiveUniform(program, idx);
            if(info){
                const locationName=`${blockName}.${info.name}`;
                const memberName=info.name.replace(`${blockName}.`, '');
                const subUniforms= uniforms[blockName].uniforms! as UniformInfos;
                subUniforms[memberName]={
                 name:memberName,
                 type:'block-member',
                 location:null,
                 size:info.size,
                 glType:info.type,
                 locationName:locationName,
              }
            }
        });

       
    }

    return uniforms;
}

/**
* 获取程序中所有激活的attribute信息
* @param gl WebGL2上下文
* @param program 程序对象
* @returns attribute信息数组
*/
export function getActiveAttributes(gl: GL, program: WebGLProgram): AttributeInfo[] {
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    const attributes: AttributeInfo[] = [];

    for (let i = 0; i < numAttribs; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) continue;

        attributes.push({
            name: info.name,
            type: info.type,
            size: info.size,
            location: gl.getAttribLocation(program, info.name),
            isArray: info.size > 1
        });
    }

    return attributes;
}

/**
* 获取uniform block信息
* @param gl WebGL2上下文
* @param program 程序对象
* @param blockIndex block索引
* @returns block信息
*/
export function getUniformBlockInfo(gl: GL, program: WebGLProgram, blockIndex: number): UniformBlockInfo {
    return {
        name: gl.getActiveUniformBlockName(program, blockIndex) || '',
        index: blockIndex,
        size: gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE),
        activeUniforms: gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS),
        binding: gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_BINDING)
    };
}

// ==================== 高级Uniform设置 ====================

/**
* 设置数组uniform
* @param gl WebGL2上下文
* @param program 程序对象
* @param baseName uniform基础名称(不带数组下标)
* @param values 值数组
* @param setter 单个元素的设置函数
*/
export function setUniformArray<T>(
    gl: GL,
    program: WebGLProgram,
    baseName: string,
    values: T[],
    setter: (location: WebGLUniformLocation | null, value: T) => void
): void {
    if (values.length === 0) return;

    // 检查是否是数组uniform
    const location0 = gl.getUniformLocation(program, `${baseName}[0]`);
    if (location0) {
        // 标准数组uniform (如float array[10])
        for (let i = 0; i < values.length; i++) {
            const location = gl.getUniformLocation(program, `${baseName}[${i}]`);
            setter(location, values[i]);
        }
    } else {
        // 可能是结构体数组或非数组uniform
        const location = gl.getUniformLocation(program, baseName);
        setter(location, values[0]);
    }
}


/**
 *  * // 设置uniform block绑定
GL.setUniformBlockBinding(gl, program, 'LightBlock', 0);

// 创建uniform buffer
const lightData = new Float32Array([...ambient, ...diffuse, ...position]);
const ubo = GL.createUniformBuffer(gl, lightData);

// 绑定到绑定点0
GL.bindUniformBuffer(gl, ubo, 0);
 * 
* 设置uniform block的绑定点
* @param gl WebGL2上下文
* @param program 程序对象
* @param blockName block名称
* @param bindingPoint 绑定点索引
*/
export function setUniformBlockBinding(
    gl: GL,
    program: WebGLProgram,
    blockName: string,
    bindingPoint: number
): void {
    const blockIndex = gl.getUniformBlockIndex(program, blockName);
    if (blockIndex !== gl.INVALID_INDEX) {
        gl.uniformBlockBinding(program, blockIndex, bindingPoint);
    }
}



/**
* 创建uniform buffer对象
* @param gl WebGL2上下文
* @param data 初始数据
* @param usage 使用方式
* @returns 创建的UBO
*/
export function createUniformBuffer(
    gl: GL,
    data: ArrayBufferView | null = null,
    usage: number = gl.DYNAMIC_DRAW
): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) return null;

    gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
    gl.bufferData(gl.UNIFORM_BUFFER, data, usage);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    return buffer;
}

// ==================== 高级Attribute设置 ====================

/**
* 设置顶点属性指针(支持数组属性)
* @param gl WebGL2上下文
* @param program 程序对象
* @param name 属性名称
* @param buffer 缓冲区对象
* @param size 每个顶点分量数
* @param type 数据类型
* @param normalized 是否归一化
* @param stride 步长
* @param offset 偏移量
* @param divisor 实例化除数(可选)
*/
export function setAttributePointerAdvanced(
    gl: GL,
    program: WebGLProgram,
    name: string,
    buffer: WebGLBuffer,
    size: number,
    type: number = gl.FLOAT,
    normalized: boolean = false,
    stride: number = 0,
    offset: number = 0,
    divisor?: number
): void {
    const location = gl.getAttribLocation(program, name);
    if (location === -1) {
        console.warn(`Attribute "${name}" not found`);
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
        location,
        size,
        type,
        normalized,
        stride,
        offset
    );

    if (divisor !== undefined) {
        gl.vertexAttribDivisor(location, divisor);
    }
}

/**
* 绑定uniform buffer到绑定点
* @param gl WebGL2上下文
* @param buffer uniform buffer对象
* @param bindingPoint 绑定点索引
* @param offset 偏移量
* @param size 数据大小
*/
export function bindUniformBuffer(
    gl: GL,
    buffer: WebGLBuffer,
    bindingPoint: number,
    offset: number = 0,
    size: number = 0
): void {
    gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
    gl.bindBufferRange(gl.UNIFORM_BUFFER, bindingPoint, buffer, offset, size);
}


/**
* 设置顶点属性(支持数组属性)
* @param gl WebGL2上下文
* @param program 程序对象
* @param name 属性名称
* @param values 属性值数组
* @param size 每个顶点分量数
* @param type 数据类型
* @param normalized 是否归一化
*/
export function setAttributeValues(
    gl: GL,
    program: WebGLProgram,
    name: string,
    values: number[] | Float32Array,
    size: number,
    type: number = gl.FLOAT,
    normalized: boolean = false
): void {
    const location = gl.getAttribLocation(program, name);
    if (location === -1) {
        console.warn(`Attribute "${name}" not found`);
        return;
    }

    const buffer = createBuffer(gl, new Float32Array(values), gl.STATIC_DRAW);
    if (!buffer) return;

    setAttributePointerAdvanced(
        gl,
        program,
        name,
        buffer,
        size,
        type,
        normalized
    );
}

export function updateBuffer(gl: GL, buffer: WebGLBuffer, data: ArrayBufferView, usage: number = gl.DYNAMIC_DRAW): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// ----- 顶点数组对象 (VAO) -----
export function createVAO(gl: GL): WebGLVertexArrayObject | null {
    const vao = gl.createVertexArray();
    if (!vao) return null;
    return vao;
}

export function setupVAO(
    gl: GL,
    vao: WebGLVertexArrayObject,
    program: WebGLProgram,
    attributes: Array<{
        name: string;
        buffer: WebGLBuffer;
        size: number;
        type?: number;
        normalized?: boolean;
        stride?: number;
        offset?: number;
        divisor?: number;  // for instanced rendering
    }>
): void {
    gl.bindVertexArray(vao);

    attributes.forEach(attr => {
        const location = gl.getAttribLocation(program, attr.name);
        if (location === -1) {
            console.warn(`Attribute "${attr.name}" not found`);
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(
            location,
            attr.size,
            attr.type || gl.FLOAT,
            attr.normalized || false,
            attr.stride || 0,
            attr.offset || 0
        );

        if (attr.divisor !== undefined) {
            gl.vertexAttribDivisor(location, attr.divisor);
        }
    });

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


// ----- 帧缓冲区管理 -----
export function createFramebuffer(gl: GL): WebGLFramebuffer | null {
    return gl.createFramebuffer();
}

export function attachTextureToFramebuffer(
    gl: GL,
    framebuffer: WebGLFramebuffer,
    texture: WebGLTexture,
    attachment: number = gl.COLOR_ATTACHMENT0
): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachment,
        gl.TEXTURE_2D,
        texture,
        0
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

export function checkFramebufferStatus(gl: GL, framebuffer: WebGLFramebuffer): boolean {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Framebuffer incomplete:', status);
        return false;
    }
    return true;
}

