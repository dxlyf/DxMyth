
### 1. **核心数学原理**

```typescript
// 蒙版本质是像素级的布尔运算
interface Pixel {
  r: number; // 红色通道 0-255
  g: number; // 绿色通道 0-255  
  b: number; // 蓝色通道 0-255
  a: number; // 透明度 0-1
}

// 蒙版运算的基本公式
class MaskOperations {
  // Alpha 合成公式
  static composite(source: Pixel, dest: Pixel): Pixel {
    const alpha = source.a + dest.a * (1 - source.a);
    const r = (source.r * source.a + dest.r * dest.a * (1 - source.a)) / alpha;
    const g = (source.g * source.a + dest.g * dest.a * (1 - source.a)) / alpha;
    const b = (source.b * source.a + dest.b * dest.a * (1 - source.a)) / alpha;
    
    return { r, g, b, a: alpha };
  }

  // 蒙版裁剪：只在蒙版不透明区域显示内容
  static applyMask(content: Pixel, mask: Pixel): Pixel {
    return {
      r: content.r,
      g: content.g, 
      b: content.b,
      a: content.a * mask.a // 关键：内容透明度 × 蒙版透明度
    };
  }
}
```

### 2. **CanvasKit 底层实现**

```typescript
// 模拟 CanvasKit 的蒙版实现
class CanvasKitMaskEngine {
  private canvas: any;
  private pixelBuffer: Uint8ClampedArray;
  private width: number;
  private height: number;

  constructor(canvas: any, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.pixelBuffer = new Uint8ClampedArray(width * height * 4);
  }

  /**
   * 实现 destination-in 蒙版效果
   * 原理：最终颜色 = 目标颜色 × 源透明度
   */
  applyDestinationInMask(contentImage: ImageData, maskImage: ImageData): ImageData {
    const result = new ImageData(this.width, this.height);
    
    for (let i = 0; i < contentImage.data.length; i += 4) {
      const contentAlpha = contentImage.data[i + 3] / 255;
      const maskAlpha = maskImage.data[i + 3] / 255;
      
      // destination-in 公式
      result.data[i] = contentImage.data[i];     // R
      result.data[i + 1] = contentImage.data[i + 1]; // G
      result.data[i + 2] = contentImage.data[i + 2]; // B
      result.data[i + 3] = contentImage.data[i + 3] * maskAlpha; // A × mask Alpha
    }
    
    return result;
  }

  /**
   * 实现 source-in 蒙版效果  
   * 原理：最终颜色 = 源颜色 × 目标透明度
   */
  applySourceInMask(contentImage: ImageData, maskImage: ImageData): ImageData {
    const result = new ImageData(this.width, this.height);
    
    for (let i = 0; i < contentImage.data.length; i += 4) {
      const contentAlpha = contentImage.data[i + 3] / 255;
      const maskAlpha = maskImage.data[i + 3] / 255;
      
      result.data[i] = maskImage.data[i] * contentAlpha;     // R
      result.data[i + 1] = maskImage.data[i + 1] * contentAlpha; // G
      result.data[i + 2] = maskImage.data[i + 2] * contentAlpha; // B
      result.data[i + 3] = maskImage.data[i + 3] * contentAlpha; // A × content Alpha
    }
    
    return result;
  }
}
```

## 🛠️ 完整蒙版系统实现

### 1. **基础蒙版类**

