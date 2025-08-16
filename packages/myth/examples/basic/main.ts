import {Application,Rect} from '../../src'
import {ApplicationOptions} from '../../src/types/core/Application'

const app=new Application({
    resizeTo:window,
    canvas:document.getElementById('myCanvas') as HTMLCanvasElement,
    renderMode:'canvas'
})
async function main(){
    await app.init()


    const  rect=new Rect({
        shape:{
            x:0,
            y:0,
            width:100,
            height:100
        },
        style:{
            fillStyle:'#ff0000'
        },
        position:{x:100,y:100},

        
    })
    app.add(rect)
    app.render()

}
main()

