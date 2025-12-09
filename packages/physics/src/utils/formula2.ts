/**
 * 公司级物理计算工具库
 * 包含经典物理公式、数值积分方法、单位转换等
 */

// ==================== 基础物理常量 ====================
export const PhysicsConstants = {
  // 通用常量
  GRAVITY: 9.81, // 地球重力加速度 (m/s²)
  SPEED_OF_LIGHT: 299792458, // 光速 (m/s)
  PLANCK_CONSTANT: 6.62607015e-34, // 普朗克常数 (J·s)
  BOLTZMANN_CONSTANT: 1.380649e-23, // 玻尔兹曼常数 (J/K)
  
  // 单位转换
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  
  // 动画相关
  STANDARD_FRAME_TIME: 1 / 60, // 60fps对应的帧时间
} as const;

// ==================== 向量数学 ====================
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export class VectorMath {
  // 二维向量运算
  static add(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  static subtract(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }

  static multiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static divide(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x / scalar, y: v.y / scalar };
  }

  static magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: Vector2D): Vector2D {
    const mag = this.magnitude(v);
    return mag > 0 ? this.divide(v, mag) : { x: 0, y: 0 };
  }

  static dot(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static cross(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.y - v1.y * v2.x;
  }

  static distance(v1: Vector2D, v2: Vector2D): number {
    return this.magnitude(this.subtract(v1, v2));
  }

  static angle(v1: Vector2D, v2: Vector2D): number {
    const dot = this.dot(v1, v2);
    const mag1 = this.magnitude(v1);
    const mag2 = this.magnitude(v2);
    return Math.acos(dot / (mag1 * mag2));
  }

  static rotate(v: Vector2D, angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos
    };
  }

  // 三维向量运算
  static add3(v1: Vector3D, v2: Vector3D): Vector3D {
    return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
  }

  static magnitude3(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }
}

// ==================== 运动学公式 ====================
export class Kinematics {
  /**
   * 匀加速直线运动公式
   */

  // 已知初速度、加速度、时间，求位移
  static displacement1(v0: number, a: number, t: number): number {
    return v0 * t + 0.5 * a * t * t;
  }

  // 已知初速度、末速度、时间，求位移
  static displacement2(v0: number, v: number, t: number): number {
    return 0.5 * (v0 + v) * t;
  }

  // 已知初速度、加速度、位移，求末速度
  static finalVelocity(v0: number, a: number, s: number): number {
    return Math.sqrt(v0 * v0 + 2 * a * s);
  }

  // 已知位移、初速度、加速度，求时间
  static timeFromDisplacement(s: number, v0: number = 0, a: number = 0): number[] {
    if (a === 0) {
      // 匀速运动
      return v0 !== 0 ? [s / v0] : [];
    }
    
    // 解二次方程: 0.5*a*t² + v0*t - s = 0
    const discriminant = v0 * v0 + 2 * a * s;
    
    if (discriminant < 0) {
      return []; // 无实数解
    }
    
    const sqrtDisc = Math.sqrt(discriminant);
    const t1 = (-v0 + sqrtDisc) / a;
    const t2 = (-v0 - sqrtDisc) / a;
    
    return [t1, t2].filter(t => t >= 0);
  }

  /**
   * 抛体运动
   */
  static projectileMotion(
    initialVelocity: number,
    launchAngle: number, // 弧度
    time: number,
    g: number = PhysicsConstants.GRAVITY
  ): { x: number; y: number; vx: number; vy: number } {
    const vx = initialVelocity * Math.cos(launchAngle);
    const vy = initialVelocity * Math.sin(launchAngle) - g * time;
    
    const x = vx * time;
    const y = initialVelocity * Math.sin(launchAngle) * time - 0.5 * g * time * time;
    
    return { x, y, vx, vy };
  }

  // 计算抛体运动的最高点
  static maxHeight(initialVelocity: number, launchAngle: number, g: number = PhysicsConstants.GRAVITY): number {
    const vy0 = initialVelocity * Math.sin(launchAngle);
    return (vy0 * vy0) / (2 * g);
  }

