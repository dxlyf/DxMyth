
import { Engine, Rect, Group, Ellipse } from './src/index'
import Stats from 'stats.js'

const stats = new Stats()
document.body.appendChild(stats.domElement)
const engine = new Engine()

const init = async () => {
    await engine.initialize({
        width: 500,
        height: 500,
        backgroundColor: '#efefef'
    })

    const group = new Group()
    //  group.position.set(100,100)
    const rect = new Rect({
        position: { x: 100, y: 100 },
        style: {
            fillStyle: '#ff0000',
            strokeStyle: '#0000ff',
            lineWidth: 10,
            strokeAlign:'outside'
            // shadowBlur: 10,
            // shadowColor: '#ffff00',
            // shadowOffsetX: 10,
            // shadowOffsetY: 10,
        },
        shape:{
            width:100,
            height:100
        }
    })
    rect.on('pointerenter',e=>{
        console.log('pointerenter')
        rect.setStyles({
            fillStyle:'#0000ff'
        })
    })
    rect.on('pointerleave',e=>{
        console.log('pointerleave')
        rect.setStyles({
            fillStyle:'#ff0000'
        })
    })

    const ellipse = new Ellipse({
        position: { x: 300, y: 250 },
      //  hitBounds:false,
        style: {
            fillStyle: '#00ff00',
            strokeStyle: '#000',
            lineWidth: 3,
           // closePath:true
        },
        shape: {
            radiusX: 80,
            radiusY: 150,
           // rotation: 0.3,
            endAngle: Math.PI*2,
        }
    })
    ellipse.on('click',e=>{
        console.log('ff')
    })
    engine.add(ellipse)
    group.add(rect)
    
    engine.add(group)
    engine.on('tick',()=>{
        stats.update()
    })
}

init()