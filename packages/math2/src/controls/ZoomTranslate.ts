

export class ZoomTranslate{
    x:number=0
    y:number=0
    zoom:number=100
    minZoom:number=10
    maxZoom:number=1000
    get scaleFactor(){
        return this.zoom/100
    }
  
    scale(zoom:number){
       this.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,zoom))
    }
    scaleOrigin(zoom:number,x:number,y:number){
        const oldZoom=this.zoom
        this.scale(zoom)
        const zoomScale=this.zoom/oldZoom
        const mx=x-this.x;
        const my=y-this.y;
        const newX=x-mx*zoomScale
        const newY=y-my*zoomScale
        this.x=newX
        this.y=newY
    }
    translate(x:number,y:number){
        this.x+=x;
        this.y+=y;
    }

}