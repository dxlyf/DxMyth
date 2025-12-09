// physics/PhysicsConstants.ts
/**
 * 物理常数定义
 */
export const PhysicsConstants = {
  // 重力加速度 (m/s²)
  GRAVITY_EARTH: 9.80665,
  GRAVITY_MOON: 1.62,
  GRAVITY_MARS: 3.71,
  
  // 空气密度 (kg/m³)
  AIR_DENSITY_SEA_LEVEL: 1.225,
  AIR_DENSITY_1000M: 1.112,
  
  // 材料摩擦系数
  FRICTION_COEFFICIENTS: {
    STEEL_ON_STEEL: 0.6,
    WOOD_ON_WOOD: 0.25,
    RUBBER_ON_DRY_CONCRETE: 0.7,
    TEFLON_ON_TEFLON: 0.04,
    ICE_ON_ICE: 0.1,
  },
  
  // 材料弹性系数
  ELASTICITY_COEFFICIENTS: {
    STEEL: 200,      // GPa
    ALUMINUM: 70,
    GLASS: 65,
    RUBBER: 0.01,
    HUMAN_TISSUE: 0.002,
  },
  
  // 流体粘性系数 (Pa·s)
  VISCOSITY: {
    AIR_20C: 1.8e-5,
    WATER_20C: 1.0e-3,
    HONEY_20C: 10,
    BLOOD_37C: 3.0e-3,
  },
} as const;
/**
 * 物理向量类型
 */
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface PhysicalBody {
  mass: number;           // 质量 (kg)
  position: Vector2D;     // 位置 (m)
  velocity: Vector2D;     // 速度 (m/s)
  acceleration: Vector2D; // 加速度 (m/s²)
  forces: Vector2D[];     // 作用力列表 (N)
  restitution: number;    // 恢复系数 [0, 1]
  friction: number;       // 摩擦系数
  area?: number;          // 面积 (m²)
  volume?: number;        // 体积 (m³)
  density?: number;       // 密度 (kg/m³)
}

export interface SpringConfig {
  stiffness: number;      // 刚度系数 (N/m)
  damping: number;        // 阻尼系数 (Ns/m)
  restLength: number;     // 自然长度 (m)
  breakForce?: number;    // 断裂力 (N)
}

export interface CollisionResult {
  normal: Vector2D;       // 碰撞法线
  penetration: number;    // 穿透深度
  point: Vector2D;        // 碰撞点
  impulse: Vector2D;      // 冲量
}
/**
 * 数学工具类
 */
export class MathUtils {
  // 弧度与角度转换
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
  
  // 向量操作
  static vectorLength(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  
  static normalize(v: Vector2D): Vector2D {
    const length = this.vectorLength(v);
    if (length === 0) return { x: 0, y: 0 };
    return { x: v.x / length, y: v.y / length };
  }
  
  static dot(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.x + v1.y * v2.y;
  }
  
  static cross(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.y - v1.y * v2.x;
  }
  
  static add(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }
  
  static subtract(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }
  
  static multiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }
  
  static distance(p1: Vector2D, p2: Vector2D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // 插值函数
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }
  
  static lerpVector(v1: Vector2D, v2: Vector2D, t: number): Vector2D {
    return {
      x: this.lerp(v1.x, v2.x, t),
      y: this.lerp(v1.y, v2.y, t),
    };
  }
  
  // 约束函数
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
  
  static clampVector(v: Vector2D, maxLength: number): Vector2D {
    const length = this.vectorLength(v);
    if (length <= maxLength || length === 0) return v;
    return this.multiply(this.normalize(v), maxLength);
  }
  
  // 随机函数
  static randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  
  static randomVector(length: number = 1): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * length,
      y: Math.sin(angle) * length,
    };
  }
  
  // 角度计算
  static angleBetween(v1: Vector2D, v2: Vector2D): number {
    const dot = this.dot(v1, v2);
    const length1 = this.vectorLength(v1);
    const length2 = this.vectorLength(v2);
    return Math.acos(dot / (length1 * length2));
  }
  
  static rotateVector(v: Vector2D, angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    };
  }
}

// physics/Kinematics.ts
/**
 * 运动学公式
 */
