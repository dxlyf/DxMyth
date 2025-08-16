import { BoundingRect } from 'src/math/BoundingRect'
export interface IViewport{
    left:number
    top:number
    right:number
    bottom:number
    intersect(rect:BoundingRect):boolean

}