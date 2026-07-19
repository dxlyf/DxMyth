/**复数 */
/** 复数类，支持基本运算 */
class Complex {
  /** 实部 */
  real: number;
  /** 虚部 */
  imag: number;

  /**
   * 构造一个复数
   * @param real 实部
   * @param imag 虚部
   */
  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  /** 返回共轭复数 */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  /** 返回模长 */
  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  /** 返回幅角（弧度） */
  arg(): number {
    return Math.atan2(this.imag, this.real);
  }

  /**
   * 复数加法
   * @param other 另一个复数
   * @returns 新的复数结果
   */
  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  /**
   * 复数减法
   * @param other 另一个复数
   * @returns 新的复数结果
   */
  sub(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  /**
   * (a+bi)(c+di)=ac+adi+bci+bdi^2=ac+(ad+bc)i+bd*(-1)=(ac-bd)+(ad+bc)i
   * 复数乘法
   * @param other 另一个复数
   * @returns 新的复数结果
   */
  mul(other: Complex): Complex {
    const r = this.real * other.real - this.imag * other.imag;
    const i = this.real * other.imag + this.imag * other.real;
    return new Complex(r, i);
  }

  /**
   * 复数除法
   * @param other 另一个复数
   * @returns 新的复数结果
   * @throws 当除数为 0 时抛出错误
   */
  div(other: Complex): Complex {
    const den = other.real * other.real + other.imag * other.imag;
    if (den === 0) throw new Error('除数不能为零');
    const r = (this.real * other.real + this.imag * other.imag) / den;
    const i = (this.imag * other.real - this.real * other.imag) / den;
    return new Complex(r, i);
  }

  /** 返回形如 "a+bi" 的字符串 */
  toString(): string {
    const sign = this.imag >= 0 ? '+' : '';
    return `${this.real}${sign}${this.imag}i`;
  }

  /**
   * 计算复数的幂
   * @param exponent 指数
   * @returns 结果复数
   */
  pow(exponent: number | Complex): Complex {
    if (typeof exponent === 'number') {
      return Complex.pow(this, new Complex(exponent, 0));
    }
    return Complex.pow(this, exponent);
  }

  /**
   * 计算复数的平方根
   * @returns 结果复数（主值）
   */
  sqrt(): Complex {
    return this.pow(0.5);
  }

  /**
   * 计算复数的指数函数 e^z
   * @returns 结果复数
   */
  exp(): Complex {
    return Complex.exp(this);
  }

  /**
   * 计算复数的自然对数
   * @returns 结果复数（主值）
   */
  log(): Complex {
    return Complex.log(this);
  }

  /**
   * 计算复数的正弦值
   * @returns 结果复数
   */
  sin(): Complex {
    return Complex.sin(this);
  }

  /**
   * 计算复数的余弦值
   * @returns 结果复数
   */
  cos(): Complex {
    return Complex.cos(this);
  }

  /**
   * 计算复数的正切值
   * @returns 结果复数
   */
  tan(): Complex {
    return Complex.tan(this);
  }

  /**
   * 计算复数的双曲正弦值
   * @returns 结果复数
   */
  sinh(): Complex {
    return Complex.sinh(this);
  }

  /**
   * 计算复数的双曲余弦值
   * @returns 结果复数
   */
  cosh(): Complex {
    return Complex.cosh(this);
  }

  /**
   * 计算复数的双曲正切值
   * @returns 结果复数
   */
  tanh(): Complex {
    return Complex.div(this.sinh(), this.cosh());
  }

  /**
   * 归一化复数（将模长变为1）
   * @returns 归一化后的复数
   */
  normalize(): Complex {
    const mag = this.magnitude();
    if (mag === 0) return new Complex(0, 0);
    return new Complex(this.real / mag, this.imag / mag);
  }

  /**
   * 旋转复数
   * @param angle 旋转角度（弧度）
   * @returns 旋转后的复数
   */
  rotate(angle: number): Complex {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const real = this.real * cos - this.imag * sin;
    const imag = this.real * sin + this.imag * cos;
    return new Complex(real, imag);
  }

  /**
   * 缩放复数
   * @param scale 缩放因子
   * @returns 缩放后的复数
   */
  scale(scale: number): Complex {
    return new Complex(this.real * scale, this.imag * scale);
  }

  /**
   * 与实数相乘
   * @param scalar 实数值
   * @returns 结果复数
   */
  multiplyByScalar(scalar: number): Complex {
    return this.scale(scalar);
  }

  /**
   * 四舍五入复数的实部和虚部
   * @param digits 保留的小数位数
   * @returns 四舍五入后的复数
   */
  round(digits: number = 0): Complex {
    const factor = Math.pow(10, digits);
    const real = Math.round(this.real * factor) / factor;
    const imag = Math.round(this.imag * factor) / factor;
    return new Complex(real, imag);
  }
}

/** 工具函数：创建复数 */
const complex = (real: number, imag: number) => new Complex(real, imag);

/** 复数类的静态方法和扩展功能 */
namespace Complex {
  /**
   * 从极坐标创建复数
   * @param magnitude 模长
   * @param angle 角度（弧度）
   * @returns 新的复数
   */
  export const fromPolar = (magnitude: number, angle: number): Complex => {
    const real = magnitude * Math.cos(angle);
    const imag = magnitude * Math.sin(angle);
    return new Complex(real, imag);
  };