export class Kinematics {
  // 匀加速直线运动
  static uniformAcceleration(
    initialVelocity: number,
    acceleration: number,
    time: number
  ): number {
    return initialVelocity * time + 0.5 * acceleration * time * time;
  }
  
  // 计算未速度
  static finalVelocity(
    initialVelocity: number,
    acceleration: number,
    distance: number
  ): number {
    return Math.sqrt(initialVelocity * initialVelocity + 2 * acceleration * distance);
  }
  
  // 计算所需时间
  static timeToTravel(
    initialVelocity: number,
    acceleration: number,
    distance: number
  ): number {
    if (acceleration === 0) {
      return distance / initialVelocity;
    }
    const discriminant = initialVelocity * initialVelocity + 2 * acceleration * distance;
    if (discriminant < 0) return Infinity;
    const v = Math.sqrt(discriminant);
    return (v - initialVelocity) / acceleration;
  }
  
  // 抛体运动 - 水平距离
  static projectileRange(
    initialVelocity: number,
    launchAngle: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): number {
    const angleRad = MathUtils.degToRad(launchAngle);
    return (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / gravity;
  }
  
  // 抛体运动 - 最大高度
  static projectileMaxHeight(
    initialVelocity: number,
    launchAngle: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): number {
    const angleRad = MathUtils.degToRad(launchAngle);
    const vy = initialVelocity * Math.sin(angleRad);
    return (vy * vy) / (2 * gravity);
  }
  
  // 抛体运动 - 飞行时间
  static projectileTimeOfFlight(
    initialVelocity: number,
    launchAngle: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): number {
    const angleRad = MathUtils.degToRad(launchAngle);
    const vy = initialVelocity * Math.sin(angleRad);
    return (2 * vy) / gravity;
  }
  
  // 圆周运动 - 向心加速度
  static centripetalAcceleration(
    velocity: number,
    radius: number
  ): number {
    return (velocity * velocity) / radius;
  }
  
  // 圆周运动 - 向心力
  static centripetalForce(
    mass: number,
    velocity: number,
    radius: number
  ): number {
    return (mass * velocity * velocity) / radius;
  }
  
  // 简谐运动 - 位移
  static simpleHarmonicMotion(
    amplitude: number,
    angularFrequency: number,
    time: number,
    phase: number = 0
  ): number {
    return amplitude * Math.sin(angularFrequency * time + phase);
  }
  
  // 简谐运动 - 速度
  static simpleHarmonicVelocity(
    amplitude: number,
    angularFrequency: number,
    time: number,
    phase: number = 0
  ): number {
    return amplitude * angularFrequency * Math.cos(angularFrequency * time + phase);
  }
}

// physics/Dynamics.ts
/**
 * 动力学公式
 */
export class Dynamics {
  // 牛顿第二定律: F = m * a
  static newtonSecondLaw(mass: number, acceleration: Vector2D): Vector2D {
    return MathUtils.multiply(acceleration, mass);
  }
  
  // 计算加速度: a = F / m
  static accelerationFromForce(mass: number, force: Vector2D): Vector2D {
    return MathUtils.multiply(force, 1 / mass);
  }
  
  // 重力: F = m * g
  static gravitationalForce(
    mass: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): Vector2D {
    return { x: 0, y: mass * gravity };
  }
  
  // 弹簧力: F = -k * x
  static springForce(
    stiffness: number,
    displacement: Vector2D
  ): Vector2D {
    return MathUtils.multiply(displacement, -stiffness);
  }
  
  // 阻尼力: F = -c * v
  static dampingForce(
    damping: number,
    velocity: Vector2D
  ): Vector2D {
    return MathUtils.multiply(velocity, -damping);
  }
  
  // 弹簧-质量-阻尼系统力
  static springMassDamperForce(
    stiffness: number,
    damping: number,
    displacement: Vector2D,
    velocity: Vector2D
  ): Vector2D {
    const spring = this.springForce(stiffness, displacement);
    const damper = this.dampingForce(damping, velocity);
    return MathUtils.add(spring, damper);
  }
  
  // 摩擦力 - 静摩擦
  static staticFriction(
    normalForce: number,
    frictionCoefficient: number
  ): number {
    return normalForce * frictionCoefficient;
  }
  
