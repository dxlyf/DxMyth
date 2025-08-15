import { ProxyPath2D } from "skia-path2d";
import { IBaseRenderer,BaseRendererOptions, RenderOptions } from "src/types/core/BaseRenderer";
import {EventEmitter} from '@dxyl/utils'


export abstract class BaseRenderer<Ctx,E extends {}> extends EventEmitter<E> implements IBaseRenderer<Ctx> {
    ctx: Ctx;
    canvas:HTMLCanvasElement
    options:BaseRendererOptions
    abstract renderMode: "canvas" | "webgl" | "webgpu";
    constructor(options:Partial<BaseRendererOptions>) {
        super()
        // 构造函数实现
        this.options=Object.assign({dpr:window.devicePixelRatio} as BaseRendererOptions, options);
        this.canvas=options.canvas!;
        this.ctx=this.createContext();
        if(Number.isFinite(this.options.width) && Number.isFinite(this.options.height)){
            this.updateSize(this.options.width, this.options.height)
        }
        this.init()
    }
    init(){
         
    }
    set width(value:number){
        if(this.options.width===value){
            return
        }
        this.options.width=value
        this.updateSize(value,this.height)
  
    }
    get width(){
        return this.options.width!
    }
    set height(value:number){
        if(this.options.height===value){
            return
        }
        this.options.height=value
        this.updateSize(this.width,value)
    }
    get height(){
         return this.options.height
    }
    get dpr(){
        return this.options.dpr!
    }
    set dpr(value:number){
        this.options.dpr=value
        this.updateSize(this.width, this.height,false)
    }
    abstract createContext(): Ctx
    get pixelWidth(){
        return this.canvas.width
    }
    get pixelHeight(){
        return this.canvas.height
    }
    updateSize(width:number,height:number,updateStyle=true){
        this.options.width=width
        this.options.height=height
        this.canvas.width = width * this.dpr>>0;
        this.canvas.height = height * this.dpr>>0;
        if(updateStyle) {
            this.canvas.style.width=`${width}px`;
            this.canvas.style.height=`${height}px`;
        }
    }
    drawRect(x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    drawCircle(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw: boolean): void {
        throw new Error("Method not implemented.");
    }
    drawEllipse(x: number, y: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, ccw: boolean): void {
        throw new Error("Method not implemented.");
    }
    abstract drawPath(path: ProxyPath2D): void 
    abstract render(renderOptions:RenderOptions):void
    dispose(){
      
    }
    
}