  // 计算抛体运动的射程
  static range(initialVelocity: number, launchAngle: number, g: number = PhysicsConstants.GRAVITY): number {
    return (initialVelocity * initialVelocity * Math.sin(2 * launchAngle)) / g;
  }

  /**
   * 圆周运动
   */
  static centripetalAcceleration(v: number, r: number): number {
    return (v * v) / r;
  }

  static angularVelocity(v: number, r: number): number {
    return v / r;
  }

  static periodFromRadius(r: number, g: number = PhysicsConstants.GRAVITY): number {
    return 2 * Math.PI * Math.sqrt(r / g);
  }
}

// ==================== 动力学公式 ====================
export class Dynamics {
  /**
   * 牛顿定律
   */
  
  // 牛顿第二定律: F = ma
  static forceFromMassAndAcceleration(m: number, a: number): number {
    return m * a;
  }

  static accelerationFromForceAndMass(F: number, m: number): number {
    return F / m;
  }

  static massFromForceAndAcceleration(F: number, a: number): number {
    return F / a;
  }

  /**
   * 动量
   */
  static momentum(m: number, v: number): number {
    return m * v;
  }

  static impulse(F: number, t: number): number {
    return F * t;
  }

  // 动量守恒
  static elasticCollision(
    m1: number, v1: number,
    m2: number, v2: number
  ): { v1Final: number; v2Final: number } {
    const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    
    return { v1Final, v2Final };
  }

  // 完全非弹性碰撞
  static inelasticCollision(
    m1: number, v1: number,
    m2: number, v2: number
  ): number {
    return (m1 * v1 + m2 * v2) / (m1 + m2);
  }

  /**
   * 能量
   */
  static kineticEnergy(m: number, v: number): number {
    return 0.5 * m * v * v;
  }

  static potentialEnergy(m: number, h: number, g: number = PhysicsConstants.GRAVITY): number {
    return m * g * h;
  }

  static springPotentialEnergy(k: number, x: number): number {
    return 0.5 * k * x * x;
  }

  // 机械能守恒
  static conservationOfEnergy(
    initialKE: number,
    initialPE: number,
    finalKE: number,
    finalPE: number
  ): boolean {
    const tolerance = 1e-6;
    return Math.abs((initialKE + initialPE) - (finalKE + finalPE)) < tolerance;
  }
}

// ==================== 弹簧-质量-阻尼系统 ====================
export interface SpringMassSystem {
  mass: number;           // 质量 (kg)
  stiffness: number;      // 弹簧刚度 (N/m)
  damping: number;        // 阻尼系数 (N·s/m)
  position: number;       // 当前位置 (m)
  velocity: number;       // 当前速度 (m/s)
  equilibrium: number;    // 平衡位置 (m)
}

export class SpringPhysics {
  /**
   * 计算临界阻尼系数
   * c_critical = 2 * √(m * k)
   */
  static criticalDamping(mass: number, stiffness: number): number {
    return 2 * Math.sqrt(mass * stiffness);
  }

  /**
   * 计算阻尼比 (ζ)
   * ζ = c / c_critical
   */
  static dampingRatio(damping: number, mass: number, stiffness: number): number {
    const critical = this.criticalDamping(mass, stiffness);
    return damping / critical;
  }

  /**
   * 判断系统状态
   * ζ < 1: 欠阻尼 (振荡衰减)
   * ζ = 1: 临界阻尼 (最快无振荡)
   * ζ > 1: 过阻尼 (缓慢无振荡)
   */
  static systemBehavior(damping: number, mass: number, stiffness: number): string {
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (Math.abs(zeta - 1) < 1e-6) return 'critical';
    if (zeta < 1) return 'underdamped';
    return 'overdamped';
  }

  /**
   * 计算自然频率
   * ω_n = √(k / m)
   */
  static naturalFrequency(stiffness: number, mass: number): number {
    return Math.sqrt(stiffness / mass);
  }

  /**
   * 计算阻尼振动频率
   * ω_d = ω_n * √(1 - ζ²)
   */
  static dampedFrequency(stiffness: number, mass: number, damping: number): number {
    const omega_n = this.naturalFrequency(stiffness, mass);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (zeta >= 1) return 0; // 无振荡
    return omega_n * Math.sqrt(1 - zeta * zeta);
  }

