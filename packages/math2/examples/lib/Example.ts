import { GUI,Controller } from "lil-gui"

type StateConfig={
    label?:string
    floder?:boolean
    min?:number
    max?:number
    step?:number
    value?:any
    options?:any[]
}
interface IExample{
    name: string
    gui:GUI
    parent:ExampleManager
    state:Record<string,any>
    getState():Record<string,StateConfig>
    onChange():void
    init():void
    enter():void
    exit():void
    destroy():void
}
interface ExampleConstructor{
    name: string
    new(): IExample
}
export  class Example implements IExample{
    name: string = "Example"
    gui:GUI
    parent:ExampleManager
    state:Record<string,any>={}
    getState():Record<string,StateConfig>{
        return {}
    }
    init():void{}
    onChange():void{}
    initState(){
        const state=this.getState()
        this.state={}
    
        this.initGuiState(this.gui,this.state,state)
    }
    initGuiState(gui:GUI,target:any,state:Record<string,StateConfig>){
        for(const key of Object.keys(state)){
            const config=state[key]
            const label=config.label||key
            target[key]=config.value
            let controller:Controller
            if(config.options){
                controller=gui.add(target,key,config.options)
            }
            else if(typeof config.max==='number'&&typeof config.min==='number'){
                controller=gui.add(target,key,config.min,config.max,config.step??1)
            }
            else if(typeof config.value==="string"&&config.value.startsWith('#')){
                controller=gui.addColor(target,key)
            }
            else if(Object.prototype.toString.call(config.value)==="[object Object]"){
                target[key]={}
                if(config.floder){
                    this.initGuiState(gui.addFolder(label),target[key],config.value)
                }else{
                    this.initGuiState(gui,target[key],config.value)
                }
            }else{
                 controller=gui.add(target,key)
            }
           if(controller&&config.label){
            controller.name(config.label)
           }
        }
    }
    enter():void{
        this.initState()
    }
    exit():void{
          this.gui.destroy()
    }
    destroy():void{
        this.gui.destroy()
    }
}

type ExampleManagerOptions={
    examples:ExampleConstructor[]
}
export class ExampleManager{
    static create(options:ExampleManagerOptions){
        return new ExampleManager(options)
    }
    gui:GUI
    examples: Map<string,IExample>=new Map()
    options:ExampleManagerOptions
    activeExample:IExample|undefined=undefined
    activeName:string=""
    constructor(options:ExampleManagerOptions){
        this.options=options
        this.gui = new GUI()
        document.body.appendChild(this.gui.domElement)
    }
    async init(){
        this.gui.add(this,"activeName",this.names).name('examples').onFinishChange((name:string)=>{
            this.active(name)
        })
        this.options.examples.forEach(ExampleClass=>{
            this.addExample(ExampleClass)
        })

        setTimeout(()=>{
            if(this.names.length>0){
                this.active(this.names[0])
            }
        },0)
    }
    get names(){
        return this.options.examples.map(d=>d.name)
    }
    exit(example:IExample){
        example.exit()
    }
    enter(example:IExample){
        example.enter()
    }
    active(name:string){
        if(!this.examples.has(name)){
            return
        }
        const exmaple=this.examples.get(name)
        if(this.activeExample){
            this.exit(this.activeExample)
        }
        this.activeExample=exmaple
        this.activeName=name
        exmaple.gui=this.gui.addFolder(name)
        exmaple.gui.onChange(()=>{
            exmaple.onChange()
        })
        this.gui.controllers.forEach(controller=>{
            if(controller._name==='examples'){
                controller.updateDisplay()
            }
        })
        this.enter(exmaple)
    }
    addExample(ExampleClass: ExampleConstructor){
        if(this.examples.has(ExampleClass.name)){
            return
        }
        const exmaple=new ExampleClass()
        exmaple.parent=this
        exmaple.init()
        this.examples.set(ExampleClass.name,exmaple)
    }
    removeExample(ExampleClass: ExampleConstructor){
        if(!this.examples.has(ExampleClass.name)){
            return
        }
        const exmaple=this.examples.get(ExampleClass.name)
        exmaple.destroy()
        this.examples.delete(ExampleClass.name)
    }
}


export class Canvas {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    dpr: number
    canvasWidth: number
    canvasHeight: number
    constructor(canvas: HTMLCanvasElement, width: number, height: number, dpr = window.devicePixelRatio) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.width = width
        this.height = height
        this.dpr = dpr
        this.canvasWidth = Math.floor(width * dpr)
        this.canvasHeight = Math.floor(height * dpr)
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        this.canvas.style.width = this.width + "px"
        this.canvas.style.height = this.height + "px"

    }
    attachEvents(){

    }
    drawBefore() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.ctx.save()
        this.ctx.scale(this.dpr, this.dpr)
    }
    drawAfter() {
        this.ctx.restore()
    }
    draw(cb: (ctx: CanvasRenderingContext2D) => void) {
        const ctx = this.ctx;
        this.drawBefore()
        cb(ctx)
        this.drawAfter()
    }

}