/** 四元数 一个实部和三个虚部组成，通常用于表示3D旋转。
 * (w,x,y,z) xi + yj + zk 其中 i, j, k 分别代表虚部 x, y, z，w 为实部。
四元数的乘法表推导出来，基于核心规则 i² = j² = k² = ijk = -1 以及推导出的：
ij = k, ji = -k
jk = i, kj = -i
ki = j, ik = -j

q1 = w1 + x1i + y1j + z1k = [w1,x1, y1, z1]
q2 = w2 + x2i + y2j + z2k = [s2,x2, y2, z2]
q1 * q2 =
w1w2+w1x2i+w1y2j+w1z2k +
x1w2i+x1x2i^2+x1y2ij+x1z2ik +
y1w2j+y1x2ji+y1y2j^2+y1z2jk +
z1w2k+z1x2ki+z1y2kj+z1z2k^2

合并同类项，可以得到：
w1* w2 - x1* x2 - y1*  y2 - z1*z2
w1*x2i + x1*w2i + y1*z2jk - z1*y2kj
w1*y2j + y1*w2j + z1*x2ki - x1*z2ik
w1*z2k + z1*w2k + x1*y2ij - y1*x2ji

q.w = w1*w2 - x1*x2 - y1*y2 - z1*z2
q.x = w1*x2 + x1*w2 + y1*z2 - z1*y2
q.y = w1*y2 - x1*z2 + y1*w2 + z1*x2
q.z = w1*z2 + x1*y2 - y1*x2 + z1*w2

vec4 multiplyQuaternions(vec4 q1, vec4 q2) {
    vec3 v1 = q1.xyz;
    vec3 v2 = q2.xyz;
    float s1 = q1.w;
    float s2 = q2.w;

    vec4 result;
    result.xyz = s1 * v2 + s2 * v1 + cross(v1, v2);
    result.w = s1 * s2 - dot(v1, v2);
    // 注意：此版本的 result.xyz 需要加上 cross(v1, v2)，已修正
    return result;
}
/** 四元数类，用于表示3D旋转 */
declare class Quaternion {
    /** 实部 w */
    w: number;
    /** 虚部 x */
    x: number;
    /** 虚部 y */
    y: number;
    /** 虚部 z */
    z: number;
    /**
     * 构造一个四元数
     * @param w 实部
     * @param x 虚部 x
     * @param y 虚部 y
     * @param z 虚部 z
     */
    constructor(w?: number, x?: number, y?: number, z?: number);
    get xyz(): {
        x: number;
        y: number;
        z: number;
    };
    /**
     * 获取四元数的模长
     * @returns 模长值
     */
    magnitude(): number;
    /**
     * 归一化四元数
     * @returns 归一化后的四元数
     */
    normalize(): Quaternion;
    /**
     * 共轭(对于单位四元数)=逆
     * 获取共轭四元数
     * @returns 共轭四元数
     */
    conjugate(): Quaternion;
    /**
     * 获取四元数的逆
     * q^-1 = conj(q) / |q|^2
     * @returns 逆四元数
     */
    inverse(): Quaternion;
    /**
     * 四元数加法
     * @param other 另一个四元数
     * @returns 结果四元数
     */
    add(other: Quaternion): Quaternion;
    /**
     * 四元数减法
     * @param other 另一个四元数
     * @returns 结果四元数
     */
    sub(other: Quaternion): Quaternion;
    /**
     * 四元数乘法（哈密尔顿积）
     * @param other 另一个四元数
     * @returns 结果四元数
     */
    mul(other: Quaternion): Quaternion;
    /**
     * 四元数与实数相乘
     * @param scalar 实数值
     * @returns 结果四元数
     */
    multiplyByScalar(scalar: number): Quaternion;
    /**
     * 应用四元数旋转到向量
     * @param x 向量 x 分量
     * @param y 向量 y 分量
     * @param z 向量 z 分量
     * @returns 旋转后的向量 [x, y, z]
     */
    rotateVector(x: number, y: number, z: number): [number, number, number];
    /**
     * 获取四元数表示的旋转角度（弧度）
     * @returns 旋转角度
     */
    getAngle(): number;
    /**
     * 获取四元数表示的旋转轴
     * @returns 旋转轴 [x, y, z]
     */
    getAxis(): [number, number, number];
    /**
     * 转换为旋转矩阵（4x4）
     * @returns 4x4旋转矩阵
     */
    toMatrix4(): number[];
    /**
     * 转换为字符串表示
     * @returns 字符串表示
     */
    toString(): string;
}
/** 工具函数：创建四元数 */
declare const quaternion: (w?: number, x?: number, y?: number, z?: number) => Quaternion;
/** 四元数的静态方法和工具函数 */
declare namespace Quaternion {
    /**
     * 创建单位四元数（无旋转）
     * @returns 单位四元数
     */
    const identity: () => Quaternion;
    /**
     * 纯四元数（无旋转，但有非零虚部）
     */
    const pure: (x: number, y: number, z: number) => Quaternion;
    /**
     * 从旋转轴和角度创建四元数
     * @param x 轴 x 分量
     * @param y 轴 y 分量
     * @param z 轴 z 分量
     * @param angle 旋转角度（弧度）
     * @returns 四元数
     */
    const fromAxisAngle: (x: number, y: number, z: number, angle: number) => Quaternion;
    /**
     * cx=cos(euler.x/2)
     * sx=sin(euler.x/2)
     * cy=cos(euler.y/2)
     * sy=sin(euler.y/2)
     * cz=cos(euler.z/2)
     *
     * xyz
     * [
     *  sx,   0    0
     *  0,    sy   0
     *  0,    0,   sz
     *  cx    cy   cz
     * ]
     * w=cx*cy*cz-sx*sy*sz
       x=cx*sy*sz+cy*cz*sx
       y=cx*cz*sy-sx*cy*sz
       z=cx*cy*sz+sx*cz*sy
     *
     */
    const fromEulerOrder: (euler: {
        x: number;
        y: number;
        z: number;
    }, order?: string) => Quaternion;
    /**
     * 欧拉角转四元数的过程非常直观，本质上是将三次绕固定轴的旋转（欧拉角）合并为一次等效的旋转（四元数）。
     * 其核心是分别构造绕X、Y、Z轴旋转的四元数，然后按顺序相乘。
     * 从欧拉角创建四元数（Z-Y-X顺序，即yaw-pitch-roll）
     * @param yaw 偏航角（弧度，绕Y轴）
     * @param pitch 俯仰角（弧度，绕X轴）
     * @param roll 滚转角（弧度，绕Z轴）
     * @returns 四元数
     */
    const fromEuler: (yaw: number, pitch: number, roll: number) => Quaternion;
    /**
     * 球面线性插值（Slerp）
     * @param a 起始四元数
     * @param b 结束四元数
     * @param t 插值因子（0-1）
     * @returns 插值结果
     */
    const slerp: (a: Quaternion, b: Quaternion, t: number) => Quaternion;
    /**
     * 计算两个四元数之间的距离
     * @param a 第一个四元数
     * @param b 第二个四元数
     * @returns 距离值
     */
    const distance: (a: Quaternion, b: Quaternion) => number;
    /**
     * 计算两个四元数的点积
     * @param a 第一个四元数
     * @param b 第二个四元数
     * @returns 点积结果
     */
    const dot: (a: Quaternion, b: Quaternion) => number;
    /**
     * 四元数乘法（静态方法）
     * @param a 第一个四元数
     * @param b 第二个四元数
     * @returns 结果四元数
     */
    const mul: (a: Quaternion, b: Quaternion) => Quaternion;
    const toMat3: (q: Quaternion) => number[];
    /**
     * 将单位四元数转换为 3x3 旋转矩阵
     * @param q 单位四元数 [x, y, z, w]
     * @returns 3x3 旋转矩阵 (列主序)
     */
    const quaternionToMatrix: (q: Quaternion) => number[];
    /**
        * 将 3x3 旋转矩阵转换为单位四元数
        * 使用数值稳定的方法，避免除零和精度损失
        * @param m 3x3 旋转矩阵 (列主序)
        * @returns 单位四元数 [x, y, z, w]
        */
    const matrixToQuaternion: (m: number[]) => Quaternion;
    /**
        * 用四元数旋转向量
        * @param q 单位四元数
        * @param v 三维向量
        * @returns 旋转后的向量
        */
    const rotateVectorByQuaternion: (q: Quaternion, v: {
        x: number;
        y: number;
        z: number;
    }) => {
        x: number;
        y: number;
        z: number;
    };
}
export { Quaternion, quaternion };
