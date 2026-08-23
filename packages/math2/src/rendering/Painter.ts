
import { Matrix2D } from 'src/math/Matrix2D'
import {MirrorPath2D} from 'src/math/MirrorPath2D'



export abstract class PainterContext {
    currentPath:MirrorPath2D
    constructor(){
        this.currentPath=new MirrorPath2D()
    }

    beginPath(){
        this.currentPath=new MirrorPath2D()
    }
    moveTo(x:number,y:number){
        this.currentPath.moveTo(x,y)
    }
    lineTo(x:number,y:number){
        this.currentPath.lineTo(x,y)
    }
    arc(x:number,y:number,radius:number,startAngle:number,endAngle:number,ccw:boolean=false){
        this.currentPath.arc(x,y,radius,startAngle,endAngle,ccw)
    }
    ellipse(x:number,y:number,radiusX:number,radiusY:number,rotation:number,startAngle:number,endAngle:number,ccw:boolean){
        this.currentPath.ellipse(x,y,radiusX,radiusY,rotation,startAngle,endAngle,ccw)
    }
    arcTo(x1:number,y1:number,x2:number,y2:number,radius:number){
        this.currentPath.arcTo(x1,y1,x2,y2,radius)
    }
    quadraticCurveTo(x1:number,y1:number,x2:number,y2:number){
        this.currentPath.quadraticCurveTo(x1,y1,x2,y2)
    }
    bezierCurveTo(x1:number,y1:number,x2:number,y2:number,x3:number,y3:number){
        this.currentPath.bezierCurveTo(x1,y1,x2,y2,x3,y3)
    }
    closePath(){
        this.currentPath.closePath()
    }
    transform(matrix:Matrix2D){
        this.currentPath.transform(matrix)
    }
    abstract stroke():void
    abstract fill():void

    
}