  /**
   * 计算振幅衰减
   * A(t) = A₀ * exp(-ζ * ω_n * t)
   */
  static amplitudeDecay(
    initialAmplitude: number,
    stiffness: number,
    mass: number,
    damping: number,
    time: number
  ): number {
    const omega_n = this.naturalFrequency(stiffness, mass);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    return initialAmplitude * Math.exp(-zeta * omega_n * time);
  }

  /**
   * 计算衰减时间（振幅衰减到初始值的1/e所需时间）
   * τ = 1 / (ζ * ω_n)
   */
  static decayTime(stiffness: number, mass: number, damping: number): number {
    const omega_n = this.naturalFrequency(stiffness, mass);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (zeta === 0) return Infinity;
    return 1 / (zeta * omega_n);
  }

  /**
   * 计算弹簧力
   * F_spring = -k * (x - x_eq)
   */
  static springForce(system: SpringMassSystem): number {
    const displacement = system.position - system.equilibrium;
    return -system.stiffness * displacement;
  }

  /**
   * 计算阻尼力
   * F_damping = -c * v
   */
  static dampingForce(system: SpringMassSystem): number {
    return -system.damping * system.velocity;
  }

  /**
   * 计算总加速度
   * a = (F_spring + F_damping) / m
   */
  static totalAcceleration(system: SpringMassSystem): number {
    const F_spring = this.springForce(system);
    const F_damping = this.dampingForce(system);
    return (F_spring + F_damping) / system.mass;
  }

  /**
   * 预测系统停止时间（精度阈值内）
   */
  static estimateStopTime(
    system: SpringMassSystem,
    precision: number = 0.001
  ): number {
    const omega_n = this.naturalFrequency(system.stiffness, system.mass);
    const zeta = this.dampingRatio(system.damping, system.mass, system.stiffness);
    
    if (zeta >= 1) {
      // 过阻尼或临界阻尼：指数衰减
      return -Math.log(precision) / (zeta * omega_n);
    } else {
      // 欠阻尼：考虑振荡衰减
      const tau = this.decayTime(system.stiffness, system.mass, system.damping);
      return -tau * Math.log(precision);
    }
  }
}

// ==================== 数值积分器 ====================
export interface IntegrationResult {
  position: number;
  velocity: number;
  acceleration: number;
}

export class NumericalIntegrator {
  /**
   * 显式欧拉法（最简单，精度低，可能不稳定）
   * x_{n+1} = x_n + v_n * dt
   * v_{n+1} = v_n + a_n * dt
   */
  static explicitEuler(
    position: number,
    velocity: number,
    acceleration: number,
    dt: number
  ): IntegrationResult {
    const newPosition = position + velocity * dt;
    const newVelocity = velocity + acceleration * dt;
    
    return {
      position: newPosition,
      velocity: newVelocity,
      acceleration
    };
  }

  /**
   * 半隐式欧拉法（更稳定，常用于游戏物理）
   * v_{n+1} = v_n + a_n * dt
   * x_{n+1} = x_n + v_{n+1} * dt
   */
  static semiImplicitEuler(
    position: number,
    velocity: number,
    acceleration: number,
    dt: number
  ): IntegrationResult {
    const newVelocity = velocity + acceleration * dt;
    const newPosition = position + newVelocity * dt;
    
    return {
      position: newPosition,
      velocity: newVelocity,
      acceleration
    };
  }

  /**
   * Verlet积分（能量守恒好，适用于分子动力学）
   * x_{n+1} = 2x_n - x_{n-1} + a_n * dt²
   */
  static verlet(
    currentPosition: number,
    previousPosition: number,
    acceleration: number,
    dt: number
  ): IntegrationResult {
    const newPosition = 2 * currentPosition - previousPosition + acceleration * dt * dt;
    const newVelocity = (newPosition - previousPosition) / (2 * dt);
    
    return {
      position: newPosition,
      velocity: newVelocity,
      acceleration
    };
  }

