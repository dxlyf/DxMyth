import { CK } from '../index'
import * as CanvasKit from '../index'
import { CanvasRenderingContext2D } from './canvas2dcontext';
import { addToFontCache } from './font';
import { HTMLImage } from './htmlimage';
import {Path2D} from './path2d'
import { toBase64String } from './util';
export const MakeCanvas=(width:number, height:number)=> {
  var surf = CK.MakeSurface(width, height);
  if (surf) {
    return new HTMLCanvas(surf);
  }
  return null;
};
class HTMLCanvas{
  _surface:CanvasKit.Surface
  _context:CanvasRenderingContext2D
  _toCleanup:any[]
  constructor(skSurface:CanvasKit.Surface) {
    this._surface=skSurface;
    this._context = new CanvasRenderingContext2D(skSurface.getCanvas());
    this._toCleanup= [];
  }
  // Data is either an ArrayBuffer, a TypedArray, or a Node Buffer
  decodeImage(data:any) {
    var img = CK.MakeImageFromEncoded(data);
    if (!img) {
      throw 'Invalid input';
    }
    this._toCleanup.push(img);
    return new HTMLImage(img);
  }
  loadFont(buffer:any, descriptors:any):any {
    var newFont = CK.Typeface.MakeTypefaceFromData(buffer);
    if (!newFont) {
     // Debug('font could not be processed', descriptors);
      return null;
    }
    this._toCleanup.push(newFont);
    addToFontCache(newFont, descriptors);
  };

  makePath2D(path:any) {
    var p2d = new Path2D(path);
    this._toCleanup.push(p2d._getPath());
    return p2d;
  };

  // A normal <canvas> requires that clients call getContext
  getContext(type:string) {
    if (type === '2d') {
      return this._context;
    }
    return null;
  };

  toDataURL(codec:any, quality:number) {
    // TODO(kjlubick): maybe support other codecs (webp?)
    // For now, just to png and jpeg
    this._surface.flush();

    var img = this._surface.makeImageSnapshot();
    if (!img) {
      //Debug('no snapshot');
      return;
    }
    codec = codec || 'image/png';
    var format = CK.ImageFormat.PNG;
    if (codec === 'image/jpeg') {
      format = CK.ImageFormat.JPEG;
    }
    quality = quality || 0.92;
    var imgBytes = img.encodeToBytes(format, quality);
    if (!imgBytes) {
   //   Debug('encoding failure');
      return
    }
    img.delete();
    return 'data:' + codec + ';base64,' + toBase64String(imgBytes as any);
  };

  dispose() {
    this._context._dispose();
    this._toCleanup.forEach(function(i) {
      i.delete();
    });
    this._surface.dispose();
  }
}