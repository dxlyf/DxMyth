import { isFiniteNumber } from "src/utils/lang"
import { EventEmitter } from "src/utils"
import { IRenderer } from "src/interface/IRenderer"

export type CanvasLayerOptions={
    width?:number
    height?:number
    dpr?:number
    canvas?:HTMLCanvasElement
}
export type CanvasLayerEventMap={
    'resize':[width:number,height:number]
}
export class CanvasLayer<Context extends CanvasRenderingContext2D> extends EventEmitter<CanvasLayerEventMap>{
    canvas:HTMLCanvasElement
    ctx:Context
    dpr:number
    width:number
    height:number
    isVirtual:boolean
    renderer:IRenderer
    constructor(options:CanvasLayerOptions){
        super()
        this.dpr=options.dpr??window.devicePixelRatio
        this.canvas=options.canvas??document.createElement('canvas')
        this.createContext()
        if(isFiniteNumber(options.width)&&isFiniteNumber(options.height)){
            this.setSize(options.width,options.height)
        }else{
            this.width=this.canvas.clientWidth
            this.height=this.canvas.clientHeight
        }
    }
    createContext(){
        this.ctx = this.canvas.getContext('2d')! as Context;
    }
    setDpr(dpr:number){
        this.dpr=dpr
    }
    get pixelWidth(){
        return this.canvas.width
    }
    get pixelHeight(){
        return this.canvas.height
    }
    setSize(width:number,height:number){
        const pixelWidth=Math.floor(width*this.dpr)
        const pixelHeight=Math.floor(height*this.dpr)
        this.width=width
        this.height=height
        this.canvas.width=pixelWidth
        this.canvas.height=pixelHeight
        this.canvas.style.width=`${width}px`
        this.canvas.style.height=`${height}px`
        this.emit('resize',width,height)
    }
}