  // 摩擦力 - 动摩擦
  static kineticFriction(
    normalForce: number,
    frictionCoefficient: number
  ): number {
    return normalForce * frictionCoefficient;
  }
  
  // 空气阻力 (低速情况): F = 0.5 * ρ * C * A * v²
  static airResistance(
    density: number,
    dragCoefficient: number,
    area: number,
    velocity: Vector2D
  ): Vector2D {
    const speed = MathUtils.vectorLength(velocity);
    if (speed === 0) return { x: 0, y: 0 };
    
    const magnitude = -0.5 * density * dragCoefficient * area * speed * speed;
    const direction = MathUtils.normalize(velocity);
    return MathUtils.multiply(direction, magnitude);
  }
  
  // 浮力: F = ρ * g * V
  static buoyantForce(
    fluidDensity: number,
    volume: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): Vector2D {
    return { x: 0, y: -fluidDensity * gravity * volume };
  }
  
  // 张力 (简单的弦或绳)
  static tensionForce(
    mass: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH,
    acceleration: number = 0
  ): number {
    return mass * (gravity + acceleration);
  }
  
  // 动量: p = m * v
  static momentum(mass: number, velocity: Vector2D): Vector2D {
    return MathUtils.multiply(velocity, mass);
  }
  
  // 冲量: J = F * Δt
  static impulse(force: Vector2D, time: number): Vector2D {
    return MathUtils.multiply(force, time);
  }
  
  // 动能: KE = 0.5 * m * v²
  static kineticEnergy(mass: number, velocity: Vector2D): number {
    const speed = MathUtils.vectorLength(velocity);
    return 0.5 * mass * speed * speed;
  }
  
  // 势能 - 重力: PE = m * g * h
  static gravitationalPotentialEnergy(
    mass: number,
    height: number,
    gravity: number = PhysicsConstants.GRAVITY_EARTH
  ): number {
    return mass * gravity * height;
  }
  
  // 势能 - 弹簧: PE = 0.5 * k * x²
  static springPotentialEnergy(stiffness: number, displacement: number): number {
    return 0.5 * stiffness * displacement * displacement;
  }
  
  // 功率: P = F · v
  static power(force: Vector2D, velocity: Vector2D): number {
    return MathUtils.dot(force, velocity);
  }
  
  // 功: W = F · d
  static work(force: Vector2D, displacement: Vector2D): number {
    return MathUtils.dot(force, displacement);
  }
}

// physics/SpringPhysics.ts
/**
 * 弹簧物理计算
 */
export class SpringPhysics {
  // 计算临界阻尼系数: c_critical = 2 * √(m * k)
  static criticalDamping(mass: number, stiffness: number): number {
    return 2 * Math.sqrt(mass * stiffness);
  }
  
  // 计算阻尼比: ζ = c / c_critical
  static dampingRatio(
    damping: number,
    mass: number,
    stiffness: number
  ): number {
    const critical = this.criticalDamping(mass, stiffness);
    return damping / critical;
  }
  
  // 计算自然频率: ω₀ = √(k / m)
  static naturalFrequency(mass: number, stiffness: number): number {
    return Math.sqrt(stiffness / mass);
  }
  
  // 计算阻尼频率: ω_d = ω₀ * √(1 - ζ²)
  static dampedFrequency(
    mass: number,
    stiffness: number,
    damping: number
  ): number {
    const omega0 = this.naturalFrequency(mass, stiffness);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (zeta >= 1) return 0; // 无振荡
    return omega0 * Math.sqrt(1 - zeta * zeta);
  }
  
  // 计算弹簧周期: T = 2π / ω
  static springPeriod(mass: number, stiffness: number): number {
    const omega = this.naturalFrequency(mass, stiffness);
    return (2 * Math.PI) / omega;
  }
  
  // 计算弹簧系统在时间t的位移（欠阻尼情况）
  static underDampedDisplacement(
    initialPosition: number,
    initialVelocity: number,
    targetPosition: number,
    mass: number,
    stiffness: number,
    damping: number,
    time: number
  ): number {
    const omega0 = this.naturalFrequency(mass, stiffness);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (zeta >= 1) {
      return this.criticallyDampedDisplacement(
        initialPosition, initialVelocity, targetPosition,
        mass, stiffness, damping, time
      );
    }
    
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const displacement = initialPosition - targetPosition;
    
    const A = displacement;
    const B = (initialVelocity + zeta * omega0 * displacement) / omegaD;
    
    const decay = Math.exp(-zeta * omega0 * time);
    const oscillation = A * Math.cos(omegaD * time) + B * Math.sin(omegaD * time);
    
    return targetPosition + decay * oscillation;
  }
  
