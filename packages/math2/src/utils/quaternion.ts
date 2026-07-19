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


class Quaternion {
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
  constructor(w: number = 1, x: number = 0, y: number = 0, z: number = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get xyz(){
    return {x:this.x,y:this.y,z:this.z}
  }
  /**
   * 获取四元数的模长
   * @returns 模长值
   */
  magnitude(): number {
    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * 归一化四元数
   * @returns 归一化后的四元数
   */
  normalize(): Quaternion {
    const mag = this.magnitude();
    if (mag === 0) return new Quaternion(1, 0, 0, 0); // 返回单位四元数
    return new Quaternion(
      this.w / mag,
      this.x / mag,
      this.y / mag,
      this.z / mag
    );
  }

  /**
   * 共轭(对于单位四元数)=逆
   * 获取共轭四元数 
   * @returns 共轭四元数
   */
  conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  /**
   * 获取四元数的逆
   * q^-1 = conj(q) / |q|^2
   * @returns 逆四元数
   */
  inverse(): Quaternion {
    const magSq = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
    if (magSq === 0) return new Quaternion(1, 0, 0, 0); // 返回单位四元数
    // 共轭乘以模长的倒数即为逆四元数，但要先确保模长不为0。如果为0则返回单位四元数作为默认值。
    const invMagSq = 1 / magSq;
    return new Quaternion(
      this.w * invMagSq,
      -this.x * invMagSq,
      -this.y * invMagSq,
      -this.z * invMagSq
    );
  }

  /**
   * 四元数加法
   * @param other 另一个四元数
   * @returns 结果四元数
   */
  add(other: Quaternion): Quaternion {
    return new Quaternion(
      this.w + other.w,
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  /**
   * 四元数减法
   * @param other 另一个四元数
   * @returns 结果四元数
   */
  sub(other: Quaternion): Quaternion {
    return new Quaternion(
      this.w - other.w,
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  /**
   * 四元数乘法（哈密尔顿积）
   * @param other 另一个四元数
   * @returns 结果四元数
   */
  mul(other: Quaternion): Quaternion {
    const w = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z;
    const x = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y;
    const y = this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x;
    const z = this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w;
    return new Quaternion(w, x, y, z);
  }
  /**
   * 四元数与实数相乘
   * @param scalar 实数值
   * @returns 结果四元数
   */
  multiplyByScalar(scalar: number): Quaternion {
    return new Quaternion(
      this.w * scalar,
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  /**
   * 应用四元数旋转到向量
   * @param x 向量 x 分量
   * @param y 向量 y 分量
   * @param z 向量 z 分量
   * @returns 旋转后的向量 [x, y, z]
   */
  rotateVector(x: number, y: number, z: number): [number, number, number] {
    // 创建纯四元数 p = 0 + xi + yj + zk
    const p = new Quaternion(0, x, y, z);

    // 计算 q * p * q^{-1}
    const qInv = this.inverse();
    const result = this.mul(p).mul(qInv);

    return [result.x, result.y, result.z];
  }

  /**
   * 获取四元数表示的旋转角度（弧度）
   * @returns 旋转角度
   */
  getAngle(): number {
    // 确保四元数是归一化的
    const norm = this.normalize();
    return 2 * Math.acos(norm.w);
  }

  /**
   * 获取四元数表示的旋转轴
   * @returns 旋转轴 [x, y, z]
   */
  getAxis(): [number, number, number] {
    const norm = this.normalize();
    const sinHalfAngle = Math.sin(Math.acos(norm.w));

    if (sinHalfAngle === 0) return [1, 0, 0]; // 旋转角度为0，任意轴都可以

    return [
      norm.x / sinHalfAngle,
      norm.y / sinHalfAngle,
      norm.z / sinHalfAngle
    ];
  }

  /**
   * 转换为旋转矩阵（4x4）
   * @returns 4x4旋转矩阵
   */
  toMatrix4(): number[] {
    const norm = this.normalize();
    const { w, x, y, z } = norm;

    return [
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * w * z, 2 * x * z + 2 * w * y, 0,
      2 * x * y + 2 * w * z, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * w * x, 0,
      2 * x * z - 2 * w * y, 2 * y * z + 2 * w * x, 1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ];
  }

  /**
   * 转换为字符串表示
   * @returns 字符串表示
   */
  toString(): string {
    return `Quaternion(${this.w}, ${this.x}, ${this.y}, ${this.z})`;
  }
}

/** 工具函数：创建四元数 */
const quaternion = (w: number = 1, x: number = 0, y: number = 0, z: number = 0): Quaternion => {
  return new Quaternion(w, x, y, z);
};

/** 四元数的静态方法和工具函数 */
namespace Quaternion {
  
  /**
   * 创建单位四元数（无旋转）
   * @returns 单位四元数
   */
  export const identity = (): Quaternion => {
    return new Quaternion(1, 0, 0, 0);
  };
  /**
   * 纯四元数（无旋转，但有非零虚部）
   */
  export const pure = (x: number, y: number, z: number): Quaternion => {
    return new Quaternion(0, x, y, z);
  };
  /**
   * 从旋转轴和角度创建四元数
   * @param x 轴 x 分量
   * @param y 轴 y 分量
   * @param z 轴 z 分量
   * @param angle 旋转角度（弧度）
   * @returns 四元数
   */
  export const fromAxisAngle = (x: number, y: number, z: number, angle: number): Quaternion => {
    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin(halfAngle);
    const cosHalfAngle = Math.cos(halfAngle);

    // 归一化轴
    const length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0) return identity();

    const normX = x / length;
    const normY = y / length;
    const normZ = z / length;

    return new Quaternion(
      cosHalfAngle,
      normX * sinHalfAngle,
      normY * sinHalfAngle,
      normZ * sinHalfAngle
    );
  };
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
  export const fromEulerOrder=(euler:{x:number,y:number,z:number},order:string='xyz')=>{
    const a=Quaternion.fromAxisAngle(1,0,0,euler.x)
    const b=Quaternion.fromAxisAngle(0,1,0,euler.y)
    const c=Quaternion.fromAxisAngle(0,0,1,euler.z)
    const axis=[a,b,c]
    const orders=order.split('').map(v=>({x:0,y:1,z:2}[v]))
//
    let result=axis[orders[axis.length-1]];
    for(let i=axis.length-2;i>=0;i--){
      result=Quaternion.mul(axis[i],result)
    }
    return result
  }

  /**
   * 欧拉角转四元数的过程非常直观，本质上是将三次绕固定轴的旋转（欧拉角）合并为一次等效的旋转（四元数）。
   * 其核心是分别构造绕X、Y、Z轴旋转的四元数，然后按顺序相乘。
   * 从欧拉角创建四元数（Z-Y-X顺序，即yaw-pitch-roll）
   * @param yaw 偏航角（弧度，绕Y轴）
   * @param pitch 俯仰角（弧度，绕X轴）
   * @param roll 滚转角（弧度，绕Z轴）
   * @returns 四元数
   */
  export const fromEuler = (yaw: number, pitch: number, roll: number): Quaternion => {
    const halfYaw = yaw / 2;
    const halfPitch = pitch / 2;
    const halfRoll = roll / 2;

    const cosYaw = Math.cos(halfYaw);
    const sinYaw = Math.sin(halfYaw);
    const cosPitch = Math.cos(halfPitch);
    const sinPitch = Math.sin(halfPitch);
    const cosRoll = Math.cos(halfRoll);
    const sinRoll = Math.sin(halfRoll);
    // 2. 分别构造绕各轴旋转的四元数
    // 绕X轴旋转roll：q_x = [sin(roll/2), 0, 0, cos(roll/2)]
    // 绕Y轴旋转pitch：q_y = [0, sin(pitch/2), 0, cos(pitch/2)]
    // 绕Z轴旋转yaw：q_z = [0, 0, sin(yaw/2), cos(yaw/2)]

    return new Quaternion(
      cosYaw * cosPitch * cosRoll + sinYaw * sinPitch * sinRoll,
      cosYaw * cosPitch * sinRoll - sinYaw * sinPitch * cosRoll,
      cosYaw * sinPitch * cosRoll + sinYaw * cosPitch * sinRoll,
      sinYaw * cosPitch * cosRoll - cosYaw * sinPitch * sinRoll
    );
  };

  /**
   * 球面线性插值（Slerp）
   * @param a 起始四元数
   * @param b 结束四元数
   * @param t 插值因子（0-1）
   * @returns 插值结果
   */
  export const slerp = (a: Quaternion, b: Quaternion, t: number): Quaternion => {
    const normA = a.normalize();
    let normB = b.normalize();

    // 计算点积
    let dot = normA.w * normB.w + normA.x * normB.x + normA.y * normB.y + normA.z * normB.z;

    // 确保我们选择最短路径
    if (dot < 0) {
      dot = -dot;
      normB = normB.multiplyByScalar(-1);
    }

    // 避免数值不稳定
    if (dot > 0.9995) {
      // 使用线性插值
      const result = normA.add(normB.sub(normA).multiplyByScalar(t));
      return result.normalize();
    }

    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);

    const weightA = Math.sin((1 - t) * theta) / sinTheta;
    const weightB = Math.sin(t * theta) / sinTheta;

    return normA.multiplyByScalar(weightA).add(normB.multiplyByScalar(weightB));
  };

  /**
   * 计算两个四元数之间的距离
   * @param a 第一个四元数
   * @param b 第二个四元数
   * @returns 距离值
   */
  export const distance = (a: Quaternion, b: Quaternion): number => {
    const diff = a.sub(b);
    return diff.magnitude();
  };

  /**
   * 计算两个四元数的点积
   * @param a 第一个四元数
   * @param b 第二个四元数
   * @returns 点积结果
   */
  export const dot = (a: Quaternion, b: Quaternion): number => {
    return a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
  };

  /**
   * 四元数乘法（静态方法）
   * @param a 第一个四元数
   * @param b 第二个四元数
   * @returns 结果四元数
   */
  export const mul = (a: Quaternion, b: Quaternion): Quaternion => {
    return a.mul(b);
  };

  export const toMat3=(q:Quaternion):number[]=>{
    const mat:number[]=[]
    // 绕
    mat[0]
    return mat
  }

    /**
     * 将单位四元数转换为 3x3 旋转矩阵
     * @param q 单位四元数 [x, y, z, w]
     * @returns 3x3 旋转矩阵 (列主序)
     */
    export const quaternionToMatrix=(q: Quaternion): number[]=> {
        const {x, y, z, w} = q;
        
        // 计算常用中间值（优化性能）
        const xx = x * x, yy = y * y, zz = z * z;
        const xy = x * y, xz = x * z, yz = y * z;
        const wx = w * x, wy = w * y, wz = w * z;
        
        // 列主序：矩阵的列是旋转后的基向量
        //let xColumn=Quaternion.rotateVectorByQuaternion(q,{x:1,y:0,z:0})
        //let yColumn=Quaternion.rotateVectorByQuaternion(q,{x:0,y:1,z:0})
       //  let zColumn=Quaternion.rotateVectorByQuaternion(q,{x:0,y:0,z:1})
        return [
            // 第一列：旋转后的 X 轴
            1 - 2 * (yy + zz),
            2 * (xy + wz),
            2 * (xz - wy),
            
            // 第二列：旋转后的 Y 轴
            2 * (xy - wz),
            1 - 2 * (xx + zz),
            2 * (yz + wx),
            
            // 第三列：旋转后的 Z 轴
            2 * (xz + wy),
            2 * (yz - wx),
            1 - 2 * (xx + yy)
        ];
    }
 /**
     * 将 3x3 旋转矩阵转换为单位四元数
     * 使用数值稳定的方法，避免除零和精度损失
     * @param m 3x3 旋转矩阵 (列主序)
     * @returns 单位四元数 [x, y, z, w]
     */
    export const matrixToQuaternion=(m: number[]): Quaternion=> {
        // 从列主序数组中提取矩阵元素
        const [m00, m10, m20, m01, m11, m21, m02, m12, m22] = m;
        
        let x: number, y: number, z: number, w: number;
        
        // 计算矩阵的迹 (trace)
        const trace = m00 + m11 + m22;
        
        if (trace > 0) {
            // 迹 > 0 的情况（数值最稳定）
            const s = Math.sqrt(trace + 1.0) * 2;
            w = 0.25 * s;
            x = (m21 - m12) / s;
            y = (m02 - m20) / s;
            z = (m10 - m01) / s;
        } else if ((m00 > m11) && (m00 > m22)) {
            // m00 是最大对角线元素
            const s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
            w = (m21 - m12) / s;
            x = 0.25 * s;
            y = (m01 + m10) / s;
            z = (m02 + m20) / s;
        } else if (m11 > m22) {
            // m11 是最大对角线元素
            const s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
            w = (m02 - m20) / s;
            x = (m01 + m10) / s;
            y = 0.25 * s;
            z = (m12 + m21) / s;
        } else {
            // m22 是最大对角线元素
            const s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
            w = (m10 - m01) / s;
            x = (m02 + m20) / s;
            y = (m12 + m21) / s;
            z = 0.25 * s;
        }
        
        // 归一化处理（应对数值误差）
        const length = Math.sqrt(x * x + y * y + z * z + w * w);
        if (length > 1e6) {
            return new Quaternion( w / length,x / length, y / length, z / length);
        }
        
        // 单位四元数（无旋转）
        return new Quaternion(1,0, 0, 0);
    }
 /**
     * 用四元数旋转向量
     * @param q 单位四元数
     * @param v 三维向量
     * @returns 旋转后的向量
     */
    export const rotateVectorByQuaternion=(q: Quaternion, v: {x:number,y:number,z:number}):  {x:number,y:number,z:number}=> {
        // 将向量转换为纯四元数
        const {x:qx, y:qy, z:qz, w:qw} = q;
        const {x:vx, y:vy, z:vz} = v;
        
        // 计算 q * v * q⁻¹ (q⁻¹ = 共轭，因为 q 是单位四元数)
        // t = 2 * cross(q.xyz, v)
        const tx = 2 * (qy * vz - qz * vy);
        const ty = 2 * (qz * vx - qx * vz);
        const tz = 2 * (qx * vy - qy * vx);
        
        // v' = v + qw * t + cross(q.xyz, t)
        return {
            x:vx + qw * tx + qy * tz - qz * ty,
            y:vy + qw * ty + qz * tx - qx * tz,
            z:vz + qw * tz + qx * ty - qy * tx
        };
    }

}

export { Quaternion, quaternion };