  /**
   * 创建单位复数（模长为1）
   * @param angle 角度（弧度）
   * @returns 单位复数
   */
  export const unit = (angle: number): Complex => {
    return fromPolar(1, angle);
  };

  /**
   * 创建纯实数复数
   * @param real 实部值
   * @returns 纯实数复数
   */
  export const real = (real: number): Complex => {
    return new Complex(real, 0);
  };

  /**
   * 创建纯虚数复数
   * @param imag 虚部值
   * @returns 纯虚数复数
   */
  export const imag = (imag: number): Complex => {
    return new Complex(0, imag);
  };

  /**
   * 计算复数的指数函数 e^z
   * @param z 输入复数
   * @returns 结果复数
   */
  export const exp = (z: Complex): Complex => {
    const magnitude = Math.exp(z.real);
    const real = magnitude * Math.cos(z.imag);
    const imag = magnitude * Math.sin(z.imag);
    return new Complex(real, imag);
  };

  /**
   * 计算复数的自然对数
   * @param z 输入复数
   * @returns 结果复数
   */
  export const log = (z: Complex): Complex => {
    const magnitude = z.magnitude();
    const angle = z.arg();
    return new Complex(Math.log(magnitude), angle);
  };

  /**
   * 计算复数的幂
   * @param z 底数复数
   * @param w 指数复数
   * @returns 结果复数
   */
  export const pow = (z: Complex, w: Complex): Complex => {
    if (z.magnitude() === 0) return new Complex(0, 0);
    return exp(mul(log(z), w));
  };

  /**
   * 计算两个复数的和
   * @param a 第一个复数
   * @param b 第二个复数
   * @returns 和复数
   */
  export const add = (a: Complex, b: Complex): Complex => {
    return a.add(b);
  };

  /**
   * 计算两个复数的差
   * @param a 第一个复数
   * @param b 第二个复数
   * @returns 差复数
   */
  export const sub = (a: Complex, b: Complex): Complex => {
    return a.sub(b);
  };

  /**
   * 计算两个复数的积
   * @param a 第一个复数
   * @param b 第二个复数
   * @returns 积复数
   */
  export const mul = (a: Complex, b: Complex): Complex => {
    return a.mul(b);
  };

  /**
   * 计算两个复数的商
   * @param a 被除数复数
   * @param b 除数复数
   * @returns 商复数
   */
  export const div = (a: Complex, b: Complex): Complex => {
    return a.div(b);
  };

  /**
   * 计算复数的正弦值
   * @param z 输入复数
   * @returns 结果复数
   */
  export const sin = (z: Complex): Complex => {
    const real = Math.sin(z.real) * Math.cosh(z.imag);
    const imag = Math.cos(z.real) * Math.sinh(z.imag);
    return new Complex(real, imag);
  };

  /**
   * 计算复数的余弦值
   * @param z 输入复数
   * @returns 结果复数
   */
  export const cos = (z: Complex): Complex => {
    const real = Math.cos(z.real) * Math.cosh(z.imag);
    const imag = -Math.sin(z.real) * Math.sinh(z.imag);
    return new Complex(real, imag);
  };

  /**
   * 计算复数的正切值
   * @param z 输入复数
   * @returns 结果复数
   */
  export const tan = (z: Complex): Complex => {
    return div(sin(z), cos(z));
  };

  /**
   * 计算复数的双曲正弦值
   * @param z 输入复数
   * @returns 结果复数
   */
  export const sinh = (z: Complex): Complex => {
    const real = Math.sinh(z.real) * Math.cos(z.imag);
    const imag = Math.cosh(z.real) * Math.sin(z.imag);
    return new Complex(real, imag);
  };

  /**
   * 计算复数的双曲余弦值
   * @param z 输入复数
   * @returns 结果复数
   */
  export const cosh = (z: Complex): Complex => {
    const real = Math.cosh(z.real) * Math.cos(z.imag);
    const imag = Math.sinh(z.real) * Math.sin(z.imag);
    return new Complex(real, imag);
  };

  /**
   * 计算两个复数之间的距离
   * @param a 第一个复数
   * @param b 第二个复数
   * @returns 距离值
   */
  export const distance = (a: Complex, b: Complex): number => {
    const dr = a.real - b.real;
    const di = a.imag - b.imag;
    return Math.sqrt(dr * dr + di * di);
  };

  /**
   * 计算复数的相位差（弧度）
   * @param a 第一个复数
   * @param b 第二个复数
   * @returns 相位差
   */
  export const phaseDifference = (a: Complex, b: Complex): number => {
    return a.arg() - b.arg();
  };

  /**
   * 复数的线性插值
   * @param a 起始复数
   * @param b 结束复数
   * @param t 插值因子（0-1）
   * @returns 插值结果
   */
  export const lerp = (a: Complex, b: Complex, t: number): Complex => {
    const real = a.real + (b.real - a.real) * t;
    const imag = a.imag + (b.imag - a.imag) * t;
    return new Complex(real, imag);
  };
  export const fromRotation = (angle: number): Complex => {
    return new Complex(Math.cos(angle), Math.sin(angle));
  };
  /**
   * 复数旋转
   * @param z 输入复数
   * @param angle 旋转角度（弧度）
   * @returns 旋转结果
   */
  export const rotate = (z: Complex, angle: number): Complex => {
    return  z.mul(Complex.fromRotation(angle))
  };
}

export { Complex, complex };