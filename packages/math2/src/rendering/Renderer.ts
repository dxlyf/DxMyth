import { EventEmitter } from "src/events/EventEmitter"
import { PathBuilder } from "src/math/PathBuilder"
import { Paint } from "./Paint"
import { Viewport } from "src/math/Viewport"
import { Matrix2D } from "src/math/Matrix2D"
import { Color, ColorInput, ColorValue } from "src/math/Color"

export type RendererEvents={
    resize:[renderer:Renderer]
}
export interface RendererConstructor{
    new():Renderer
}
export type RendererProps={
    canvas:HTMLCanvasElement|SVGElement
    width:number
    height:number
    dpr:number
}
export type RenderOptions={
    //viewport:Viewport
}
export abstract class Renderer extends EventEmitter<RendererEvents>{
    renderType:string
    width: number = 0
    height: number = 0
    dpr:number=1
    clearColor:ColorValue=null
    abstract domElement:HTMLElement
    constructor(){
        super()
    }
    abstract preInit(options:Partial<RendererProps>):Promise<void>
    async init(options:Partial<RendererProps>):Promise<void>{
        await this.preInit(options)
        this.setSize(options.width,options.height,options.dpr)
    }
    setDpr(dpr:number){
        this.dpr=dpr
        this.updateSize(false)
    }
    updateSize(updateStyle:boolean=true){
        (this.domElement as HTMLCanvasElement).width=Math.round(this.width*this.dpr);
        (this.domElement as HTMLCanvasElement).height=Math.round(this.height*this.dpr);
       if(updateStyle){
            this.domElement.style.width=`${this.width}px`
            this.domElement.style.height=`${this.height}px`
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
    setClearColor(color:ColorInput){
        this.clearColor=Color.fromInput(color)
    }
    abstract clear():void
    abstract save():void
    abstract restore():void
    abstract transform(matrix:Matrix2D):void
    abstract translate(x:number,y:number):void
    abstract scale(scale:number):void
    abstract rotate(angle:number):void
    abstract moveTo(x:number,y:number):void
    abstract rect(x:number,y:number,width:number,height:number):void
    abstract render(renderOptions:RenderOptions):void
    abstract drawRect(x:number,y:number,width:number,height:number,paint:Paint):void
    abstract drawPath(path:PathBuilder,paint:Paint):void
    abstract drawImage(image:CanvasImageSource,x:number,y:number,w:number,h:number):void
    abstract fillText(text:string,x:number,y:number,paint:Paint):void
}