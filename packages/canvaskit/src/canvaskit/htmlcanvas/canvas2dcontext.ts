import { CK } from '../index'
import type * as CanvasKit from  '../index'
import type {Paint} from  '../index'
import { parseColor, colorToString } from './color'
import { getTypeface } from './font'
import { HTMLImage } from './htmlimage'
import { arc, arcTo, ellipse, closePath, rect, lineTo, moveTo, bezierCurveTo, quadraticCurveTo, Path2D } from './path2d'
import { RadialCanvasGradient } from './radialgradient'
import { allAreFinite, isCKColor, radiansToDegrees } from './util'
import {CanvasPattern} from './pattern'
import { LinearCanvasGradient } from './lineargradient'
import {ImageData} from './imagedata'

declare module 'canvaskit-wasm'{
    interface Paint{
      dispose():void
    }
}

export class CanvasRenderingContext2D {
  _canvas: CanvasKit.Canvas
  _paint: CanvasKit.Paint
  _fontString: string
  _font: CanvasKit.Font
  _strokeStyle: any
  _fillStyle: any
  _shadowBlur: number
  _shadowColor: CanvasKit.Color
  _shadowOffsetX: number
  _shadowOffsetY: number
  _globalAlpha: number
  _strokeWidth: number
  _lineDashOffset: number
  _lineDashList: number[]
  _globalCompositeOperation: CanvasKit.BlendMode
  _currentPath: CanvasKit.Path
  _currentTransform: number[]
  _canvasStateStack: any[]
  _toCleanUp: any[]
  constructor(skcanvas: CanvasKit.Canvas) {
    this._canvas = skcanvas
    this._paint = new CK.Paint();
    this._paint.setAntiAlias(true);

    this._paint.setStrokeMiter(10);
    this._paint.setStrokeCap(CK.StrokeCap.Butt);
    this._paint.setStrokeJoin(CK.StrokeJoin.Miter);
    this._fontString = '10px monospace';

    this._font = new CK.Font(CK.Typeface.GetDefault(), 10);
    this._font.setSubpixel(true);

    this._strokeStyle = CK.BLACK;
    this._fillStyle = CK.BLACK;
    this._shadowBlur = 0;
    this._shadowColor = CK.TRANSPARENT;
    this._shadowOffsetX = 0;
    this._shadowOffsetY = 0;
    this._globalAlpha = 1;
    this._strokeWidth = 1;
    this._lineDashOffset = 0;
    this._lineDashList = [];
    // aka BlendMode
    this._globalCompositeOperation = CK.BlendMode.SrcOver;

    this._paint.setStrokeWidth(this._strokeWidth);
    this._paint.setBlendMode(this._globalCompositeOperation);

    this._currentPath = new CK.Path();
    this._currentTransform = CK.Matrix.identity();

    // Use this for save/restore
    this._canvasStateStack = [];
    // Keep a reference to all the effects (e.g. gradients, patterns)
    // that were allocated for cleanup in _dispose.
    this._toCleanUp = [];

   
  }
  _dispose() {
    this._currentPath.delete();
    this._paint.delete();
    this._font.delete();
    this._toCleanUp.forEach(function (c) {
      c._dispose();
    });
  }
  get currentTransform() {
    return {
      'a': this._currentTransform[0],
      'c': this._currentTransform[1],
      'e': this._currentTransform[2],
      'b': this._currentTransform[3],
      'd': this._currentTransform[4],
      'f': this._currentTransform[5],
    };
  }
  set currentTransform(matrix) {
    if (matrix.a) {
      // if we see a property named 'a', guess that b-f will
      // also be there.
      this.setTransform(matrix.a, matrix.b, matrix.c,
        matrix.d, matrix.e, matrix.f);
    }
  }

  get fillStyle() {
    if (isCKColor(this._fillStyle)) {
      return colorToString(this._fillStyle);
    }
    return this._fillStyle;
  }
  set fillStyle(newStyle) {
    if (typeof newStyle === 'string') {
      this._fillStyle = parseColor(newStyle);
    } else if (newStyle._getShader) {
      // It's an effect that has a shader.
      this._fillStyle = newStyle
    }
  }
  get font() {
    return this._fontString;
  }
  set font(newFont) {
    var tf = getTypeface(newFont);
    if (tf) {
      // tf is a "dict" according to closure, that is, the field
      // names are not minified. Thus, we need to access it via
      // bracket notation to tell closure not to minify these names.
      this._font.setSize(tf['sizePx']);
      this._font.setTypeface(tf['typeface']);
      this._fontString = newFont;
    }
  }

