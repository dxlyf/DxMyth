/**
 * 物理常数定义
 */
export declare const PhysicsConstants: {
    readonly GRAVITY_EARTH: 9.80665;
    readonly GRAVITY_MOON: 1.62;
    readonly GRAVITY_MARS: 3.71;
    readonly AIR_DENSITY_SEA_LEVEL: 1.225;
    readonly AIR_DENSITY_1000M: 1.112;
    readonly FRICTION_COEFFICIENTS: {
        readonly STEEL_ON_STEEL: 0.6;
        readonly WOOD_ON_WOOD: 0.25;
        readonly RUBBER_ON_DRY_CONCRETE: 0.7;
        readonly TEFLON_ON_TEFLON: 0.04;
        readonly ICE_ON_ICE: 0.1;
    };
    readonly ELASTICITY_COEFFICIENTS: {
        readonly STEEL: 200;
        readonly ALUMINUM: 70;
        readonly GLASS: 65;
        readonly RUBBER: 0.01;
        readonly HUMAN_TISSUE: 0.002;
    };
    readonly VISCOSITY: {
        readonly AIR_20C: 0.000018;
        readonly WATER_20C: 0.001;
        readonly HONEY_20C: 10;
        readonly BLOOD_37C: 0.003;
    };
};
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
    mass: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    forces: Vector2D[];
    restitution: number;
    friction: number;
    area?: number;
    volume?: number;
    density?: number;
}
export interface SpringConfig {
    stiffness: number;
    damping: number;
    restLength: number;
    breakForce?: number;
}
export interface CollisionResult {
    normal: Vector2D;
    penetration: number;
    point: Vector2D;
    impulse: Vector2D;
}
/**
 * 数学工具类
 */
export declare class MathUtils {
    static degToRad(degrees: number): number;
    static radToDeg(radians: number): number;
    static vectorLength(v: Vector2D): number;
    static normalize(v: Vector2D): Vector2D;
    static dot(v1: Vector2D, v2: Vector2D): number;
    static cross(v1: Vector2D, v2: Vector2D): number;
    static add(v1: Vector2D, v2: Vector2D): Vector2D;
    static subtract(v1: Vector2D, v2: Vector2D): Vector2D;
    static multiply(v: Vector2D, scalar: number): Vector2D;
    static distance(p1: Vector2D, p2: Vector2D): number;
    static lerp(start: number, end: number, t: number): number;
    static lerpVector(v1: Vector2D, v2: Vector2D, t: number): Vector2D;
    static clamp(value: number, min: number, max: number): number;
    static clampVector(v: Vector2D, maxLength: number): Vector2D;
    static randomInRange(min: number, max: number): number;
    static randomVector(length?: number): Vector2D;
    static angleBetween(v1: Vector2D, v2: Vector2D): number;
    static rotateVector(v: Vector2D, angle: number): Vector2D;
}
/**
 * 运动学公式
 */
export declare class Kinematics {
    static uniformAcceleration(initialVelocity: number, acceleration: number, time: number): number;
    static finalVelocity(initialVelocity: number, acceleration: number, distance: number): number;
    static timeToTravel(initialVelocity: number, acceleration: number, distance: number): number;
    static projectileRange(initialVelocity: number, launchAngle: number, gravity?: number): number;
    static projectileMaxHeight(initialVelocity: number, launchAngle: number, gravity?: number): number;
    static projectileTimeOfFlight(initialVelocity: number, launchAngle: number, gravity?: number): number;
    static centripetalAcceleration(velocity: number, radius: number): number;
    static centripetalForce(mass: number, velocity: number, radius: number): number;
    static simpleHarmonicMotion(amplitude: number, angularFrequency: number, time: number, phase?: number): number;
    static simpleHarmonicVelocity(amplitude: number, angularFrequency: number, time: number, phase?: number): number;
}
/**
 * 动力学公式
 */
export declare class Dynamics {
    static newtonSecondLaw(mass: number, acceleration: Vector2D): Vector2D;
    static accelerationFromForce(mass: number, force: Vector2D): Vector2D;
    static gravitationalForce(mass: number, gravity?: number): Vector2D;
    static springForce(stiffness: number, displacement: Vector2D): Vector2D;
    static dampingForce(damping: number, velocity: Vector2D): Vector2D;
    static springMassDamperForce(stiffness: number, damping: number, displacement: Vector2D, velocity: Vector2D): Vector2D;
    static staticFriction(normalForce: number, frictionCoefficient: number): number;
    static kineticFriction(normalForce: number, frictionCoefficient: number): number;
    static airResistance(density: number, dragCoefficient: number, area: number, velocity: Vector2D): Vector2D;
    static buoyantForce(fluidDensity: number, volume: number, gravity?: number): Vector2D;
    static tensionForce(mass: number, gravity?: number, acceleration?: number): number;
    static momentum(mass: number, velocity: Vector2D): Vector2D;
    static impulse(force: Vector2D, time: number): Vector2D;
    static kineticEnergy(mass: number, velocity: Vector2D): number;
    static gravitationalPotentialEnergy(mass: number, height: number, gravity?: number): number;
    static springPotentialEnergy(stiffness: number, displacement: number): number;
    static power(force: Vector2D, velocity: Vector2D): number;
    static work(force: Vector2D, displacement: Vector2D): number;
}
/**
 * 弹簧物理计算
 */
