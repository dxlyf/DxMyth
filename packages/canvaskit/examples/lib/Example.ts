import { CKEngine,Circle,Rect,Group,Ellipse,GraphicPath } from "src/index"
import {GUI} from './lil-gui/lil-gui.esm'
import './lil-gui/lil-gui.css'
import { CKEngineOptions } from "src/types/CKEngine"
import { DisplayObject } from "src/scene/DisplayObject"

export  class ExampleBase{
    static uid=0
    static title:string
    title:string
    owner:ExampleManager
    gui:GUI
    uid:number
    active:boolean=false
    state:Record<string,any>={}
    stateOptions:Record<string,any>={}
    constructor(){
        this.uid=ExampleBase.uid++
        this.state=this.getDefaultState()
    }
    createTransformState(position=[0,0],scale=[1,1],angle=0){
        return {
            position,
            scale,
            angle,  
        }
    }
    getDefaultState(){
        return {
            ...this.state
        }
    }
    initGuiState(){
        const state=this.state
        for(const [key,value] of Object.entries(state)){
            if(Array.isArray(value)){
               const gui= this.gui.addFolder(key)
               if(value.length===2){
                    gui.add(value,0).name('x')
                    gui.add(value,1).name('y')
               }else  if(value.length===4){
                    gui.add(value,0).name('x')
                    gui.add(value,1).name('y')
                    gui.add(value,2).name('x')
                    gui.add(value,3).name('w')
               }
            }else if(this.stateOptions[key]){
                this.gui.add(state,key,this.stateOptions[key])
            }else if(typeof value==='string'&&value.startsWith('#')){
                this.gui.addColor(state,key)
            }else{
                this.gui.add(state,key)
            }
        }
    }
    updateTransform(object:DisplayObject,state:any){
        const {position,scale,angle}=state
        object.position.set(position[0],position[1])
        object.scale.set(scale[0],scale[1])
        object.angle=angle
    }
    
    init(){

    }
    enter(){

    }
    exit(){

    }
    onChange(property:string,value:any){
       
    }
    onUpdate(){

    }
    refresh(){
        this.owner.refresh()
    }
    destroy(){

    }
}
type GetFuncProp<T extends ExampleBase, Prop extends keyof ExampleBase=keyof ExampleBase>=T[Prop] extends Function?Prop:never

export class ExampleManager{
    static getSignleInstance(){
        if(!this._instance){
            this._instance=new ExampleManager()
        }
        return this._instance
    }
    static examples:typeof ExampleBase[]=[]
    private static _instance:ExampleManager=null
    engine:CKEngine
    gui:GUI
    examples:Map<string,ExampleBase>=new Map()
    currentExample:ExampleBase=null
    exampleGroup:Group
    constructor(){
        if(ExampleManager.examples.length>0){
            this.addExamples(ExampleManager.examples)
        }
    }
    async setupEngine(options:Partial<CKEngineOptions>={}){
        const engine=new CKEngine()
        await engine.init({
            canvas:document.querySelector('#canvas')!,
            width:500,
            height:500,
            backgroundColor:'#efefef',
            alwaysRefresh:true,
            ...options
        })
        this.engine=engine
        this.exampleGroup=new Group()
        this.engine.add(this.exampleGroup)
    
    }
    async init(options:Partial<CKEngineOptions>={}){
        this.gui=new GUI()
        this.gui.onChange(({property,value})=>{
            if(property!=='currentExampleName'){
                if(this.currentExample){
                    this.currentExample.onChange(property,value)
                }
                this.refresh()
            }
        })
        await this.setupEngine(options)
        await this.initExamples()
        const exampleSelect=this.gui.add(this,'currentExampleName',Array.from(this.examples.keys())).name('examples')
        if(this.examples.size>0){
            let examples=Array.from(this.examples.values())
            let cur=examples.find(d=>d.active)
            let value=cur?cur.title:examples[0].title
             exampleSelect.setValue(value)
           // this.activeExample(this.examples.keys().next().value)
           // exampleSelect.setValue(this.currentExampleName)
        }
    }
    async initExamples(){
        for(const example of this.examples.values()){
           await this.initExample(example)
        }
    }
    get currentExampleName(){
        return this.currentExample?.title
    }
    set currentExampleName(name:string){
        this.activeExample(name)
    }
    addExamples(examples:typeof ExampleBase[]){
        examples.forEach(Example=>{
            this.addExample(Example)
        })
    }
    addExample(Example:typeof ExampleBase){
        const name=Example.prototype.title||Example.title
        if(this.hasExample(name)){
            return
        }
        const example=new Example()
        example.owner=this
        example.title=name
        this.examples.set(name,example)
    }
    callExampleHook(example:ExampleBase,hookName:keyof ExampleBase,args:any[]=[]){
        const hook=example[hookName]
        if(typeof hook==='function'){
            (hook as any).apply(example,args)
        }
    }
    async initExample(example:ExampleBase){
        return example.init()
    }
    hasExample(type:string){
        return this.examples.has(type)
    }


    activeExample(name:string){
        const example=this.examples.get(name)
        if(example&&example!==this.currentExample){
            if(this.currentExample){
                this.currentExample.gui?.destroy()
                this.currentExample.gui=null
                this.currentExample.exit()
                this.exampleGroup.removeAllChildren()
            }
            example.gui?.destroy()
            example.gui=this.gui.addFolder(example.title)
            example.initGuiState()
            example.enter()
            this.currentExample=example
        }
    }
    add(node:DisplayObject){
        this.exampleGroup.add(node)
        this.refresh()
    }
    refresh(){
        this.engine.refresh()
    }
    destroy(){
        this.examples.forEach(example=>{
            example.destroy()
        })
        this.examples.clear()
        this.gui.destroy()
    }
}