/**
 * 公司级物理计算工具库
 * 包含经典物理公式、数值积分方法、单位转换等
 */
export declare const PhysicsConstants: {
    readonly GRAVITY: 9.81;
    readonly SPEED_OF_LIGHT: 299792458;
    readonly PLANCK_CONSTANT: 6.62607015e-34;
    readonly BOLTZMANN_CONSTANT: 1.380649e-23;
    readonly DEG_TO_RAD: number;
    readonly RAD_TO_DEG: number;
    readonly STANDARD_FRAME_TIME: number;
};
export interface Vector2D {
    x: number;
    y: number;
}
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}
export declare class VectorMath {
    static add(v1: Vector2D, v2: Vector2D): Vector2D;
    static subtract(v1: Vector2D, v2: Vector2D): Vector2D;
    static multiply(v: Vector2D, scalar: number): Vector2D;
    static divide(v: Vector2D, scalar: number): Vector2D;
    static magnitude(v: Vector2D): number;
    static normalize(v: Vector2D): Vector2D;
    static dot(v1: Vector2D, v2: Vector2D): number;
    static cross(v1: Vector2D, v2: Vector2D): number;
    static distance(v1: Vector2D, v2: Vector2D): number;
    static angle(v1: Vector2D, v2: Vector2D): number;
    static rotate(v: Vector2D, angle: number): Vector2D;
    static add3(v1: Vector3D, v2: Vector3D): Vector3D;
    static magnitude3(v: Vector3D): number;
}
export declare class Kinematics {
    /**
     * 匀加速直线运动公式
     */
    static displacement1(v0: number, a: number, t: number): number;
    static displacement2(v0: number, v: number, t: number): number;
    static finalVelocity(v0: number, a: number, s: number): number;
    static timeFromDisplacement(s: number, v0?: number, a?: number): number[];
    /**
     * 抛体运动
     */
    static projectileMotion(initialVelocity: number, launchAngle: number, // 弧度
    time: number, g?: number): {
        x: number;
        y: number;
        vx: number;
        vy: number;
    };
    static maxHeight(initialVelocity: number, launchAngle: number, g?: number): number;
    static range(initialVelocity: number, launchAngle: number, g?: number): number;
    /**
     * 圆周运动
     */
    static centripetalAcceleration(v: number, r: number): number;
    static angularVelocity(v: number, r: number): number;
    static periodFromRadius(r: number, g?: number): number;
}
export declare class Dynamics {
    /**
     * 牛顿定律
     */
    static forceFromMassAndAcceleration(m: number, a: number): number;
    static accelerationFromForceAndMass(F: number, m: number): number;
    static massFromForceAndAcceleration(F: number, a: number): number;
    /**
     * 动量
     */
    static momentum(m: number, v: number): number;
    static impulse(F: number, t: number): number;
    static elasticCollision(m1: number, v1: number, m2: number, v2: number): {
        v1Final: number;
        v2Final: number;
    };
    static inelasticCollision(m1: number, v1: number, m2: number, v2: number): number;
    /**
     * 能量
     */
    static kineticEnergy(m: number, v: number): number;
    static potentialEnergy(m: number, h: number, g?: number): number;
    static springPotentialEnergy(k: number, x: number): number;
    static conservationOfEnergy(initialKE: number, initialPE: number, finalKE: number, finalPE: number): boolean;
}
export interface SpringMassSystem {
    mass: number;
    stiffness: number;
    damping: number;
    position: number;
    velocity: number;
    equilibrium: number;
}
export declare class SpringPhysics {
    /**
     * 计算临界阻尼系数
     * c_critical = 2 * √(m * k)
     */
    static criticalDamping(mass: number, stiffness: number): number;
    /**
     * 计算阻尼比 (ζ)
     * ζ = c / c_critical
     */
    static dampingRatio(damping: number, mass: number, stiffness: number): number;
    /**
     * 判断系统状态
     * ζ < 1: 欠阻尼 (振荡衰减)
     * ζ = 1: 临界阻尼 (最快无振荡)
     * ζ > 1: 过阻尼 (缓慢无振荡)
     */
    static systemBehavior(damping: number, mass: number, stiffness: number): string;
    /**
     * 计算自然频率
     * ω_n = √(k / m)
     */
    static naturalFrequency(stiffness: number, mass: number): number;
    /**
     * 计算阻尼振动频率
     * ω_d = ω_n * √(1 - ζ²)
     */
    static dampedFrequency(stiffness: number, mass: number, damping: number): number;
    /**
     * 计算振幅衰减
     * A(t) = A₀ * exp(-ζ * ω_n * t)
     */
    static amplitudeDecay(initialAmplitude: number, stiffness: number, mass: number, damping: number, time: number): number;
    /**
     * 计算衰减时间（振幅衰减到初始值的1/e所需时间）
     * τ = 1 / (ζ * ω_n)
     */
    static decayTime(stiffness: number, mass: number, damping: number): number;
    /**
     * 计算弹簧力
     * F_spring = -k * (x - x_eq)
     */
    static springForce(system: SpringMassSystem): number;
    /**
     * 计算阻尼力
     * F_damping = -c * v
     */
    static dampingForce(system: SpringMassSystem): number;
    /**
     * 计算总加速度
     * a = (F_spring + F_damping) / m
     */
    static totalAcceleration(system: SpringMassSystem): number;
    /**
     * 预测系统停止时间（精度阈值内）
     */
    static estimateStopTime(system: SpringMassSystem, precision?: number): number;
}
export interface IntegrationResult {
    position: number;
    velocity: number;
    acceleration: number;
}
export declare class NumericalIntegrator {
    /**
     * 显式欧拉法（最简单，精度低，可能不稳定）
     * x_{n+1} = x_n + v_n * dt
     * v_{n+1} = v_n + a_n * dt
     */
    static explicitEuler(position: number, velocity: number, acceleration: number, dt: number): IntegrationResult;
    /**
     * 半隐式欧拉法（更稳定，常用于游戏物理）
     * v_{n+1} = v_n + a_n * dt
     * x_{n+1} = x_n + v_{n+1} * dt
     */
    static semiImplicitEuler(position: number, velocity: number, acceleration: number, dt: number): IntegrationResult;
    /**
     * Verlet积分（能量守恒好，适用于分子动力学）
     * x_{n+1} = 2x_n - x_{n-1} + a_n * dt²
     */
    static verlet(currentPosition: number, previousPosition: number, acceleration: number, dt: number): IntegrationResult;
    /**
     * 速度Verlet积分（更准确的Verlet变体）
     * x_{n+1} = x_n + v_n * dt + 0.5 * a_n * dt²
     * v_{n+1} = v_n + 0.5 * (a_n + a_{n+1}) * dt
     */
    static velocityVerlet(position: number, velocity: number, currentAcceleration: number, nextAcceleration: number, dt: number): IntegrationResult;
    /**
     * Runge-Kutta 4阶（高精度，计算量大）
     */
    static rungeKutta4(position: number, velocity: number, accelerationFunc: (pos: number, vel: number) => number, dt: number): IntegrationResult;
    /**
     * 自适应步长积分器（根据误差自动调整步长）
     */
    static adaptiveStepRK4(position: number, velocity: number, accelerationFunc: (pos: number, vel: number) => number, dt: number, tolerance?: number): {
        result: IntegrationResult;
        suggestedDt: number;
    };
}
export interface CollisionResult {
    collision: boolean;
    normal?: Vector2D;
    depth?: number;
    point?: Vector2D;
}
export declare class CollisionPhysics {
    /**
     * 圆形碰撞检测
     */
    static circleCollision(pos1: Vector2D, radius1: number, pos2: Vector2D, radius2: number): CollisionResult;
    /**
     * AABB（轴对齐包围盒）碰撞检测
     */
    static aabbCollision(min1: Vector2D, max1: Vector2D, min2: Vector2D, max2: Vector2D): CollisionResult;
    /**
     * 弹性碰撞响应
     */
    static elasticResponse(m1: number, v1: Vector2D, m2: number, v2: Vector2D, normal: Vector2D, restitution?: number): {
        v1Final: Vector2D;
        v2Final: Vector2D;
    };
    /**
     * 摩擦力计算
     */
    static frictionForce(normalForce: number, velocity: Vector2D, staticFriction: number, kineticFriction: number): Vector2D;
}
export declare class FluidDynamics {
    /**
     * 斯托克斯阻力（小雷诺数，粘性主导）
     * F = 6πμRv
     */
    static stokesDrag(viscosity: number, // 粘度 (Pa·s)
    radius: number, // 球体半径 (m)
    velocity: number): number;
    /**
     * 牛顿阻力（大雷诺数，惯性主导）
     * F = 0.5 * ρ * v² * A * C_d
     */
    static newtonianDrag(density: number, // 流体密度 (kg/m³)
    velocity: number, // 速度 (m/s)
    area: number, // 迎风面积 (m²)
    dragCoefficient: number): number;
    /**
     * 计算终端速度（重力与阻力平衡）
     * v_terminal = √(2mg / ρAC_d)
     */
    static terminalVelocity(mass: number, gravity: number, density: number, area: number, dragCoefficient: number): number;
    /**
     * 雷诺数计算
     * Re = ρvL/μ
     */
    static reynoldsNumber(density: number, velocity: number, characteristicLength: number, viscosity: number): number;
}
export declare class EasingFunctions {
    /**
     * 线性缓动
     */
    static linear(t: number): number;
    /**
     * 二次缓动
     */
    static easeInQuad(t: number): number;
    static easeOutQuad(t: number): number;
    static easeInOutQuad(t: number): number;
    /**
     * 三次缓动
     */
    static easeInCubic(t: number): number;
    static easeOutCubic(t: number): number;
    static easeInOutCubic(t: number): number;
    /**
     * 正弦缓动
     */
    static easeInSine(t: number): number;
    static easeOutSine(t: number): number;
    static easeInOutSine(t: number): number;
    /**
     * 指数缓动
     */
    static easeInExpo(t: number): number;
    static easeOutExpo(t: number): number;
    /**
     * 弹性缓动（弹簧效果）
     */
    static elasticOut(t: number, amplitude?: number, period?: number): number;
    /**
     * 回弹缓动
     */
    static bounceOut(t: number): number;
    /**
     * 物理弹簧缓动（基于真实物理）
     */
    static springPhysics(t: number, mass?: number, stiffness?: number, damping?: number): number;
}
export declare class PhysicsUtils {
    /**
     * 单位转换
     */
    static degreesToRadians(degrees: number): number;
    static radiansToDegrees(radians: number): number;
    static metersToPixels(meters: number, pixelsPerMeter?: number): number;
    static pixelsToMeters(pixels: number, pixelsPerMeter?: number): number;
    /**
     * 帧时间处理
     */
    static calculateDeltaTime(lastTime: number): number;
    static getFrameTime(targetFPS?: number): number;
    /**
     * 物理量限制器
     */
    static clamp(value: number, min: number, max: number): number;
    static lerp(start: number, end: number, t: number): number;
    static inverseLerp(start: number, end: number, value: number): number;
    /**
     * 随机物理量
     */
    static randomVelocity(minSpeed: number, maxSpeed: number): Vector2D;
    static randomForce(minMagnitude: number, maxMagnitude: number): Vector2D;
    /**
     * 物理系统诊断
     */
    static diagnoseSpringSystem(system: SpringMassSystem): {
        behavior: string;
        naturalFrequency: number;
        dampedFrequency: number;
        dampingRatio: number;
        decayTime: number;
    };
}
export declare class PhysicsExamples {
    /**
     * 示例1：弹簧动画系统
     */
    static createSpringAnimation(): {
        diagnosis: {
            behavior: string;
            naturalFrequency: number;
            dampedFrequency: number;
            dampingRatio: number;
            decayTime: number;
        };
        positions: number[];
    };
    /**
     * 示例2：抛体运动
     */
    static simulateProjectile(initialVelocity: number, launchAngle: number, duration?: number): {
        positions: Vector2D[];
        maxHeight: number;
        range: number;
    };
    /**
     * 示例3：碰撞响应
     */
    static simulateCollision(): {
        before: {
            ball1Vel: {
                x: number;
                y: number;
            };
            ball2Vel: {
                x: number;
                y: number;
            };
        };
        after: {
            ball1Vel: Vector2D;
            ball2Vel: Vector2D;
        };
    };
}
declare const _default: {
    PhysicsConstants: {
        readonly GRAVITY: 9.81;
        readonly SPEED_OF_LIGHT: 299792458;
        readonly PLANCK_CONSTANT: 6.62607015e-34;
        readonly BOLTZMANN_CONSTANT: 1.380649e-23;
        readonly DEG_TO_RAD: number;
        readonly RAD_TO_DEG: number;
        readonly STANDARD_FRAME_TIME: number;
    };
    VectorMath: typeof VectorMath;
    Kinematics: typeof Kinematics;
    Dynamics: typeof Dynamics;
    SpringPhysics: typeof SpringPhysics;
    NumericalIntegrator: typeof NumericalIntegrator;
    CollisionPhysics: typeof CollisionPhysics;
    FluidDynamics: typeof FluidDynamics;
    EasingFunctions: typeof EasingFunctions;
    PhysicsUtils: typeof PhysicsUtils;
    PhysicsExamples: typeof PhysicsExamples;
};
export default _default;