  // 计算弹簧系统在时间t的位移（临界阻尼情况）
  static criticallyDampedDisplacement(
    initialPosition: number,
    initialVelocity: number,
    targetPosition: number,
    mass: number,
    stiffness: number,
    damping: number,
    time: number
  ): number {
    const omega0 = this.naturalFrequency(mass, stiffness);
    const displacement = initialPosition - targetPosition;
    
    const decay = Math.exp(-omega0 * time);
    const term = displacement + (initialVelocity + omega0 * displacement) * time;
    
    return targetPosition + decay * term;
  }
  
  // 计算弹簧系统在时间t的位移（过阻尼情况）
  static overDampedDisplacement(
    initialPosition: number,
    initialVelocity: number,
    targetPosition: number,
    mass: number,
    stiffness: number,
    damping: number,
    time: number
  ): number {
    const omega0 = this.naturalFrequency(mass, stiffness);
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    const root = Math.sqrt(zeta * zeta - 1);
    const r1 = -omega0 * (zeta - root);
    const r2 = -omega0 * (zeta + root);
    
    const displacement = initialPosition - targetPosition;
    
    const c2 = (initialVelocity - r1 * displacement) / (r2 - r1);
    const c1 = displacement - c2;
    
    return targetPosition + c1 * Math.exp(r1 * time) + c2 * Math.exp(r2 * time);
  }
  
  // 通用弹簧位移计算（自动判断阻尼类型）
  static springDisplacement(
    initialPosition: number,
    initialVelocity: number,
    targetPosition: number,
    mass: number,
    stiffness: number,
    damping: number,
    time: number
  ): number {
    const zeta = this.dampingRatio(damping, mass, stiffness);
    
    if (zeta < 0.999) {
      return this.underDampedDisplacement(
        initialPosition, initialVelocity, targetPosition,
        mass, stiffness, damping, time
      );
    } else if (zeta > 1.001) {
      return this.overDampedDisplacement(
        initialPosition, initialVelocity, targetPosition,
        mass, stiffness, damping, time
      );
    } else {
      return this.criticallyDampedDisplacement(
        initialPosition, initialVelocity, targetPosition,
        mass, stiffness, damping, time
      );
    }
  }
  
  // 计算弹簧达到稳定所需时间（精度为epsilon）
  static settlingTime(
    mass: number,
    stiffness: number,
    damping: number,
    epsilon: number = 0.01
  ): number {
    const zeta = this.dampingRatio(damping, mass, stiffness);
    const omega0 = this.naturalFrequency(mass, stiffness);
    
    if (zeta < 1) {
      // 欠阻尼系统的稳定时间
      return -Math.log(epsilon) / (zeta * omega0);
    } else {
      // 临界和过阻尼系统的稳定时间
      return 4 / (zeta * omega0);
    }
  }
}

// physics/CollisionPhysics.ts
/**
 * 碰撞物理计算
 */
export class CollisionPhysics {
  // 检测圆与圆的碰撞
  static circleCircleCollision(
    pos1: Vector2D,
    radius1: number,
    pos2: Vector2D,
    radius2: number
  ): CollisionResult | null {
    const distance = MathUtils.distance(pos1, pos2);
    const sumRadii = radius1 + radius2;
    
    if (distance >= sumRadii) return null;
    
    const normal = MathUtils.normalize(MathUtils.subtract(pos2, pos1));
    const penetration = sumRadii - distance;
    const point = {
      x: pos1.x + normal.x * radius1,
      y: pos1.y + normal.y * radius1,
    };
    
    return { normal, penetration, point, impulse: { x: 0, y: 0 } };
  }
  
