
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { createWebGLProgram, glMatrix ,getWebGLActiveUniforms,getWebGLActiveUniformBlocks} from 'src'
class WeblglExample extends Example {
    constructor() {
        super()
    }
    canvas: HTMLCanvasElement
    gl!: WebGL2RenderingContext
    progam: WebGLProgram
    init(): void {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 500
        this.canvas.height = 500
        document.body.appendChild(this.canvas)
        this.gl = this.canvas.getContext('webgl2', {
            antialias: true,
            depth: true,
            stencil: true,
            premultipliedAlpha: false
        })!
        this.gl.disable(this.gl.DEPTH_TEST)
        this.gl.disable(this.gl.STENCIL_TEST)
        this.progam = createWebGLProgram(this.gl, this.createVert(), this.createFrag())
        this.gl.useProgram(this.progam)

    }
    createVert() {
        // highp medium lowp

        return `#version 300 es
        layout(location=0) in vec2 aPos; // 顶点位置
        uniform mat3 uProjMat; // 投影矩阵
     //   uniform mat3 uModelMat; // 模型矩阵
     //   uniform vec2 uViewportSize; // 视口口大小
        // uniform buffer ubo
        uniform MatricesBlock {
            mat3 uProjMat;
            mat3 uModelMat;
            vec2 uVec;
        } matrices;

        // 数组定义
        uniform vec3 uColors[4];
        out vec3 vColor;
        void main() {
            vColor=uColors[0];
            vec3 outPos=matrices.uProjMat*matrices.uModelMat*vec3(aPos,1);
            gl_Position = vec4(outPos, 1.0);
        }`
    }
    createFrag() {
        return `#version 300 es
        precision mediump float;
        uniform vec3 uColor;
        uniform vec2 uViewportSize; // 视口口大小
        // 结构体定义
        struct MM{
            int a;
            vec2 c;
            vec2 d[2];
        };
        uniform struct {
            int type;
            vec3 position;
            vec3 color;
            vec3 normal[2];
            MM mm[4];
        } uSdf;

        out vec4 fragColor;
        in vec3 vColor;

        float sdfCircle(vec2 p,float d){
            return length(p)-d;
        }
        vec2 projectUV(vec2 p){
            return vec2(p.x,uViewportSize.y-p.y);
          //  return 2.*(p-uViewportSize*0.5)/min(uViewportSize.x,uViewportSize.y);
        }
        void main() {
            vec2 uv=projectUV(gl_FragCoord.xy);
            if(uSdf.type==1){
                float d=sdfCircle(uv-uSdf.position.xy,uSdf.position.z);
                if(d<=0.0){
                    fragColor = vec4(uSdf.color, 1.0);
                }else{
                    // 丢弃
                    discard;
                }
            }else{
                fragColor = vec4(uColor*vColor, 1.0);
            }
        }`
    }
    enter(): void {

        const gl = this.gl;
        const progam = this.progam;
        gl.useProgram(progam)
        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        const attributes = []
        const attributeCount = gl.getProgramParameter(progam, gl.ACTIVE_ATTRIBUTES)
        for (let i = 0; i < attributeCount; i++) {
            const info = gl.getActiveAttrib(progam, i)
            if (!info) {
                continue
            }
            const location = gl.getAttribLocation(progam, info.name)
            attributes.push({
                name: info.name,
                type: info.type,
                size: info.size,
                location,
            })
        }

        const uniforms = []
        const uniformCount = gl.getProgramParameter(progam, gl.ACTIVE_UNIFORMS)
        const uniformIndices:number[]=[]
        const uniformData:any[]=[]
        for (let i = 0; i < uniformCount; i++) {
            const info = gl.getActiveUniform(progam, i)
            const location = gl.getUniformLocation(progam, info.name)
            uniformData[i]={name:info.name,location};
            uniformIndices.push(i)
           
            const isArray = info.name.indexOf('[') !== -1
            if (isArray) {
                const name = info.name.substring(0, info.name.indexOf('['))
                for (let j = 0; j < info.size; j++) {
                    const uniformName = name + '[' + j + ']'
                    const location = gl.getUniformLocation(progam, uniformName)
                    uniforms.push({
                        name: uniformName,
                        type: info.type,
                        size: 1,
                        location,
                    })
                }
            } else {
                const location = gl.getUniformLocation(progam, info.name)
                if (location) {
                    const isStruct=info.name.indexOf('.')!==-1
                    uniforms.push({
                        name: info.name,
                        type: info.type,
                        size: info.size,
                        location,
                        isStruct:isStruct
                    })
                }else{
                
                    uniforms.push({
                        name: info.name,
                        type: info.type,
                        size: info.size,
                    })
                }
            }
        }
        const uniformBlocks=[]
        const uniformBlockCount=gl.getProgramParameter(progam,gl.ACTIVE_UNIFORM_BLOCKS)
        for(let i=0;i<uniformBlockCount;i++){
            const blockName=gl.getActiveUniformBlockName(progam,i)
            const blockIndex=gl.getUniformBlockIndex(progam,blockName)
            const bindingIndex=gl.getActiveUniformBlockParameter(progam,blockIndex,gl.UNIFORM_BLOCK_BINDING)
            const blockMemberCount=gl.getActiveUniformBlockParameter(progam,blockIndex,gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS)
            const indecies=gl.getActiveUniformBlockParameter(progam,blockIndex,gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
            const blockSize = gl.getActiveUniformBlockParameter(progam, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
            const uniformsIndex=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_BLOCK_INDEX)
            const uniformsSize=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_SIZE)
            const uniformsType=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_TYPE)
            const uniformsOffset=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_OFFSET)
            //const uniformsArrayStride=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_ARRAY_STRIDE)
           // const uniformsMatrixStride=gl.getActiveUniforms(progam,indecies,gl.UNIFORM_MATRIX_STRIDE)