  get globalAlpha() {
    return this._globalAlpha;
  }
  set globalAlpha(newAlpha: number) {
    // ignore invalid values, as per the spec
    if (!isFinite(newAlpha) || newAlpha < 0 || newAlpha > 1) {
      return;
    }
    this._globalAlpha = newAlpha;
  }
  get globalCompositeOperation() {
    switch (this._globalCompositeOperation) {
      // composite-mode
      case CK.BlendMode.SrcOver:
        return 'source-over';
      case CK.BlendMode.DstOver:
        return 'destination-over';
      case CK.BlendMode.Src:
        return 'copy';
      case CK.BlendMode.Dst:
        return 'destination';
      case CK.BlendMode.Clear:
        return 'clear';
      case CK.BlendMode.SrcIn:
        return 'source-in';
      case CK.BlendMode.DstIn:
        return 'destination-in';
      case CK.BlendMode.SrcOut:
        return 'source-out';
      case CK.BlendMode.DstOut:
        return 'destination-out';
      case CK.BlendMode.SrcATop:
        return 'source-atop';
      case CK.BlendMode.DstATop:
        return 'destination-atop';
      case CK.BlendMode.Xor:
        return 'xor';
      case CK.BlendMode.Plus:
        return 'lighter';
      case CK.BlendMode.Multiply:
        return 'multiply';
      case CK.BlendMode.Screen:
        return 'screen';
      case CK.BlendMode.Overlay:
        return 'overlay';
      case CK.BlendMode.Darken:
        return 'darken';
      case CK.BlendMode.Lighten:
        return 'lighten';
      case CK.BlendMode.ColorDodge:
        return 'color-dodge';
      case CK.BlendMode.ColorBurn:
        return 'color-burn';
      case CK.BlendMode.HardLight:
        return 'hard-light';
      case CK.BlendMode.SoftLight:
        return 'soft-light';
      case CK.BlendMode.Difference:
        return 'difference';
      case CK.BlendMode.Exclusion:
        return 'exclusion';
      case CK.BlendMode.Hue:
        return 'hue';
      case CK.BlendMode.Saturation:
        return 'saturation';
      case CK.BlendMode.Color:
        return 'color';
      case CK.BlendMode.Luminosity:
        return 'luminosity';
    }
  }
  set globalCompositeOperation(newMode: string) {
    switch (newMode) {
      // composite-mode
      case 'source-over':
        this._globalCompositeOperation = CK.BlendMode.SrcOver;
        break;
      case 'destination-over':
        this._globalCompositeOperation = CK.BlendMode.DstOver;
        break;
      case 'copy':
        this._globalCompositeOperation = CK.BlendMode.Src;
        break;
      case 'destination':
        this._globalCompositeOperation = CK.BlendMode.Dst;
        break;
      case 'clear':
        this._globalCompositeOperation = CK.BlendMode.Clear;
        break;
      case 'source-in':
        this._globalCompositeOperation = CK.BlendMode.SrcIn;
        break;
      case 'destination-in':
        this._globalCompositeOperation = CK.BlendMode.DstIn;
        break;
      case 'source-out':
        this._globalCompositeOperation = CK.BlendMode.SrcOut;
        break;
      case 'destination-out':
        this._globalCompositeOperation = CK.BlendMode.DstOut;
        break;
      case 'source-atop':
        this._globalCompositeOperation = CK.BlendMode.SrcATop;
        break;
      case 'destination-atop':
        this._globalCompositeOperation = CK.BlendMode.DstATop;
        break;
      case 'xor':
        this._globalCompositeOperation = CK.BlendMode.Xor;
        break;
      case 'lighter':
        this._globalCompositeOperation = CK.BlendMode.Plus;
        break;
      case 'plus-lighter':
        this._globalCompositeOperation = CK.BlendMode.Plus;
        break;
      case 'plus-darker':
        throw 'plus-darker is not supported';

      // blend-mode
      case 'multiply':
        this._globalCompositeOperation = CK.BlendMode.Multiply;
        break;
      case 'screen':
        this._globalCompositeOperation = CK.BlendMode.Screen;
        break;
      case 'overlay':
        this._globalCompositeOperation = CK.BlendMode.Overlay;
        break;
      case 'darken':
        this._globalCompositeOperation = CK.BlendMode.Darken;
        break;
      case 'lighten':
        this._globalCompositeOperation = CK.BlendMode.Lighten;
        break;
      case 'color-dodge':
        this._globalCompositeOperation = CK.BlendMode.ColorDodge;
        break;
      case 'color-burn':
        this._globalCompositeOperation = CK.BlendMode.ColorBurn;
        break;
      case 'hard-light':
        this._globalCompositeOperation = CK.BlendMode.HardLight;
        break;
      case 'soft-light':
        this._globalCompositeOperation = CK.BlendMode.SoftLight;
        break;
      case 'difference':
        this._globalCompositeOperation = CK.BlendMode.Difference;
        break;
      case 'exclusion':
        this._globalCompositeOperation = CK.BlendMode.Exclusion;
        break;
      case 'hue':
        this._globalCompositeOperation = CK.BlendMode.Hue;
        break;
      case 'saturation':
        this._globalCompositeOperation = CK.BlendMode.Saturation;
        break;
      case 'color':
        this._globalCompositeOperation = CK.BlendMode.Color;
        break;
      case 'luminosity':
        this._globalCompositeOperation = CK.BlendMode.Luminosity;
        break;
      default:
        return;
    }
    this._paint.setBlendMode(this._globalCompositeOperation);
  }
  get imageSmoothingEnabled() {
    return true
  }
  get imageSmoothingQuality() {
    return 'high'
  }
  get lineCap() {
    switch (this._paint.getStrokeCap()) {
      case CK.StrokeCap.Butt:
        return 'butt';
      case CK.StrokeCap.Round:
        return 'round';
      case CK.StrokeCap.Square:
        return 'square';
    }
  }
  set lineCap(newCap: string) {
    switch (newCap) {
      case 'butt':
        this._paint.setStrokeCap(CK.StrokeCap.Butt);
        return;
      case 'round':
        this._paint.setStrokeCap(CK.StrokeCap.Round);
        return;
      case 'square':
        this._paint.setStrokeCap(CK.StrokeCap.Square);
        return;
    }
  }
  get lineDashOffset() {
    return this._lineDashOffset;
  }
  set lineDashOffset(newOffset: number) {
    if (!isFinite(newOffset)) {
      return;
    }
    this._lineDashOffset = newOffset;
  }
  get lineJoin() {
    switch (this._paint.getStrokeJoin()) {
      case CK.StrokeJoin.Miter:
        return 'miter';
      case CK.StrokeJoin.Round:
        return 'round';
      case CK.StrokeJoin.Bevel:
        return 'bevel';
    }
  }
  set lineJoin(newJoin: CanvasLineJoin) {
    switch (newJoin) {
      case 'miter':
        this._paint.setStrokeJoin(CK.StrokeJoin.Miter);
        return;
      case 'round':
        this._paint.setStrokeJoin(CK.StrokeJoin.Round);
        return;
      case 'bevel':
        this._paint.setStrokeJoin(CK.StrokeJoin.Bevel);
        return;
    }
  }
  get lineWidth() {
    return this._paint.getStrokeWidth();
  }
  set lineWidth(newWidth: number) {
    if (newWidth <= 0 || !newWidth) {
      // Spec says to ignore NaN/Inf/0/negative values
      return;
    }
    this._strokeWidth = newWidth;
    this._paint.setStrokeWidth(newWidth);
  }
  get miterLimit() {
    return this._paint.getStrokeMiter();
  }
  set miterLimit(newLimit: number) {
    if (newLimit <= 0 || !newLimit) {
      // Spec says to ignore NaN/Inf/0/negative values
      return;
    }
    this._paint.setStrokeMiter(newLimit);
  }
  get shadowBlur() {
    return this._shadowBlur;
  }
  set shadowBlur(newBlur: number) {
    // ignore negative, inf and NAN (but not 0) as per the spec.
    if (newBlur < 0 || !isFinite(newBlur)) {
      return;
    }
    this._shadowBlur = newBlur;
  }
  get shadowColor() {
    return colorToString(this._shadowColor);
  }
  set shadowColor(newColor: string) {
    this._shadowColor = parseColor(newColor);
  }
  get shadowOffsetX() {
    return this._shadowOffsetX;
  }
  set shadowOffsetX(newOffset: number) {
    if (!isFinite(newOffset)) {
      return;
    }
    this._shadowOffsetX = newOffset;
  }
  get shadowOffsetY() {
    return this._shadowOffsetY;
  }
  set shadowOffsetY(newOffset: number) {
    if (!isFinite(newOffset)) {
      return;
    }
    this._shadowOffsetY = newOffset;
  }
  get strokeStyle() {
    return colorToString(this._strokeStyle);
  }
  set strokeStyle(newStyle: any) {
    if (typeof newStyle === 'string') {
      this._strokeStyle = parseColor(newStyle);
    } else if (newStyle._getShader) {
      // It's probably an effect.
      this._strokeStyle = newStyle
    }
  }
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean) {
    arc(this._currentPath, x, y, radius, startAngle, endAngle, ccw);
  };
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    arcTo(this._currentPath, x1, y1, x2, y2, radius);
  };
  beginPath() {
    this._currentPath.delete();
    this._currentPath = new CK.Path();
  };
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    bezierCurveTo(this._currentPath, cp1x, cp1y, cp2x, cp2y, x, y);
  };
  clearRect(x: number, y: number, width: number, height: number) {
    this._paint.setStyle(CK.PaintStyle.Fill);
    this._paint.setBlendMode(CK.BlendMode.Clear);
    this._canvas.drawRect(CK.XYWHRect(x, y, width, height), this._paint);
    this._paint.setBlendMode(this._globalCompositeOperation);
  };
  clip(path: any, fillRule: string) {
    if (typeof path === 'string') {
      // shift the args if a Path2D is supplied
      fillRule = path;
      path = this._currentPath;
    } else if (path && path._getPath) {
      path = path._getPath();
    }
    if (!path) {
      path = this._currentPath;
    }

    var clip = path.copy();
    if (fillRule && fillRule.toLowerCase() === 'evenodd') {
      clip.setFillType(CK.FillType.EvenOdd);
    } else {
      clip.setFillType(CK.FillType.Winding);
    }
    this._canvas.clipPath(clip, CK.ClipOp.Intersect, true);
    clip.delete();
  };

  closePath() {
    closePath(this._currentPath);
  };


  createImageData() {
    // either takes in 1 or 2 arguments:
    //  - imagedata on which to copy *width* and *height* only
    //  - width, height
    if (arguments.length === 1) {
      var oldData = arguments[0];
      var byteLength = 4 * oldData.width * oldData.height;
      return new ImageData(new Uint8ClampedArray(byteLength),
        oldData.width, oldData.height);
    } else if (arguments.length === 2) {
      var width = arguments[0];
      var height = arguments[1];
      var byteLength = 4 * width * height;
      return new ImageData(new Uint8ClampedArray(byteLength),
        width, height);
    } else {
      throw 'createImageData expects 1 or 2 arguments, got ' + arguments.length;
    }
  };
  createLinearGradient(x1: number, y1: number, x2: number, y2: number) {
    if (!allAreFinite(arguments)) {
      return;
    }
    var lcg = new LinearCanvasGradient(x1, y1, x2, y2);
    this._toCleanUp.push(lcg);
    return lcg;
  };

  createPattern(image:HTMLImage, repetition:any) {
    var cp = new CanvasPattern(image, repetition);
    this._toCleanUp.push(cp);
    return cp;
  }

  createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2:number) {
    if (!allAreFinite(arguments)) {
      return;
    }
    var rcg = new RadialCanvasGradient(x1, y1, r1, x2, y2, r2);
    this._toCleanUp.push(rcg);
    return rcg;
  }

  drawImage(img:any) {
    // 3 potential sets of arguments
    // - image, dx, dy
    // - image, dx, dy, dWidth, dHeight
    // - image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    // use the fillPaint, which has the globalAlpha in it
    // which drawImageRect will use.
    if (img instanceof HTMLImage) {
      img = img.getSkImage();
    }
    var iPaint = this._fillPaint();
    if (arguments.length === 3 || arguments.length === 5) {
      var destRect = CK.XYWHRect(arguments[1], arguments[2],
        arguments[3] || img.width(), arguments[4] || img.height());
      var srcRect = CK.XYWHRect(0, 0, img.width(), img.height());
    } else if (arguments.length === 9) {
      var destRect = CK.XYWHRect(arguments[5], arguments[6],
        arguments[7], arguments[8]);
      var srcRect = CK.XYWHRect(arguments[1], arguments[2],
        arguments[3], arguments[4]);
    } else {
      throw 'invalid number of args for drawImage, need 3, 5, or 9; got ' + arguments.length;
    }
    this._canvas.drawImageRect(img, srcRect, destRect, iPaint, false);

    iPaint.dispose();
  };

  ellipse(x:number, y:number, radiusX:number, radiusY:number, rotation:number,
    startAngle:number, endAngle:number, ccw:boolean) {
    ellipse(this._currentPath, x, y, radiusX, radiusY, rotation,
      startAngle, endAngle, ccw);
  };

  // A helper to copy the current paint, ready for filling
  // This applies the global alpha.
  // Call dispose() after to clean up.
  _fillPaint() {
    var paint = this._paint.copy();
    paint.setStyle(CK.PaintStyle.Fill);
    if (isCKColor(this._fillStyle)) {
      var alphaColor = CK.multiplyByAlpha(this._fillStyle, this._globalAlpha);
      paint.setColor(alphaColor);
    } else {
      var shader = this._fillStyle._getShader(this._currentTransform);
      paint.setColor(CK.Color(0, 0, 0, this._globalAlpha));
      paint.setShader(shader);
    }

    paint.dispose=function(){
      // If there are some helper effects in the future, clean them up
      // here. In any case, we have .dispose() to make _fillPaint behave
      // like _strokePaint and _shadowPaint.
      this.delete();
    };
    return paint
  };

  fill(path:CanvasKit.Path|Path2D, fillRule:string) {
    if (typeof path === 'string') {
      // shift the args if a Path2D is supplied
      fillRule = path;
      path = this._currentPath;
    } else if (path && (path as Path2D)._getPath) {
      path = (path as Path2D)._getPath();
    }
    if (fillRule === 'evenodd') {
      this._currentPath.setFillType(CK.FillType.EvenOdd);
    } else if (fillRule === 'nonzero' || !fillRule) {
      this._currentPath.setFillType(CK.FillType.Winding);
    } else {
      throw 'invalid fill rule';
    }
    if (!path) {
      path = this._currentPath;
    }

    var fillPaint = this._fillPaint();

    var shadowPaint = this._shadowPaint(fillPaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawPath(path as CanvasKit.Path, shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }
    this._canvas.drawPath(path as CanvasKit.Path, fillPaint);
    fillPaint.dispose();
  };

  fillRect(x:number, y:number, width:number, height:number) {
    var fillPaint = this._fillPaint();

    var shadowPaint = this._shadowPaint(fillPaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawRect(CK.XYWHRect(x, y, width, height), shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }

    this._canvas.drawRect(CK.XYWHRect(x, y, width, height), fillPaint);
    fillPaint.dispose();
  };

  fillText(text:string, x:number, y:number, maxWidth:number) {
    // TODO do something with maxWidth, probably involving measure
    var fillPaint = this._fillPaint();
    var blob = CK.TextBlob.MakeFromText(text, this._font);

    var shadowPaint = this._shadowPaint(fillPaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawTextBlob(blob, x, y, shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }
    this._canvas.drawTextBlob(blob, x, y, fillPaint);
    blob.delete();
    fillPaint.dispose();
  };

  getImageData(x:number, y:number, w:number, h:number) {
    var pixels = this._canvas.readPixels(x, y, {
      'width': w,
      'height': h,
      'colorType': CK.ColorType.RGBA_8888,
      'alphaType': CK.AlphaType.Unpremul,
      'colorSpace': CK.ColorSpace.SRGB,
    });
    if (!pixels) {
      return null;
    }
    // This essentially re-wraps the pixels from a Uint8Array to
    // a Uint8ClampedArray (without making a copy of pixels).
    return new ImageData(new Uint8ClampedArray(pixels.buffer as any), w, h);
  };

  getLineDash() {
    return this._lineDashList.slice();
  };

  _mapToLocalCoordinates(pts:number[]) {
    var inverted = CK.Matrix.invert(this._currentTransform);
    CK.Matrix.mapPoints(inverted, pts);
    return pts;
  };

  isPointInPath(x:number, y:number, fillmode:string) {
    var args = arguments;
    if (args.length === 3) {
      var path = this._currentPath;
    } else if (args.length === 4) {
      var path = args[0] as CanvasKit.Path;
      x = args[1];
      y = args[2];
      fillmode = args[3];
    } else {
      throw 'invalid arg count, need 3 or 4, got ' + args.length;
    }
    if (!isFinite(x) || !isFinite(y)) {
      return false;
    }
    fillmode = fillmode || 'nonzero';
    if (!(fillmode === 'nonzero' || fillmode === 'evenodd')) {
      return false;
    }
    // x and y are in canvas coordinates (i.e. unaffected by CTM)
    var pts = this._mapToLocalCoordinates([x, y]);
    x = pts[0];
    y = pts[1];
    path.setFillType(fillmode === 'nonzero' ?
      CK.FillType.Winding :
      CK.FillType.EvenOdd);
    return path.contains(x, y);
  };

  isPointInStroke(x:number, y:number) {
    var args = arguments;
    if (args.length === 2) {
      var path = this._currentPath;
    } else if (args.length === 3) {
      var path = args[0] as CanvasKit.Path;
      x = args[1];
      y = args[2];
    } else {
      throw 'invalid arg count, need 2 or 3, got ' + args.length;
    }
    if (!isFinite(x) || !isFinite(y)) {
      return false;
    }
    var pts = this._mapToLocalCoordinates([x, y]);
    x = pts[0];
    y = pts[1];
    var temp = path.copy();
    // fillmode is always nonzero
    temp.setFillType(CK.FillType.Winding);
    temp.stroke({
      'width': this.lineWidth, 'miter_limit': this.miterLimit,
      'cap': this._paint.getStrokeCap(), 'join': this._paint.getStrokeJoin(),
      'precision': 0.3, // this is what Chrome uses to compute this
    });
    var retVal = temp.contains(x, y);
    temp.delete();
    return retVal;
  };

  lineTo(x:number, y:number) {
    lineTo(this._currentPath, x, y);
  };

  measureText(text:string) {
    const ids = this._font.getGlyphIDs(text);
    const widths = this._font.getGlyphWidths(ids);
    let totalWidth = 0;
    for (const w of widths) {
      totalWidth += w;
    }
    return {
      "width": totalWidth,
    };
  };

  moveTo(x:number, y:number) {
    moveTo(this._currentPath, x, y);
  };

  putImageData(imageData:ImageData, x:number, y:number, dirtyX:number, dirtyY:number, dirtyWidth:number, dirtyHeight:number) {
    if (!allAreFinite([x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight])) {
      return;
    }
    if (dirtyX === undefined) {
      // fast, simple path for basic call
      this._canvas.writePixels(imageData.data as any, imageData.width, imageData.height, x, y);
      return;
    }
    dirtyX = dirtyX || 0;
    dirtyY = dirtyY || 0;
    dirtyWidth = dirtyWidth || imageData.width;
    dirtyHeight = dirtyHeight || imageData.height;

    // as per https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-putimagedata
    if (dirtyWidth < 0) {
      dirtyX = dirtyX + dirtyWidth;
      dirtyWidth = Math.abs(dirtyWidth);
    }
    if (dirtyHeight < 0) {
      dirtyY = dirtyY + dirtyHeight;
      dirtyHeight = Math.abs(dirtyHeight);
    }
    if (dirtyX < 0) {
      dirtyWidth = dirtyWidth + dirtyX;
      dirtyX = 0;
    }
    if (dirtyY < 0) {
      dirtyHeight = dirtyHeight + dirtyY;
      dirtyY = 0;
    }
    if (dirtyWidth <= 0 || dirtyHeight <= 0) {
      return;
    }
    var img = CK.MakeImage({
      'width': imageData.width,
      'height': imageData.height,
      'alphaType': CK.AlphaType.Unpremul,
      'colorType': CK.ColorType.RGBA_8888,
      'colorSpace': CK.ColorSpace.SRGB
    }, imageData.data, 4 * imageData.width);
    var src = CK.XYWHRect(dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    var dst = CK.XYWHRect(x + dirtyX, y + dirtyY, dirtyWidth, dirtyHeight);
    var inverted = CK.Matrix.invert(this._currentTransform);
    this._canvas.save();
    // putImageData() operates in device space.
    this._canvas.concat(inverted);
    this._canvas.drawImageRect(img, src, dst, null, false);
    this._canvas.restore();
    img.delete();
  };

  quadraticCurveTo(cpx:number, cpy:number, x:number, y:number) {
    quadraticCurveTo(this._currentPath, cpx, cpy, x, y);
  };

  rect(x:number, y:number, width:number, height:number) {
    rect(this._currentPath, x, y, width, height);
  };

  resetTransform() {
    // Apply the current transform to the path and then reset
    // to the identity. Essentially "commit" the transform.
    this._currentPath.transform(this._currentTransform);
    var inverted = CK.Matrix.invert(this._currentTransform);
    this._canvas.concat(inverted);
    // This should be identity, modulo floating point drift.
    this._currentTransform = this._canvas.getTotalMatrix();
  };

  restore() {
    var newState = this._canvasStateStack.pop();
    if (!newState) {
      return;
    }
    // "commit" the current transform. We pop, then apply the inverse of the
    // popped state, which has the effect of applying just the delta of
    // transforms between old and new.
    var combined = CK.Matrix.multiply(
      this._currentTransform,
      CK.Matrix.invert(newState.ctm)
    );
    this._currentPath.transform(combined);
    this._paint.delete();
    this._paint = newState.paint;

    this._lineDashList = newState.ldl;
    this._strokeWidth = newState.sw;
    this._strokeStyle = newState.ss;
    this._fillStyle = newState.fs;
    this._shadowOffsetX = newState.sox;
    this._shadowOffsetY = newState.soy;
    this._shadowBlur = newState.sb;
    this._shadowColor = newState.shc;
    this._globalAlpha = newState.ga;
    this._globalCompositeOperation = newState.gco;
    this._lineDashOffset = newState.ldo;
    this._fontString = newState.fontstr;

    //TODO: textAlign, textBaseline

    // restores the clip and ctm
    this._canvas.restore();
    this._currentTransform = this._canvas.getTotalMatrix();
  };

  rotate(radians:number) {
    if (!isFinite(radians)) {
      return;
    }
    // retroactively apply the inverse of this transform to the previous
    // path so it cancels out when we apply the transform at draw time.
    var inverted = CK.Matrix.rotated(-radians);
    this._currentPath.transform(inverted);
    this._canvas.rotate(radiansToDegrees(radians), 0, 0);
    this._currentTransform = this._canvas.getTotalMatrix();
  };

  save() {
    if (this._fillStyle._copy) {
      var fs = this._fillStyle._copy();
      this._toCleanUp.push(fs);
    } else {
      var fs = this._fillStyle;
    }

    if (this._strokeStyle._copy) {
      var ss = this._strokeStyle._copy();
      this._toCleanUp.push(ss);
    } else {
      var ss = this._strokeStyle;
    }

    this._canvasStateStack.push({
      ctm: this._currentTransform.slice(),
      ldl: this._lineDashList.slice(),
      sw: this._strokeWidth,
      ss: ss,
      fs: fs,
      sox: this._shadowOffsetX,
      soy: this._shadowOffsetY,
      sb: this._shadowBlur,
      shc: this._shadowColor,
      ga: this._globalAlpha,
      ldo: this._lineDashOffset,
      gco: this._globalCompositeOperation,
      paint: this._paint.copy(),
      fontstr: this._fontString,
      //TODO: textAlign, textBaseline
    });
    // Saves the clip
    this._canvas.save();
  };

  scale(sx:number, sy:number) {
    if (!allAreFinite(arguments)) {
      return;
    }
    // retroactively apply the inverse of this transform to the previous
    // path so it cancels out when we apply the transform at draw time.
    var inverted = CK.Matrix.scaled(1 / sx, 1 / sy);
    this._currentPath.transform(inverted);
    this._canvas.scale(sx, sy);
    this._currentTransform = this._canvas.getTotalMatrix();
  };

  setLineDash(dashes:number[]) {
    for (var i = 0; i < dashes.length; i++) {
      if (!isFinite(dashes[i]) || dashes[i] < 0) {
      //  Debug('dash list must have positive, finite values');
        return;
      }
    }
    if (dashes.length % 2 === 1) {
      // as per the spec, concatenate 2 copies of dashes
      // to give it an even number of elements.
      Array.prototype.push.apply(dashes, dashes);
    }
    this._lineDashList = dashes;
  };

  setTransform(a:number, b:number, c:number, d:number, e:number, f:number) {
    if (!(allAreFinite(arguments))) {
      return;
    }
    this.resetTransform();
    this.transform(a, b, c, d, e, f);
  };

  // We need to apply the shadowOffsets on the device coordinates, so we undo
  // the CTM, apply the offsets, then re-apply the CTM.
  _applyShadowOffsetMatrix() {
    var inverted = CK.Matrix.invert(this._currentTransform);
    this._canvas.concat(inverted);
    this._canvas.concat(CK.Matrix.translated(this._shadowOffsetX, this._shadowOffsetY));
    this._canvas.concat(this._currentTransform);
  };

  // Returns the shadow paint for the current settings or null if there
  // should be no shadow. This ends up being a copy of the given
  // paint with a blur maskfilter and the correct color.
  _shadowPaint(basePaint:CanvasKit.Paint) {
    // multiply first to see if the alpha channel goes to 0 after multiplication.
    var alphaColor = CK.multiplyByAlpha(this._shadowColor, this._globalAlpha);
    // if alpha is zero, no shadows
    if (!CK.getColorComponents(alphaColor)[3]) {
      return null;
    }
    // one of these must also be non-zero (otherwise the shadow is
    // completely hidden.  And the spec says so).
    if (!(this._shadowBlur || this._shadowOffsetY || this._shadowOffsetX)) {
      return null;
    }
    var shadowPaint = basePaint.copy();
    shadowPaint.setColor(alphaColor);
    var blurEffect = CK.MaskFilter.MakeBlur(CK.BlurStyle.Normal,
      BlurRadiusToSigma(this._shadowBlur),
      false);
    shadowPaint.setMaskFilter(blurEffect);

    // hack up a "destructor" which also cleans up the blurEffect. Otherwise,
    // we leak the blurEffect (since smart pointers don't help us in JS land).
    shadowPaint.dispose=function(){
      blurEffect.delete();
      this.delete();
    };
    return shadowPaint;
  }

  // A helper to get a copy of the current paint, ready for stroking.
  // This applies the global alpha and the dashedness.
  // Call dispose() after to clean up.
  _strokePaint() {
    var paint = this._paint.copy();
    paint.setStyle(CK.PaintStyle.Stroke);
    if (isCKColor(this._strokeStyle)) {
      var alphaColor = CK.multiplyByAlpha(this._strokeStyle, this._globalAlpha);
      paint.setColor(alphaColor);
    } else {
      var shader = this._strokeStyle._getShader(this._currentTransform);
      paint.setColor(CK.Color(0, 0, 0, this._globalAlpha));
      paint.setShader(shader);
    }

    paint.setStrokeWidth(this._strokeWidth);

    if (this._lineDashList.length) {
      var dashedEffect = CK.PathEffect.MakeDash(this._lineDashList, this._lineDashOffset);
      paint.setPathEffect(dashedEffect);
    }

    paint.dispose=function() {
      dashedEffect && dashedEffect.delete();
      this.delete();
    };
    return paint;
  }
  stroke(newpath?:Path2D) {
    let path = newpath ? newpath._getPath() : this._currentPath;
    var strokePaint = this._strokePaint();

    var shadowPaint = this._shadowPaint(strokePaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawPath(path, shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }

    this._canvas.drawPath(path, strokePaint);
    strokePaint.dispose();
  }
  strokeRect(x:number, y:number, width:number, height:number) {
    var strokePaint = this._strokePaint();

    var shadowPaint = this._shadowPaint(strokePaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawRect(CK.XYWHRect(x, y, width, height), shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }
    this._canvas.drawRect(CK.XYWHRect(x, y, width, height), strokePaint);
    strokePaint.dispose();
  };

  strokeText(text:string, x:number, y:number, maxWidth:number) {
    // TODO do something with maxWidth, probably involving measure
    var strokePaint = this._strokePaint();
    var blob = CK.TextBlob.MakeFromText(text, this._font);

    var shadowPaint = this._shadowPaint(strokePaint);
    if (shadowPaint) {
      this._canvas.save();
      this._applyShadowOffsetMatrix();
      this._canvas.drawTextBlob(blob, x, y, shadowPaint);
      this._canvas.restore();
      shadowPaint.dispose();
    }
    this._canvas.drawTextBlob(blob, x, y, strokePaint);
    blob.delete();
    strokePaint.dispose();
  };
  translate(dx:number, dy:number) {
    if (!allAreFinite(arguments)) {
      return;
    }
    // retroactively apply the inverse of this transform to the previous
    // path so it cancels out when we apply the transform at draw time.
    var inverted = CK.Matrix.translated(-dx, -dy);
    this._currentPath.transform(inverted);
    this._canvas.translate(dx, dy);
    this._currentTransform = this._canvas.getTotalMatrix();
  };

  transform(a:number, b:number, c:number, d:number, e:number, f:number) {
    var newTransform = [a, c, e,
      b, d, f,
      0, 0, 1];
    // retroactively apply the inverse of this transform to the previous
    // path so it cancels out when we apply the transform at draw time.
    var inverted = CK.Matrix.invert(newTransform);
    this._currentPath.transform(inverted);
    this._canvas.concat(newTransform);
    this._currentTransform = this._canvas.getTotalMatrix();
  }
  // Not supported operations (e.g. for Web only)
  addHitRegion() { };
  clearHitRegions() { };
  drawFocusIfNeeded() { };
  removeHitRegion() { };
  scrollPathIntoView() { };

}






function BlurRadiusToSigma(radius: number) {
  // Blink (Chrome) does the following, for legacy reasons, even though it
  // is against the spec. https://bugs.chromium.org/p/chromium/issues/detail?id=179006
  // This may change in future releases.
  // This code is staying here in case any clients are interested in using it
  // to match Blink "exactly".
  // if (radius <= 0)
  //   return 0;
  // return 0.288675 * radius + 0.5;
  //
  // This is what the spec says, which is how Firefox and others operate.
  return radius / 2;
}
