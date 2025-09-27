import { CK } from '../index'
import * as CanvasKit from '../index'
export class HTMLImage{
  _skImage:CanvasKit.Image
  width:number
  height:number
  naturalWidth:number
  naturalHeight:number
  getSkImage:()=>CanvasKit.Image
  constructor(skImage:CanvasKit.Image){
    this._skImage = skImage;
    // These are writable but have no effect, just like HTMLImageElement
    this.width = skImage.width();
    this.height = skImage.height();
    this.naturalWidth = this.width;
    this.naturalHeight = this.height;
    this.getSkImage = function() {
      return skImage;
    }
  }
}


