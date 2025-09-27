
import type * as CanvasKit from 'src/canvaskit'
import { IRenderer,IRendererService,RendererOptions } from 'src/interface/Renderer'
import { allIsFinite } from 'src/utils'

export abstract class BaseRenderer<Options extends RendererOptions> implements IRenderer<Options> {
    options:Options
    domElment:HTMLCanvasElement
    dpr:number=1
    width:number
    height:number
    abstract rendererService:IRendererService<Options>
    constructor(options:Options) {
        this.options={dpr:window.devicePixelRatio,...options}
        this.domElment=options.canvas
        if(allIsFinite(this.options.width,this.options.height)){
            this.dpr=this.options.dpr
            this.setSize(this.options.width,this.options.height)
        }
    }
    setDpr(dpr:number){
        if(this.dpr!==dpr){
            this.dpr=dpr
            this.setSize(this.width,this.height,false)
        }
    }
    setSize(width: number, height: number,updateStyle:boolean=true): void {
        this.domElment.width=Math.floor(width*this.dpr)
        this.domElment.height=Math.floor(height*this.dpr)
        this.width=width
        this.height=height
        if(updateStyle){
            this.domElment.style.width=width+'px'
            this.domElment.style.height=height+'px'
        }
    }
    abstract render(): void 

}