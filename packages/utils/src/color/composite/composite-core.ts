// composite-core.ts
import { RGBAColor, CompositeOperation, CompositeContext } from './composite-types';

export class CompositeCore implements CompositeContext {
  applyComposite(source: RGBAColor, destination: RGBAColor, operation: CompositeOperation): RGBAColor {
    switch (operation) {
      case 'source-over':
        return this.sourceOver(source, destination);
      case 'source-in':
        return this.sourceIn(source, destination);
      case 'source-out':
        return this.sourceOut(source, destination);
      case 'source-atop':
        return this.sourceAtop(source, destination);
      case 'destination-over':
        return this.destinationOver(source, destination);
      case 'destination-in':
        return this.destinationIn(source, destination);
      case 'destination-out':
        return this.destinationOut(source, destination);
      case 'destination-atop':
        return this.destinationAtop(source, destination);
      case 'lighter':
        return this.lighter(source, destination);
      case 'copy':
        return this.copy(source, destination);
      case 'xor':
        return this.xor(source, destination);
      case 'multiply':
        return this.multiply(source, destination);
      case 'screen':
        return this.screen(source, destination);
      case 'overlay':
        return this.overlay(source, destination);
      case 'darken':
        return this.darken(source, destination);
      case 'lighten':
        return this.lighten(source, destination);
      case 'color-dodge':
        return this.colorDodge(source, destination);
      case 'color-burn':
        return this.colorBurn(source, destination);
      case 'hard-light':
        return this.hardLight(source, destination);
      case 'soft-light':
        return this.softLight(source, destination);
      case 'difference':
        return this.difference(source, destination);
      case 'exclusion':
        return this.exclusion(source, destination);
      case 'hue':
        return this.hue(source, destination);
      case 'saturation':
        return this.saturation(source, destination);
      case 'color':
        return this.color(source, destination);
      case 'luminosity':
        return this.luminosity(source, destination);
      default:
        return this.sourceOver(source, destination);
    }
  }

  private sourceOver(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a + destination.a * (1 - source.a);
    if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
    
    return {
      r: (source.r * source.a + destination.r * destination.a * (1 - source.a)) / alpha,
      g: (source.g * source.a + destination.g * destination.a * (1 - source.a)) / alpha,
      b: (source.b * source.a + destination.b * destination.a * (1 - source.a)) / alpha,
      a: alpha
    };
  }

  private sourceIn(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a * destination.a;
    return {
      r: source.r,
      g: source.g,
      b: source.b,
      a: alpha
    };
  }

  private sourceOut(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a * (1 - destination.a);
    return {
      r: source.r,
      g: source.g,
      b: source.b,
      a: alpha
    };
  }

  private sourceAtop(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = destination.a;
    const sourceFactor = destination.a;
    const destFactor = 1 - source.a;
    
    return {
      r: (source.r * sourceFactor + destination.r * destFactor),
      g: (source.g * sourceFactor + destination.g * destFactor),
      b: (source.b * sourceFactor + destination.b * destFactor),
      a: alpha
    };
  }

  private destinationOver(source: RGBAColor, destination: RGBAColor): RGBAColor {
    return this.sourceOver(destination, source);
  }

  private destinationIn(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a * destination.a;
    return {
      r: destination.r,
      g: destination.g,
      b: destination.b,
      a: alpha
    };
  }

  private destinationOut(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = destination.a * (1 - source.a);
    return {
      r: destination.r,
      g: destination.g,
      b: destination.b,
      a: alpha
    };
  }

  private destinationAtop(source: RGBAColor, destination: RGBAColor): RGBAColor {
    return this.sourceAtop(destination, source);
  }

  private lighter(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = 1 - (1 - source.a) * (1 - destination.a);
    if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
    
    return {
      r: Math.min(1, (source.r * source.a + destination.r * destination.a)) / alpha,
      g: Math.min(1, (source.g * source.a + destination.g * destination.a)) / alpha,
      b: Math.min(1, (source.b * source.a + destination.b * destination.a)) / alpha,
      a: alpha
    };
  }

  private copy(source: RGBAColor, destination: RGBAColor): RGBAColor {
    return { ...source };
  }

  private xor(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a * (1 - destination.a) + destination.a * (1 - source.a);
    return {
      r: source.r,
      g: source.g,
      b: source.b,
      a: alpha
    };
  }

  // 混合模式实现
  private multiply(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a + destination.a * (1 - source.a);
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    return this.unpremultiply({
      r: s.r * d.r,
      g: s.g * d.g,
      b: s.b * d.b,
      a: alpha
    });
  }

  private screen(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a + destination.a * (1 - source.a);
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    return this.unpremultiply({
      r: s.r + d.r - s.r * d.r,
      g: s.g + d.g - s.g * d.g,
      b: s.b + d.b - s.b * d.b,
      a: alpha
    });
  }

