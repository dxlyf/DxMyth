
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { GL,glMatrix} from 'src'
class WeblglExample extends Example {
    constructor() {
        super()
    }
    canvas: HTMLCanvasElement
    gl!: WebGL2RenderingContext
    ctx:GL.GLContext
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
        this.ctx=new GL.GLContext(this.gl)

    }
 
    enter(): void {

        const ctx=this.ctx
        const gl = this.ctx.gl;
        const progam = ctx.createProgram({
            vs:`#version 300 es
            layout(location=0) in vec3 aPos; // 顶点位置
            uniform mat4 uModel;
            uniform mat4 uProj;
            uniform mat4 uView;
            void main() {
                vec4 vPos = uProj*uView * uModel * vec4(aPos, 1.0);
                gl_Position = vec4(vPos.xyz, 1.0);
            }
            
            `,
            fs:`#version 300 es
            precision highp float;
            out vec4 fragColor;
            void main() {
                fragColor = vec4(1.,0., 0.0, 1.0);
            }
            `
        });
       const vertices = new Float32Array([
            -0.5, 0.5,1,
            0.5, 0.5,1,
            -0.5, -0.5,1,
            0.5, -0.5,1,

             -0.5, 0.5,-1,
            0.5, 0.5,-1,
            -0.5, -0.5,-1,
            0.5, -0.5,-1,
        ])
        const indices = new Uint16Array([
            0, 1, 2,
            1,2,3
        ])
        ctx.useProgram(progam)
        const attributeBuffer=ctx.createAttributeBuffer({
            type:gl.FLOAT,
            stride:12,
            attributes:[{
                name:'aPos',
                type:gl.FLOAT,
                location:progam.getAttribute('aPos').location,
                components:3,
            }],
        })
        const indexBuffer=ctx.createIndexBuffer({
          
        })
        const model=glMatrix.mat4.create()
        const proj=glMatrix.mat4.create()
        const view=glMatrix.mat4.create()
        glMatrix.mat4.identity(model)
        glMatrix.mat4.identity(proj)
        glMatrix.mat4.identity(view)

        ctx.createUniformMat4('uModel').setValue(model)
        ctx.createUniformMat4('uProj').setValue(proj)
        ctx.createUniformMat4('uView').setValue(view)
        
        ctx.disable('DEPTH_TEST')
        ctx.clear({color:[0,0,0,1],depth:1})
        ctx.viewport(0,0,500,500)
        attributeBuffer.bufferData(new Float32Array(vertices))
        indexBuffer.bufferData(new Uint16Array(indices))
        indexBuffer.bind()
        attributeBuffer.bind()

        ctx.drawElements('TRIANGLES', indices.length, 'UNSIGNED_SHORT', 0)
        // gl.flush()
    }

}

ExampleManager.create({ examples: [WeblglExample] }).init()