  /**
   * 速度Verlet积分（更准确的Verlet变体）
   * x_{n+1} = x_n + v_n * dt + 0.5 * a_n * dt²
   * v_{n+1} = v_n + 0.5 * (a_n + a_{n+1}) * dt
   */
  static velocityVerlet(
    position: number,
    velocity: number,
    currentAcceleration: number,
    nextAcceleration: number,
    dt: number
  ): IntegrationResult {
    const newPosition = position + velocity * dt + 0.5 * currentAcceleration * dt * dt;
    const newVelocity = velocity + 0.5 * (currentAcceleration + nextAcceleration) * dt;
    
    return {
      position: newPosition,
      velocity: newVelocity,
      acceleration: nextAcceleration
    };
  }

  /**
   * Runge-Kutta 4阶（高精度，计算量大）
   */
  static rungeKutta4(
    position: number,
    velocity: number,
    accelerationFunc: (pos: number, vel: number) => number,
    dt: number
  ): IntegrationResult {
    // 定义状态向量
    const state = [position, velocity];
    
    // k1
    const k1v = accelerationFunc(state[0], state[1]);
    const k1x = state[1];
    
    // k2
    const k2v = accelerationFunc(state[0] + 0.5 * dt * k1x, state[1] + 0.5 * dt * k1v);
    const k2x = state[1] + 0.5 * dt * k1v;
    
    // k3
    const k3v = accelerationFunc(state[0] + 0.5 * dt * k2x, state[1] + 0.5 * dt * k2v);
    const k3x = state[1] + 0.5 * dt * k2v;
    
    // k4
    const k4v = accelerationFunc(state[0] + dt * k3x, state[1] + dt * k3v);
    const k4x = state[1] + dt * k3v;
    
    // 更新
    const newPosition = state[0] + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    const newVelocity = state[1] + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    const newAcceleration = accelerationFunc(newPosition, newVelocity);
    
    return {
      position: newPosition,
      velocity: newVelocity,
      acceleration: newAcceleration
    };
  }

  /**
   * 自适应步长积分器（根据误差自动调整步长）
   */
  static adaptiveStepRK4(
    position: number,
    velocity: number,
    accelerationFunc: (pos: number, vel: number) => number,
    dt: number,
    tolerance: number = 1e-6
  ): { result: IntegrationResult; suggestedDt: number } {
    // 全步长计算
    const fullStep = this.rungeKutta4(position, velocity, accelerationFunc, dt);
    
    // 两个半步长计算
    const halfStep1 = this.rungeKutta4(position, velocity, accelerationFunc, dt / 2);
    const halfStep2 = this.rungeKutta4(
      halfStep1.position,
      halfStep1.velocity,
      accelerationFunc,
      dt / 2
    );
    
    // 计算误差估计
    const errorPosition = Math.abs(fullStep.position - halfStep2.position) / dt;
    const errorVelocity = Math.abs(fullStep.velocity - halfStep2.velocity) / dt;
    const maxError = Math.max(errorPosition, errorVelocity);
    
    // 根据误差调整步长
    let suggestedDt = dt;
    if (maxError > 0) {
      const scale = 0.9 * Math.pow(tolerance / maxError, 0.2);
      suggestedDt = Math.min(dt * scale, dt * 2); // 限制最大增长
    }
    
    return {
      result: halfStep2, // 使用更精确的两个半步结果
      suggestedDt
    };
  }
}

// ==================== 碰撞检测与响应 ====================
export interface CollisionResult {
  collision: boolean;
  normal?: Vector2D;
  depth?: number;
  point?: Vector2D;
}

export class CollisionPhysics {
  /**
   * 圆形碰撞检测
   */
  static circleCollision(
    pos1: Vector2D, radius1: number,
    pos2: Vector2D, radius2: number
  ): CollisionResult {
    const distance = VectorMath.distance(pos1, pos2);
    const sumRadii = radius1 + radius2;
    
    if (distance < sumRadii) {
      const normal = VectorMath.normalize(VectorMath.subtract(pos2, pos1));
      const depth = sumRadii - distance;
      const point = VectorMath.add(pos1, VectorMath.multiply(normal, radius1));
      
      return {
        collision: true,
        normal,
        depth,
        point
      };
    }
    
    return { collision: false };
  }