  private overlay(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const overlayChannel = (s: number, d: number) => 
      d <= 0.5 ? 2 * s * d : 1 - 2 * (1 - s) * (1 - d);
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: overlayChannel(s.r, d.r),
      g: overlayChannel(s.g, d.g),
      b: overlayChannel(s.b, d.b),
      a: alpha
    });
  }

  private darken(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a + destination.a * (1 - source.a);
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    return this.unpremultiply({
      r: Math.min(s.r, d.r),
      g: Math.min(s.g, d.g),
      b: Math.min(s.b, d.b),
      a: alpha
    });
  }

  private lighten(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const alpha = source.a + destination.a * (1 - source.a);
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    return this.unpremultiply({
      r: Math.max(s.r, d.r),
      g: Math.max(s.g, d.g),
      b: Math.max(s.b, d.b),
      a: alpha
    });
  }

  // 其他混合模式的简化实现...
  private colorDodge(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const dodgeChannel = (s: number, d: number) => 
      s === 1 ? 1 : Math.min(1, d / (1 - s));
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: dodgeChannel(s.r, d.r),
      g: dodgeChannel(s.g, d.g),
      b: dodgeChannel(s.b, d.b),
      a: alpha
    });
  }

  private difference(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: Math.abs(s.r - d.r),
      g: Math.abs(s.g - d.g),
      b: Math.abs(s.b - d.b),
      a: alpha
    });
  }

  // HSL 混合模式需要 RGB 到 HSL 的转换
  private hue(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const sHSL = this.rgbToHsl(source);
    const dHSL = this.rgbToHsl(destination);
    
    const resultHSL = { h: sHSL.h, s: dHSL.s, l: dHSL.l, a: source.a };
    const resultRGB = this.hslToRgb(resultHSL);
    
    return {
      ...resultRGB,
      a: source.a + destination.a * (1 - source.a)
    };
  }

  // 工具方法
  private premultiply(color: RGBAColor): RGBAColor {
    return {
      r: color.r * color.a,
      g: color.g * color.a,
      b: color.b * color.a,
      a: color.a
    };
  }

  private unpremultiply(color: RGBAColor): RGBAColor {
    if (color.a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    
    return {
      r: color.r / color.a,
      g: color.g / color.a,
      b: color.b / color.a,
      a: color.a
    };
  }

  private rgbToHsl(color: RGBAColor): { h: number; s: number; l: number; a: number } {
    const r = color.r;
    const g = color.g;
    const b = color.b;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h, s, l, a: color.a };
  }

  private hslToRgb(hsl: { h: number; s: number; l: number; a: number }): RGBAColor {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;
    
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r, g, b, a: hsl.a };
  }

  // 简化实现其他 HSL 混合模式
  private saturation(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const sHSL = this.rgbToHsl(source);
    const dHSL = this.rgbToHsl(destination);
    
    const resultHSL = { h: dHSL.h, s: sHSL.s, l: dHSL.l, a: source.a };
    const resultRGB = this.hslToRgb(resultHSL);
    
    return {
      ...resultRGB,
      a: source.a + destination.a * (1 - source.a)
    };
  }

  private color(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const sHSL = this.rgbToHsl(source);
    const dHSL = this.rgbToHsl(destination);
    
    const resultHSL = { h: sHSL.h, s: sHSL.s, l: dHSL.l, a: source.a };
    const resultRGB = this.hslToRgb(resultHSL);
    
    return {
      ...resultRGB,
      a: source.a + destination.a * (1 - source.a)
    };
  }

  private luminosity(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const sHSL = this.rgbToHsl(source);
    const dHSL = this.rgbToHsl(destination);
    
    const resultHSL = { h: dHSL.h, s: dHSL.s, l: sHSL.l, a: source.a };
    const resultRGB = this.hslToRgb(resultHSL);
    
    return {
      ...resultRGB,
      a: source.a + destination.a * (1 - source.a)
    };
  }

  // 简化实现其他混合模式
  private colorBurn(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const burnChannel = (s: number, d: number) => 
      s === 0 ? 0 : Math.max(0, 1 - (1 - d) / s);
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: burnChannel(s.r, d.r),
      g: burnChannel(s.g, d.g),
      b: burnChannel(s.b, d.b),
      a: alpha
    });
  }

  private hardLight(source: RGBAColor, destination: RGBAColor): RGBAColor {
    return this.overlay(destination, source);
  }

  private softLight(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const softLightChannel = (s: number, d: number) => {
      if (s <= 0.5) {
        return d - (1 - 2 * s) * d * (1 - d);
      } else {
        const g = d <= 0.25 ? ((16 * d - 12) * d + 4) * d : Math.sqrt(d);
        return d + (2 * s - 1) * (g - d);
      }
    };
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: softLightChannel(s.r, d.r),
      g: softLightChannel(s.g, d.g),
      b: softLightChannel(s.b, d.b),
      a: alpha
    });
  }

  private exclusion(source: RGBAColor, destination: RGBAColor): RGBAColor {
    const s = this.premultiply(source);
    const d = this.premultiply(destination);
    
    const alpha = source.a + destination.a * (1 - source.a);
    
    return this.unpremultiply({
      r: s.r + d.r - 2 * s.r * d.r,
      g: s.g + d.g - 2 * s.g * d.g,
      b: s.b + d.b - 2 * s.b * d.b,
      a: alpha
    });
  }
}