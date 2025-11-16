import { CK } from '../index'
import type {CanvasKit} from '../index'
import { allAreFinite, almostEqual, radiansToDegrees } from './util'
// CanvasPath methods, which all take an Path object as the first param

function arc(skpath: CanvasKit.Path, x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean) {
  // As per  https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-arc
  // arc is essentially a simpler version of ellipse.
  ellipse(skpath, x, y, radius, radius, 0, startAngle, endAngle, ccw);
}

function arcTo(skpath: CanvasKit.Path, x1: number, y1: number, x2: number, y2: number, radius: number) {
  if (!allAreFinite([x1, y1, x2, y2, radius])) {
    return;
  }
  if (radius < 0) {
    throw 'radii cannot be negative';
  }
  if (skpath.isEmpty()) {
    skpath.moveTo(x1, y1);
  }
  skpath.arcToTangent(x1, y1, x2, y2, radius);
}

function bezierCurveTo(skpath: CanvasKit.Path, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
  if (!allAreFinite([cp1x, cp1y, cp2x, cp2y, x, y])) {
    return;
  }
  if (skpath.isEmpty()) {
    skpath.moveTo(cp1x, cp1y);
  }
  skpath.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y);
}

function closePath(skpath: CanvasKit.Path) {
  if (skpath.isEmpty()) {
    return;
  }
  // Check to see if we are not just a single point
  var bounds = skpath.getBounds();
  if ((bounds[3] - bounds[1]) || (bounds[2] - bounds[0])) {
    skpath.close();
  }
}

function _ellipseHelper(skpath: CanvasKit.Path, x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number) {
  var sweepDegrees = radiansToDegrees(endAngle - startAngle);
  var startDegrees = radiansToDegrees(startAngle);

  var oval = CK.LTRBRect(x - radiusX, y - radiusY, x + radiusX, y + radiusY);

  // draw in 2 180 degree segments because trying to draw all 360 degrees at once
  // draws nothing.
  if (almostEqual(Math.abs(sweepDegrees), 360)) {
    var halfSweep = sweepDegrees / 2;
    skpath.arcToOval(oval, startDegrees, halfSweep, false);
    skpath.arcToOval(oval, startDegrees + halfSweep, halfSweep, false);
    return;
  }
  skpath.arcToOval(oval, startDegrees, sweepDegrees, false);
}

function ellipse(skpath: CanvasKit.Path, x: number, y: number, radiusX: number, radiusY: number, rotation: number,
  startAngle: number, endAngle: number, ccw: boolean) {
  if (!allAreFinite([x, y, radiusX, radiusY, rotation, startAngle, endAngle])) {
    return;
  }
  if (radiusX < 0 || radiusY < 0) {
    throw 'radii cannot be negative';
  }

  // based off of CanonicalizeAngle in Chrome
  var tao = 2 * Math.PI;
  var newStartAngle = startAngle % tao;
  if (newStartAngle < 0) {
    newStartAngle += tao;
  }
  var delta = newStartAngle - startAngle;
  startAngle = newStartAngle;
  endAngle += delta;

  // Based off of AdjustEndAngle in Chrome.
  if (!ccw && (endAngle - startAngle) >= tao) {
    // Draw complete ellipse
    endAngle = startAngle + tao;
  } else if (ccw && (startAngle - endAngle) >= tao) {
    // Draw complete ellipse
    endAngle = startAngle - tao;
  } else if (!ccw && startAngle > endAngle) {
    endAngle = startAngle + (tao - (startAngle - endAngle) % tao);
  } else if (ccw && startAngle < endAngle) {
    endAngle = startAngle - (tao - (endAngle - startAngle) % tao);
  }

  // Based off of Chrome's implementation in
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/graphics/path.cc
  // of note, can't use addArc or addOval because they close the arc, which
  // the spec says not to do (unless the user explicitly calls closePath).
  // This throws off points being in/out of the arc.
  if (!rotation) {
    _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle);
    return;
  }
  var rotated = CK.Matrix.rotated(rotation, x, y);
  var rotatedInvert = CK.Matrix.rotated(-rotation, x, y);
  skpath.transform(rotatedInvert);
  _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle);
  skpath.transform(rotated);
}

function lineTo(skpath: CanvasKit.Path, x: number, y: number) {
  if (!allAreFinite([x, y])) {
    return;
  }
  // A lineTo without a previous point has a moveTo inserted before it
  if (skpath.isEmpty()) {
    skpath.moveTo(x, y);
  }
  skpath.lineTo(x, y);
}

