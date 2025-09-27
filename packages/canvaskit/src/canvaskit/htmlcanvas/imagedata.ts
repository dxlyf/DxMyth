export class ImageData {
  width:number
  height:number
  data:Uint8Array
  constructor(arr:ArrayLike<any>, width:number, height:number){
    if (!width || height === 0) {
      throw new TypeError('invalid dimensions, width and height must be non-zero');
    }
    if (arr.length % 4) {
      throw new TypeError('arr must be a multiple of 4');
    }
    height = height || arr.length/(4*width);
  
    Object.defineProperty(this, 'data', {
      value: arr,
      writable: false
    });
    Object.defineProperty(this, 'height', {
      value: height,
      writable: false
    });
    Object.defineProperty(this, 'width', {
      value: width,
      writable: false
    });
  }
  
}
