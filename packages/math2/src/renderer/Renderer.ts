import { EventEmitter } from "src/events/EventEmitter"
import { PathBuilder } from "src/math/PathBuilder"
import { Paint } from "./Paint"

export type RendererEvents={
    resize:[renderer:Renderer]
}
export interface RendererConstructor{
    new():Renderer
}
export type RendererInitProps={
    domElement:HTMLElement
    width:number
    height:number
    dpr:number
}
export abstract class Renderer extends EventEmitter<RendererEvents>{
    width: number = 0
    height: number = 0
    dpr:number=1
    abstract domElement:HTMLElement
    constructor(){
        super()
    }
    abstract preInit(options:RendererInitProps):Promise<void>
    async init(options:RendererInitProps):Promise<void>{
        await this.preInit(options)
        this.setSize(options.width,options.height,options.dpr)
    }
    setDpr(dpr:number){
        this.dpr=dpr
        this.updateSize(false)
    }
    updateSize(updateStyle:boolean=true){
        (this.domElement as HTMLCanvasElement).width=this.width;
        (this.domElement as HTMLCanvasElement).height=this.height;
       if(updateStyle){
            const width=Math.round(this.width*this.dpr)
            const height=Math.round(this.height*this.dpr)
            this.domElement.style.width=`${width}px`
            this.domElement.style.height=`${height}px`
       }
       this.emit('resize',this)
    }
    setSize(width:number,height:number,dpr:number=this.dpr){
        this.width=width
        this.height=height
        this.dpr=dpr
        this.updateSize(true)
    }

    // 绘制路径
    abstract drawPath(path:PathBuilder,paint:Paint):void
    abstract fillText(text:string,x:number,y:number,paint:Paint):void
}