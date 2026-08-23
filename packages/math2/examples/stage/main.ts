
import { SkScalarExp } from 'skia-path2d'
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Stats, Ruler,ZoomTranslate, Stage,curvePaths,pixijs,EllipseArc, random, Path2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath } from 'src'

class CanvasExample extends Example {
    constructor() {
        super()
    }
  
    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {
            cx:{
                label:'cx',
                value:100,
                min:0,
                max:500,
                step:1,
            },
            cy:{
                label:'cy',
                value:100,
                min:0,
                max:500,
                step:1,
            },
            startAngle:{
                label:'startAngle',
                value:0,
                min:-360,
                max:360,
                step:1
            },
            endAngle:{
                label:'endAngle',
                value:360,
                min:-360,
                max:360,
                step:1,
       
            },
            rx:{
                label:'rx',
                value:50,
                min:0,
                max:500,
                step:1,
            },
            ry:{
                label:'ry',
                value:70,
                min:0,
                max:500,
                step:1,
            },
            ccw:{
                label:'ccw',
                value:false,
            },
            showPath:{
                label:'showPath',
                value:true,
            }
        }
    }
    stage:Stage
    async enter() {
        super.enter()
      
        let stage=new Stage()
        let setting=this.state
        this.stage=stage
        stage.init({
            width: 500,
            height: 500,
            renderer: 'canvas',
            rendererConfig:{}
        }).then(()=>{
            stage.start()
        
            stage.on('beforeFrame',()=>{
                  const ctx=stage.renderer.ctx
               
                ctx.save()
                ctx.clearRect(0,0,ctx.canvas.width,stage.renderer.height)
                ctx.scale(stage.renderer.dpr,stage.renderer.dpr)
                const path=new curvePaths.Path()

                let startAngle=setting.startAngle
                let endAngle=setting.endAngle
                let ccw=setting.ccw

            
           path.ellipse(setting.cx,setting.cy,setting.rx,setting.ry,setting.startAngle/180*Math.PI,setting.endAngle/180*Math.PI,setting.ccw,0)
                const path2=new globalThis.Path2D()
                path2.ellipse(setting.cx,setting.cy,setting.rx,setting.ry,0,setting.startAngle/180*Math.PI,setting.endAngle/180*Math.PI,setting.ccw)
                const points=path.getPoints()
                console.log('points',points)
                ctx.beginPath()
                ctx.lineWidth=1
                ctx.strokeStyle='#000'
            
                ctx.stroke(path2)
              
                if(setting.showPath){
                    ctx.beginPath()
                    ctx.lineWidth=1
                    ctx.strokeStyle='red'
                    ctx.moveTo(points[0].x,points[0].y)
                    for(let i=1;i<points.length;i++){
                        ctx.lineTo(points[i].x,points[i].y)
                    }
                    ctx.stroke()
                }
                ctx.restore()
            })
            stage.refresh()

        })
    }
    onChange(): void {
        this.stage?.refresh()
    }
    render() {

    }
}
ExampleManager.create({ examples: [CanvasExample] }).init()