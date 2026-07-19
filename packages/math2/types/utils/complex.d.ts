/**复数 */
/** 复数类，支持基本运算 */
declare class Complex {
    /** 实部 */
    real: number;
    /** 虚部 */
    imag: number;
    /**
     * 构造一个复数
     * @param real 实部
     * @param imag 虚部
     */
    constructor(real: number, imag: number);
    /** 返回共轭复数 */
    conjugate(): Complex;
    /** 返回模长 */
    magnitude(): number;
    /** 返回幅角（弧度） */
    arg(): number;
    /**
     * 复数加法
     * @param other 另一个复数
     * @returns 新的复数结果
     */
    add(other: Complex): Complex;
    /**
     * 复数减法
     * @param other 另一个复数
     * @returns 新的复数结果
     */
    sub(other: Complex): Complex;
    /**
     * (a+bi)(c+di)=ac+adi+bci+bdi^2=ac+(ad+bc)i+bd*(-1)=(ac-bd)+(ad+bc)i
     * 复数乘法
     * @param other 另一个复数
     * @returns 新的复数结果
     */
    mul(other: Complex): Complex;
    /**
     * 复数除法
     * @param other 另一个复数
     * @returns 新的复数结果
     * @throws 当除数为 0 时抛出错误
     */
    div(other: Complex): Complex;
    /** 返回形如 "a+bi" 的字符串 */
    toString(): string;
    /**
     * 计算复数的幂
     * @param exponent 指数
     * @returns 结果复数
     */
    pow(exponent: number | Complex): Complex;
    /**
     * 计算复数的平方根
     * @returns 结果复数（主值）
     */
    sqrt(): Complex;
    /**
     * 计算复数的指数函数 e^z
     * @returns 结果复数
     */
    exp(): Complex;
    /**
     * 计算复数的自然对数
     * @returns 结果复数（主值）
     */
    log(): Complex;
    /**
     * 计算复数的正弦值
     * @returns 结果复数
     */
    sin(): Complex;
    /**
     * 计算复数的余弦值
     * @returns 结果复数
     */
    cos(): Complex;
    /**
     * 计算复数的正切值
     * @returns 结果复数
     */
    tan(): Complex;
    /**
     * 计算复数的双曲正弦值
     * @returns 结果复数
     */
    sinh(): Complex;
    /**
     * 计算复数的双曲余弦值
     * @returns 结果复数
     */
    cosh(): Complex;
    /**
     * 计算复数的双曲正切值
     * @returns 结果复数
     */
    tanh(): Complex;
    /**
     * 归一化复数（将模长变为1）
     * @returns 归一化后的复数
     */
    normalize(): Complex;
    /**
     * 旋转复数
     * @param angle 旋转角度（弧度）
     * @returns 旋转后的复数
     */
    rotate(angle: number): Complex;
    /**
     * 缩放复数
     * @param scale 缩放因子
     * @returns 缩放后的复数
     */
    scale(scale: number): Complex;
    /**
     * 与实数相乘
     * @param scalar 实数值
     * @returns 结果复数
     */
    multiplyByScalar(scalar: number): Complex;
    /**
     * 四舍五入复数的实部和虚部
     * @param digits 保留的小数位数
     * @returns 四舍五入后的复数
     */
    round(digits?: number): Complex;
}
/** 工具函数：创建复数 */
declare const complex: (real: number, imag: number) => Complex;
/** 复数类的静态方法和扩展功能 */
declare namespace Complex {
    /**
     * 从极坐标创建复数
     * @param magnitude 模长
     * @param angle 角度（弧度）
     * @returns 新的复数
     */
    const fromPolar: (magnitude: number, angle: number) => Complex;
    /**
     * 创建单位复数（模长为1）
     * @param angle 角度（弧度）
     * @returns 单位复数
     */
    const unit: (angle: number) => Complex;
    /**
     * 创建纯实数复数
     * @param real 实部值
     * @returns 纯实数复数
     */
    const real: (real: number) => Complex;
    /**
     * 创建纯虚数复数
     * @param imag 虚部值
     * @returns 纯虚数复数
     */
    const imag: (imag: number) => Complex;
    /**
     * 计算复数的指数函数 e^z
     * @param z 输入复数
     * @returns 结果复数
     */
    const exp: (z: Complex) => Complex;
    /**
     * 计算复数的自然对数
     * @param z 输入复数
     * @returns 结果复数
     */
    const log: (z: Complex) => Complex;
    /**
     * 计算复数的幂
     * @param z 底数复数
     * @param w 指数复数
     * @returns 结果复数
     */
    const pow: (z: Complex, w: Complex) => Complex;
    /**
     * 计算两个复数的和
     * @param a 第一个复数
     * @param b 第二个复数
     * @returns 和复数
     */
    const add: (a: Complex, b: Complex) => Complex;
    /**
     * 计算两个复数的差
     * @param a 第一个复数
     * @param b 第二个复数
     * @returns 差复数
     */
    const sub: (a: Complex, b: Complex) => Complex;
    /**
     * 计算两个复数的积
     * @param a 第一个复数
     * @param b 第二个复数
     * @returns 积复数
     */
    const mul: (a: Complex, b: Complex) => Complex;
    /**
     * 计算两个复数的商
     * @param a 被除数复数
     * @param b 除数复数
     * @returns 商复数
     */
    const div: (a: Complex, b: Complex) => Complex;
    /**
     * 计算复数的正弦值
     * @param z 输入复数
     * @returns 结果复数
     */
    const sin: (z: Complex) => Complex;
    /**
     * 计算复数的余弦值
     * @param z 输入复数
     * @returns 结果复数
     */
    const cos: (z: Complex) => Complex;
    /**
     * 计算复数的正切值
     * @param z 输入复数
     * @returns 结果复数
     */
    const tan: (z: Complex) => Complex;
    /**
     * 计算复数的双曲正弦值
     * @param z 输入复数
     * @returns 结果复数
     */
    const sinh: (z: Complex) => Complex;
    /**
     * 计算复数的双曲余弦值
     * @param z 输入复数
     * @returns 结果复数
     */
    const cosh: (z: Complex) => Complex;
    /**
     * 计算两个复数之间的距离
     * @param a 第一个复数
     * @param b 第二个复数
     * @returns 距离值
     */
    const distance: (a: Complex, b: Complex) => number;
    /**
     * 计算复数的相位差（弧度）
     * @param a 第一个复数
     * @param b 第二个复数
     * @returns 相位差
     */
    const phaseDifference: (a: Complex, b: Complex) => number;
    /**
     * 复数的线性插值
     * @param a 起始复数
     * @param b 结束复数
     * @param t 插值因子（0-1）
     * @returns 插值结果
     */
    const lerp: (a: Complex, b: Complex, t: number) => Complex;
    const fromRotation: (angle: number) => Complex;
    /**
     * 复数旋转
     * @param z 输入复数
     * @param angle 旋转角度（弧度）
     * @returns 旋转结果
     */
    const rotate: (z: Complex, angle: number) => Complex;
}
export { Complex, complex };
