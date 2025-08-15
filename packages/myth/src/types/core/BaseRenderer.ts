import {ProxyPath2D} from 'skia-path2d'
import type {IApplication} from './Application'
import {IContainer,ContainerProps} from './Container'
export interface BaseRendererOptions{
    canvas:HTMLCanvasElement;
    width:number;
    height:number;
    dpr:number;
}

export interface IBaseRenderer<Context=any> extends RendererContext{
    ctx:Context;
    updateSize(width:number,height:number,updateStyle?:boolean):void;
    render(renderOptions:RenderOptions):void
}
export interface RenderOptions{
    container:IContainer<ContainerProps>
}

export interface RendererContext{
    canvas:HTMLCanvasElement
    renderMode:string
    width:number
    height:number
    readonly pixelWidth:number
    readonly pixelHeight:number
    drawRect(x: number, y: number, w: number, h: number): void;
    drawCircle(x: number, y: number, r: number,startAngle:number,endAngle:number,ccw:boolean): void;
    drawEllipse(x: number, y: number, rx: number,ry:number,xRotation:number,startAngle:number,endAngle:number,ccw:boolean): void;
    drawPath(path: ProxyPath2D): void;
}