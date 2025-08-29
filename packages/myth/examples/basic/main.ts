import { Application, Rect, Container, Circle, Path } from '../../src'
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
    p.on('pointerdown',e=>{
        console.log('path',e.target)
  
        
    })
    app.container.on('pointerdown',e=>{
        console.log('container',e)
    })
    app.add(p)
    app.refresh()


}
main()

