import { Application, Rect, Container, Circle, Path,Text} from '../../src'
import { ApplicationOptions } from '../../src/types/core/Application'
import { Matrix2D } from '../../src/math/Matrix2d'
import { Vector2 } from '../../src/math/Vec2'
const app = new Application({
    resizeTo: window,
    canvas: document.getElementById('myCanvas') as HTMLCanvasElement,
    renderMode: 'canvas'
})
async function main() {
    await app.init()
    let p = new Path({
        style: {
            fillStyle:null,
            strokeStyle: 'blue',
            lineWidth: 10,
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


    app.add(p)
    app.refresh()


}
main()