       let memberBlocks=[]
        for(let j=0;j<blockMemberCount;j++){
                const info=gl.getActiveUniform(progam,indecies[j])
                if(!info){
                    continue
                }
                const offset=uniformsOffset[j]
                memberBlocks.push({
                    name:info.name,       
                    type:info.type,
                    uniformsType:uniformsType[j],
                    uniformsSize:uniformsSize[j],
                    index:j,
                    uniformsIndex:uniformsIndex[j],
                    size:info.size,
                    offset:offset
                })
            }
            uniformBlocks.push({
                name:blockName,
                index:blockIndex,
                indecies:indecies,
                uniformsSize:blockSize,
                bindingIndex:bindingIndex,
                memberBlocks
            })
        }

         [
            [ "UNIFORM_TYPE", "type" ],
            [ "UNIFORM_SIZE", "size" ],  // num elements
            [ "UNIFORM_BLOCK_INDEX", "blockNdx" ],
            [ "UNIFORM_OFFSET", "offset", ],
        ].forEach(function(pair) {
            const pname = pair[0] as keyof typeof gl;
            const key = pair[1];
            gl.getActiveUniforms(progam, uniformIndices, gl[pname]).forEach(function(value, ndx) {
             uniformData[ndx][key] = value;
            });
        });
        console.log('attributes', attributes)
        console.log('uniforms', uniforms)
        console.log('uniformBlocks', uniformBlocks)
        console.log('uniformData', uniformData)
        console.log('getWebGLActiveUniformBlocks',getWebGLActiveUniformBlocks(gl,progam))
      //  console.log('getWebGLActiveUniforms',getWebGLActiveUniforms(gl,progam))
        const uniformsMap = new Map(uniforms.map(item => [item.name, item]))
        const vertices = new Float32Array([
            100, 100,
            200, 100,
            200, 200,
            100, 200,
        ])
        const indices = new Uint16Array([
            0, 1, 3,
            1, 3, 2,
        ])
        const vbo = gl.createBuffer()
        const ibo = gl.createBuffer();

        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0)


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
        gl.bindVertexArray(null)

        const projMatrix = glMatrix.mat3.create()
        glMatrix.mat3.projection(projMatrix, gl.canvas.width, gl.canvas.height)
        const modelMatrix = glMatrix.mat3.create()
        glMatrix.mat3.identity(modelMatrix)
       // glMatrix.mat3.translate(modelMatrix,modelMatrix, [100, 100])
        // ubo uniform block
        const matricesBlockIndex=gl.getUniformBlockIndex(progam,'MatricesBlock')

        const mat3ToMat12=(mat:Float32Array)=>{
            const m= new Float32Array(12)
            for(let i=0;i<3;i++){
                let index=i*3;
                let targetIndex=i*4
                m[targetIndex]=mat[index]
                m[targetIndex+1]=mat[index+1]
                m[targetIndex+2]=mat[index+2]
                m[targetIndex+3]=0
            }
            return m;
        }
 
        const ubo=gl.createBuffer()
        const uboArray=new Float32Array(26)
        uboArray.set(mat3ToMat12(projMatrix),0)
        uboArray.set(mat3ToMat12(modelMatrix),12)
        //console.log('uboArray',uboArray)
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo)
        gl.bufferData(gl.UNIFORM_BUFFER, uboArray,
        gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.UNIFORM_BUFFER,null)
        gl.uniformBlockBinding(progam,matricesBlockIndex,0)
        gl.bindBufferBase(gl.UNIFORM_BUFFER, matricesBlockIndex, ubo)
      

  
     //   gl.uniformMatrix3fv(uniformsMap.get('uProjMat').location, false, projMatrix)
     //   gl.uniformMatrix3fv(uniformsMap.get('uModelMat').location, false, modelMatrix)
        gl.uniform2f(uniformsMap.get('uViewportSize').location, gl.canvas.width, gl.canvas.height)
        gl.uniform3fv(uniformsMap.get('uColors[0]').location, new Float32Array([1, 0.1, 0.1]))
        gl.uniform3fv(uniformsMap.get('uColor').location, new Float32Array([1, 0, 0]))

        gl.uniform1i(uniformsMap.get('uSdf.type').location, 0)
        gl.uniform3fv(uniformsMap.get('uSdf.position').location, new Float32Array([150, 150, 30]))
        gl.uniform3fv(uniformsMap.get('uSdf.color').location, new Float32Array([0, 1, 0]))

        gl.bindVertexArray(vao)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        // gl.flush()
    }

}

ExampleManager.create({ examples: [WeblglExample] }).init()