export declare class SpringPhysics {
    static criticalDamping(mass: number, stiffness: number): number;
    static dampingRatio(damping: number, mass: number, stiffness: number): number;
    static naturalFrequency(mass: number, stiffness: number): number;
    static dampedFrequency(mass: number, stiffness: number, damping: number): number;
    static springPeriod(mass: number, stiffness: number): number;
    static underDampedDisplacement(initialPosition: number, initialVelocity: number, targetPosition: number, mass: number, stiffness: number, damping: number, time: number): number;
    static criticallyDampedDisplacement(initialPosition: number, initialVelocity: number, targetPosition: number, mass: number, stiffness: number, damping: number, time: number): number;
    static overDampedDisplacement(initialPosition: number, initialVelocity: number, targetPosition: number, mass: number, stiffness: number, damping: number, time: number): number;
    static springDisplacement(initialPosition: number, initialVelocity: number, targetPosition: number, mass: number, stiffness: number, damping: number, time: number): number;
    static settlingTime(mass: number, stiffness: number, damping: number, epsilon?: number): number;
}
/**
 * 碰撞物理计算
 */
export declare class CollisionPhysics {
    static circleCircleCollision(pos1: Vector2D, radius1: number, pos2: Vector2D, radius2: number): CollisionResult | null;
    static aabbCollision(min1: Vector2D, max1: Vector2D, min2: Vector2D, max2: Vector2D): CollisionResult | null;
    static calculateImpulse(body1: PhysicalBody, body2: PhysicalBody, normal: Vector2D, restitution?: number): Vector2D;
    static elasticCollisionVelocity(m1: number, v1: Vector2D, m2: number, v2: Vector2D): [Vector2D, Vector2D];
    static inelasticCollisionVelocity(m1: number, v1: Vector2D, m2: number, v2: Vector2D, restitution?: number): [Vector2D, Vector2D];
    static perfectlyInelasticCollision(m1: number, v1: Vector2D, m2: number, v2: Vector2D): Vector2D;
    static rotationalCollision(velocity: Vector2D, angularVelocity: number, radius: number, collisionPoint: Vector2D, normal: Vector2D, momentOfInertia: number): [Vector2D, number];
}
/**
 * 物理模拟器（整合所有物理计算）
 */
export declare class PhysicsSimulator {
    private bodies;
    private gravity;
    private timeScale;
    private damping;
    constructor(config?: {
        gravity?: Vector2D;
        timeScale?: number;
        damping?: number;
    });
    addBody(body: PhysicalBody): void;
    removeBody(body: PhysicalBody): void;
    setGravity(gravity: Vector2D): void;
    setTimeScale(scale: number): void;
    step(deltaTime: number): void;
    private updateBody;
    private resolveCollisions;
    private resolveCollision;
    applyForce(body: PhysicalBody, force: Vector2D): void;
    applyImpulse(body: PhysicalBody, impulse: Vector2D): void;
    getTotalKineticEnergy(): number;
    getTotalMomentum(): Vector2D;
    clear(): void;
    getBodies(): ReadonlyArray<PhysicalBody>;
}
export declare class DisplacementCalculator {
    /**
     * 方法1：匀速直线运动的位移
     * s = v * dt
     */
    static uniformMotionDisplacement(velocity: Vector2D, dt: number): Vector2D;
    /**
     * 方法2：匀加速直线运动的位移
     * s = v0 * dt + 0.5 * a * dt²
     */
    static uniformlyAcceleratedMotion(initialVelocity: Vector2D, acceleration: Vector2D, dt: number): Vector2D;
    /**
     * 方法3：基于力和质量的位移（牛顿第二定律）
     * a = F / m
     * s = v0 * dt + 0.5 * (F / m) * dt²
     */
    static forceBasedDisplacement(position: Vector2D, velocity: Vector2D, force: Vector2D, mass: number, dt: number): Vector2D;
    /**
   * 方法8：角位移计算
   * θ = ω * dt + 0.5 * α * dt²
   */
    static angularDisplacement(angle: number, angularVelocity: number, angularAcceleration: number, dt: number): number;
    /**
     * 方法9：圆周运动的线位移
     * 从角位移转换为弧长: s = r * θ
     */
    static circularMotionDisplacement(center: Vector2D, radius: number, angle: number, angularVelocity: number, dt: number): Vector2D;
    /**
     * 方法10：受向心力和切线力作用的圆周运动
     */
    static circularMotionWithForces(center: Vector2D, position: Vector2D, tangentialVelocity: number, radius: number, tangentialForce: number, mass: number, dt: number): {
        newPosition: Vector2D;
        newVelocity: number;
    };
    /**
   * 方法11：2D平面上的复合运动
   * 考虑x和y方向的独立运动
   */
    static compositeMotion2D(position: Vector2D, velocity: Vector2D, acceleration: Vector2D, dt: number): Vector2D;
    /**
     * 方法12：带角度方向的运动
     * 力和初速度都有方向角
     */
    static directionalMotion(position: Vector2D, speed: number, directionAngle: number, forceMagnitude: number, forceAngle: number, mass: number, friction: number, dt: number): {
        newPosition: Vector2D;
        newSpeed: number;
        newAngle: number;
    };
}
