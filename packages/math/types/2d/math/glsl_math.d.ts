/**
 * GLSL 内置函数的 TypeScript 实现
 * 包含 GLSL 2.0 和 3.0 中常见的数学、几何和工具函数
 */
type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type Mat2 = [Vec2, Vec2];
type Mat3 = [Vec3, Vec3, Vec3];
type Mat4 = [Vec4, Vec4, Vec4, Vec4];
declare class GLSLFunctions {
    /**
     * 将角度转换为弧度:cite[1]:cite[10]
     */
    static radians(degrees: number): number;
    static radians(degrees: Vec2): Vec2;
    static radians(degrees: Vec3): Vec3;
    static radians(degrees: Vec4): Vec4;
    /**
     * 将弧度转换为角度:cite[1]:cite[10]
     */
    static degrees(radians: number): number;
    static degrees(radians: Vec2): Vec2;
    static degrees(radians: Vec3): Vec3;
    static degrees(radians: Vec4): Vec4;
    /**
     * 正弦函数:cite[1]:cite[10]
     */
    static sin(angle: number): number;
    static sin(angle: Vec2): Vec2;
    static sin(angle: Vec3): Vec3;
    static sin(angle: Vec4): Vec4;
    /**
     * 余弦函数:cite[1]:cite[10]
     */
    static cos(angle: number): number;
    static cos(angle: Vec2): Vec2;
    static cos(angle: Vec3): Vec3;
    static cos(angle: Vec4): Vec4;
    /**
     * 正切函数:cite[1]:cite[10]
     */
    static tan(angle: number): number;
    static tan(angle: Vec2): Vec2;
    static tan(angle: Vec3): Vec3;
    static tan(angle: Vec4): Vec4;
    /**
     * 反正弦函数:cite[1]:cite[10]
     */
    static asin(x: number): number;
    static asin(x: Vec2): Vec2;
    static asin(x: Vec3): Vec3;
    static asin(x: Vec4): Vec4;
    /**
     * 反余弦函数:cite[1]:cite[10]
     */
    static acos(x: number): number;
    static acos(x: Vec2): Vec2;
    static acos(x: Vec3): Vec3;
    static acos(x: Vec4): Vec4;
    /**
     * 反正切函数:cite[1]:cite[10]
     * 可以接受一个参数或两个参数
     */
    static atan(y: number, x?: number): number;
    static atan(y: Vec2, x?: Vec2): Vec2;
    static atan(y: Vec3, x?: Vec3): Vec3;
    static atan(y: Vec4, x?: Vec4): Vec4;
    /**
     * 返回 x 的 y 次幂:cite[4]:cite[10]
     */
    static pow(x: number, y: number): number;
    static pow(x: Vec2, y: Vec2): Vec2;
    static pow(x: Vec3, y: Vec3): Vec3;
    static pow(x: Vec4, y: Vec4): Vec4;
    /**
     * 返回 e 的 x 次幂:cite[4]:cite[10]
     */
    static exp(x: number): number;
    static exp(x: Vec2): Vec2;
    static exp(x: Vec3): Vec3;
    static exp(x: Vec4): Vec4;
    /**
     * 返回 x 的自然对数:cite[4]:cite[10]
     */
    static log(x: number): number;
    static log(x: Vec2): Vec2;
    static log(x: Vec3): Vec3;
    static log(x: Vec4): Vec4;
    /**
     * 返回 2 的 x 次幂:cite[4]:cite[10]
     */
    static exp2(x: number): number;
    static exp2(x: Vec2): Vec2;
    static exp2(x: Vec3): Vec3;
    static exp2(x: Vec4): Vec4;
    /**
     * 返回以 2 为底 x 的对数:cite[4]:cite[10]
     */
    static log2(x: number): number;
    static log2(x: Vec2): Vec2;
    static log2(x: Vec3): Vec3;
    static log2(x: Vec4): Vec4;
    /**
     * 返回 x 的平方根:cite[4]:cite[10]
     */
    static sqrt(x: number): number;
    static sqrt(x: Vec2): Vec2;
    static sqrt(x: Vec3): Vec3;
    static sqrt(x: Vec4): Vec4;
    /**
     * 返回 x 的平方根的倒数:cite[4]:cite[10]
     */
    static inversesqrt(x: number): number;
    static inversesqrt(x: Vec2): Vec2;
    static inversesqrt(x: Vec3): Vec3;
    static inversesqrt(x: Vec4): Vec4;
    /**
     * 返回 x 的绝对值:cite[4]:cite[10]
     */
    static abs(x: number): number;
    static abs(x: Vec2): Vec2;
    static abs(x: Vec3): Vec3;
    static abs(x: Vec4): Vec4;
    /**
     * 返回 x 的符号:cite[4]:cite[10]
     * 如果 x > 0 返回 1, x = 0 返回 0, x < 0 返回 -1
     */
    static sign(x: number): number;
    static sign(x: Vec2): Vec2;
    static sign(x: Vec3): Vec3;
    static sign(x: Vec4): Vec4;
    /**
     * 返回小于等于 x 的最大整数:cite[4]:cite[9]:cite[10]
     */
    static floor(x: number): number;
    static floor(x: Vec2): Vec2;
    static floor(x: Vec3): Vec3;
    static floor(x: Vec4): Vec4;
    /**
     * 返回大于等于 x 的最小整数:cite[4]:cite[9]:cite[10]
     */
    static ceil(x: number): number;
    static ceil(x: Vec2): Vec2;
    static ceil(x: Vec3): Vec3;
    static ceil(x: Vec4): Vec4;
    /**
     * 返回 x 的小数部分:cite[4]:cite[9]:cite[10]
     */
    static fract(x: number): number;
    static fract(x: Vec2): Vec2;
    static fract(x: Vec3): Vec3;
    static fract(x: Vec4): Vec4;
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
    /**
     * 返回向量 x 的长度:cite[4]:cite[10]
     */
    static length(x: number): number;
    static length(x: Vec2): number;
    static length(x: Vec3): number;
    static length(x: Vec4): number;
    /**
     * 返回点 p0 和 p1 之间的距离:cite[4]:cite[10]
     */
    static distance(p0: number, p1: number): number;
    static distance(p0: Vec2, p1: Vec2): number;
    static distance(p0: Vec3, p1: Vec3): number;
    static distance(p0: Vec4, p1: Vec4): number;
    /**
     * 返回向量 x 和 y 的点积:cite[4]:cite[10]
     */
    static dot(x: number, y: number): number;
    static dot(x: Vec2, y: Vec2): number;
    static dot(x: Vec3, y: Vec3): number;
    static dot(x: Vec4, y: Vec4): number;
    /**
     * 返回向量 x 的单位向量:cite[4]:cite[10]
     */
    static normalize(x: number): number;
    static normalize(x: Vec2): Vec2;
    static normalize(x: Vec3): Vec3;
    static normalize(x: Vec4): Vec4;
    /**
     * 反射向量计算:cite[4]:cite[10]
     * I: 入射向量，N: 法线向量（必须已归一化）
     */
    static reflect(I: Vec3, N: Vec3): Vec3;
    /**
     * 折射向量计算:cite[4]:cite[10]
     * I: 入射向量，N: 法线向量，eta: 折射率比值
     */
    static refract(I: Vec3, N: Vec3, eta: number): Vec3;
    /**
     * 矩阵分量乘法:cite[4]:cite[10]
     */
    static matrixCompMult(a: Mat2, b: Mat2): Mat2;
    static matrixCompMult(a: Mat3, b: Mat3): Mat3;
    static matrixCompMult(a: Mat4, b: Mat4): Mat4;
    /**
     * 矩阵转置:cite[4]
     */
    static transpose(m: Mat2): Mat2;
    static transpose(m: Mat3): Mat3;
    static transpose(m: Mat4): Mat4;
    /**
     * 一维随机函数:cite[2]:cite[8]
     */
    static random1(x: number): number;
    /**
     * 二维随机函数:cite[2]:cite[3]:cite[8]
     */
    static random2(st: Vec2): number;
    /**
     * 二维噪声函数（基于值噪声）:cite[2]
     */
    static noise2(st: Vec2): number;
    /**
     * 向量比较：小于:cite[10]
     */
    static lessThan(a: Vec2, b: Vec2): [boolean, boolean];
    static lessThan(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static lessThan(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 向量比较：小于等于:cite[10]
     */
    static lessThanEqual(a: Vec2, b: Vec2): [boolean, boolean];
    static lessThanEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static lessThanEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 向量比较：大于:cite[10]
     */
    static greaterThan(a: Vec2, b: Vec2): [boolean, boolean];
    static greaterThan(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static greaterThan(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 向量比较：大于等于:cite[10]
     */
    static greaterThanEqual(a: Vec2, b: Vec2): [boolean, boolean];
    static greaterThanEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static greaterThanEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 向量比较：等于:cite[10]
     */
    static equal(a: Vec2, b: Vec2): [boolean, boolean];
    static equal(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static equal(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 向量比较：不等于:cite[10]
     */
    static notEqual(a: Vec2, b: Vec2): [boolean, boolean];
    static notEqual(a: Vec3, b: Vec3): [boolean, boolean, boolean];
    static notEqual(a: Vec4, b: Vec4): [boolean, boolean, boolean, boolean];
    /**
     * 任意分量是否为真:cite[10]
     */
    static any(v: boolean[]): boolean;
    static any(v: [boolean, boolean]): boolean;
    static any(v: [boolean, boolean, boolean]): boolean;
    static any(v: [boolean, boolean, boolean, boolean]): boolean;
    /**
     * 所有分量是否为真:cite[10]
     */
    static all(v: boolean[]): boolean;
    static all(v: [boolean, boolean]): boolean;
    static all(v: [boolean, boolean, boolean]): boolean;
    static all(v: [boolean, boolean, boolean, boolean]): boolean;
    /**
     * 分量逻辑非:cite[10]
     */
    static not(v: boolean[]): boolean[];
    static not(v: [boolean, boolean]): [boolean, boolean];
    static not(v: [boolean, boolean, boolean]): [boolean, boolean, boolean];
    static not(v: [boolean, boolean, boolean, boolean]): [boolean, boolean, boolean, boolean];
    /**
     * 创建单位矩阵
     */
    static identity2(): Mat2;
    static identity3(): Mat3;
    static identity4(): Mat4;
    /**
     * 从对角线创建矩阵
     */
    static diagonal2(diag: Vec2): Mat2;
    static diagonal3(diag: Vec3): Mat3;
    static diagonal4(diag: Vec4): Mat4;
    /**
     * 矩阵加法
     */
    static add2(a: Mat2, b: Mat2): Mat2;
    static add3(a: Mat3, b: Mat3): Mat3;
    static add4(a: Mat4, b: Mat4): Mat4;
    /**
     * 矩阵减法
     */
    static subtract2(a: Mat2, b: Mat2): Mat2;
    static subtract3(a: Mat3, b: Mat3): Mat3;
    static subtract4(a: Mat4, b: Mat4): Mat4;
    /**
     * 矩阵标量乘法
     */
    static multiplyScalar2(m: Mat2, scalar: number): Mat2;
    static multiplyScalar3(m: Mat3, scalar: number): Mat3;
    static multiplyScalar4(m: Mat4, scalar: number): Mat4;
    /**
     * 矩阵乘法
     */
    static multiply2(a: Mat2, b: Mat2): Mat2;
    static multiply3(a: Mat3, b: Mat3): Mat3;
    static multiply4(a: Mat4, b: Mat4): Mat4;
    /**
     * 矩阵与向量乘法
     */
    static multiplyVector2(m: Mat2, v: Vec2): Vec2;
    static multiplyVector3(m: Mat3, v: Vec3): Vec3;
    static multiplyVector4(m: Mat4, v: Vec4): Vec4;
    /**
     * 矩阵转置
     */
    static transpose2(m: Mat2): Mat2;
    static transpose3(m: Mat3): Mat3;
    static transpose4(m: Mat4): Mat4;
    /**
     * 2x2 矩阵行列式
     */
    static determinant2(m: Mat2): number;
    /**
     * 3x3 矩阵行列式
     */
    static determinant3(m: Mat3): number;
    /**
     * 4x4 矩阵行列式 (使用拉普拉斯展开)
     */
    static determinant4(m: Mat4): number;
    /**
     * 2x2 矩阵求逆
     */
    static inverse2(m: Mat2): Mat2 | null;
    /**
     * 3x3 矩阵求逆
     */
    static inverse3(m: Mat3): Mat3 | null;
    /**
     * 4x4 矩阵求逆 (使用伴随矩阵法)
     */
    static inverse4(m: Mat4): Mat4 | null;
    /**
     * 平移矩阵
     */
    static translationMatrix(tx: number, ty: number, tz: number): Mat4;
    /**
     * 缩放矩阵
     */
    static scalingMatrix(sx: number, sy: number, sz: number): Mat4;
    /**
     * 绕 X 轴旋转矩阵
     */
    static rotationXMatrix(angle: number): Mat4;
    /**
     * 绕 Y 轴旋转矩阵
     */
    static rotationYMatrix(angle: number): Mat4;
    /**
     * 绕 Z 轴旋转矩阵
     */
    static rotationZMatrix(angle: number): Mat4;
    /**
     * 绕任意轴旋转矩阵 (罗德里格斯公式)
     */
    static rotationAxisMatrix(axis: Vec3, angle: number): Mat4;
    /**
     * 透视投影矩阵
     */
    static perspectiveMatrix(fov: number, aspect: number, near: number, far: number): Mat4;
    /**
     * 正交投影矩阵
     */
    static orthographicMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    /**
     * 视图矩阵 (lookAt)
     */
    static lookAtMatrix(eye: Vec3, center: Vec3, up: Vec3): Mat4;
    static normalizeVector3(v: Vec3): Vec3;
    static cross(a: Vec2, b: Vec2): number;
    static cross(a: Vec3, b: Vec3): Vec3;
    /**
     * 矩阵转换为字符串 (便于调试)
     */
    static matrixToString(m: Mat2 | Mat3 | Mat4): string;
    /**
     * 检查矩阵是否相等 (考虑浮点误差)
     */
    static matrixEquals(a: Mat2, b: Mat2, epsilon: number): boolean;
    static matrixEquals(a: Mat3, b: Mat3, epsilon: number): boolean;
    static matrixEquals(a: Mat4, b: Mat4, epsilon: number): boolean;
}
export default GLSLFunctions;
