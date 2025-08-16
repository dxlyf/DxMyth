import { BoundingRect } from 'src/math/BoundingRect'
import { Matrix2D } from 'src/math/Matrix2d'
import { IViewport } from "src/types/core/Viewport";


export class Viewport implements IViewport{
    rect=BoundingRect.empty()
    matrix=Matrix2D.default()
    constructor(){
    
    }
    get left(){
        return this.rect.left
    }
    get top(){
        return this.rect.top
    }
    get right(){
        return this.rect.right
    }
    get bottom(){
        return this.rect.bottom
    }
    copy(source:Viewport){
        this.rect.copy(source.rect)
        this.matrix.copy(source.matrix)
        return this
    }
    clone(){
        return new Viewport().copy(this)
    }
    multiptyScalar(scale:number){
        this.rect.min.mulScalar(scale)
        this.rect.max.mulScalar(scale)
        return this
    }
    setViertport(x:number,y:number,width:number,height:number){
        this.rect.fromRect(x,y,width,height)
    }
    intersect(rect: BoundingRect): boolean {
       return this.rect.intersectionBox(rect)
    }
    
}