```typescript
interface MaskLayer {
  id: string;
  type: 'alpha' | 'luminance' | 'vector' | 'gradient';
  path?: any; // CanvasKit.Path
  imageData?: ImageData;
  opacity: number;
  invert: boolean;
}

class FigmaStyleMask {
  private canvasKit: any;
  private masks: Map<string, MaskLayer> = new Map();
  
  constructor(canvasKit: any) {
    this.canvasKit = canvasKit;
  }

  /**
   * 创建路径蒙版
   */
  createPathMask(id: string, pathData: string, invert: boolean = false): string {
    const path = this.canvasKit.Path.MakeFromSVGString(pathData);
    if (!path) throw new Error('Invalid SVG path data');
    
    const mask: MaskLayer = {
      id,
      type: 'vector',
      path,
      opacity: 1,
      invert
    };
    
    this.masks.set(id, mask);
    return id;
  }

  /**
   * 创建透明度蒙版
   */
  createAlphaMask(id: string, imageData: ImageData, invert: boolean = false): string {
    const mask: MaskLayer = {
      id,
      type: 'alpha',
      imageData,
      opacity: 1,
      invert
    };
    
    this.masks.set(id, mask);
    return id;
  }

  /**
   * 应用蒙版到内容
   */
  applyMask(canvas: any, content: any, maskId: string, options: {
    position?: { x: number; y: number };
    scale?: number;
    rotation?: number;
  } = {}): void {
    const mask = this.masks.get(maskId);
    if (!mask) throw new Error(`Mask ${maskId} not found`);

    // 保存画布状态
    canvas.save();
    
    // 应用变换
    if (options.position) {
      canvas.translate(options.position.x, options.position.y);
    }
    if (options.scale) {
      canvas.scale(options.scale, options.scale);
    }
    if (options.rotation) {
      canvas.rotate(options.rotation * Math.PI / 180);
    }

    // 根据蒙版类型应用不同的蒙版策略
    switch (mask.type) {
      case 'vector':
        this.applyVectorMask(canvas, content, mask);
        break;
      case 'alpha':
        this.applyAlphaMask(canvas, content, mask);
        break;
      case 'luminance':
        this.applyLuminanceMask(canvas, content, mask);
        break;
      case 'gradient':
        this.applyGradientMask(canvas, content, mask);
        break;
    }

    // 恢复画布状态
    canvas.restore();
  }

  /**
   * 矢量路径蒙版实现
   */
  private applyVectorMask(canvas: any, content: any, mask: MaskLayer): void {
    const paint = new this.canvasKit.Paint();
    
    if (mask.invert) {
      // 反向蒙版：使用 destination-out
      paint.setBlendMode(this.canvasKit.BlendMode.DstOut);
    } else {
      // 正常蒙版：使用 destination-in
      paint.setBlendMode(this.canvasKit.BlendMode.DstIn);
    }
    
    // 先绘制内容
    this.drawContent(canvas, content);
    
    // 再绘制蒙版路径
    canvas.drawPath(mask.path!, paint);
    
    paint.delete();
  }

  /**
   * 透明度蒙版实现
   */
  private applyAlphaMask(canvas: any, content: any, mask: MaskLayer): void {
    // 创建临时画布进行像素级操作
    const tempSurface = this.canvasKit.MakeSurface(this.width, this.height);
    const tempCanvas = tempSurface.getCanvas();
    
    // 绘制内容到临时画布
    this.drawContent(tempCanvas, content);
    
    // 应用透明度蒙版
    const imageData = this.applyAlphaMaskToImageData(
      this.getImageData(tempSurface),
      mask.imageData!,
      mask.invert
    );
    
    // 将结果绘制回主画布
    this.putImageData(canvas, imageData);
    
    tempSurface.delete();
  }

  /**
   * 亮度蒙版实现
   */
  private applyLuminanceMask(canvas: any, content: any, mask: MaskLayer): void {
    const luminanceData = this.convertToLuminance(mask.imageData!);
    const alphaMask = this.luminanceToAlpha(luminanceData, mask.invert);
    
    this.applyAlphaMask(canvas, content, {
      ...mask,
      imageData: alphaMask
    });
  }

  /**
   * 渐变蒙版实现
   */
  private applyGradientMask(canvas: any, content: any, mask: MaskLayer): void {
    const gradient = this.createGradient(mask.gradientConfig!);
    const gradientMask = this.renderGradientToImageData(gradient);
    
    this.applyAlphaMask(canvas, content, {
      ...mask,
      imageData: gradientMask
    });
  }
}
```

