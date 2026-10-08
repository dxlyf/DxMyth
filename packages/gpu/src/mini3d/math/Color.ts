import { clamp } from './MathUtils';

/**
 * RGB colour with linear-working-space semantics (like three.js).
 *
 * Construction mirrors three.js:
 * - `new Color()` — white
 * - `new Color(0xff8844)` — packed hex
 * - `new Color(1, 0.5, 0.25)` — explicit channels
 * - `new Color('#f84')` / `new Color('rgb(255,136,68)')` / `new Color('tomato')`
 * - `new Color(otherColor)` — copy
 */
export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r?: number | string | Color, g?: number, b?: number) {
    this.r = 1;
    this.g = 1;
    this.b = 1;
    if (r === undefined) {
      // `new Color()` is white, matching three.js.
    } else if (typeof r === 'string') {
      this.setStyle(r);
    } else if (r instanceof Color) {
      this.copy(r);
    } else if (g === undefined && b === undefined) {
      this.setHex(r);
    } else {
      this.setRGB(r, g as number, b as number);
    }
  }

  /**
   * `set(hex)`, `set(r, g, b)`, `set(color)` or `set(cssString)`. A single
   * numeric argument is interpreted as a packed hex value, matching the
   * constructor.
   */
  set(r: number | string | Color, g?: number, b?: number): this {
    if (typeof r === 'string') return this.setStyle(r);
    if (r instanceof Color) return this.copy(r);
    if (g === undefined && b === undefined) return this.setHex(r);
    return this.setRGB(r, g as number, b as number);
  }

  setRGB(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setScalar(s: number): this {
    return this.setRGB(s, s, s);
  }

  copy(c: Color): this {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    return this;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b);
  }

  /** `#rgb`, `#rrggbb`, `rgb(...)`, `rgba(...)` or a CSS colour name. */
  setStyle(style: string): this {
    const value = style.trim().toLowerCase();

    if (value.startsWith('#')) {
      const hex = value.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return this.setRGB(r / 255, g / 255, b / 255);
      }
      if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return this.setRGB(r / 255, g / 255, b / 255);
      }
      throw new Error(`mini3d.Color: unsupported hex string "${style}"`);
    }

    const match = /^rgba?\(([^)]+)\)$/.exec(value);
    if (match) {
      const parts = match[1].split(',').map((p) => parseFloat(p));
      const [r, g, b, a = 1] = parts;
      const normalised = r <= 1 && g <= 1 && b <= 1 && !match[1].includes('%');
      return this.setRGB(
        normalised ? r : r / 255,
        normalised ? g : g / 255,
        normalised ? b : b / 255,
      ).multiplyScalar(a);
    }

    const named = Color.NAMES[value];
    if (named !== undefined) return this.setHex(named);
    throw new Error(`mini3d.Color: unknown colour "${style}"`);
  }

  setHex(hex: number): this {
    const h = Math.floor(hex);
    return this.setRGB(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);
  }

  getHex(): number {
    return (
      (Math.round(clamp(this.r, 0, 1) * 255) << 16) ^
      (Math.round(clamp(this.g, 0, 1) * 255) << 8) ^
      Math.round(clamp(this.b, 0, 1) * 255)
    );
  }

  getHexString(): string {
    return this.getHex().toString(16).padStart(6, '0');
  }

  getStyle(): string {
    const r = Math.round(clamp(this.r, 0, 1) * 255);
    const g = Math.round(clamp(this.g, 0, 1) * 255);
    const b = Math.round(clamp(this.b, 0, 1) * 255);
    return `rgb(${r},${g},${b})`;
  }

  add(c: Color): this {
    this.r += c.r;
    this.g += c.g;
    this.b += c.b;
    return this;
  }

  addScalar(s: number): this {
    this.r += s;
    this.g += s;
    this.b += s;
    return this;
  }

  sub(c: Color): this {
    this.r -= c.r;
    this.g -= c.g;
    this.b -= c.b;
    return this;
  }

  multiply(c: Color): this {
    this.r *= c.r;
    this.g *= c.g;
    this.b *= c.b;
    return this;
  }

  multiplyScalar(s: number): this {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    return this;
  }

  lerp(c: Color, t: number): this {
    this.r += (c.r - this.r) * t;
    this.g += (c.g - this.g) * t;
    this.b += (c.b - this.b) * t;
    return this;
  }

  /** Perceptual-ish luminance in linear space (Rec. 709). */
  getLuminance(): number {
    return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b;
  }

  equals(c: Color): boolean {
    return this.r === c.r && this.g === c.g && this.b === c.b;
  }

  /** Writes `[r, g, b]` into `target` starting at `offset` (defaults to 0). */
  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    target[offset] = this.r;
    target[offset + 1] = this.g;
    target[offset + 2] = this.b;
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    return this.setRGB(source[offset], source[offset + 1], source[offset + 2]);
  }

  static NAMES: Record<string, number> = {
    black: 0x000000,
    white: 0xffffff,
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    yellow: 0xffff00,
    cyan: 0x00ffff,
    magenta: 0xff00ff,
    gray: 0x808080,
    grey: 0x808080,
    silver: 0xc0c0c0,
    orange: 0xffa500,
    purple: 0x800080,
    pink: 0xffc0cb,
    brown: 0xa52a2a,
    lime: 0x00ff00,
    navy: 0x000080,
    teal: 0x008080,
    olive: 0x808000,
    maroon: 0x800000,
    gold: 0xffd700,
    skyblue: 0x87ceeb,
    steelblue: 0x4682b4,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    indigo: 0x4b0082,
  };
}
