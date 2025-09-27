/**
 * GLSL 内置函数的 TypeScript 实现
 * 包含 GLSL 2.0 和 3.0 中常见的数学、几何和工具函数
 */

// 类型定义
type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type Mat2 = [Vec2, Vec2];
type Mat3 = [Vec3, Vec3, Vec3];
type Mat4 = [Vec4, Vec4, Vec4, Vec4];

class GLSLFunctions {
  // ========== 角度和三角函数 ==========:cite[1]:cite[4]:cite[10]
  
  /**
   * 将角度转换为弧度:cite[1]:cite[10]
   */
  static radians(degrees: number): number;
  static radians(degrees: Vec2): Vec2;
  static radians(degrees: Vec3): Vec3;
  static radians(degrees: Vec4): Vec4;
  static radians(degrees: any): any {
    if (typeof degrees === 'number') {
      return degrees * Math.PI / 180;
    } else if (Array.isArray(degrees)) {
      return degrees.map(d => d * Math.PI / 180) as any;
    }
  }

  /**
   * 将弧度转换为角度:cite[1]:cite[10]
   */
  static degrees(radians: number): number;
  static degrees(radians: Vec2): Vec2;
  static degrees(radians: Vec3): Vec3;
  static degrees(radians: Vec4): Vec4;
  static degrees(radians: any): any {
    if (typeof radians === 'number') {
      return radians * 180 / Math.PI;
    } else if (Array.isArray(radians)) {
      return radians.map(r => r * 180 / Math.PI) as any;
    }
  }

  /**
   * 正弦函数:cite[1]:cite[10]
   */
  static sin(angle: number): number;
  static sin(angle: Vec2): Vec2;
  static sin(angle: Vec3): Vec3;
  static sin(angle: Vec4): Vec4;
  static sin(angle: any): any {
    if (typeof angle === 'number') {
      return Math.sin(angle);
    } else if (Array.isArray(angle)) {
      return angle.map(a => Math.sin(a)) as any;
    }
  }

  /**
   * 余弦函数:cite[1]:cite[10]
   */
  static cos(angle: number): number;
  static cos(angle: Vec2): Vec2;
  static cos(angle: Vec3): Vec3;
  static cos(angle: Vec4): Vec4;
  static cos(angle: any): any {
    if (typeof angle === 'number') {
      return Math.cos(angle);
    } else if (Array.isArray(angle)) {
      return angle.map(a => Math.cos(a)) as any;
    }
  }

  /**
   * 正切函数:cite[1]:cite[10]
   */
  static tan(angle: number): number;
  static tan(angle: Vec2): Vec2;
  static tan(angle: Vec3): Vec3;
  static tan(angle: Vec4): Vec4;
  static tan(angle: any): any {
    if (typeof angle === 'number') {
      return Math.tan(angle);
    } else if (Array.isArray(angle)) {
      return angle.map(a => Math.tan(a)) as any;
    }
  }

  /**
   * 反正弦函数:cite[1]:cite[10]
   */
  static asin(x: number): number;
  static asin(x: Vec2): Vec2;
  static asin(x: Vec3): Vec3;
  static asin(x: Vec4): Vec4;
  static asin(x: any): any {
    if (typeof x === 'number') {
      return Math.asin(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.asin(val)) as any;
    }
  }

  /**
   * 反余弦函数:cite[1]:cite[10]
   */
  static acos(x: number): number;
  static acos(x: Vec2): Vec2;
  static acos(x: Vec3): Vec3;
  static acos(x: Vec4): Vec4;
  static acos(x: any): any {
    if (typeof x === 'number') {
      return Math.acos(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.acos(val)) as any;
    }
  }

  /**
   * 反正切函数:cite[1]:cite[10]
   * 可以接受一个参数或两个参数
   */
  static atan(y: number, x?: number): number;
  static atan(y: Vec2, x?: Vec2): Vec2;
  static atan(y: Vec3, x?: Vec3): Vec3;
  static atan(y: Vec4, x?: Vec4): Vec4;
  static atan(y: any, x?: any): any {
    if (typeof y === 'number') {
      if (x !== undefined) {
        return Math.atan2(y, x);
      }
      return Math.atan(y);
    } else if (Array.isArray(y)) {
      if (x !== undefined) {
        return y.map((val, i) => Math.atan2(val, x[i])) as any;
      }
      return y.map(val => Math.atan(val)) as any;
    }
  }

  // ========== 指数函数 ==========:cite[4]:cite[10]
  
  /**
   * 返回 x 的 y 次幂:cite[4]:cite[10]
   */
  static pow(x: number, y: number): number;
  static pow(x: Vec2, y: Vec2): Vec2;
  static pow(x: Vec3, y: Vec3): Vec3;
  static pow(x: Vec4, y: Vec4): Vec4;
  static pow(x: any, y: any): any {
    if (typeof x === 'number' && typeof y === 'number') {
      return Math.pow(x, y);
    } else if (Array.isArray(x) && Array.isArray(y)) {
      return x.map((val, i) => Math.pow(val, y[i])) as any;
    }
  }

