
import { RendererOptions,RendererEvents } from 'src/types/Renderer'
import { allIsFinite } from 'src/utils'
import {EventEmitter} from 'src/events'
import { BoundingRect } from 'src/math/BoundingRect'


export abstract class BaseRenderer<Options extends RendererOptions,E extends RendererEvents> extends EventEmitter<E>  {
    options:Options
    domElment:HTMLCanvasElement
    dpr:number=1
    width:number // 视口宽度
    height:number
    viewport:BoundingRect=BoundingRect.default()
    constructor(options:Options) {
        super()
        this.options={dpr:window.devicePixelRatio,...options}
        this.domElment=options.canvas
        if(allIsFinite(this.options.width,this.options.height)){
            this.dpr=this.options.dpr
            this.setSize(this.options.width,this.options.height)
        }
    }
    get pixelWidth(){
        return this.domElment.width
    }
    get pixelHeight(){
        return this.domElment.height
    }
    setDpr(dpr:number){
        if(this.dpr!==dpr){
            this.dpr=dpr
            this.setSize(this.width,this.height,false)
        }
    }
    setViewport(x:number,y:number,width:number,height:number){
        this.viewport.setViewport(x,y,width,height)
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
        this.setViewport(0,0,width,height);
        ((this as unknown) as BaseRenderer<Options, RendererEvents>).emit('resize', width, height);
    }

}