

export class GLContext {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    dpr: number = 1
    width: number = 0
    height: number = 0
    _isContextLost: boolean = false
    constructor(canvas: HTMLCanvasElement, options: WebGLContextAttributes) {
        this.canvas = canvas
        this.gl = canvas.getContext('webgl2', options)!

        this.onContextLost = this.onContextLost.bind(this)
        this.onContextRestore = this.onContextRestore.bind(this)
        this.onContextCreationError = this.onContextCreationError.bind(this)

        this.canvas.addEventListener('webglcontextlost', this.onContextLost, false);
        this.canvas.addEventListener('webglcontextrestored', this.onContextRestore, false);
        this.canvas.addEventListener('webglcontextcreationerror', this.onContextCreationError, false);
        if (this.gl === null) {
            if (this.canvas.getContext('webgl2')) {
                throw new Error('THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.');
            } else {
                throw new Error('THREE.WebGLRenderer: Error creating WebGL context.');
            }

        }
        this.initGLContext()
    }
    onContextLost() {
        this._isContextLost = true
    }
    onContextRestore = () => {
        this._isContextLost = false
        this.initGLContext()
    }
    onContextCreationError() {

    }
    setDpr(dpr: number) {
        this.dpr = dpr
        this.setSize(this.width, this.height, false)
    }
    setSize(width: number, height: number, updateStyle: boolean = true) {
        this.width = Math.floor(width * this.dpr)
        this.height = Math.floor(height * this.dpr)
        this.canvas.width = this.width
        this.canvas.height = this.height
        if (updateStyle) {
            this.canvas.style.width = `${width}px`
            this.canvas.style.height = `${height}px`
        }
    }
    initGLContext() {

    }
}