  /**
   * 返回 e 的 x 次幂:cite[4]:cite[10]
   */
  static exp(x: number): number;
  static exp(x: Vec2): Vec2;
  static exp(x: Vec3): Vec3;
  static exp(x: Vec4): Vec4;
  static exp(x: any): any {
    if (typeof x === 'number') {
      return Math.exp(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.exp(val)) as any;
    }
  }

  /**
   * 返回 x 的自然对数:cite[4]:cite[10]
   */
  static log(x: number): number;
  static log(x: Vec2): Vec2;
  static log(x: Vec3): Vec3;
  static log(x: Vec4): Vec4;
  static log(x: any): any {
    if (typeof x === 'number') {
      return Math.log(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.log(val)) as any;
    }
  }

  /**
   * 返回 2 的 x 次幂:cite[4]:cite[10]
   */
  static exp2(x: number): number;
  static exp2(x: Vec2): Vec2;
  static exp2(x: Vec3): Vec3;
  static exp2(x: Vec4): Vec4;
  static exp2(x: any): any {
    if (typeof x === 'number') {
      return Math.pow(2, x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.pow(2, val)) as any;
    }
  }

  /**
   * 返回以 2 为底 x 的对数:cite[4]:cite[10]
   */
  static log2(x: number): number;
  static log2(x: Vec2): Vec2;
  static log2(x: Vec3): Vec3;
  static log2(x: Vec4): Vec4;
  static log2(x: any): any {
    if (typeof x === 'number') {
      return Math.log2(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.log2(val)) as any;
    }
  }

  /**
   * 返回 x 的平方根:cite[4]:cite[10]
   */
  static sqrt(x: number): number;
  static sqrt(x: Vec2): Vec2;
  static sqrt(x: Vec3): Vec3;
  static sqrt(x: Vec4): Vec4;
  static sqrt(x: any): any {
    if (typeof x === 'number') {
      return Math.sqrt(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.sqrt(val)) as any;
    }
  }

  /**
   * 返回 x 的平方根的倒数:cite[4]:cite[10]
   */
  static inversesqrt(x: number): number;
  static inversesqrt(x: Vec2): Vec2;
  static inversesqrt(x: Vec3): Vec3;
  static inversesqrt(x: Vec4): Vec4;
  static inversesqrt(x: any): any {
    if (typeof x === 'number') {
      return 1 / Math.sqrt(x);
    } else if (Array.isArray(x)) {
      return x.map(val => 1 / Math.sqrt(val)) as any;
    }
  }

  // ========== 常用函数 ==========:cite[4]:cite[9]:cite[10]
  
  /**
   * 返回 x 的绝对值:cite[4]:cite[10]
   */
  static abs(x: number): number;
  static abs(x: Vec2): Vec2;
  static abs(x: Vec3): Vec3;
  static abs(x: Vec4): Vec4;
  static abs(x: any): any {
    if (typeof x === 'number') {
      return Math.abs(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.abs(val)) as any;
    }
  }

  /**
   * 返回 x 的符号:cite[4]:cite[10]
   * 如果 x > 0 返回 1, x = 0 返回 0, x < 0 返回 -1
   */
  static sign(x: number): number;
  static sign(x: Vec2): Vec2;
  static sign(x: Vec3): Vec3;
  static sign(x: Vec4): Vec4;
  static sign(x: any): any {
    if (typeof x === 'number') {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
    } else if (Array.isArray(x)) {
      return x.map(val => val > 0 ? 1 : val < 0 ? -1 : 0) as any;
    }
  }

  /**
   * 返回小于等于 x 的最大整数:cite[4]:cite[9]:cite[10]
   */
  static floor(x: number): number;
  static floor(x: Vec2): Vec2;
  static floor(x: Vec3): Vec3;
  static floor(x: Vec4): Vec4;
  static floor(x: any): any {
    if (typeof x === 'number') {
      return Math.floor(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.floor(val)) as any;
    }
  }

  /**
   * 返回大于等于 x 的最小整数:cite[4]:cite[9]:cite[10]
   */
  static ceil(x: number): number;
  static ceil(x: Vec2): Vec2;
  static ceil(x: Vec3): Vec3;
  static ceil(x: Vec4): Vec4;
  static ceil(x: any): any {
    if (typeof x === 'number') {
      return Math.ceil(x);
    } else if (Array.isArray(x)) {
      return x.map(val => Math.ceil(val)) as any;
    }
  }

  /**
   * 返回 x 的小数部分:cite[4]:cite[9]:cite[10]
   */
  static fract(x: number): number;
  static fract(x: Vec2): Vec2;
  static fract(x: Vec3): Vec3;
  static fract(x: Vec4): Vec4;
  static fract(x: any): any {
    if (typeof x === 'number') {
      return x - Math.floor(x);
    } else if (Array.isArray(x)) {
      return x.map(val => val - Math.floor(val)) as any;
    }
  }