  /**
   * AABB（轴对齐包围盒）碰撞检测
   */
  static aabbCollision(
    min1: Vector2D, max1: Vector2D,
    min2: Vector2D, max2: Vector2D
  ): CollisionResult {
    const collision = 
      min1.x <= max2.x &&
      max1.x >= min2.x &&
      min1.y <= max2.y &&
      max1.y >= min2.y;
    
    if (collision) {
      // 计算穿透深度和法线
      const overlapX = Math.min(max1.x - min2.x, max2.x - min1.x);
      const overlapY = Math.min(max1.y - min2.y, max2.y - min1.y);
      
      if (overlapX < overlapY) {
        const normal = { x: max1.x < max2.x ? -1 : 1, y: 0 };
        const depth = overlapX;
        return {
          collision: true,
          normal,
          depth,
          point: {
            x: normal.x > 0 ? min1.x : max1.x,
            y: (min1.y + max1.y) * 0.5
          }
        };
      } else {
        const normal = { x: 0, y: max1.y < max2.y ? -1 : 1 };
        const depth = overlapY;
        return {
          collision: true,
          normal,
          depth,
          point: {
            x: (min1.x + max1.x) * 0.5,
            y: normal.y > 0 ? min1.y : max1.y
          }
        };
      }
    }
    
    return { collision: false };
  }

  /**
   * 弹性碰撞响应
   */
  static elasticResponse(
    m1: number, v1: Vector2D,
    m2: number, v2: Vector2D,
    normal: Vector2D,
    restitution: number = 1.0 // 恢复系数，1为完全弹性
  ): { v1Final: Vector2D; v2Final: Vector2D } {
    const relativeVelocity = VectorMath.subtract(v1, v2);
    const velocityAlongNormal = VectorMath.dot(relativeVelocity, normal);
    
    if (velocityAlongNormal > 0) {
      // 物体正在分离，不处理
      return { v1Final: v1, v2Final: v2 };
    }
    
    // 计算冲量
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const totalMass = 1 / m1 + 1 / m2;
    const impulse = impulseScalar / totalMass;
    
    const impulseVector = VectorMath.multiply(normal, impulse);
    
    const v1Final = VectorMath.add(v1, VectorMath.multiply(impulseVector, 1 / m1));
    const v2Final = VectorMath.subtract(v2, VectorMath.multiply(impulseVector, 1 / m2));
    
    return { v1Final, v2Final };
  }

  /**
   * 摩擦力计算
   */
  static frictionForce(
    normalForce: number,
    velocity: Vector2D,
    staticFriction: number,
    kineticFriction: number
  ): Vector2D {
    const speed = VectorMath.magnitude(velocity);
    
    if (speed === 0) {
      // 静摩擦力
      return { x: 0, y: 0 };
    }
    
    // 动摩擦力（方向与速度相反）
    const frictionMagnitude = kineticFriction * normalForce;
    const frictionDirection = VectorMath.multiply(VectorMath.normalize(velocity), -1);
    
    return VectorMath.multiply(frictionDirection, Math.min(frictionMagnitude, speed));
  }
}

// ==================== 流体力学与阻力 ====================
export class FluidDynamics {
  /**
   * 斯托克斯阻力（小雷诺数，粘性主导）
   * F = 6πμRv
   */
  static stokesDrag(
    viscosity: number, // 粘度 (Pa·s)
    radius: number,    // 球体半径 (m)
    velocity: number   // 速度 (m/s)
  ): number {
    return 6 * Math.PI * viscosity * radius * velocity;
  }

  /**
   * 牛顿阻力（大雷诺数，惯性主导）
   * F = 0.5 * ρ * v² * A * C_d
   */
  static newtonianDrag(
    density: number,    // 流体密度 (kg/m³)
    velocity: number,   // 速度 (m/s)
    area: number,      // 迎风面积 (m²)
    dragCoefficient: number // 阻力系数
  ): number {
    return 0.5 * density * velocity * velocity * area * dragCoefficient;
  }

