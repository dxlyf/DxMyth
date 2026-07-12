
import {ck,type CanvasKit} from './lib'
import {normalizeAngles,degToRad,radToDeg} from '@dxyl/math2'
function almostEqual(floata: number, floatb: number) {
    return Math.abs(floata - floatb) < 1e-6;
}
function allAreFinite(args: any) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined && !Number.isFinite(args[i])) {
            return false;
        }
    }
    return true;
}
function _ellipseHelper(skpath: CanvasKit.PathBuilder, x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number) {
    const sweepDegrees = radToDeg(endAngle - startAngle);
    const startDegrees = radToDeg(startAngle);

    const oval = ck.LTRBRect(x - radiusX, y - radiusY, x + radiusX, y + radiusY);

    // draw in 2 180 degree segments because trying to draw all 360 degrees at once
    // draws nothing.
    if (almostEqual(Math.abs(sweepDegrees), 360)) {
        const halfSweep = sweepDegrees / 2;
        skpath.arcToOval(oval, startDegrees, halfSweep, false);
        skpath.arcToOval(oval, startDegrees + halfSweep, halfSweep, false);
        return;
    }
    skpath.arcToOval(oval, startDegrees, sweepDegrees, false);
}

export function ellipse(skpath: CanvasKit.PathBuilder, x: number, y: number, radiusX: number, radiusY: number, rotation: number,
    startAngle: number, endAngle: number, ccw: boolean) {
    if (!allAreFinite([x, y, radiusX, radiusY, rotation, startAngle, endAngle])) {
        return;
    }
    if (radiusX < 0 || radiusY < 0) {
        throw 'radii cannot be negative';
    }

    // based off of CanonicalizeAngle in Chrome
    const {startAngle:newStartAngle,endAngle:newEndAngle} = normalizeAngles(startAngle, endAngle);

    // Based off of Chrome's implementation in
    // https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/graphics/path.cc
    // of note, can't use addArc or addOval because they close the arc, which
    // the spec says not to do (unless the user explicitly calls closePath).
    // This throws off points being in/out of the arc.
    if (!rotation) {
        _ellipseHelper(skpath, x, y, radiusX, radiusY, newStartAngle, newEndAngle);
        return;
    }
    const rotated = ck.Matrix.rotated(rotation, x, y);
    const rotatedInvert = ck.Matrix.rotated(-rotation, x, y);
    skpath.transform(rotatedInvert);
    _ellipseHelper(skpath, x, y, radiusX, radiusY, newStartAngle, newEndAngle);
    skpath.transform(rotated);
}