  /**
   * 返回 x 除以 y 的余数:cite[4]:cite[10]
   */
  static mod(x: number, y: number): number;
  static mod(x: Vec2, y: Vec2): Vec2;
  static mod(x: Vec3, y: Vec3): Vec3;
  static mod(x: Vec4, y: Vec4): Vec4;
  static mod(x: Vec2, y: number): Vec2;
  static mod(x: Vec3, y: number): Vec3;
  static mod(x: Vec4, y: number): Vec4;
  static mod(x: any, y: any): any {
    if (typeof x === 'number' && typeof y === 'number') {
      return x % y;
    } else if (Array.isArray(x) && Array.isArray(y)) {
      return x.map((val, i) => val % y[i]) as any;
    } else if (Array.isArray(x) && typeof y === 'number') {
      return x.map(val => val % y) as any;
    }
  }

  /**
   * 返回 x 和 y 中的较小值:cite[4]:cite[10]
   */
  static min(x: number, y: number): number;
  static min(x: Vec2, y: Vec2): Vec2;
  static min(x: Vec3, y: Vec3): Vec3;
  static min(x: Vec4, y: Vec4): Vec4;
  static min(x: Vec2, y: number): Vec2;
  static min(x: Vec3, y: number): Vec3;
  static min(x: Vec4, y: number): Vec4;
  static min(x: any, y: any): any {
    if (typeof x === 'number' && typeof y === 'number') {
      return Math.min(x, y);
    } else if (Array.isArray(x) && Array.isArray(y)) {
      return x.map((val, i) => Math.min(val, y[i])) as any;
    } else if (Array.isArray(x) && typeof y === 'number') {
      return x.map(val => Math.min(val, y)) as any;
    }
  }

  /**
   * 返回 x 和 y 中的较大值:cite[4]:cite[10]
   */
  static max(x: number, y: number): number;
  static max(x: Vec2, y: Vec2): Vec2;
  static max(x: Vec3, y: Vec3): Vec3;
  static max(x: Vec4, y: Vec4): Vec4;
  static max(x: Vec2, y: number): Vec2;
  static max(x: Vec3, y: number): Vec3;
  static max(x: Vec4, y: number): Vec4;
  static max(x: any, y: any): any {
    if (typeof x === 'number' && typeof y === 'number') {
      return Math.max(x, y);
    } else if (Array.isArray(x) && Array.isArray(y)) {
      return x.map((val, i) => Math.max(val, y[i])) as any;
    } else if (Array.isArray(x) && typeof y === 'number') {
      return x.map(val => Math.max(val, y)) as any;
    }
  }

  /**
   * 将 x 限制在 minVal 和 maxVal 之间:cite[4]:cite[10]
   */
  static clamp(x: number, minVal: number, maxVal: number): number;
  static clamp(x: Vec2, minVal: Vec2, maxVal: Vec2): Vec2;
  static clamp(x: Vec3, minVal: Vec3, maxVal: Vec3): Vec3;
  static clamp(x: Vec4, minVal: Vec4, maxVal: Vec4): Vec4;
  static clamp(x: Vec2, minVal: number, maxVal: number): Vec2;
  static clamp(x: Vec3, minVal: number, maxVal: number): Vec3;
  static clamp(x: Vec4, minVal: number, maxVal: number): Vec4;
  static clamp(x: any, minVal: any, maxVal: any): any {
    if (typeof x === 'number' && typeof minVal === 'number' && typeof maxVal === 'number') {
      return Math.min(Math.max(x, minVal), maxVal);
    } else if (Array.isArray(x) && Array.isArray(minVal) && Array.isArray(maxVal)) {
      return x.map((val, i) => Math.min(Math.max(val, minVal[i]), maxVal[i])) as any;
    } else if (Array.isArray(x) && typeof minVal === 'number' && typeof maxVal === 'number') {
      return x.map(val => Math.min(Math.max(val, minVal), maxVal)) as any;
    }
  }

  /**
   * 线性插值：返回 x 和 y 之间的混合值:cite[4]:cite[10]
   * 当 a = 0 时返回 x，a = 1 时返回 y
   */
  static mix(x: number, y: number, a: number): number;
  static mix(x: Vec2, y: Vec2, a: Vec2): Vec2;
  static mix(x: Vec3, y: Vec3, a: Vec3): Vec3;
  static mix(x: Vec4, y: Vec4, a: Vec4): Vec4;
  static mix(x: Vec2, y: Vec2, a: number): Vec2;
  static mix(x: Vec3, y: Vec3, a: number): Vec3;
  static mix(x: Vec4, y: Vec4, a: number): Vec4;
  static mix(x: any, y: any, a: any): any {
    if (typeof x === 'number' && typeof y === 'number' && typeof a === 'number') {
      return x * (1 - a) + y * a;
    } else if (Array.isArray(x) && Array.isArray(y) && Array.isArray(a)) {
      return x.map((val, i) => val * (1 - a[i]) + y[i] * a[i]) as any;
    } else if (Array.isArray(x) && Array.isArray(y) && typeof a === 'number') {
      return x.map((val, i) => val * (1 - a) + y[i] * a) as any;
    }
  }