  /**
   * 计算终端速度（重力与阻力平衡）
   * v_terminal = √(2mg / ρAC_d)
   */
  static terminalVelocity(
    mass: number,
    gravity: number,
    density: number,
    area: number,
    dragCoefficient: number
  ): number {
    return Math.sqrt((2 * mass * gravity) / (density * area * dragCoefficient));
  }

  /**
   * 雷诺数计算
   * Re = ρvL/μ
   */
  static reynoldsNumber(
    density: number,
    velocity: number,
    characteristicLength: number,
    viscosity: number
  ): number {
    return (density * velocity * characteristicLength) / viscosity;
  }
}

// ==================== 曲线与缓动函数 ====================
export class EasingFunctions {
  /**
   * 线性缓动
   */
  static linear(t: number): number {
    return t;
  }

  /**
   * 二次缓动
   */
  static easeInQuad(t: number): number {
    return t * t;
  }

  static easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * 三次缓动
   */
  static easeInCubic(t: number): number {
    return t * t * t;
  }

  static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * 正弦缓动
   */
  static easeInSine(t: number): number {
    return 1 - Math.cos((t * Math.PI) / 2);
  }

  static easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2);
  }

  static easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  /**
   * 指数缓动
   */
  static easeInExpo(t: number): number {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }

  static easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /**
   * 弹性缓动（弹簧效果）
   */
  static elasticOut(t: number, amplitude: number = 1, period: number = 0.3): number {
    if (t === 0 || t === 1) return t;
    
    const s = period / 4;
    return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / period) + 1;
  }

  /**
   * 回弹缓动
   */
  static bounceOut(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  /**
   * 物理弹簧缓动（基于真实物理）
   */
  static springPhysics(
    t: number,
    mass: number = 1,
    stiffness: number = 100,
    damping: number = 10
  ): number {
    const system: SpringMassSystem = {
      mass,
      stiffness,
      damping,
      position: 0,
      velocity: 0,
      equilibrium: 1
    };
    
    // 模拟弹簧系统
    const dt = 0.016; // 60fps
    let time = 0;
    let position = 0;
    let velocity = 0;
    
    while (time < t) {
      const acc = SpringPhysics.totalAcceleration({
        ...system,
        position,
        velocity
      });
      
      const result = NumericalIntegrator.semiImplicitEuler(position, velocity, acc, dt);
      position = result.position;
      velocity = result.velocity;
      time += dt;
    }
    
    return position;
  }
}

// ==================== 工具函数 ====================
export class PhysicsUtils {
  /**
   * 单位转换
   */
  static degreesToRadians(degrees: number): number {
    return degrees * PhysicsConstants.DEG_TO_RAD;
  }

  static radiansToDegrees(radians: number): number {
    return radians * PhysicsConstants.RAD_TO_DEG;
  }

  static metersToPixels(meters: number, pixelsPerMeter: number = 100): number {
    return meters * pixelsPerMeter;
  }

  static pixelsToMeters(pixels: number, pixelsPerMeter: number = 100): number {
    return pixels / pixelsPerMeter;
  }

  /**
   * 帧时间处理
   */
  static calculateDeltaTime(lastTime: number): number {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // 转换为秒
    return Math.min(deltaTime, PhysicsConstants.STANDARD_FRAME_TIME * 2); // 限制最大步长
  }

  static getFrameTime(targetFPS: number = 60): number {
    return 1 / targetFPS;
  }

  /**
   * 物理量限制器
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * this.clamp(t, 0, 1);
  }

  static inverseLerp(start: number, end: number, value: number): number {
    return this.clamp((value - start) / (end - start), 0, 1);
  }

  /**
   * 随机物理量
   */
  static randomVelocity(minSpeed: number, maxSpeed: number): Vector2D {
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    const angle = Math.random() * Math.PI * 2;
    
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }

  static randomForce(minMagnitude: number, maxMagnitude: number): Vector2D {
    return this.randomVelocity(minMagnitude, maxMagnitude);
  }