### 2. **高级蒙版效果**

```typescript
class AdvancedMaskEffects {
  private canvasKit: any;

  constructor(canvasKit: any) {
    this.canvasKit = canvasKit;
  }

  /**
   * 羽化蒙版（边缘模糊）
   */
  createFeatheredMask(baseMask: MaskLayer, featherRadius: number): MaskLayer {
    const blurredMask = this.applyGaussianBlur(baseMask.imageData!, featherRadius);
    
    return {
      ...baseMask,
      imageData: blurredMask,
      type: 'alpha'
    };
  }

  /**
   * 多重蒙版组合
   */
  combineMasks(operation: 'add' | 'subtract' | 'intersect' | 'exclude', masks: MaskLayer[]): MaskLayer {
    let resultImageData: ImageData;
    
    switch (operation) {
      case 'add':
        resultImageData = this.combineMasksAdd(masks);
        break;
      case 'subtract':
        resultImageData = this.combineMasksSubtract(masks);
        break;
      case 'intersect':
        resultImageData = this.combineMasksIntersect(masks);
        break;
      case 'exclude':
        resultImageData = this.combineMasksExclude(masks);
        break;
    }
    
    return {
      id: `combined_${Date.now()}`,
      type: 'alpha',
      imageData: resultImageData,
      opacity: 1,
      invert: false
    };
  }

  /**
   * 动态蒙版（动画效果）
   */
  createAnimatedMask(
    baseMask: MaskLayer, 
    animation: {
      type: 'wave' | 'pulse' | 'morph';
      speed: number;
      intensity: number;
    }
  ): (time: number) => MaskLayer {
    
    return (time: number) => {
      const animatedImageData = this.animateMask(
        baseMask.imageData!,
        animation,
        time
      );
      
      return {
        ...baseMask,
        imageData: animatedImageData
      };
    };
  }

  private combineMasksAdd(masks: MaskLayer[]): ImageData {
    const result = new ImageData(masks[0].imageData!.width, masks[0].imageData!.height);
    
    for (let i = 0; i < result.data.length; i += 4) {
      let maxAlpha = 0;
      
      for (const mask of masks) {
        const alpha = mask.imageData!.data[i + 3];
        maxAlpha = Math.max(maxAlpha, alpha);
      }
      
      result.data[i + 3] = maxAlpha;
    }
    
    return result;
  }

  private combineMasksIntersect(masks: MaskLayer[]): ImageData {
    const result = new ImageData(masks[0].imageData!.width, masks[0].imageData!.height);
    
    for (let i = 0; i < result.data.length; i += 4) {
      let minAlpha = 255;
      
      for (const mask of masks) {
        const alpha = mask.imageData!.data[i + 3];
        minAlpha = Math.min(minAlpha, alpha);
      }
      
      result.data[i + 3] = minAlpha;
    }
    
    return result;
  }
}
```

### 3. **性能优化版本**

