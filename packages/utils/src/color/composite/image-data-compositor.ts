// image-data-compositor.ts
import { CompositeCore } from './composite-core';
import { CompositeOperation, RGBAColor } from './composite-types';

export class ImageDataCompositor extends CompositeCore {
  applyToImageData(
    sourceData: ImageData,
    destData: ImageData,
    operation: CompositeOperation,
    dx: number = 0,
    dy: number = 0
  ): ImageData {
    const result = new ImageData(destData.width, destData.height);
    const resultData = result.data;
    const sourceDataArray = sourceData.data;
    const destDataArray = destData.data;

    for (let y = 0; y < destData.height; y++) {
      for (let x = 0; x < destData.width; x++) {
        const destIdx = (y * destData.width + x) * 4;
        
        // 获取目标像素
        const destination: RGBAColor = {
          r: destDataArray[destIdx] / 255,
          g: destDataArray[destIdx + 1] / 255,
          b: destDataArray[destIdx + 2] / 255,
          a: destDataArray[destIdx + 3] / 255
        };

        let source: RGBAColor = { r: 0, g: 0, b: 0, a: 0 };
        
        // 检查源图像中的对应位置
        const sourceX = x - dx;
        const sourceY = y - dy;
        
        if (sourceX >= 0 && sourceX < sourceData.width && 
            sourceY >= 0 && sourceY < sourceData.height) {
          const sourceIdx = (sourceY * sourceData.width + sourceX) * 4;
          source = {
            r: sourceDataArray[sourceIdx] / 255,
            g: sourceDataArray[sourceIdx + 1] / 255,
            b: sourceDataArray[sourceIdx + 2] / 255,
            a: sourceDataArray[sourceIdx + 3] / 255
          };
        }

        // 应用合成操作
        const resultColor = this.applyComposite(source, destination, operation);

        // 设置结果像素
        resultData[destIdx] = Math.round(resultColor.r * 255);
        resultData[destIdx + 1] = Math.round(resultColor.g * 255);
        resultData[destIdx + 2] = Math.round(resultColor.b * 255);
        resultData[destIdx + 3] = Math.round(resultColor.a * 255);
      }
    }

    return result;
  }
}