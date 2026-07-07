
import { Engine, Rect, Group } from './src/index'
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
            lineWidth: 10
        },
        shape:{
            width:100,
            height:100
        }
    })
    const rect2 = new Rect({
        position: { x: 150, y: 150 },
        style: {
            fillStyle: '#00ff00',
            strokeStyle: '#0000ff',
            lineWidth: 10,
            // opacity:0.7
        },
        zIndex: 100
    })
    const count = 5000;

    const random = (min: number, max: number) => {
        return Math.floor(min + (max - min) * Math.random())
    }
    const rects = Array.from({ length: count }, () => {
        const info = {
            x: random(0, engine.renderer.viewWidth),
            y: random(0, engine.renderer.viewHeight),
            w: random(40, 100),
            h: random(40, 100),

            fillStyle: '#' + Math.random().toString(16).slice(-6),
            speed: random(1, 5),
            update: function () {
                this.x += this.speed
                if (this.x > 500) {
                    this.x = 0
                }
            }
        }
        let rect=new Rect({
            position:{x:info.x,y:info.y},
            shape:{
                x:0,
                y:0,
                width:info.w,
                height:info.h
            },
            style:{
                fillStyle:info.fillStyle
            }
        })
        rect.onUpdate=()=>{
            info.update()
            rect.position.set(info.x,info.y)
            engine.refresh()
        }
       // group.add(rect)
    })
     group.add(rect)
     group.on('click',e=>{
        console.log('e',e.data)
     })
     rect.on('pointerenter',e=>{
        e.target.setStyle('fillStyle','#00ff00')
     })
     rect.on('pointerleave',e=>{
        e.target.setStyle('fillStyle','#ff0000')
     })
    // group.add(rect2)
    engine.add(group)
    engine.on('tick',()=>{
        stats.update()
    })
}

init()