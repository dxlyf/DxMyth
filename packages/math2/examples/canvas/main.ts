
import { SkScalarExp } from 'skia-path2d'
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Stats, Ruler,ZoomTranslate, CanvasRenderer, random, Path2D as SPath2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath } from 'src'

class CanvasExample extends Example {
    constructor() {
        super()
    }
    canvas: CanvasRenderer
    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {

        }
    }
    enter(): void {
        super.enter()
        this.canvas = new CanvasRenderer({
            width: 500,
            height: 500,
        })
        const canvas = this.canvas
        const ruler = new Ruler()
        const zoomTranslate=new ZoomTranslate()

        canvas.on('wheel',(e)=>{
           const ee= e.nativeEvent as WheelEvent
          if(ee.ctrlKey){
              const delta=-ee.deltaY
             zoomTranslate.scaleOrigin(zoomTranslate.zoom+delta/10,e.point.x,e.point.y)
           canvas.refresh()
           ee.preventDefault()
          }
        })
        let spaceDown=false
        window.addEventListener('keydown',e=>{
            spaceDown=e.key===' '
        })
          window.addEventListener('keyup',e=>{
            spaceDown=false
        })
        canvas.on('drag',e=>{
            if(spaceDown){
                zoomTranslate.translate(e.deltaPoint.x,e.deltaPoint.y)
                canvas.refresh()
            }
        })
        let visibleText:any
        let currentActiveFrame:any;
        canvas.on('pointerdown',e=>{
            const paths=e.composedPath()
            const activeFrame=paths.find(d=>(d as any).name=='Frame')
            if(activeFrame){
                currentActiveFrame=activeFrame
                canvas.refresh()
            }else if(currentActiveFrame){
                currentActiveFrame=null
                canvas.refresh()
            }
        })
        canvas.on('pointermove',e=>{
            if(e.point.y<10){
                const x=e.point.x;
                visibleText={x:x,y:0,value:ruler.getValue(x)}
                           canvas.refresh()
            }else if(visibleText){
                visibleText=null
                canvas.refresh()
            }
            
        })
        canvas.on('render:before',(canvas)=>{
            canvas.ctx.fillStyle='#ddd'
            canvas.ctx.fillRect(0,0,canvas.width,canvas.height)

        })
        canvas.on('render:after', (canvas) => {
            const ctx = canvas.ctx
            const width = canvas.width
            let pageX=zoomTranslate.x;
            if(currentActiveFrame){
                pageX+=currentActiveFrame.transform.position.x
            }   
        
            const { ticks, labels } = ruler.generate(width,{
                zoom:zoomTranslate.scaleFactor,
                offset:pageX
            })
            ctx.save()
            ctx.beginPath()
            ctx.lineWidth=1
            ctx.strokeStyle='#000'
            ticks.forEach((t,i)=> {
                let h=t.type==='long'?10:5
                ctx.moveTo(t.position,0)
                ctx.lineTo(t.position,h)
            })
            ctx.stroke()
            ctx.beginPath()
            ctx.fillStyle='blue'
            ctx.textBaseline='top'
            labels.forEach(t=>{
                ctx.fillText(t.value+'',t.position,10)
            })
            if(visibleText){
              //  ctx.beginPath()
                ctx.fillStyle='#fff'
                ctx.lineWidth=1
                ctx.strokeStyle='green'
                ctx.fillRect(visibleText.x+50,visibleText.y+20,100,30)
                ctx.strokeRect(visibleText.x+50,visibleText.y+20,100,30)
                ctx.fillStyle='green'
                ctx.fillText(visibleText.value+'',visibleText.x+100,visibleText.y+30)
            }
            ctx.restore()
        })
        const workspace=canvas.add('group',{
            name:'Workspace',
            onUpdate(){
                this.transform.position.set(zoomTranslate.x,zoomTranslate.y)
                this.transform.scale.set(zoomTranslate.scaleFactor,zoomTranslate.scaleFactor)
            }
        })
        const frame=workspace.add('group',{
            name:'Frame',
            draggable:true,
            onUpdate(){
                
            }
           
        })

        frame.add('rect',{
            width:300,
            height:300,
            style:{
                fillStyle:'#fff'
            }
        })
        const page=frame.add('group',{
            onUpdate(){
        
               // this.transform.origin.set(zoomTranslate.)
            }
        })

        const r=page.add('rect',{
            width:100,
            height:100,
            position:{x:100,y:100},
            style:{
                fillStyle:'#0000ff'
            },
            beforeDraw(){
               // console.log('aaaa',this.transform.worldMatrix)
            }
        })
     //   console.log('rrr',r.transform.worldMatrix)
        // canvas.requestRender()
        // let stats = new Stats()
        // document.body.appendChild(stats.dom)
        // canvas.on('tick', delta => {
        //     stats.update()
        // })
    }
    onChange(): void {

    }
    render() {

    }
}
ExampleManager.create({ examples: [CanvasExample] }).init()