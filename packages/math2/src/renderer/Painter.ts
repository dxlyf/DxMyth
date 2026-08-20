
import {PathBuilder} from 'src/math/PathBuilder'


export class Painter {
    currentPath:PathBuilder
    constructor(){
        this.currentPath=new PathBuilder()
    }
    moveTo(x:number,y:number){
        this.currentPath.moveTo(x,y)
    }
    lineTo(x:number,y:number){
        this.currentPath.lineTo(x,y)
    }
    closePath(){
        this.currentPath.closePath()
    }

    
}