  /**
   * 物理系统诊断
   */
  static diagnoseSpringSystem(system: SpringMassSystem): {
    behavior: string;
    naturalFrequency: number;
    dampedFrequency: number;
    dampingRatio: number;
    decayTime: number;
  } {
    const naturalFreq = SpringPhysics.naturalFrequency(system.stiffness, system.mass);
    const dampedFreq = SpringPhysics.dampedFrequency(system.stiffness, system.mass, system.damping);
    const zeta = SpringPhysics.dampingRatio(system.damping, system.mass, system.stiffness);
    const decay = SpringPhysics.decayTime(system.stiffness, system.mass, system.damping);
    
    let behavior = '';
    if (zeta < 0.95) behavior = '欠阻尼（振荡）';
    else if (zeta > 1.05) behavior = '过阻尼（缓慢）';
    else behavior = '临界阻尼（最优）';
    
    return {
      behavior,
      naturalFrequency: naturalFreq,
      dampedFrequency: dampedFreq,
      dampingRatio: zeta,
      decayTime: decay
    };
  }
}

// ==================== 使用示例 ====================
export class PhysicsExamples {
  /**
   * 示例1：弹簧动画系统
   */
  static createSpringAnimation() {
    const system: SpringMassSystem = {
      mass: 1.0,
      stiffness: 300,
      damping: 15,
      position: 0,
      velocity: 0,
      equilibrium: 100
    };

    // 诊断系统
    const diagnosis = PhysicsUtils.diagnoseSpringSystem(system);
    console.log('Spring System Diagnosis:', diagnosis);

    // 模拟动画
    const positions: number[] = [];
    let currentPosition = system.position;
    let currentVelocity = system.velocity;
    
    for (let i = 0; i < 60; i++) { // 1秒的动画（60帧）
      const acc = SpringPhysics.totalAcceleration({
        ...system,
        position: currentPosition,
        velocity: currentVelocity
      });
      
      const result = NumericalIntegrator.semiImplicitEuler(
        currentPosition,
        currentVelocity,
        acc,
        PhysicsConstants.STANDARD_FRAME_TIME
      );
      
      currentPosition = result.position;
      currentVelocity = result.velocity;
      positions.push(currentPosition);
    }
    
    return { diagnosis, positions };
  }

  /**
   * 示例2：抛体运动
   */
  static simulateProjectile(
    initialVelocity: number,
    launchAngle: number,
    duration: number = 5
  ) {
    const steps = duration * 60; // 60fps
    const positions: Vector2D[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const time = i / 60;
      const pos = Kinematics.projectileMotion(initialVelocity, launchAngle, time);
      positions.push({ x: pos.x, y: pos.y });
      
      if (pos.y < 0) break; // 落地
    }
    
    const maxHeight = Kinematics.maxHeight(initialVelocity, launchAngle);
    const range = Kinematics.range(initialVelocity, launchAngle);
    
    return { positions, maxHeight, range };
  }

  /**
   * 示例3：碰撞响应
   */
  static simulateCollision() {
    const ball1 = {
      mass: 2,
      position: { x: 0, y: 0 },
      velocity: { x: 5, y: 0 },
      radius: 10
    };
    
    const ball2 = {
      mass: 1,
      position: { x: 50, y: 0 },
      velocity: { x: -3, y: 0 },
      radius: 10
    };
    
    // 检测碰撞
    const collision = CollisionPhysics.circleCollision(
      ball1.position, ball1.radius,
      ball2.position, ball2.radius
    );
    
    if (collision.collision && collision.normal) {
      // 计算碰撞响应
      const response = CollisionPhysics.elasticResponse(
        ball1.mass, ball1.velocity,
        ball2.mass, ball2.velocity,
        collision.normal
      );
      
      return {
        before: { ball1Vel: ball1.velocity, ball2Vel: ball2.velocity },
        after: { ball1Vel: response.v1Final, ball2Vel: response.v2Final }
      };
    }
    
    return null;
  }
}



// ==================== 导出所有工具 ====================
export default {
  PhysicsConstants,
  VectorMath,
  Kinematics,
  Dynamics,
  SpringPhysics,
  NumericalIntegrator,
  CollisionPhysics,
  FluidDynamics,
  EasingFunctions,
  PhysicsUtils,
  PhysicsExamples
};