function moveTo(skpath: CanvasKit.Path, x: number, y: number) {
  if (!allAreFinite([x, y])) {
    return;
  }
  skpath.moveTo(x, y);
}

function quadraticCurveTo(skpath: CanvasKit.Path, cpx: number, cpy: number, x: number, y: number) {
  if (!allAreFinite([cpx, cpy, x, y])) {
    return;
  }
  if (skpath.isEmpty()) {
    skpath.moveTo(cpx, cpy);
  }
  skpath.quadTo(cpx, cpy, x, y);
}

function rect(skpath: CanvasKit.Path, x: number, y: number, width: number, height: number) {
  var rect = CK.XYWHRect(x, y, width, height);
  if (!allAreFinite(rect)) {
    return;
  }
  // https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-rect
  skpath.addRect(rect);
}
function roundRect(skpath: CanvasKit.Path, x: number, y: number, width: number, height: number,radius:number|[number,number]) {
  var rect = CK.XYWHRect(x, y, width, height);
  if (!allAreFinite(rect)) {
    return;
  }
  const radiusArr=Array.isArray(radius)?radius:[radius??0,radius??0]
  const rx=radiusArr[0],ry=radiusArr[1]
  // https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-rect
  skpath.addRRect(CK.RRectXY(rect, rx, ry));
}
class Path2D {
  _path: CanvasKit.Path;
  constructor(path?: string | CanvasKit.Path | Path2D) {
    if (typeof path === 'string') {
      this._path = CK.Path.MakeFromSVGString(path);
    } else if (path && (path as Path2D)._getPath) {
      this._path = (path as Path2D)._getPath().copy();
    } else {
      this._path = new CK.Path();
    }
  }
  _getPath() {
    return this._path;
  }
  addPath(path2d:Path2D, transform?:any) {
    if (!transform) {
      transform = {
        'a': 1, 'c': 0, 'e': 0,
        'b': 0, 'd': 1, 'f': 0,
      };
    }
    this._path.addPath(path2d._getPath(), [transform.a, transform.c, transform.e,
    transform.b, transform.d, transform.f]);
  }
  arc (x:number, y:number, radius:number, startAngle:number,endAngle:number, ccw:boolean) {
    arc(this._path, x, y, radius, startAngle, endAngle, ccw);
  }

  arcTo(x1:number, y1:number, x2:number, y2:number, radius:number) {
    arcTo(this._path, x1, y1, x2, y2, radius);
  }

  bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) {
    bezierCurveTo(this._path, cp1x, cp1y, cp2x, cp2y, x, y);
  }
  conicTo(x:number, y:number, x1:number, y1:number, weight:number){
    this._path.conicTo(x, y, x1, y1, weight)
  }
  closePath() {
    closePath(this._path);
  }

  ellipse(x:number, y:number, radiusX:number, radiusY:number, rotation:number,
    startAngle:number, endAngle:number, ccw:boolean) {
    ellipse(this._path, x, y, radiusX, radiusY, rotation,
      startAngle, endAngle, ccw);
  }

  lineTo(x:number, y:number) {
    lineTo(this._path, x, y);
  }

  moveTo(x:number, y:number) {
    moveTo(this._path, x, y);
  }

  quadraticCurveTo(cpx:number, cpy:number, x:number, y:number) {
    quadraticCurveTo(this._path, cpx, cpy, x, y);
  }

  rect(x:number, y:number, width:number, height:number) {
    rect(this._path, x, y, width, height);
  }
  roundRect(x:number, y:number, width:number, height:number, radius:number|[number,number]) {
    roundRect(this._path, x, y, width, height, radius);
  }
  getBounds(){
    return this._path.getBounds()
  }
  computeTightBounds(){
    return this._path.computeTightBounds()
  }
  contains(x:number, y:number){
    return this._path.contains(x, y)
  }
  simplify(){
    return  this._path.simplify()
  }
  stroke(opts?:CanvasKit.StrokeOpts){
    return this._path.stroke(opts)
  }
  setFillType(fillType:CanvasKit.FillType){
    this._path.setFillType(fillType)
  }
  clone(){
    return new Path2D(this)
  }
}


export {
  Path2D,
  arc,
  arcTo,
  bezierCurveTo,
  closePath,
  ellipse,
  lineTo,
  moveTo,
  quadraticCurveTo,
  rect,
  roundRect
}