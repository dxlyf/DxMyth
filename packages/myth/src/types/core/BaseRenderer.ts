import {ProxyPath2D} from 'skia-path2d'
import {IContainer,ContainerProps} from './Container'
import { IViewport } from './Viewport';
import { ColorValue } from 'src/image/Color';
import { RenderObject } from './Paint';

export interface BaseRendererOptions{
    canvas:HTMLCanvasElement;
    width?:number;
    height?:number;
    dpr?:number;
    backgroundColor?:ColorValue
}

export interface IBaseRenderer<Context=any> extends Renderer2DContext{
    ctx:Context;
    viewport:IViewport
    setSize(width:number,height:number,updateStyle?:boolean):void;
    render(renderOptions:RenderOptions):void
}
export interface RenderOptions{
    renderObjects:RenderObject[]
}
export type BaseRendereEvents={
    resize:[width:number,height:number]
}

export interface Renderer2DContext{
    canvas:HTMLCanvasElement
    renderMode:string
    width:number
    height:number
    dpr:number
    readonly pixelWidth:number
    readonly pixelHeight:number
    drawRect(x: number, y: number, w: number, h: number): void;
    drawCircle(x: number, y: number, r: number,startAngle:number,endAngle:number,ccw:boolean): void;
    drawEllipse(x: number, y: number, rx: number,ry:number,xRotation:number,startAngle:number,endAngle:number,ccw:boolean): void;
    drawPath(path: ProxyPath2D): void;
}

