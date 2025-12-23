/** 四元数 一个实部和三个虚部组成，通常用于表示3D旋转。
 * (w,x,y,z) xi + yj + zk 其中 i, j, k 分别代表虚部 x, y, z，w 为实部。
  i^2 = j^2 = k^2 = -1
  i*j=k
  j*i=-k
  j*k = i
  k*j=-i
  k*i=j
  i*k=-j
 * 
 */
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
   * 获取共轭四元数
   * @returns 共轭四元数
   */
  conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  /**
   * 获取四元数的逆
   * @returns 逆四元数
   */
  inverse(): Quaternion {
    const magSq = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
    if (magSq === 0) return new Quaternion(1, 0, 0, 0); // 返回单位四元数
    
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
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * w * z,     2 * x * z + 2 * w * y,     0,
      2 * x * y + 2 * w * z,     1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * w * x,     0,
      2 * x * z - 2 * w * y,     2 * y * z + 2 * w * x,     1 - 2 * x * x - 2 * y * y, 0,
      0,                         0,                         0,                         1
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
}

export { Quaternion, quaternion };