  // 检测AABB（轴对齐包围盒）碰撞
  static aabbCollision(
    min1: Vector2D,
    max1: Vector2D,
    min2: Vector2D,
    max2: Vector2D
  ): CollisionResult | null {
    if (max1.x < min2.x || min1.x > max2.x) return null;
    if (max1.y < min2.y || min1.y > max2.y) return null;
    
    // 计算穿透向量
    const dx1 = max2.x - min1.x;
    const dx2 = max1.x - min2.x;
    const dy1 = max2.y - min1.y;
    const dy2 = max1.y - min2.y;
    
    const penetrationX = Math.min(dx1, dx2);
    const penetrationY = Math.min(dy1, dy2);
    
    let normal: Vector2D;
    let penetration: number;
    
    if (penetrationX < penetrationY) {
      normal = { x: dx1 < dx2 ? 1 : -1, y: 0 };
      penetration = penetrationX;
    } else {
      normal = { x: 0, y: dy1 < dy2 ? 1 : -1 };
      penetration = penetrationY;
    }
    
    const point = {
      x: (min1.x + max1.x + min2.x + max2.x) / 4,
      y: (min1.y + max1.y + min2.y + max2.y) / 4,
    };
    
    return { normal, penetration, point, impulse: { x: 0, y: 0 } };
  }
  
  // 计算碰撞冲量（动量守恒）
  static calculateImpulse(
    body1: PhysicalBody,
    body2: PhysicalBody,
    normal: Vector2D,
    restitution: number = Math.min(body1.restitution, body2.restitution)
  ): Vector2D {
    const relativeVelocity = MathUtils.subtract(body2.velocity, body1.velocity);
    const velocityAlongNormal = MathUtils.dot(relativeVelocity, normal);
    
    // 如果物体正在分离，不需要冲量
    if (velocityAlongNormal > 0) return { x: 0, y: 0 };
    
    // 计算冲量标量
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const invMass1 = 1 / body1.mass;
    const invMass2 = 1 / body2.mass;
    const impulseMagnitude = impulseScalar / (invMass1 + invMass2);
    
    // 计算冲量向量
    return MathUtils.multiply(normal, impulseMagnitude);
  }
  
  // 完全弹性碰撞后的速度
  static elasticCollisionVelocity(
    m1: number, v1: Vector2D,
    m2: number, v2: Vector2D
  ): [Vector2D, Vector2D] {
    const totalMass = m1 + m2;
    const massRatio1 = (m1 - m2) / totalMass;
    const massRatio2 = (2 * m2) / totalMass;
    const massRatio3 = (2 * m1) / totalMass;
    const massRatio4 = (m2 - m1) / totalMass;
    
    const newV1 = {
      x: massRatio1 * v1.x + massRatio2 * v2.x,
      y: massRatio1 * v1.y + massRatio2 * v2.y,
    };
    
    const newV2 = {
      x: massRatio3 * v1.x + massRatio4 * v2.x,
      y: massRatio3 * v1.y + massRatio4 * v2.y,
    };
    
    return [newV1, newV2];
  }
  
  // 非弹性碰撞后的速度
  static inelasticCollisionVelocity(
    m1: number, v1: Vector2D,
    m2: number, v2: Vector2D,
    restitution: number = 0.5
  ): [Vector2D, Vector2D] {
    const totalMass = m1 + m2;
    const combinedVelocity = {
      x: (m1 * v1.x + m2 * v2.x) / totalMass,
      y: (m1 * v1.y + m2 * v2.y) / totalMass,
    };
    
    const relativeVelocity = MathUtils.subtract(v1, v2);
    const impulse = MathUtils.multiply(relativeVelocity, restitution * m2);
    
    const newV1 = MathUtils.subtract(v1, MathUtils.multiply(impulse, 1 / m1));
    const newV2 = MathUtils.add(v2, MathUtils.multiply(impulse, 1 / m2));
    
    return [newV1, newV2];
  }
  
  // 完全非弹性碰撞（粘在一起）
  static perfectlyInelasticCollision(
    m1: number, v1: Vector2D,
    m2: number, v2: Vector2D
  ): Vector2D {
    const totalMass = m1 + m2;
    return {
      x: (m1 * v1.x + m2 * v2.x) / totalMass,
      y: (m1 * v1.y + m2 * v2.y) / totalMass,
    };
  }
  
