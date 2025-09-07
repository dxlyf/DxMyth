import { Application, Rect, Container, Circle, Path,Text,Image,LinearGradient,ProxyPath2D} from '../../src'
import { ApplicationOptions } from '../../src/types/core/Application'
import { Matrix2D } from '../../src/math/Matrix2d'
import { Vector2 } from '../../src/math/Vec2'
import url from './images.jpg?url'
const app = new Application({
    resizeTo: window,
    canvas: document.getElementById('myCanvas') as HTMLCanvasElement,
    renderMode: 'canvas'
})
async function main() {

    await app.init()
    let _LinearGradient=new LinearGradient(100,150,200,150)
    _LinearGradient.addColorStop(0, 'red')
    _LinearGradient.addColorStop(0.5, 'green')
    _LinearGradient.addColorStop(1, 'blue')

    let clipPath=new ProxyPath2D()
    clipPath.arc(150,150,30,0,Math.PI*2)

    let p = new Path({
        style: {
            fillStyle:_LinearGradient,
           // strokeStyle: 'blue',
            //lineWidth: 10,
            //strokeDashArray:[5,5]
        }
    })
    p.rect(100, 100, 100, 100)
    p.on('pointerenter',e=>{
        console.log('path','enter')
    })
    p.on('pointerleave',e=>{
        console.log('path','leave')
    })

    let text=new Text({
        style:{
            fontSize:14,
            fillStyle:'red'
        },
        shape:{
            text:'hello world'
        },
        position:{x:100,y:400}
    })
    text.on('pointerenter',e=>{
        console.log('text','enter')
    })
    text.on('pointerleave',e=>{
        console.log('text','leave')
    })
    app.add(text)


    let circle=new Circle({
        ignore:true,
        style:{
            fillStyle:'blue'
        },
        shape:{
           r:40
        },
        position:{x:350,y:450},

    })

    let rect=new Rect({
        style:{
            fillStyle:'red'
        },
        shape:{
            x:0,
            y:0,
            width:100,
            height:100
        },
        position:{x:300,y:400},
        clipShape:circle

    })
    app.add(rect)
    app.add(circle)
    let img=new Image({
        shape:{
            image:url
        },
        position:{x:300,y:100}
    })
    app.add(img)
    app.add(p)
    app.refresh()


}
main()