  /**
   * 阶跃函数：当 x < edge 返回 0，否则返回 1:cite[4]:cite[9]:cite[10]
   */
  static step(edge: number, x: number): number;
  static step(edge: Vec2, x: Vec2): Vec2;
  static step(edge: Vec3, x: Vec3): Vec3;
  static step(edge: Vec4, x: Vec4): Vec4;
  static step(edge: number, x: Vec2): Vec2;
  static step(edge: number, x: Vec3): Vec3;
  static step(edge: number, x: Vec4): Vec4;
  static step(edge: any, x: any): any {
    if (typeof edge === 'number' && typeof x === 'number') {
      return x < edge ? 0 : 1;
    } else if (Array.isArray(edge) && Array.isArray(x)) {
      return x.map((val, i) => val < edge[i] ? 0 : 1) as any;
    } else if (typeof edge === 'number' && Array.isArray(x)) {
      return x.map(val => val < edge ? 0 : 1) as any;
    }
  }

  /**
   * 平滑阶跃函数：在 edge0 和 edge1 之间进行平滑插值:cite[4]:cite[9]:cite[10]
   */
  static smoothstep(edge0: number, edge1: number, x: number): number;
  static smoothstep(edge0: Vec2, edge1: Vec2, x: Vec2): Vec2;
  static smoothstep(edge0: Vec3, edge1: Vec3, x: Vec3): Vec3;
  static smoothstep(edge0: Vec4, edge1: Vec4, x: Vec4): Vec4;
  static smoothstep(edge0: number, edge1: number, x: Vec2): Vec2;
  static smoothstep(edge0: number, edge1: number, x: Vec3): Vec3;
  static smoothstep(edge0: number, edge1: number, x: Vec4): Vec4;
  static smoothstep(edge0: any, edge1: any, x: any): any {
    if (typeof edge0 === 'number' && typeof edge1 === 'number' && typeof x === 'number') {
      const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
      return t * t * (3 - 2 * t);
    } else if (Array.isArray(edge0) && Array.isArray(edge1) && Array.isArray(x)) {
      return x.map((val, i) => {
        const t = Math.min(Math.max((val - edge0[i]) / (edge1[i] - edge0[i]), 0), 1);
        return t * t * (3 - 2 * t);
      }) as any;
    } else if (typeof edge0 === 'number' && typeof edge1 === 'number' && Array.isArray(x)) {
      return x.map(val => {
        const t = Math.min(Math.max((val - edge0) / (edge1 - edge0), 0), 1);
        return t * t * (3 - 2 * t);
      }) as any;
    }
  }

  // ========== 几何函数 ==========:cite[4]:cite[10]
  
  /**
   * 返回向量 x 的长度:cite[4]:cite[10]
   */
  static length(x: number): number;
  static length(x: Vec2): number;
  static length(x: Vec3): number;
  static length(x: Vec4): number;
  static length(x: any): number {
    if (typeof x === 'number') {
      return Math.abs(x);
    } else if (Array.isArray(x)) {
      return Math.sqrt(x.reduce((sum, val) => sum + val * val, 0));
    }
    return 0;
  }

  /**
   * 返回点 p0 和 p1 之间的距离:cite[4]:cite[10]
   */
  static distance(p0: number, p1: number): number;
  static distance(p0: Vec2, p1: Vec2): number;
  static distance(p0: Vec3, p1: Vec3): number;
  static distance(p0: Vec4, p1: Vec4): number;
  static distance(p0: any, p1: any): number {
    if (typeof p0 === 'number' && typeof p1 === 'number') {
      return Math.abs(p0 - p1);
    } else if (Array.isArray(p0) && Array.isArray(p1)) {
      return Math.sqrt(p0.reduce((sum, val, i) => sum + (val - p1[i]) * (val - p1[i]), 0));
    }
    return 0;
  }

  /**
   * 返回向量 x 和 y 的点积:cite[4]:cite[10]
   */
  static dot(x: number, y: number): number;
  static dot(x: Vec2, y: Vec2): number;
  static dot(x: Vec3, y: Vec3): number;
  static dot(x: Vec4, y: Vec4): number;
  static dot(x: any, y: any): number {
    if (typeof x === 'number' && typeof y === 'number') {
      return x * y;
    } else if (Array.isArray(x) && Array.isArray(y)) {
      return x.reduce((sum, val, i) => sum + val * y[i], 0);
    }
    return 0;
  }

  /**
   * 返回向量 x 的单位向量:cite[4]:cite[10]
   */
  static normalize(x: number): number;
  static normalize(x: Vec2): Vec2;
  static normalize(x: Vec3): Vec3;
  static normalize(x: Vec4): Vec4;
  static normalize(x: any): any {
    if (typeof x === 'number') {
      return x === 0 ? 0 : 1;
    } else if (Array.isArray(x)) {
      const len = this.length(x as any);
      if (len === 0) return x.map(() => 0) as any;
      return x.map(val => val / len) as any;
    }
  }

  /**
   * 反射向量计算:cite[4]:cite[10]
   * I: 入射向量，N: 法线向量（必须已归一化）
   */
  static reflect(I: Vec3, N: Vec3): Vec3 {
    const dot = this.dot(I, N);
    return [
      I[0] - 2 * dot * N[0],
      I[1] - 2 * dot * N[1],
      I[2] - 2 * dot * N[2]
    ];
  }