  // 计算碰撞后的角速度（考虑转动惯量）
  static rotationalCollision(
    velocity: Vector2D,
    angularVelocity: number,
    radius: number,
    collisionPoint: Vector2D,
    normal: Vector2D,
    momentOfInertia: number
  ): [Vector2D, number] {
    // 计算碰撞点的速度
    const tangent = { x: -normal.y, y: normal.x };
    const radiusVector = MathUtils.subtract(collisionPoint, { x: 0, y: 0 });
    const rotationalVelocity = MathUtils.multiply(tangent, angularVelocity * radius);
    const pointVelocity = MathUtils.add(velocity, rotationalVelocity);
    
    // 计算冲量
    const velocityAlongNormal = MathUtils.dot(pointVelocity, normal);
    const impulseMagnitude = -velocityAlongNormal * (1 + 0.8); // 假设恢复系数0.8
    
    // 更新线速度
    const impulse = MathUtils.multiply(normal, impulseMagnitude);
    const newVelocity = MathUtils.add(velocity, MathUtils.multiply(impulse, 1 / momentOfInertia));
    
    // 更新角速度
    const torque = MathUtils.cross(radiusVector, impulse);
    const newAngularVelocity = angularVelocity + torque / momentOfInertia;
    
    return [newVelocity, newAngularVelocity];
  }
}

// physics/PhysicsSimulator.ts
/**
 * 物理模拟器（整合所有物理计算）
 */
export class PhysicsSimulator {
  private bodies: PhysicalBody[] = [];
  private gravity: Vector2D = { x: 0, y: PhysicsConstants.GRAVITY_EARTH };
  private timeScale: number = 1.0;
  private damping: number = 0.99; // 全局速度阻尼
  
  constructor(config?: {
    gravity?: Vector2D;
    timeScale?: number;
    damping?: number;
  }) {
    if (config?.gravity) this.gravity = config.gravity;
    if (config?.timeScale) this.timeScale = config.timeScale;
    if (config?.damping) this.damping = config.damping;
  }
  
  // 添加物理体
  addBody(body: PhysicalBody): void {
    this.bodies.push(body);
  }
  
  // 移除物理体
  removeBody(body: PhysicalBody): void {
    const index = this.bodies.indexOf(body);
    if (index > -1) this.bodies.splice(index, 1);
  }
  
  // 设置重力
  setGravity(gravity: Vector2D): void {
    this.gravity = gravity;
  }
  
  // 设置时间缩放
  setTimeScale(scale: number): void {
    this.timeScale = MathUtils.clamp(scale, 0, 10);
  }
  
  // 模拟一步（数值积分）
  step(deltaTime: number): void {
    const dt = deltaTime * this.timeScale;
    
    // 应用全局阻尼
    this.bodies.forEach(body => {
      body.velocity = MathUtils.multiply(body.velocity, this.damping);
    });
    
    // 更新每个物理体
    this.bodies.forEach(body => {
      this.updateBody(body, dt);
    });
    
    // 检测和处理碰撞
    this.resolveCollisions();
  }
  
  // 更新单个物理体
  private updateBody(body: PhysicalBody, dt: number): void {
    // 计算合力
    let netForce = this.gravity ? 
      Dynamics.newtonSecondLaw(body.mass, this.gravity) : 
      { x: 0, y: 0 };
    
    // 累加其他作用力
    body.forces.forEach(force => {
      netForce = MathUtils.add(netForce, force);
    });
    
    // 清空作用力列表
    body.forces = [];
    
    // 计算加速度
    const acceleration = Dynamics.accelerationFromForce(body.mass, netForce);
    
    // 半隐式欧拉积分
    body.velocity = MathUtils.add(
      body.velocity,
      MathUtils.multiply(acceleration, dt)
    );
    
    body.position = MathUtils.add(
      body.position,
      MathUtils.multiply(body.velocity, dt)
    );
    
    // 更新加速度（用于下一次计算）
    body.acceleration = acceleration;
  }
  
