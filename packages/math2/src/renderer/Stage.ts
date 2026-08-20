import { EventEmitter } from "src/events/EventEmitter"
import { AsyncSeriesBailHook } from 'src/tapable'
import {Renderer,type RendererConstructor} from './Renderer'
import {PointerEventSystem} from 'src/events/PointerEventSystem'


export type StageEvents={
    tick:[delta:number]
    preInit:[stage:Stage]
    postInit:[stage:Stage]
    beforeRender:[stage:Stage]
    render:[stage:Stage]
    afterRender:[stage:Stage]
}
export type StageProps={
    
}
export type StageInitProps={
    width?:number
    height?:number
    dpr?:number
    container:HTMLElement
    renderer:'canvas'|'webgl'|'webgpu'
}
export class Stage extends EventEmitter<StageEvents> {
    static renderers:Map<string,RendererConstructor>=new Map()
    private needRendering:boolean=false
    private delta=0
    domElement:HTMLElement
    renderer:Renderer
    eventSystem:PointerEventSystem
    constructor(props:StageProps){
        super()
    }
    async init(props:StageInitProps){
        this.emit('preInit',this)
        this.domElement=props.container
        const RendererCls=Stage.renderers.get(props.renderer)
        this.renderer=new RendererCls()
        await this.renderer.init({
            domElement:this.domElement,
            width:props.width??this.domElement.clientWidth,
            height:props.height??this.domElement.clientHeight,
            dpr:props.dpr??window.devicePixelRatio
        })
        this.eventSystem=new PointerEventSystem({
            target:this.domElement,
            screenToWorld:(out,x,y,element)=>{
                const rect=element.getBoundingClientRect()
                out.set(x-rect.left,y-rect.top)
                return out
            },
            hitTest:(x,y)=>{
                return false
            }
        })
        this.eventSystem.attachEvents()
        this.emit('postInit',this)
    }
    start(){
 
    }
    get width(){
        return this.renderer.width
    }
    get height(){
        return this.renderer.height
    }
    setSize(width:number,height:number,dpr?:number){
        this.renderer.setSize(width,height,dpr)
    }
    refresh(){
        this.needRendering=true
    }
    private render(){
        this.emit('beforeRender',this)
        this.emit('render',this)
        this.emit('afterRender',this)
        this.needRendering=false
    }
    tick(delta:number){
        this.emit('tick',delta)
        if(this.needRendering){
            this.render()
        }
    }
}