  /**
   * 折射向量计算:cite[4]:cite[10]
   * I: 入射向量，N: 法线向量，eta: 折射率比值
   */
  static refract(I: Vec3, N: Vec3, eta: number): Vec3 {
    const dotValue = this.dot(I, N);
    const k = 1 - eta * eta * (1 - dotValue * dotValue);
    
    if (k < 0) {
      return [0, 0, 0]; // 全反射
    }
    
    return [
      eta * I[0] - (eta * dotValue + Math.sqrt(k)) * N[0],
      eta * I[1] - (eta * dotValue + Math.sqrt(k)) * N[1],
      eta * I[2] - (eta * dotValue + Math.sqrt(k)) * N[2]
    ];
  }

  // ========== 矩阵函数 ==========:cite[4]:cite[10]
  
  /**
   * 矩阵分量乘法:cite[4]:cite[10]
   */
  static matrixCompMult(a: Mat2, b: Mat2): Mat2;
  static matrixCompMult(a: Mat3, b: Mat3): Mat3;
  static matrixCompMult(a: Mat4, b: Mat4): Mat4;
  static matrixCompMult(a: any, b: any): any {
    if (a.length !== b.length) return a;
    
    const result: any = [];
    for (let i = 0; i < a.length; i++) {
      const row: any = [];
      for (let j = 0; j < a[i].length; j++) {
        row.push(a[i][j] * b[i][j]);
      }
      result.push(row);
    }
    return result;
  }

  /**
   * 矩阵转置:cite[4]
   */
  static transpose(m: Mat2): Mat2;
  static transpose(m: Mat3): Mat3;
  static transpose(m: Mat4): Mat4;
  static transpose(m: any): any {
    const result: any = [];
    for (let i = 0; i < m[0].length; i++) {
      const row: any = [];
      for (let j = 0; j < m.length; j++) {
        row.push(m[j][i]);
      }
      result.push(row);
    }
    return result;
  }

  // ========== 噪声函数 (GLSL 3.0) ==========:cite[2]:cite[6]
  
  /**
   * 一维随机函数:cite[2]:cite[8]
   */
  static random1(x: number): number {
    return this.fract(Math.sin(x) * 43758.5453);
  }

  /**
   * 二维随机函数:cite[2]:cite[3]:cite[8]
   */
  static random2(st: Vec2): number {
    return this.fract(Math.sin(this.dot(st, [12.9898, 78.233])) * 43758.5453123);
  }

  /**
   * 二维噪声函数（基于值噪声）:cite[2]
   */
  static noise2(st: Vec2): number {
    const i = [Math.floor(st[0]), Math.floor(st[1])] as Vec2;
    const f = [this.fract(st[0]), this.fract(st[1])] as Vec2;
    
    // 四个角点的随机值
    const a = this.random2([i[0], i[1]]);
    const b = this.random2([i[0] + 1, i[1]]);
    const c = this.random2([i[0], i[1] + 1]);
    const d = this.random2([i[0] + 1, i[1] + 1]);
    
    // 平滑插值
    const u = f.map(val => val * val * (3 - 2 * val)) as Vec2;
    
    // 双线性插值
    return this.mix(
      this.mix(a, b, u[0]),
      this.mix(c, d, u[0]),
      u[1]
    );
  }

  // ========== 向量关系函数 ==========:cite[4]:cite[10]
  