  // 碰撞检测和解决
  private resolveCollisions(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body1 = this.bodies[i];
        const body2 = this.bodies[j];
        
        // 简单圆形碰撞检测（假设所有物体都是圆形）
        const collision = CollisionPhysics.circleCircleCollision(
          body1.position, body1.mass * 0.1, // 简单半径估算
          body2.position, body2.mass * 0.1
        );
        
        if (collision) {
          this.resolveCollision(body1, body2, collision);
        }
      }
    }
  }
  
  // 解决碰撞
  private resolveCollision(
    body1: PhysicalBody,
    body2: PhysicalBody,
    collision: CollisionResult
  ): void {
    // 计算冲量
    const impulse = CollisionPhysics.calculateImpulse(
      body1,
      body2,
      collision.normal,
      Math.min(body1.restitution, body2.restitution)
    );
    
    // 应用冲量
    body1.velocity = MathUtils.subtract(
      body1.velocity,
      MathUtils.multiply(impulse, 1 / body1.mass)
    );
    
    body2.velocity = MathUtils.add(
      body2.velocity,
      MathUtils.multiply(impulse, 1 / body2.mass)
    );
    
    // 位置修正（防止穿透）
    const correction = MathUtils.multiply(collision.normal, collision.penetration * 0.8);
    const totalMass = body1.mass + body2.mass;
    
    body1.position = MathUtils.subtract(
      body1.position,
      MathUtils.multiply(correction, body2.mass / totalMass)
    );
    
    body2.position = MathUtils.add(
      body2.position,
      MathUtils.multiply(correction, body1.mass / totalMass)
    );
  }
  
  // 应用力到物体
  applyForce(body: PhysicalBody, force: Vector2D): void {
    body.forces.push(force);
  }
  
  // 应用冲量
  applyImpulse(body: PhysicalBody, impulse: Vector2D): void {
    const velocityChange = MathUtils.multiply(impulse, 1 / body.mass);
    body.velocity = MathUtils.add(body.velocity, velocityChange);
  }
  
  // 获取系统总动能
  getTotalKineticEnergy(): number {
    return this.bodies.reduce((sum, body) => {
      return sum + Dynamics.kineticEnergy(body.mass, body.velocity);
    }, 0);
  }
  
  // 获取系统总动量
  getTotalMomentum(): Vector2D {
    return this.bodies.reduce((total, body) => {
      const momentum = Dynamics.momentum(body.mass, body.velocity);
      return MathUtils.add(total, momentum);
    }, { x: 0, y: 0 });
  }
  
  // 清除所有物体
  clear(): void {
    this.bodies = [];
  }
  
  // 获取所有物理体
  getBodies(): ReadonlyArray<PhysicalBody> {
    return this.bodies;
  }
}

export class DisplacementCalculator {
  
  // ==================== 基础公式 ====================
  
  /**
   * 方法1：匀速直线运动的位移
   * s = v * dt
   */
  static uniformMotionDisplacement(
    velocity: Vector2D,
    dt: number
  ): Vector2D {
    return MathUtils.multiply(velocity, dt);
  }
  
  /**
   * 方法2：匀加速直线运动的位移
   * s = v0 * dt + 0.5 * a * dt²
   */
  static uniformlyAcceleratedMotion(
    initialVelocity: Vector2D,
    acceleration: Vector2D,
    dt: number
  ): Vector2D {
    const term1 = MathUtils.multiply(initialVelocity, dt);
    const term2 = MathUtils.multiply(acceleration, 0.5 * dt * dt);
    return MathUtils.add(term1, term2);
  }
  
  /**
   * 方法3：基于力和质量的位移（牛顿第二定律）
   * a = F / m
   * s = v0 * dt + 0.5 * (F / m) * dt²
   */
  static forceBasedDisplacement(
    position: Vector2D,
    velocity: Vector2D,
    force: Vector2D,
    mass: number,
    dt: number
  ): Vector2D {
    const acceleration = MathUtils.multiply(force, 1 / mass);
    return this.uniformlyAcceleratedMotion(velocity, acceleration, dt);
  }

    /**
   * 方法8：角位移计算
   * θ = ω * dt + 0.5 * α * dt²
   */
  static angularDisplacement(
    angle: number,
    angularVelocity: number,
    angularAcceleration: number,
    dt: number
  ): number {
    return angularVelocity * dt + 0.5 * angularAcceleration * dt * dt;
  }
  
