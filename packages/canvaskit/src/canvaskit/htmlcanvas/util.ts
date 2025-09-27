
// General purpose utility functions go in this file.


function allAreFinite(args:any) {
  for (var i = 0; i < args.length; i++) {
    if (args[i] !== undefined && !Number.isFinite(args[i])) {
      return false;
    }
  }
  return true;
}
//
// This file houses miscellaneous helper functions and constants.
//

var nullptr = 0; // emscripten doesn't like to take null as uintptr_t


function radiansToDegrees(rad:number) {
  return (rad / Math.PI) * 180;
}

function degreesToRadians(deg:number) {
  return (deg / 180) * Math.PI;
}

function almostEqual(floata:number, floatb:number) {
  return Math.abs(floata - floatb) < 0.00001;
}

function toBase64String(bytes:number[]) {
  if (typeof Buffer !== 'undefined') { // Are we on node?
    return Buffer.from(bytes).toString('base64');
  } else {
    // From https://stackoverflow.com/a/25644409
    // because the naive solution of
    //     btoa(String.fromCharCode.apply(null, bytes));
    // would occasionally throw "Maximum call stack size exceeded"
    var CHUNK_SIZE = 0x8000; //arbitrary number
    var index = 0;
    var length = bytes.length;
    var result = '';
    var slice;
    while (index < length) {
      slice = bytes.slice(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  }
}
function isCKColor(ob:any) {
  if (!ob) {
    return false;
  }
  return (ob.constructor === Float32Array && ob.length === 4);
}
export {
  isCKColor,
  nullptr,
  radiansToDegrees,
  degreesToRadians,
  almostEqual,
  toBase64String,
  allAreFinite
}