```typescript
class OptimizedMaskRenderer {
  private canvasKit: any;
  private gpuEnabled: boolean;
  private maskCache: Map<string, ImageData> = new Map();

  constructor(canvasKit: any, useGPU: boolean = true) {
    this.canvasKit = canvasKit;
    this.gpuEnabled = useGPU && this.checkGPUSupport();
  }

  /**
   * 使用 WebGL 加速蒙版渲染
   */
  async applyMaskWebGL(
    contentTexture: WebGLTexture,
    maskTexture: WebGLTexture,
    maskType: string
  ): Promise<WebGLTexture> {
    
    if (!this.gpuEnabled) {
      return this.applyMaskCPU(contentTexture, maskTexture, maskType);
    }

    const shaderSource = this.getMaskShaderSource(maskType);
    const program = this.compileShaderProgram(shaderSource);
    
    return this.renderWithShader(program, contentTexture, maskTexture);
  }

  /**
   * 蒙版缓存系统
   */
  getCachedMask(maskId: string, generator: () => ImageData): ImageData {
    if (this.maskCache.has(maskId)) {
      return this.maskCache.get(maskId)!;
    }
    
    const maskData = generator();
    this.maskCache.set(maskId, maskData);
    
    // 限制缓存大小
    if (this.maskCache.size > 100) {
      const firstKey = this.maskCache.keys().next().value;
      this.maskCache.delete(firstKey);
    }
    
    return maskData;
  }

  /**
   * 分块渲染大型蒙版
   */
  renderLargeMaskTiled(
    canvas: any,
    content: any,
    mask: MaskLayer,
    tileSize: number = 512
  ): void {
    
    const width = mask.imageData!.width;
    const height = mask.imageData!.height;
    
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const tileWidth = Math.min(tileSize, width - x);
        const tileHeight = Math.min(tileSize, height - y);
        
        const tileMask = this.extractImageDataTile(
          mask.imageData!,
          x, y, tileWidth, tileHeight
        );
        
        canvas.save();
        canvas.translate(x, y);
        this.applyAlphaMask(canvas, content, { ...mask, imageData: tileMask });
        canvas.restore();
      }
    }
  }

  private getMaskShaderSource(maskType: string): string {
    switch (maskType) {
      case 'destination-in':
        return `
          precision mediump float;
          varying vec2 vTextureCoord;
          uniform sampler2D uContent;
          uniform sampler2D uMask;
          
          void main() {
            vec4 content = texture2D(uContent, vTextureCoord);
            vec4 mask = texture2D(uMask, vTextureCoord);
            gl_FragColor = vec4(content.rgb, content.a * mask.a);
          }
        `;
      
      case 'luminance':
        return `
          precision mediump float;
          varying vec2 vTextureCoord;
          uniform sampler2D uContent;
          uniform sampler2D uMask;
          
          void main() {
            vec4 content = texture2D(uContent, vTextureCoord);
            vec4 mask = texture2D(uMask, vTextureCoord);
            float luminance = dot(mask.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = vec4(content.rgb, content.a * luminance);
          }
        `;
      
      default:
        throw new Error(`Unknown mask type: ${maskType}`);
    }
  }
}
```

## 🧪 使用示例

```typescript
// 完整的使用示例
async function demonstrateFigmaMasks() {
  const CanvasKit = await CanvasKitInit({ locateFile: (file) => `path/to/${file}` });
  const surface = CanvasKit.MakeCanvasSurface('canvas');
  const canvas = surface.getCanvas();
  
  const maskSystem = new FigmaStyleMask(CanvasKit);
  const advancedEffects = new AdvancedMaskEffects(CanvasKit);
  const optimizedRenderer = new OptimizedMaskRenderer(CanvasKit);

  // 1. 创建矢量路径蒙版
  const starMask = maskSystem.createPathMask(
    'star-mask',
    'M50,5 L61.18,38.09 L95,38.09 L68.09,59.18 L79.18,92.27 L50,72.09 L20.82,92.27 L31.91,59.18 L5,38.09 L38.82,38.09 Z'
  );

  // 2. 创建渐变蒙版
  const gradientMask = advancedEffects.createGradientMask({
    type: 'linear',
    start: { x: 0, y: 0 },
    end: { x: 200, y: 200 },
    stops: [
      { offset: 0, color: 'rgba(0,0,0,0)' },
      { offset: 1, color: 'rgba(0,0,0,1)' }
    ]
  });

  // 3. 应用蒙版
  const content = await loadImage('background.jpg');
  maskSystem.applyMask(canvas, content, starMask, {
    position: { x: 100, y: 100 },
    scale: 1.5
  });

  // 4. 应用渐变蒙版
  maskSystem.applyMask(canvas, content, gradientMask.id, {
    position: { x: 300, y: 100 }
  });

  surface.flush();
}
```

## 💡 核心原理总结

**蒙版底层实现基于：**

1. **像素合成算法** - 使用 Porter-Duff 合成运算符
2. **混合模式** - 利用 Canvas 的 globalCompositeOperation
3. **路径裁剪** - 使用 clipPath 限制绘制区域
4. **Alpha 通道操作** - 通过透明度控制显示区域

**关键公式：**
- `destination-in`: `result = dest × source.alpha`
- `source-in`: `result = source × dest.alpha` 
- `luminance-mask`: `alpha = 0.299×R + 0.587×G + 0.114×B`

这种实现方式提供了类似 Figma 的强大蒙版功能，支持复杂的矢量路径、透明度、渐变和动态效果。


这是一个很好的问题！SVG 中蒙版的黑色隐藏、白色显示行为是由 **SVG 蒙版的亮度到 alpha 的转换规则**决定的。

## 🎯 核心原理

### 1. **亮度到 Alpha 的转换公式**

```typescript
// SVG 蒙版的底层转换规则
interface SVGMaskConversion {
  // 关键公式：蒙版像素的亮度 → 内容的不透明度
  luminanceToAlpha(r: number, g: number, b: number): number {
    // 标准亮度计算公式 (ITU-R BT.709)
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance; // 亮度值直接作为 Alpha 值
  }
}

// 具体转换示例
const maskExamples = {
  pureWhite: { r: 1.0, g: 1.0, b: 1.0 }, // 亮度 = 1.0 → Alpha = 1.0 (完全显示)
  pureBlack: { r: 0.0, g: 0.0, b: 0.0 }, // 亮度 = 0.0 → Alpha = 0.0 (完全隐藏)
  gray50:    { r: 0.5, g: 0.5, b: 0.5 }, // 亮度 = 0.5 → Alpha = 0.5 (半透明)
};
```

### 2. **SVG 规范定义**

根据 **SVG 1.1 Specification**：

> "The `mask` value is computed from the `mask` element's content. Each pixel's value is converted to an alpha value using the luminance-to-alpha conversion."

**翻译**：蒙版值从蒙版元素的内容计算得出。每个像素的值使用**亮度到alpha的转换**转换为alpha值。

## 🔍 详细工作机制

### 蒙版处理流程

```typescript
class SVGMaskProcessor {
  /**
   * SVG 蒙版处理流程
   */
  processMask(maskPixel: RGBColor, contentPixel: RGBAColor): RGBAColor {
    // 1. 计算蒙版像素的亮度
    const maskLuminance = this.calculateLuminance(maskPixel);
    
    // 2. 将亮度作为内容的不透明度
    return {
      r: contentPixel.r,
      g: contentPixel.g,
      b: contentPixel.b,
      a: contentPixel.a * maskLuminance // 关键：内容透明度 × 蒙版亮度
    };
  }

  private calculateLuminance(color: RGBColor): number {
    // 标准亮度计算 (人眼对不同颜色的敏感度不同)
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  }
}

// 实际应用示例
const processor = new SVGMaskProcessor();

// 黑色蒙版：亮度=0 → 完全透明
const blackMaskResult = processor.processMask(
  { r: 0, g: 0, b: 0 },     // 黑色蒙版
  { r: 255, g: 0, b: 0, a: 1 } // 红色内容
);
// 结果: rgba(255, 0, 0, 0) → 完全透明，不显示

// 白色蒙版：亮度=1 → 完全不透明  
const whiteMaskResult = processor.processMask(
  { r: 1, g: 1, b: 1 },     // 白色蒙版
  { r: 255, g: 0, b: 0, a: 1 } // 红色内容
);
// 结果: rgba(255, 0, 0, 1) → 完全不透明，完全显示
```

## 🛠️ 实际代码演示

### SVG 蒙版示例

```html
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 定义蒙版 -->
  <defs>
    <!-- 这个蒙版从左到右：黑色 → 灰色 → 白色 -->
    <mask id="gradientMask">
      <rect x="0" y="0" width="400" height="200" fill="url(#gradient)"/>
    </mask>
    
    <!-- 渐变：黑色(隐藏) → 灰色(半透明) → 白色(显示) -->
    <linearGradient id="gradient">
      <stop offset="0%" stop-color="black"/>    <!-- 完全隐藏 -->
      <stop offset="50%" stop-color="gray"/>    <!-- 半透明 -->
      <stop offset="100%" stop-color="white"/>  <!-- 完全显示 -->
    </linearGradient>
  </defs>
  
  <!-- 应用蒙版的内容 -->
  <rect x="0" y="0" width="400" height="200" 
        fill="red" mask="url(#gradientMask)"/>
</svg>
```

### JavaScript 模拟实现

```typescript
// 模拟 SVG 蒙版行为的完整实现
class SVGMaskSimulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * 应用 SVG 风格的蒙版
   */
  applySVGMask(
    contentImage: ImageData,
    maskImage: ImageData
  ): ImageData {
    const result = new ImageData(contentImage.width, contentImage.height);
    
    for (let i = 0; i < contentImage.data.length; i += 4) {
      const contentR = contentImage.data[i];
      const contentG = contentImage.data[i + 1];
      const contentB = contentImage.data[i + 2];
      const contentA = contentImage.data[i + 3] / 255;
      
      const maskR = maskImage.data[i] / 255;
      const maskG = maskImage.data[i + 1] / 255;
      const maskB = maskImage.data[i + 2] / 255;
      
      // SVG 蒙版核心算法：亮度 → Alpha
      const maskLuminance = this.calculateLuminance(maskR, maskG, maskB);
      const finalAlpha = contentA * maskLuminance;
      
      result.data[i] = contentR;
      result.data[i + 1] = contentG;
      result.data[i + 2] = contentB;
      result.data[i + 3] = Math.round(finalAlpha * 255);
    }
    
    return result;
  }

  /**
   * 计算像素亮度 (SVG 标准)
   */
  private calculateLuminance(r: number, g: number, b: number): number {
    // 使用 SVG 规范推荐的系数
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * 创建测试蒙版
   */
  createTestMasks(width: number, height: number): {
    blackMask: ImageData;
    whiteMask: ImageData;
    gradientMask: ImageData;
  } {
    const blackMask = this.ctx.createImageData(width, height);
    const whiteMask = this.ctx.createImageData(width, height);
    const gradientMask = this.ctx.createImageData(width, height);
    
    // 填充黑色蒙版 (全黑)
    this.fillImageData(blackMask, 0, 0, 0);
    
    // 填充白色蒙版 (全白)
    this.fillImageData(whiteMask, 255, 255, 255);
    
    // 创建渐变蒙版 (黑 → 白)
    for (let x = 0; x < width; x++) {
      const intensity = Math.round((x / width) * 255);
      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        gradientMask.data[index] = intensity;     // R
        gradientMask.data[index + 1] = intensity; // G
        gradientMask.data[index + 2] = intensity; // B
        gradientMask.data[index + 3] = 255;       // A
      }
    }
    
    return { blackMask, whiteMask, gradientMask };
  }

  private fillImageData(imageData: ImageData, r: number, g: number, b: number): void {
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = r;     // R
      imageData.data[i + 1] = g; // G
      imageData.data[i + 2] = b; // B
      imageData.data[i + 3] = 255; // A
    }
  }
}
```

## 📊 颜色到透明度的映射

### 完整的映射关系

```typescript
interface ColorToAlphaMapping {
  color: string;
  luminance: number;
  resultAlpha: number;
  description: string;
}

const colorMappings: ColorToAlphaMapping[] = [
  { color: 'black', luminance: 0.0, resultAlpha: 0.0, description: '完全隐藏' },
  { color: 'rgb(64,64,64)', luminance: 0.25, resultAlpha: 0.25, description: '大部分隐藏' },
  { color: 'gray', luminance: 0.5, resultAlpha: 0.5, description: '半透明' },
  { color: 'rgb(192,192,192)', luminance: 0.75, resultAlpha: 0.75, description: '大部分显示' },
  { color: 'white', luminance: 1.0, resultAlpha: 1.0, description: '完全显示' },
  { color: 'red', luminance: 0.21, resultAlpha: 0.21, description: '基本隐藏' },
  { color: 'green', luminance: 0.72, resultAlpha: 0.72, description: '大部分显示' },
  { color: 'blue', luminance: 0.07, resultAlpha: 0.07, description: '几乎隐藏' },
  { color: 'yellow', luminance: 0.93, resultAlpha: 0.93, description: '基本显示' }
];
```

### 可视化演示

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .demo-container { display: flex; margin: 20px; }
    .color-sample { width: 100px; height: 50px; margin: 5px; border: 1px solid #ccc; }
    .result { width: 100px; height: 50px; margin: 5px; background: red; }
  </style>
</head>
<body>
  <div class="demo-container">
    <div>
      <div class="color-sample" style="background: black"></div>
      <div class="result" style="opacity: 0"></div>
      <div>黑色 → 完全隐藏</div>
    </div>
    <div>
      <div class="color-sample" style="background: gray"></div>
      <div class="result" style="opacity: 0.5"></div>
      <div>灰色 → 半透明</div>
    </div>
    <div>
      <div class="color-sample" style="background: white"></div>
      <div class="result" style="opacity: 1"></div>
      <div>白色 → 完全显示</div>
    </div>
  </div>
</body>
</html>
```

## 🔄 与其他蒙版系统的对比

### 不同平台的蒙版行为

```typescript
class MaskBehaviorComparison {
  /**
   * 不同图形系统的蒙版行为对比
   */
  static compareMaskBehaviors(): void {
    const systems = {
      svg: {
        name: 'SVG',
        behavior: '亮度 → 透明度',
        black: '隐藏',
        white: '显示',
        formula: 'alpha = luminance(r,g,b)'
      },
      css: {
        name: 'CSS mask',
        behavior: 'Alpha通道作为蒙版',
        black: '取决于Alpha值',
        white: '取决于Alpha值', 
        formula: 'alpha = mask_alpha'
      },
      canvas: {
        name: 'Canvas',
        behavior: '多种混合模式',
        black: '取决于blendMode',
        white: '取决于blendMode',
        formula: '取决于globalCompositeOperation'
      },
      photoshop: {
        name: 'Photoshop',
        behavior: '类似SVG但可配置',
        black: '隐藏(默认)',
        white: '显示(默认)',
        formula: '可自定义映射曲线'
      }
    };
    
    console.table(systems);
  }
}
```

## 💡 设计原理思考

### 为什么选择亮度到Alpha？

1. **符合直觉**：
   - 黑色 = 没有光 = 看不见 = 隐藏
   - 白色 = 全部光 = 看得见 = 显示
   - 灰色 = 部分光 = 部分看见 = 半透明

2. **兼容灰度图像**：
   - 可以直接使用黑白照片作为蒙版
   - 自然的渐变效果

3. **色彩无关**：
   - 红色、绿色、蓝色根据亮度产生相应效果
   - 避免颜色偏好问题

4. **数学一致性**：
   - 标准的亮度计算公式
   - 可预测的、一致的行为

## 🎯 总结

**SVG 蒙版的核心规则**：
- 🔴 **黑色 (亮度 0%)** → 透明度 0% → **完全隐藏**
- ⚪ **白色 (亮度 100%)** → 透明度 100% → **完全显示**  
- 🟤 **灰色 (亮度 50%)** → 透明度 50% → **半透明**

这种设计使得 SVG 蒙版既直观又强大，你可以使用任何从黑到白的渐变来创建平滑的蒙版过渡效果！