  /**
   * 方法9：圆周运动的线位移
   * 从角位移转换为弧长: s = r * θ
   */
  static circularMotionDisplacement(
    center: Vector2D,
    radius: number,
    angle: number,
    angularVelocity: number,
    dt: number
  ): Vector2D {
    // 计算角位移
    const deltaAngle = angularVelocity * dt;
    const newAngle = angle + deltaAngle;
    
    // 计算新位置
    const newX = center.x + radius * Math.cos(newAngle);
    const newY = center.y + radius * Math.sin(newAngle);
    
    return { x: newX, y: newY };
  }
  
  /**
   * 方法10：受向心力和切线力作用的圆周运动
   */
  static circularMotionWithForces(
    center: Vector2D,
    position: Vector2D,
    tangentialVelocity: number,
    radius: number,
    tangentialForce: number,
    mass: number,
    dt: number
  ): { newPosition: Vector2D; newVelocity: number } {
    
    // 计算向心加速度
    const centripetalAcceleration = (tangentialVelocity * tangentialVelocity) / radius;
    const centripetalForce = mass * centripetalAcceleration;
    
    // 切线加速度
    const tangentialAcceleration = tangentialForce / mass;
    const newTangentialVelocity = tangentialVelocity + tangentialAcceleration * dt;
    
    // 新的半径（如果有径向力）
    // 这里简化为半径不变
    
    // 计算角速度
    const angularVelocity = newTangentialVelocity / radius;
    
    // 当前角度
    const delta = MathUtils.subtract(position, center);
    const currentAngle = Math.atan2(delta.y, delta.x);
    
    // 新的角度
    const newAngle = currentAngle + angularVelocity * dt;
    
    // 新位置
    const newPosition = {
      x: center.x + radius * Math.cos(newAngle),
      y: center.y + radius * Math.sin(newAngle),
    };
    
    return { newPosition, newVelocity: newTangentialVelocity };
  }
    /**
   * 方法11：2D平面上的复合运动
   * 考虑x和y方向的独立运动
   */
  static compositeMotion2D(
    position: Vector2D,
    velocity: Vector2D,
    acceleration: Vector2D,
    dt: number
  ): Vector2D {
    // x方向位移
    const dx = velocity.x * dt + 0.5 * acceleration.x * dt * dt;
    // y方向位移
    const dy = velocity.y * dt + 0.5 * acceleration.y * dt * dt;
    
    return {
      x: position.x + dx,
      y: position.y + dy,
    };
  }
  
  /**
   * 方法12：带角度方向的运动
   * 力和初速度都有方向角
   */
  static directionalMotion(
    position: Vector2D,
    speed: number,
    directionAngle: number,
    forceMagnitude: number,
    forceAngle: number,
    mass: number,
    friction: number,
    dt: number
  ): { newPosition: Vector2D; newSpeed: number; newAngle: number } {
    
    // 将速度和力分解为x,y分量
    const velocity = {
      x: speed * Math.cos(directionAngle),
      y: speed * Math.sin(directionAngle),
    };
    
    const force = {
      x: forceMagnitude * Math.cos(forceAngle),
      y: forceMagnitude * Math.sin(forceAngle),
    };
    
    // 计算摩擦力（与速度方向相反）
    let frictionForce = { x: 0, y: 0 };
    if (speed > 0) {
      const frictionMagnitude = friction * mass * 9.8;
      frictionForce = {
        x: -Math.cos(directionAngle) * frictionMagnitude,
        y: -Math.sin(directionAngle) * frictionMagnitude,
      };
    }
    
    // 净力
    const netForce = {
      x: force.x + frictionForce.x,
      y: force.y + frictionForce.y,
    };
    
    // 加速度
    const acceleration = {
      x: netForce.x / mass,
      y: netForce.y / mass,
    };
    
    // 新速度
    const newVelocity = {
      x: velocity.x + acceleration.x * dt,
      y: velocity.y + acceleration.y * dt,
    };
    
    // 新位置
    const newPosition = {
      x: position.x + newVelocity.x * dt,
      y: position.y + newVelocity.y * dt,
    };
    
    // 计算新的速度和方向
    const newSpeed = Math.sqrt(
      newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y
    );
    const newAngle = Math.atan2(newVelocity.y, newVelocity.x);
    
    return { newPosition, newSpeed, newAngle };
  }
}