  /**
   * 向量比较：小于:cite[10]
   */
  static lessThan(a: Vec2, b: Vec2): [boolean, boolean];
  static lessThan(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static lessThan(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static lessThan(a: any, b: any): any {
    return a.map((val: number, i: number) => val < b[i]);
  }

  /**
   * 向量比较：小于等于:cite[10]
   */
  static lessThanEqual(a: Vec2, b: Vec2): [boolean, boolean];
  static lessThanEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static lessThanEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static lessThanEqual(a: any, b: any): any {
    return a.map((val: number, i: number) => val <= b[i]);
  }

  /**
   * 向量比较：大于:cite[10]
   */
  static greaterThan(a: Vec2, b: Vec2): [boolean, boolean];
  static greaterThan(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static greaterThan(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static greaterThan(a: any, b: any): any {
    return a.map((val: number, i: number) => val > b[i]);
  }

  /**
   * 向量比较：大于等于:cite[10]
   */
  static greaterThanEqual(a: Vec2, b: Vec2): [boolean, boolean];
  static greaterThanEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static greaterThanEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static greaterThanEqual(a: any, b: any): any {
    return a.map((val: number, i: number) => val >= b[i]);
  }

  /**
   * 向量比较：等于:cite[10]
   */
  static equal(a: Vec2, b: Vec2): [boolean, boolean];
  static equal(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static equal(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static equal(a: any, b: any): any {
    return a.map((val: number, i: number) => val === b[i]);
  }

  /**
   * 向量比较：不等于:cite[10]
   */
  static notEqual(a: Vec2, b: Vec2): [boolean, boolean];
  static notEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
  static notEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
  static notEqual(a: any, b: any): any {
    return a.map((val: number, i: number) => val !== b[i]);
  }

  /**
   * 任意分量是否为真:cite[10]
   */
  static any(v: boolean[]): boolean;
  static any(v: [boolean, boolean]): boolean;
  static any(v: [boolean, boolean, boolean]): boolean;
  static any(v: [boolean, boolean, boolean, boolean]): boolean;
  static any(v: any): boolean {
    return v.some((val: boolean) => val);
  }

  /**
   * 所有分量是否为真:cite[10]
   */
  static all(v: boolean[]): boolean;
  static all(v: [boolean, boolean]): boolean;
  static all(v: [boolean, boolean, boolean]): boolean;
  static all(v: [boolean, boolean, boolean, boolean]): boolean;
  static all(v: any): boolean {
    return v.every((val: boolean) => val);
  }

  /**
   * 分量逻辑非:cite[10]
   */
  static not(v: boolean[]): boolean[];
  static not(v: [boolean, boolean]): [boolean, boolean];
  static not(v: [boolean, boolean, boolean]): [boolean, boolean, boolean];
  static not(v: [boolean, boolean, boolean, boolean]): [boolean, boolean, boolean, boolean];
  static not(v: any): any {
    return v.map((val: boolean) => !val);
  }

  // ========== 矩阵构造函数 ==========
  
  /**
   * 创建单位矩阵
   */
  static identity2(): Mat2 {
    return [
      [1, 0],
      [0, 1]
    ];
  }

  static identity3(): Mat3 {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  static identity4(): Mat4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 从对角线创建矩阵
   */
  static diagonal2(diag: Vec2): Mat2 {
    return [
      [diag[0], 0],
      [0, diag[1]]
    ];
  }

  static diagonal3(diag: Vec3): Mat3 {
    return [
      [diag[0], 0, 0],
      [0, diag[1], 0],
      [0, 0, diag[2]]
    ];
  }

  static diagonal4(diag: Vec4): Mat4 {
    return [
      [diag[0], 0, 0, 0],
      [0, diag[1], 0, 0],
      [0, 0, diag[2], 0],
      [0, 0, 0, diag[3]]
    ];
  }

  // ========== 矩阵基本运算 ==========
  
  /**
   * 矩阵加法
   */
  static add2(a: Mat2, b: Mat2): Mat2 {
    return [
      [a[0][0] + b[0][0], a[0][1] + b[0][1]],
      [a[1][0] + b[1][0], a[1][1] + b[1][1]]
    ];
  }

  static add3(a: Mat3, b: Mat3): Mat3 {
    return [
      [a[0][0] + b[0][0], a[0][1] + b[0][1], a[0][2] + b[0][2]],
      [a[1][0] + b[1][0], a[1][1] + b[1][1], a[1][2] + b[1][2]],
      [a[2][0] + b[2][0], a[2][1] + b[2][1], a[2][2] + b[2][2]]
    ];
  }

  static add4(a: Mat4, b: Mat4): Mat4 {
    return [
      [a[0][0] + b[0][0], a[0][1] + b[0][1], a[0][2] + b[0][2], a[0][3] + b[0][3]],
      [a[1][0] + b[1][0], a[1][1] + b[1][1], a[1][2] + b[1][2], a[1][3] + b[1][3]],
      [a[2][0] + b[2][0], a[2][1] + b[2][1], a[2][2] + b[2][2], a[2][3] + b[2][3]],
      [a[3][0] + b[3][0], a[3][1] + b[3][1], a[3][2] + b[3][2], a[3][3] + b[3][3]]
    ];
  }

  /**
   * 矩阵减法
   */
  static subtract2(a: Mat2, b: Mat2): Mat2 {
    return [
      [a[0][0] - b[0][0], a[0][1] - b[0][1]],
      [a[1][0] - b[1][0], a[1][1] - b[1][1]]
    ];
  }

  static subtract3(a: Mat3, b: Mat3): Mat3 {
    return [
      [a[0][0] - b[0][0], a[0][1] - b[0][1], a[0][2] - b[0][2]],
      [a[1][0] - b[1][0], a[1][1] - b[1][1], a[1][2] - b[1][2]],
      [a[2][0] - b[2][0], a[2][1] - b[2][1], a[2][2] - b[2][2]]
    ];
  }

  static subtract4(a: Mat4, b: Mat4): Mat4 {
    return [
      [a[0][0] - b[0][0], a[0][1] - b[0][1], a[0][2] - b[0][2], a[0][3] - b[0][3]],
      [a[1][0] - b[1][0], a[1][1] - b[1][1], a[1][2] - b[1][2], a[1][3] - b[1][3]],
      [a[2][0] - b[2][0], a[2][1] - b[2][1], a[2][2] - b[2][2], a[2][3] - b[2][3]],
      [a[3][0] - b[3][0], a[3][1] - b[3][1], a[3][2] - b[3][2], a[3][3] - b[3][3]]
    ];
  }

  /**
   * 矩阵标量乘法
   */
  static multiplyScalar2(m: Mat2, scalar: number): Mat2 {
    return [
      [m[0][0] * scalar, m[0][1] * scalar],
      [m[1][0] * scalar, m[1][1] * scalar]
    ];
  }

  static multiplyScalar3(m: Mat3, scalar: number): Mat3 {
    return [
      [m[0][0] * scalar, m[0][1] * scalar, m[0][2] * scalar],
      [m[1][0] * scalar, m[1][1] * scalar, m[1][2] * scalar],
      [m[2][0] * scalar, m[2][1] * scalar, m[2][2] * scalar]
    ];
  }

  static multiplyScalar4(m: Mat4, scalar: number): Mat4 {
    return [
      [m[0][0] * scalar, m[0][1] * scalar, m[0][2] * scalar, m[0][3] * scalar],
      [m[1][0] * scalar, m[1][1] * scalar, m[1][2] * scalar, m[1][3] * scalar],
      [m[2][0] * scalar, m[2][1] * scalar, m[2][2] * scalar, m[2][3] * scalar],
      [m[3][0] * scalar, m[3][1] * scalar, m[3][2] * scalar, m[3][3] * scalar]
    ];
  }

  /**
   * 矩阵乘法
   */
  static multiply2(a: Mat2, b: Mat2): Mat2 {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1]
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1]
      ]
    ];
  }

  static multiply3(a: Mat3, b: Mat3): Mat3 {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
        a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
        a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]
      ],
      [
        a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
        a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
        a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]
      ]
    ];
  }

  static multiply4(a: Mat4, b: Mat4): Mat4 {
    const result: Mat4 = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return result;
  }

  /**
   * 矩阵与向量乘法
   */
  static multiplyVector2(m: Mat2, v: Vec2): Vec2 {
    return [
      m[0][0] * v[0] + m[0][1] * v[1],
      m[1][0] * v[0] + m[1][1] * v[1]
    ];
  }

  static multiplyVector3(m: Mat3, v: Vec3): Vec3 {
    return [
      m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
      m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
      m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]
    ];
  }

  static multiplyVector4(m: Mat4, v: Vec4): Vec4 {
    return [
      m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
      m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
      m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
      m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3]
    ];
  }

  // ========== 矩阵高级运算 ==========
  
  /**
   * 矩阵转置
   */
  static transpose2(m: Mat2): Mat2 {
    return [
      [m[0][0], m[1][0]],
      [m[0][1], m[1][1]]
    ];
  }

  static transpose3(m: Mat3): Mat3 {
    return [
      [m[0][0], m[1][0], m[2][0]],
      [m[0][1], m[1][1], m[2][1]],
      [m[0][2], m[1][2], m[2][2]]
    ];
  }

  static transpose4(m: Mat4): Mat4 {
    return [
      [m[0][0], m[1][0], m[2][0], m[3][0]],
      [m[0][1], m[1][1], m[2][1], m[3][1]],
      [m[0][2], m[1][2], m[2][2], m[3][2]],
      [m[0][3], m[1][3], m[2][3], m[3][3]]
    ];
  }

  /**
   * 2x2 矩阵行列式
   */
  static determinant2(m: Mat2): number {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }

  /**
   * 3x3 矩阵行列式
   */
  static determinant3(m: Mat3): number {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  /**
   * 4x4 矩阵行列式 (使用拉普拉斯展开)
   */
  static determinant4(m: Mat4): number {
    const minor3 = (mat: Mat3): number => {
      return (
        mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
        mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
        mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0])
      );
    };

    const getMinor = (mat: Mat4, row: number, col: number): number => {
      const minorMat: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      let minorRow = 0;
      
      for (let i = 0; i < 4; i++) {
        if (i === row) continue;
        let minorCol = 0;
        
        for (let j = 0; j < 4; j++) {
          if (j === col) continue;
          minorMat[minorRow][minorCol] = mat[i][j];
          minorCol++;
        }
        minorRow++;
      }
      
      return minor3(minorMat);
    };

    return (
      m[0][0] * getMinor(m, 0, 0) -
      m[0][1] * getMinor(m, 0, 1) +
      m[0][2] * getMinor(m, 0, 2) -
      m[0][3] * getMinor(m, 0, 3)
    );
  }

  /**
   * 2x2 矩阵求逆
   */
  static inverse2(m: Mat2): Mat2 | null {
    const det = this.determinant2(m);
    if (Math.abs(det) < 1e-10) return null; // 矩阵不可逆
    
    const invDet = 1.0 / det;
    return [
      [m[1][1] * invDet, -m[0][1] * invDet],
      [-m[1][0] * invDet, m[0][0] * invDet]
    ];
  }

  /**
   * 3x3 矩阵求逆
   */
  static inverse3(m: Mat3): Mat3 | null {
    const det = this.determinant3(m);
    if (Math.abs(det) < 1e-10) return null;
    
    const invDet = 1.0 / det;
    
    return [
      [
        (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
        (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
        (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet
      ],
      [
        (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
        (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
        (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet
      ],
      [
        (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
        (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
        (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet
      ]
    ];
  }

  /**
   * 4x4 矩阵求逆 (使用伴随矩阵法)
   */
  static inverse4(m: Mat4): Mat4 | null {
    const det = this.determinant4(m);
    if (Math.abs(det) < 1e-10) return null;
    
    const invDet = 1.0 / det;
    const result: Mat4 = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    
    // 计算伴随矩阵
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const sign = ((i + j) % 2 === 0) ? 1 : -1;
        
        // 获取3x3子矩阵
        const subMat: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        let subRow = 0;
        
        for (let k = 0; k < 4; k++) {
          if (k === i) continue;
          let subCol = 0;
          
          for (let l = 0; l < 4; l++) {
            if (l === j) continue;
            subMat[subRow][subCol] = m[k][l];
            subCol++;
          }
          subRow++;
        }
        
        const minor = this.determinant3(subMat);
        result[j][i] = sign * minor * invDet; // 转置并乘以系数
      }
    }
    
    return result;
  }

  // ========== 变换矩阵生成函数 ==========
  
  /**
   * 平移矩阵
   */
  static translationMatrix(tx: number, ty: number, tz: number): Mat4 {
    return [
      [1, 0, 0, tx],
      [0, 1, 0, ty],
      [0, 0, 1, tz],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 缩放矩阵
   */
  static scalingMatrix(sx: number, sy: number, sz: number): Mat4 {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 绕 X 轴旋转矩阵
   */
  static rotationXMatrix(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    return [
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 绕 Y 轴旋转矩阵
   */
  static rotationYMatrix(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    return [
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 绕 Z 轴旋转矩阵
   */
  static rotationZMatrix(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    return [
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 绕任意轴旋转矩阵 (罗德里格斯公式)
   */
  static rotationAxisMatrix(axis: Vec3, angle: number): Mat4 {
    const normalizedAxis = this.normalizeVector3(axis);
    const [x, y, z] = normalizedAxis;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    
    return [
      [
        t * x * x + c,
        t * x * y - s * z,
        t * x * z + s * y,
        0
      ],
      [
        t * x * y + s * z,
        t * y * y + c,
        t * y * z - s * x,
        0
      ],
      [
        t * x * z - s * y,
        t * y * z + s * x,
        t * z * z + c,
        0
      ],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 透视投影矩阵
   */
  static perspectiveMatrix(fov: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1.0 / (near - far);
    
    return [
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (near + far) * rangeInv, 2 * near * far * rangeInv],
      [0, 0, -1, 0]
    ];
  }

  /**
   * 正交投影矩阵
   */
  static orthographicMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const rl = 1.0 / (right - left);
    const tb = 1.0 / (top - bottom);
    const fn = 1.0 / (far - near);
    
    return [
      [2 * rl, 0, 0, -(right + left) * rl],
      [0, 2 * tb, 0, -(top + bottom) * tb],
      [0, 0, -2 * fn, -(far + near) * fn],
      [0, 0, 0, 1]
    ];
  }

  /**
   * 视图矩阵 (lookAt)
   */
  static lookAtMatrix(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
    const f = this.normalizeVector3([
      center[0] - eye[0],
      center[1] - eye[1],
      center[2] - eye[2]
    ]);
    
    const s = this.normalizeVector3(this.cross(f, up));
    const u = this.cross(s, f);
    
    return [
      [s[0], u[0], -f[0], 0],
      [s[1], u[1], -f[1], 0],
      [s[2], u[2], -f[2], 0],
      [
        -this.dot(s, eye),
        -this.dot(u, eye),
        this.dot(f, eye),
        1
      ]
    ];
  }

  // ========== 工具函数 ==========
  
  static normalizeVector3(v: Vec3): Vec3 {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length < 1e-10) return [0, 0, 0];
    return [v[0] / length, v[1] / length, v[2] / length];
  }
  static cross(a: Vec2, b: Vec2): number
  static cross(a: Vec3, b: Vec3): Vec3
  static cross(a: any, b: any): Vec3|number {
    if(a.length === 2 && b.length === 2) {
      return a[0] * b[1] - a[1] * b[0];
    }
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  /**
   * 矩阵转换为字符串 (便于调试)
   */
  static matrixToString(m: Mat2 | Mat3 | Mat4): string {
    return m.map(row => row.map(val => val.toFixed(4)).join(', ')).join('\n');
  }

  /**
   * 检查矩阵是否相等 (考虑浮点误差)
   */
  static matrixEquals(a: Mat2, b: Mat2, epsilon: number): boolean;
  static matrixEquals(a: Mat3, b: Mat3, epsilon: number): boolean;
  static matrixEquals(a: Mat4, b: Mat4, epsilon: number): boolean;
  static matrixEquals(a: any, b: any, epsilon: number = 1e-6): boolean {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length) return false;
      
      for (let j = 0; j < a[i].length; j++) {
        if (Math.abs(a[i][j] - b[i][j]) > epsilon) {
          return false;
        }
      }
    }
    
    return true;
  }
}

export default GLSLFunctions;