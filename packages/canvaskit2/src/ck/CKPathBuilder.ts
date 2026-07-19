
import { BoundingRect } from '@dxyl/math2'
import {ck,type CanvasKit} from './lib'
import {ellipse} from './util'
import { easeOutQuart } from 'src/animation'
import { FillRule } from 'src/core/Renderer'
import {toCKFillRule} from './convert'

export class CKPathBuilder {
    pathBuilder :CanvasKit.PathBuilder
    version:number=0
    constructor() {
        this.beginPath()
    }
    reset(){
        this.beginPath()
    }
    markDirty(){
        this.version++
    }
    beginPath(){
        const path=this.pathBuilder
        if(path){
            path.delete()
        }
        this.pathBuilder=new ck.PathBuilder()
        this.markDirty()
    }
    transform(matrix: CanvasKit.Matrix3x3) {
        this.pathBuilder.transform(matrix)
        this.markDirty()
    }
    moveTo(x:number,y:number){
        this.pathBuilder.moveTo(x,y)
        this.markDirty()
    }
    lineTo(x:number,y:number){
        this.pathBuilder.lineTo(x,y)
        this.markDirty()
    }
    quadraticCurveTo(cp1x:number, cp1y:number, x:number, y:number){
        this.pathBuilder.quadTo(cp1x, cp1y, x, y)
        this.markDirty()
    }
    bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number){
        this.pathBuilder.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.markDirty()
    }
    conicTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.pathBuilder.conicTo(x1, y1, x2, y2, radius)
       this.markDirty()
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.pathBuilder.arcToTangent(x1, y1, x2, y2, radius)
        this.markDirty()
    }
    arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, counterclockwise:boolean=false){
        this.pathBuilder.arc(x, y, radius, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        ellipse(this.pathBuilder, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number, isCCW?: boolean): void {
        this.pathBuilder.addRect(ck.XYWHRect(x, y, w, h), isCCW)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
        // ck.XYWHRect 返回 4 元素 Float32Array [l, t, r, b]（Rect），不能直接当 12 元素 RRect 用：
        // Float32Array 定长，给索引 [4]-[11] 赋值会被静默忽略，导致圆角全为 0。
        // RRect 布局: [l, t, r, b, rx_tl, ry_tl, rx_tr, ry_tr, rx_br, ry_br, rx_bl, ry_bl]
        const rect = ck.XYWHRect(x, y, w, h)
        // corners 顺序对应 CSS roundRect: [tl, tr, br, bl]
        const corners = new Float32Array(4)
        if (Array.isArray(radii)) {
            if (radii.length === 1) {
                corners.fill(radii[0] as number)
            } else if (radii.length === 2) {
                // CSS 2 值规则: [tl/br, tr/bl]
                corners[0] = corners[2] = radii[0] as number
                corners[1] = corners[3] = radii[1] as number
            } else if (radii.length === 4) {
                corners[0] = radii[0] as number
                corners[1] = radii[1] as number
                corners[2] = radii[2] as number
                corners[3] = radii[3] as number
            }
        } else if (typeof radii === 'number') {
            corners.fill(radii)
        }
        const rrect = new Float32Array(12)
        rrect[0] = rect[0]            // left
        rrect[1] = rect[1]            // top
        rrect[2] = rect[2]            // right
        rrect[3] = rect[3]            // bottom
        rrect[4] = corners[0]         // tl rx
        rrect[5] = corners[0]         // tl ry
        rrect[6] = corners[1]         // tr rx
        rrect[7] = corners[1]         // tr ry
        rrect[8] = corners[2]         // br rx
        rrect[9] = corners[2]         // br ry
        rrect[10] = corners[3]        // bl rx
        rrect[11] = corners[3]        // bl ry
        this.pathBuilder.addRRect(rrect)
        this.markDirty()
    }
    closePath() {
        this.pathBuilder.close()
        this.markDirty()
    }
    getBounds(out:BoundingRect): BoundingRect {
        const rect=this.pathBuilder.getBounds()
        out.fromLTRB(rect[0], rect[1], rect[2], rect[3])
        return out
    }
    contains(x:number,y:number){
        return this.pathBuilder.contains(x, y)
    }
    setFillType(fillType:FillRule){
        this.pathBuilder.setFillType(toCKFillRule(fillType))
    }
    isEmpty(){
        return this.pathBuilder.isEmpty()
    }
    detach(){
        // 会清空当前this.pathBuilder   
        return this.pathBuilder.detach()
    }
    detachAndDelete(){
        return this.pathBuilder.detachAndDelete()
    }
    deleteLater(){
        this.pathBuilder.deleteLater()
    }
    delete(){
        this.pathBuilder.delete()
    }
    
  
}