
type GLContext = WebGL2RenderingContext;
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

function getShaderErrors(gl: GLContext, shader: WebGLShader, type: string) {

    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    const shaderInfoLog = gl.getShaderInfoLog(shader) || '';
    const errors = shaderInfoLog.trim();

    if (status && errors === '') return '';

    const errorMatches = /ERROR: 0:(\d+)/.exec(errors);
    if (errorMatches) {

        // --enable-privileged-webgl-extension
        // log( '**' + type + '**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

        const errorLine = parseInt(errorMatches[1]);
        return type.toUpperCase() + '\n\n' + errors + '\n\n' + handleSource(gl.getShaderSource(shader), errorLine);

    } else {

        return errors;

    }

}
export function createWebGLShader(gl: GLContext, source: string, type: number) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //     console.error(`Shader compile error: ${type==gl.VERTEX_SHADER?"vertex":"fragment"}`,gl.getShaderInfoLog(shader));
    // }
    return shader;
}
export function createWebGLProgram(gl: GLContext, vertexSource: string, fragmentSource: string) {
    const vertexShader = createWebGLShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = createWebGLShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const vertexErrors = getShaderErrors(gl, vertexShader, 'vertex');
        const fragmentErrors = getShaderErrors(gl, fragmentShader, 'fragment');
        const programLog = gl.getProgramInfoLog(program);
        console.error(`Program link error:`, programLog);
        console.error(`Vertex shader errors:`, vertexErrors);
        console.error(`Fragment shader errors:`, fragmentErrors);
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
}

type AttributeActiveInfo = {
    name: string,
    type: number,
    size: number,
    location: number
}
type UnifromActiveInfo = {
    name: string,
    type?: number,
    size?: number,
    location?: WebGLUniformLocation | null
}
type UnifromBlockActiveInfo = {
    name: string,
    type: number,
    size: number,
    blockIndexx:number,
    bindingIndex:number
    offset?:number
    blocks:Omit<UnifromBlockActiveInfo,'blocks'>[]
}
export function getWebGLActiveAttributes(gl: GLContext, program: WebGLProgram) {
    const attributes=new Map<string, AttributeActiveInfo>()
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < count; i++) {
        const attrib = gl.getActiveAttrib(program, i)
        const location = gl.getAttribLocation(program, attrib.name)
        attributes.set(attrib.name,{
            name: attrib.name,
            type: attrib.type,
            size: attrib.size,
            location
        })
    }
    return attributes
}
export function getWebGLActiveUniforms(gl: GLContext, program: WebGLProgram) {
    const uniforms=new Map<string, UnifromActiveInfo>()
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
        const uniformInfo = gl.getActiveUniform(program, i)
        const location = gl.getUniformLocation(program, uniformInfo.name)
        if (location) {
            const unifromName = uniformInfo.name
            const isArray = unifromName.endsWith(']')
            if(isArray){
                const newUnifromName=unifromName.substring(0,unifromName.lastIndexOf('['))
                for(let i=0;i<uniformInfo.size;i++){
                    const key=`${newUnifromName}[${i}]`
                    const newLocation=gl.getUniformLocation(program, key)
                    uniforms.set(key,{
                        name:key,
                        type:uniformInfo.type,
                        size:uniformInfo.size,
                        location:newLocation
                    })
                }
            }else{
                uniforms.set(unifromName,{
                    name:unifromName,
                    type:uniformInfo.type,
                    size:uniformInfo.size,
                    location
                })
            }
        }
    }
    return uniforms
}


export function getWebGLActiveUniformBlocks(gl: GLContext, program: WebGLProgram) {
    const uniforms=new Map<string, UnifromBlockActiveInfo>()
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS)
    for (let i = 0; i < count; i++) {
            const blockName=gl.getActiveUniformBlockName(program,i)
            const blockIndex=gl.getUniformBlockIndex(program,blockName)
            const bindingIndex=gl.getActiveUniformBlockParameter(program,blockIndex,gl.UNIFORM_BLOCK_BINDING)
            const blockMemberCount=gl.getActiveUniformBlockParameter(program,blockIndex,gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS)
            const indecies=gl.getActiveUniformBlockParameter(program,blockIndex,gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
            const blockSize = gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
            const uniformsIndex=gl.getActiveUniforms(program,indecies,gl.UNIFORM_BLOCK_INDEX)
            const uniformsSize=gl.getActiveUniforms(program,indecies,gl.UNIFORM_SIZE)
            const uniformsType=gl.getActiveUniforms(program,indecies,gl.UNIFORM_TYPE)
            const uniformsOffset=gl.getActiveUniforms(program,indecies,gl.UNIFORM_OFFSET)
            const uniformItem:UnifromBlockActiveInfo={
                name:blockName,
                type:blockIndex,
                size:blockSize,
                blockIndexx:blockIndex,
                bindingIndex:bindingIndex,
                blocks:[]
            }
            
            if(indecies){
                for(let j=0;j<indecies.length;j++){
                    const uniformIndex=indecies[j]
                    const info=gl.getActiveUniform(program,uniformIndex)
                     uniformItem.blocks.push({
                            name: info.name,
                            type:uniformsType[j],
                            size: uniformsSize[j],
                            blockIndexx:uniformsIndex[j],
                            bindingIndex:bindingIndex,
                            offset:uniformsOffset[j]
                    })
                }
            }
            uniforms.set(blockName,uniformItem)
    }
    return uniforms
}

