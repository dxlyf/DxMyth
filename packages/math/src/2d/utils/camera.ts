// ==================== 数学工具类 ====================
class MathUtils {
    public static degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }
    
    public static radiansToDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }
    
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }
    
    public static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }
    
    public static toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }
    
    public static toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }
}

// 4x4矩阵类
class Mat4 {
    private data: Float32Array;
    
    constructor() {
        this.data = new Float32Array(16);
        this.identity();
    }
    
    public identity(): Mat4 {
        const m = this.data;
        m[0] = 1; m[4] = 0; m[8] = 0; m[12] = 0;
        m[1] = 0; m[5] = 1; m[9] = 0; m[13] = 0;
        m[2] = 0; m[6] = 0; m[10] = 1; m[14] = 0;
        m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
        return this;
    }
    
    public perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        
        const m = this.data;
        m[0] = f / aspect;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        
        m[4] = 0;
        m[5] = f;
        m[6] = 0;
        m[7] = 0;
        
        m[8] = 0;
        m[9] = 0;
        m[10] = (far + near) * nf;
        m[11] = -1;
        
        m[12] = 0;
        m[13] = 0;
        m[14] = (2 * far * near) * nf;
        m[15] = 0;
        
        return this;
    }
    
    public orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        
        const m = this.data;
        m[0] = -2 * lr;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        
        m[4] = 0;
        m[5] = -2 * bt;
        m[6] = 0;
        m[7] = 0;
        
        m[8] = 0;
        m[9] = 0;
        m[10] = 2 * nf;
        m[11] = 0;
        
        m[12] = (left + right) * lr;
        m[13] = (top + bottom) * bt;
        m[14] = (far + near) * nf;
        m[15] = 1;
        
        return this;
    }
    
    public lookAt(eye: [number, number, number], center: [number, number, number], up: [number, number, number]): Mat4 {
        const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2];
        const centerX = center[0], centerY = center[1], centerZ = center[2];
        const upX = up[0], upY = up[1], upZ = up[2];
        
        let z0 = eyeX - centerX;
        let z1 = eyeY - centerY;
        let z2 = eyeZ - centerZ;
        
        let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        
        let x0 = upY * z2 - upZ * z1;
        let x1 = upZ * z0 - upX * z2;
        let x2 = upX * z1 - upY * z0;
        
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (len === 0) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        
        let y0 = z1 * x2 - z2 * x1;
        let y1 = z2 * x0 - z0 * x2;
        let y2 = z0 * x1 - z1 * x0;
        
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (len === 0) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        
        const m = this.data;
        m[0] = x0;
        m[1] = y0;
        m[2] = z0;
        m[3] = 0;
        
        m[4] = x1;
        m[5] = y1;
        m[6] = z1;
        m[7] = 0;
        
        m[8] = x2;
        m[9] = y2;
        m[10] = z2;
        m[11] = 0;
        
        m[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
        m[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
        m[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
        m[15] = 1;
        
        return this;
    }
    
    public translate(x: number, y: number, z: number): Mat4 {
        const m = this.data;
        
        m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
        m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
        m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
        m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
        
        return this;
    }
    
    public rotateX(rad: number): Mat4 {
        const m = this.data;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        
        m[4] = a10 * c + a20 * s;
        m[5] = a11 * c + a21 * s;
        m[6] = a12 * c + a22 * s;
        m[7] = a13 * c + a23 * s;
        
        m[8] = a20 * c - a10 * s;
        m[9] = a21 * c - a11 * s;
        m[10] = a22 * c - a12 * s;
        m[11] = a23 * c - a13 * s;
        
        return this;
    }
    
    public rotateY(rad: number): Mat4 {
        const m = this.data;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        
        m[0] = a00 * c - a20 * s;
        m[1] = a01 * c - a21 * s;
        m[2] = a02 * c - a22 * s;
        m[3] = a03 * c - a23 * s;
        
        m[8] = a00 * s + a20 * c;
        m[9] = a01 * s + a21 * c;
        m[10] = a02 * s + a22 * c;
        m[11] = a03 * s + a23 * c;
        
        return this;
    }
    
    public rotateZ(rad: number): Mat4 {
        const m = this.data;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        
        m[0] = a00 * c + a10 * s;
        m[1] = a01 * c + a11 * s;
        m[2] = a02 * c + a12 * s;
        m[3] = a03 * c + a13 * s;
        
        m[4] = a10 * c - a00 * s;
        m[5] = a11 * c - a01 * s;
        m[6] = a12 * c - a02 * s;
        m[7] = a13 * c - a03 * s;
        
        return this;
    }
    
    public scale(x: number, y: number, z: number): Mat4 {
        const m = this.data;
        
        m[0] *= x;
        m[1] *= x;
        m[2] *= x;
        m[3] *= x;
        
        m[4] *= y;
        m[5] *= y;
        m[6] *= y;
        m[7] *= y;
        
        m[8] *= z;
        m[9] *= z;
        m[10] *= z;
        m[11] *= z;
        
        return this;
    }
    
    public multiply(other: Mat4): Mat4 {
        const a = this.data;
        const b = other.data;
        const result = new Float32Array(16);
        
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        
        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
        
        result[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        result[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        result[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        result[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        
        result[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        result[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        result[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        result[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        
        result[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        result[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        result[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        result[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        
        result[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        result[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        result[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        result[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        
        this.data = result;
        return this;
    }
    
    public copy(): Mat4 {
        const newMat = new Mat4();
        newMat.data.set(this.data);
        return newMat;
    }
    
    public getData(): Float32Array {
        return this.data;
    }
    
    public static create(): Mat4 {
        return new Mat4();
    }
}

// 向量3类
class Vec3 {
    public x: number;
    public y: number;
    public z: number;
    
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    
    public normalize(): Vec3 {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }
    
    public cross(other: Vec3): Vec3 {
        return new Vec3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }
    
    public dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    
    public add(other: Vec3): Vec3 {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    
    public subtract(other: Vec3): Vec3 {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    
    public multiplyScalar(scalar: number): Vec3 {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    public copy(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
    
    public toArray(): [number, number, number] {
        return [this.x, this.y, this.z];
    }
    
    public static fromArray(arr: [number, number, number]): Vec3 {
        return new Vec3(arr[0], arr[1], arr[2]);
    }
    
    public static create(x: number = 0, y: number = 0, z: number = 0): Vec3 {
        return new Vec3(x, y, z);
    }
}

// ==================== 基础类型和接口 ====================
export interface CameraOptions {
    position?: { x: number; y: number; z?: number };
    target?: { x: number; y: number; z?: number };
    zoom?: number;
    rotation?: { x?: number; y?: number; z?: number };
    near?: number;
    far?: number;
    fov?: number;
}

export interface CameraUpdate {
    position?: { x: number; y: number; z?: number };
    target?: { x: number; y: number; z?: number };
    zoom?: number;
    rotation?: { x?: number; y?: number; z?: number };
}

// ==================== 基础相机抽象类 ====================
abstract class BaseCamera {
    protected position: Vec3;
    protected target: Vec3 | null;
    protected up: Vec3;
    protected zoom: number;
    protected rotation: { x: number; y: number; z: number };
    protected near: number;
    protected far: number;
    protected fov: number;
    protected aspectRatio: number;
    
    constructor(options: CameraOptions = {}) {
        this.position = new Vec3(
            options.position?.x || 0,
            options.position?.y || 0,
            options.position?.z || 0
        );
        
        this.target = options.target ? new Vec3(
            options.target.x,
            options.target.y,
            options.target.z || 0
        ) : null;
        
        this.up = new Vec3(0, 1, 0);
        this.zoom = options.zoom || 1;
        this.rotation = {
            x: options.rotation?.x || 0,
            y: options.rotation?.y || 0,
            z: options.rotation?.z || 0
        };
        this.near = options.near || 0.1;
        this.far = options.far || 1000;
        this.fov = options.fov || 60;
        this.aspectRatio = 1;
    }
    
    abstract update(deltaTime: number): void;
    abstract resize(width: number, height: number): void;
    
    public getPosition(): Vec3 {
        return this.position.copy();
    }
    
    public getTarget(): Vec3 | null {
        return this.target ? this.target.copy() : null;
    }
    
    public getZoom(): number {
        return this.zoom;
    }
    
    public getRotation(): { x: number; y: number; z: number } {
        return { ...this.rotation };
    }
    
    public setPosition(x: number, y: number, z: number): void {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    
    public setTarget(x: number, y: number, z: number): void {
        this.target = new Vec3(x, y, z);
    }
    
    public setZoom(zoom: number): void {
        this.zoom = zoom;
    }
    
    public setRotation(x: number, y: number, z: number): void {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }
    
    public move(x: number, y: number, z: number): void {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }
    
    public rotate(x: number, y: number, z: number): void {
        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;
    }
}

// ==================== 2D 相机 ====================
export interface Camera2DOptions extends CameraOptions {
    viewportWidth: number;
    viewportHeight: number;
    minZoom?: number;
    maxZoom?: number;
    bounds?: {
        minX?: number;
        maxX?: number;
        minY?: number;
        maxY?: number;
    };
    orthographic?: boolean;
}

export class Camera2D extends BaseCamera {
    protected viewportWidth: number;
    protected viewportHeight: number;
    protected minZoom: number;
    protected maxZoom: number;
    protected bounds?: {
        minX?: number;
        maxX?: number;
        minY?: number;
        maxY?: number;
    };
    protected orthographic: boolean;
    
    protected isDragging: boolean = false;
    protected dragStart: { x: number; y: number } = { x: 0, y: 0 };
    protected dragStartPosition: Vec3 = new Vec3();
    
    protected animationTarget?: {
        position: Vec3;
        zoom: number;
        duration: number;
        elapsed: number;
        easing: (t: number) => number;
    };
    
    protected projectionMatrix: Mat4;
    protected viewMatrix: Mat4;
    protected viewProjectionMatrix: Mat4;
    protected invViewProjectionMatrix: Mat4;
    
    constructor(options: Camera2DOptions) {
        super(options);
        this.viewportWidth = options.viewportWidth;
        this.viewportHeight = options.viewportHeight;
        this.minZoom = options.minZoom || 0.1;
        this.maxZoom = options.maxZoom || 10;
        this.bounds = options.bounds;
        this.orthographic = options.orthographic ?? true;
        
        this.projectionMatrix = Mat4.create();
        this.viewMatrix = Mat4.create();
        this.viewProjectionMatrix = Mat4.create();
        this.invViewProjectionMatrix = Mat4.create();
        
        this.updateAspectRatio();
        this.updateMatrices();
    }
    
    public update(deltaTime: number): void {
        // 更新动画
        if (this.animationTarget) {
            this.animationTarget.elapsed += deltaTime;
            const t = Math.min(this.animationTarget.elapsed / this.animationTarget.duration, 1);
            const easedT = this.animationTarget.easing(t);
            
            const startPos = this.dragStartPosition;
            const targetPos = this.animationTarget.position;
            
            this.position.x = MathUtils.lerp(startPos.x, targetPos.x, easedT);
            this.position.y = MathUtils.lerp(startPos.y, targetPos.y, easedT);
            this.zoom = MathUtils.lerp(this.zoom, this.animationTarget.zoom, easedT);
            
            if (t >= 1) {
                this.animationTarget = undefined;
            }
        }
        
        this.updateMatrices();
    }
    
    public resize(width: number, height: number): void {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.updateAspectRatio();
        this.updateMatrices();
    }
    
    protected updateAspectRatio(): void {
        this.aspectRatio = this.viewportWidth / this.viewportHeight;
    }
    
    protected updateMatrices(): void {
        // 更新投影矩阵
        if (this.orthographic) {
            const zoom = this.zoom;
            const left = -this.viewportWidth * 0.5 / zoom;
            const right = this.viewportWidth * 0.5 / zoom;
            const bottom = -this.viewportHeight * 0.5 / zoom;
            const top = this.viewportHeight * 0.5 / zoom;
            
            this.projectionMatrix.orthographic(left, right, bottom, top, this.near, this.far);
        } else {
            this.projectionMatrix.perspective(
                MathUtils.toRadians(this.fov),
                this.aspectRatio,
                this.near,
                this.far
            );
        }
        
        // 更新视图矩阵
        this.viewMatrix.identity();
        
        // 应用平移
        this.viewMatrix.translate(-this.position.x, -this.position.y, -this.position.z);
        
        // 应用旋转
        if (this.rotation.x !== 0) this.viewMatrix.rotateX(this.rotation.x);
        if (this.rotation.y !== 0) this.viewMatrix.rotateY(this.rotation.y);
        if (this.rotation.z !== 0) this.viewMatrix.rotateZ(this.rotation.z);
        
        // 更新组合矩阵
        this.viewProjectionMatrix = this.projectionMatrix.copy().multiply(this.viewMatrix);
        
        // 计算逆矩阵（用于坐标转换）
        this.updateInverseMatrix();
    }
    
    protected updateInverseMatrix(): void {
        // 这里应该实现矩阵求逆，简化版本使用直接计算
        this.invViewProjectionMatrix.identity();
        // 实际应用中需要实现完整的矩阵求逆算法
    }
    
    public applyTransform(context: CanvasRenderingContext2D): void {
        context.save();
        
        // 重置变换
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // 应用相机变换
        context.translate(this.viewportWidth * 0.5, this.viewportHeight * 0.5);
        context.scale(this.zoom, this.zoom);
        if (this.rotation.z !== 0) {
            context.rotate(this.rotation.z);
        }
        context.translate(-this.position.x, -this.position.y);
    }
    
    public resetTransform(context: CanvasRenderingContext2D): void {
        context.restore();
    }
    
    public screenToWorld(screenX: number, screenY: number): Vec3 {
        if (this.orthographic) {
            // 正交投影的坐标转换
            const x = (screenX - this.viewportWidth * 0.5) / this.zoom + this.position.x;
            const y = (screenY - this.viewportHeight * 0.5) / this.zoom + this.position.y;
            return new Vec3(x, y, 0);
        } else {
            // 透视投影的坐标转换（简化版本）
            const ndcX = (2.0 * screenX) / this.viewportWidth - 1.0;
            const ndcY = 1.0 - (2.0 * screenY) / this.viewportHeight;
            
            // 使用射线与近平面相交的方式计算
            // 这里简化处理，返回近平面上的点
            return new Vec3(ndcX * 10, ndcY * 10, -this.near);
        }
    }
    
    public worldToScreen(worldX: number, worldY: number, worldZ: number = 0): { x: number; y: number } {
        if (this.orthographic) {
            const x = (worldX - this.position.x) * this.zoom + this.viewportWidth * 0.5;
            const y = (worldY - this.position.y) * this.zoom + this.viewportHeight * 0.5;
            return { x, y };
        } else {
            // 透视投影转换
            const vec = new Vec3(worldX, worldY, worldZ);
            // 实际应用中需要使用投影矩阵进行计算
            return { x: worldX, y: worldY };
        }
    }
    
    public zoomAtPoint(delta: number, screenX: number, screenY: number): void {
        const oldWorldPos = this.screenToWorld(screenX, screenY);
        
        // 计算新的缩放值
        const newZoom = MathUtils.clamp(this.zoom * (1 + delta), this.minZoom, this.maxZoom);
        
        if (Math.abs(newZoom - this.zoom) > 0.001) {
            this.zoom = newZoom;
            this.updateMatrices();
            
            // 调整位置以保持缩放点在相同世界位置
            const newWorldPos = this.screenToWorld(screenX, screenY);
            this.position.x += oldWorldPos.x - newWorldPos.x;
            this.position.y += oldWorldPos.y - newWorldPos.y;
            
            this.applyBounds();
            this.updateMatrices();
        }
    }
    
    public startDrag(screenX: number, screenY: number): void {
        this.isDragging = true;
        this.dragStart.x = screenX;
        this.dragStart.y = screenY;
        this.dragStartPosition = this.position.copy();
        this.animationTarget = undefined;
    }
    
    public drag(screenX: number, screenY: number): void {
        if (!this.isDragging) return;
        
        const deltaX = screenX - this.dragStart.x;
        const deltaY = screenY - this.dragStart.y;
        
        // 将屏幕偏移转换为世界偏移
        const worldDeltaX = deltaX / this.zoom;
        const worldDeltaY = deltaY / this.zoom;
        
        // 如果有旋转，需要调整偏移方向
        if (this.rotation.z !== 0) {
            const cos = Math.cos(-this.rotation.z);
            const sin = Math.sin(-this.rotation.z);
            this.position.x = this.dragStartPosition.x - (worldDeltaX * cos - worldDeltaY * sin);
            this.position.y = this.dragStartPosition.y - (worldDeltaX * sin + worldDeltaY * cos);
        } else {
            this.position.x = this.dragStartPosition.x - worldDeltaX;
            this.position.y = this.dragStartPosition.y - worldDeltaY;
        }
        
        this.applyBounds();
        this.updateMatrices();
    }
    
    public endDrag(): void {
        this.isDragging = false;
    }
    
    public panTo(x: number, y: number, zoom?: number, duration: number = 0.5): void {
        if (duration <= 0) {
            this.position.x = x;
            this.position.y = y;
            if (zoom !== undefined) {
                this.zoom = MathUtils.clamp(zoom, this.minZoom, this.maxZoom);
            }
            this.applyBounds();
            this.updateMatrices();
        } else {
            this.animationTarget = {
                position: new Vec3(x, y, this.position.z),
                zoom: zoom ?? this.zoom,
                duration,
                elapsed: 0,
                easing: (t: number) => t * t * (3 - 2 * t) // 平滑缓动函数
            };
            this.dragStartPosition = this.position.copy();
        }
    }
    
    protected applyBounds(): void {
        if (!this.bounds) return;
        
        if (this.bounds.minX !== undefined) {
            this.position.x = Math.max(this.bounds.minX, this.position.x);
        }
        if (this.bounds.maxX !== undefined) {
            this.position.x = Math.min(this.bounds.maxX, this.position.x);
        }
        if (this.bounds.minY !== undefined) {
            this.position.y = Math.max(this.bounds.minY, this.position.y);
        }
        if (this.bounds.maxY !== undefined) {
            this.position.y = Math.min(this.bounds.maxY, this.position.y);
        }
    }
    
    public getViewportBounds(): { left: number; right: number; top: number; bottom: number } {
        const halfWidth = this.viewportWidth * 0.5 / this.zoom;
        const halfHeight = this.viewportHeight * 0.5 / this.zoom;
        
        return {
            left: this.position.x - halfWidth,
            right: this.position.x + halfWidth,
            top: this.position.y - halfHeight,
            bottom: this.position.y + halfHeight
        };
    }
    
    public getProjectionMatrix(): Float32Array {
        return this.projectionMatrix.getData();
    }
    
    public getViewMatrix(): Float32Array {
        return this.viewMatrix.getData();
    }
    
    public getViewProjectionMatrix(): Float32Array {
        return this.viewProjectionMatrix.getData();
    }
    
    public isOrthographic(): boolean {
        return this.orthographic;
    }
    
    public setOrthographic(orthographic: boolean): void {
        this.orthographic = orthographic;
        this.updateMatrices();
    }
}

// ==================== 3D 相机 ====================
export interface Camera3DOptions extends CameraOptions {
    viewportWidth: number;
    viewportHeight: number;
    mode?: 'perspective' | 'orthographic';
    projection?: 'perspective' | 'orthographic';
}

export class Camera3D extends BaseCamera {
    protected viewportWidth: number;
    protected viewportHeight: number;
    protected mode: 'orbit' | 'first-person' | 'fly';
    protected projection: 'perspective' | 'orthographic';
    
    protected projectionMatrix: Mat4;
    protected viewMatrix: Mat4;
    protected viewProjectionMatrix: Mat4;
    protected invViewProjectionMatrix: Mat4;
    
    // 轨道控制参数
    protected orbitDistance: number = 5;
    protected minOrbitDistance: number = 1;
    protected maxOrbitDistance: number = 100;
    protected orbitTarget: Vec3 = new Vec3();
    
    // 控制参数
    protected moveSpeed: number = 5;
    protected rotationSpeed: number = 0.002;
    protected zoomSpeed: number = 0.1;
    
    // 输入状态
    protected keys: Set<string> = new Set();
    protected mouseButtons: Set<number> = new Set();
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected lastMouseX: number = 0;
    protected lastMouseY: number = 0;
    
    constructor(options: Camera3DOptions) {
        super(options);
        this.viewportWidth = options.viewportWidth;
        this.viewportHeight = options.viewportHeight;
        this.mode = 'orbit';
        this.projection = options.projection || 'perspective';
        
        if (options.target) {
            this.orbitTarget = new Vec3(options.target.x, options.target.y, options.target.z || 0);
            this.updateOrbitPosition();
        }
        
        this.projectionMatrix = Mat4.create();
        this.viewMatrix = Mat4.create();
        this.viewProjectionMatrix = Mat4.create();
        this.invViewProjectionMatrix = Mat4.create();
        
        this.updateAspectRatio();
        this.updateMatrices();
    }
    
    public update(deltaTime: number): void {
        this.handleInput(deltaTime);
        this.updateMatrices();
    }
    
    public resize(width: number, height: number): void {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.updateAspectRatio();
        this.updateMatrices();
    }
    
    protected updateAspectRatio(): void {
        this.aspectRatio = this.viewportWidth / this.viewportHeight;
    }
    
    protected updateMatrices(): void {
        // 更新投影矩阵
        if (this.projection === 'orthographic') {
            const zoom = this.zoom;
            const width = this.viewportWidth * 0.5 / zoom;
            const height = this.viewportHeight * 0.5 / zoom;
            
            this.projectionMatrix.orthographic(
                -width, width,
                -height, height,
                this.near,
                this.far
            );
        } else {
            this.projectionMatrix.perspective(
                MathUtils.toRadians(this.fov),
                this.aspectRatio,
                this.near,
                this.far
            );
        }
        
        // 更新视图矩阵
        if (this.mode === 'orbit' && this.target) {
            // 轨道相机：围绕目标点旋转
            const eye = this.position;
            const center = this.target;
            const up = this.up;
            
            this.viewMatrix.lookAt(
                [eye.x, eye.y, eye.z],
                [center.x, center.y, center.z],
                [up.x, up.y, up.z]
            );
        } else {
            // 第一人称/自由相机：基于旋转角度计算
            this.viewMatrix.identity();
            this.viewMatrix.rotateX(this.rotation.x);
            this.viewMatrix.rotateY(this.rotation.y);
            this.viewMatrix.translate(-this.position.x, -this.position.y, -this.position.z);
        }
        
        // 更新组合矩阵
        this.viewProjectionMatrix = this.projectionMatrix.copy().multiply(this.viewMatrix);
        
        // 计算逆矩阵
        this.updateInverseMatrix();
    }
    
    protected updateInverseMatrix(): void {
        // 简化版本，实际应用中需要实现矩阵求逆
        this.invViewProjectionMatrix.identity();
    }
    
    protected updateOrbitPosition(): void {
        // 根据轨道距离和旋转角度计算相机位置
        const distance = this.orbitDistance;
        const phi = this.rotation.x; // 仰角
        const theta = this.rotation.y; // 方位角
        
        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(phi);
        const z = distance * Math.cos(theta) * Math.cos(phi);
        
        this.position.x = this.orbitTarget.x + x;
        this.position.y = this.orbitTarget.y + y;
        this.position.z = this.orbitTarget.z + z;
    }
    
    protected handleInput(deltaTime: number): void {
        const moveAmount = this.moveSpeed * deltaTime;
        const rotateAmount = this.rotationSpeed;
        
        // 键盘移动
        if (this.keys.has('w') || this.keys.has('ArrowUp')) {
            this.moveForward(moveAmount);
        }
        if (this.keys.has('s') || this.keys.has('ArrowDown')) {
            this.moveForward(-moveAmount);
        }
        if (this.keys.has('a') || this.keys.has('ArrowLeft')) {
            this.moveRight(-moveAmount);
        }
        if (this.keys.has('d') || this.keys.has('ArrowRight')) {
            this.moveRight(moveAmount);
        }
        if (this.keys.has('q') || this.keys.has('PageUp')) {
            this.moveUp(moveAmount);
        }
        if (this.keys.has('e') || this.keys.has('PageDown')) {
            this.moveUp(-moveAmount);
        }
        
        // 鼠标旋转
        if (this.mouseButtons.has(2) || (this.mouseButtons.has(0) && this.keys.has('Control'))) {
            // 中键或Ctrl+左键：旋转
            const deltaX = this.mouseX - this.lastMouseX;
            const deltaY = this.mouseY - this.lastMouseY;
            
            if (this.mode === 'orbit') {
                this.rotateOrbit(deltaX * rotateAmount, deltaY * rotateAmount);
            } else {
                this.rotate(deltaX * rotateAmount, deltaY * rotateAmount, 0);
            }
        }
        
        // 鼠标滚轮缩放
        // （在外部事件处理中调用zoom方法）
        
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
    }
    
    public moveForward(amount: number): void {
        if (this.mode === 'orbit') {
            this.orbitDistance = MathUtils.clamp(
                this.orbitDistance - amount,
                this.minOrbitDistance,
                this.maxOrbitDistance
            );
            this.updateOrbitPosition();
        } else {
            const forward = this.getForwardVector();
            this.position.x += forward.x * amount;
            this.position.y += forward.y * amount;
            this.position.z += forward.z * amount;
        }
    }
    
    public moveRight(amount: number): void {
        const right = this.getRightVector();
        this.position.x += right.x * amount;
        this.position.y += right.y * amount;
        this.position.z += right.z * amount;
    }
    
    public moveUp(amount: number): void {
        const up = this.getUpVector();
        this.position.x += up.x * amount;
        this.position.y += up.y * amount;
        this.position.z += up.z * amount;
    }
    
    public rotate(deltaX: number, deltaY: number, deltaZ: number = 0): void {
        this.rotation.y += deltaX;
        this.rotation.x += deltaY;
        this.rotation.z += deltaZ;
        
        // 限制俯仰角
        const maxPitch = Math.PI / 2 - 0.01;
        this.rotation.x = MathUtils.clamp(this.rotation.x, -maxPitch, maxPitch);
    }
    
    public rotateOrbit(deltaX: number, deltaY: number): void {
        this.rotation.y += deltaX;
        this.rotation.x += deltaY;
        
        // 限制仰角
        const maxPitch = Math.PI / 2 - 0.01;
        this.rotation.x = MathUtils.clamp(this.rotation.x, -maxPitch, maxPitch);
        
        this.updateOrbitPosition();
    }
    
    public updateZoom(amount: number): void {
        if (this.mode === 'orbit') {
            this.orbitDistance = MathUtils.clamp(
                this.orbitDistance * (1 - amount * this.zoomSpeed),
                this.minOrbitDistance,
                this.maxOrbitDistance
            );
            this.updateOrbitPosition();
        } else {
            this.fov = MathUtils.clamp(this.fov * (1 - amount * this.zoomSpeed), 1, 179);
        }
    }
    
    public getForwardVector(): Vec3 {
        return new Vec3(
            Math.sin(this.rotation.y) * Math.cos(this.rotation.x),
            -Math.sin(this.rotation.x),
            Math.cos(this.rotation.y) * Math.cos(this.rotation.x)
        ).normalize();
    }
    
    public getRightVector(): Vec3 {
        const forward = this.getForwardVector();
        const right = forward.cross(this.up).normalize();
        return right;
    }
    
    public getUpVector(): Vec3 {
        const forward = this.getForwardVector();
        const right = this.getRightVector();
        const up = right.cross(forward).normalize();
        return up;
    }
    
    public lookAt(targetX: number, targetY: number, targetZ: number): void {
        this.target = new Vec3(targetX, targetY, targetZ);
        
        const direction = this.target.subtract(this.position).normalize();
        
        this.rotation.y = Math.atan2(direction.x, direction.z);
        this.rotation.x = Math.asin(-direction.y);
    }
    
    public setMode(mode: 'orbit' | 'first-person' | 'fly'): void {
        this.mode = mode;
        if (mode === 'orbit' && !this.target) {
            this.target = new Vec3(0, 0, 0);
            this.updateOrbitPosition();
        }
    }
    
    public setProjection(projection: 'perspective' | 'orthographic'): void {
        this.projection = projection;
        this.updateMatrices();
    }
    
    public screenToWorld(screenX: number, screenY: number, depth: number = 0.5): Vec3 {
        // 将屏幕坐标转换为归一化设备坐标
        const ndcX = (2.0 * screenX) / this.viewportWidth - 1.0;
        const ndcY = 1.0 - (2.0 * screenY) / this.viewportHeight;
        
        // 创建近平面和远平面上的点
        const nearPoint = this.unproject(ndcX, ndcY, 0);
        const farPoint = this.unproject(ndcX, ndcY, 1);
        
        // 线性插值得到指定深度处的点
        const direction = farPoint.subtract(nearPoint);
        const point = nearPoint.add(direction.multiplyScalar(depth));
        
        return point;
    }
    
    public worldToScreen(worldX: number, worldY: number, worldZ: number): { x: number; y: number; depth: number } {
        // 将世界坐标转换为齐次坐标
        const point = new Vec3(worldX, worldY, worldZ);
        const clipSpace = this.project(point);
        
        // 将齐次坐标转换为屏幕坐标
        const x = (clipSpace.x + 1) * 0.5 * this.viewportWidth;
        const y = (1 - clipSpace.y) * 0.5 * this.viewportHeight;
        const depth = clipSpace.z * 0.5 + 0.5;
        
        return { x, y, depth };
    }
    
    protected project(point: Vec3): Vec3 {
        // 应用视图投影矩阵
        const mat = this.viewProjectionMatrix.getData();
        const x = point.x * mat[0] + point.y * mat[4] + point.z * mat[8] + mat[12];
        const y = point.x * mat[1] + point.y * mat[5] + point.z * mat[9] + mat[13];
        const z = point.x * mat[2] + point.y * mat[6] + point.z * mat[10] + mat[14];
        const w = point.x * mat[3] + point.y * mat[7] + point.z * mat[11] + mat[15];
        
        // 透视除法
        return new Vec3(x / w, y / w, z / w);
    }
    
    protected unproject(ndcX: number, ndcY: number, depth: number): Vec3 {
        // 简化版本，实际应用中需要逆矩阵
        // 这里返回近平面上的点
        return new Vec3(ndcX * 10, ndcY * 10, depth * 10 - 5);
    }
    
    // 输入处理
    public onKeyDown(key: string): void {
        this.keys.add(key.toLowerCase());
    }
    
    public onKeyUp(key: string): void {
        this.keys.delete(key.toLowerCase());
    }
    
    public onMouseDown(button: number, x: number, y: number): void {
        this.mouseButtons.add(button);
        this.mouseX = x;
        this.mouseY = y;
        this.lastMouseX = x;
        this.lastMouseY = y;
    }
    
    public onMouseUp(button: number): void {
        this.mouseButtons.delete(button);
    }
    
    public onMouseMove(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }
    
    public onWheel(delta: number): void {
        this.updateZoom(delta);
    }
    
    public getProjectionMatrix(): Float32Array {
        return this.projectionMatrix.getData();
    }
    
    public getViewMatrix(): Float32Array {
        return this.viewMatrix.getData();
    }
    
    public getViewProjectionMatrix(): Float32Array {
        return this.viewProjectionMatrix.getData();
    }
}

// ==================== 相机控制器 ====================
export interface CameraControllerOptions {
    enablePan?: boolean;
    enableRotate?: boolean;
    enableZoom?: boolean;
    panSpeed?: number;
    rotateSpeed?: number;
    zoomSpeed?: number;
    minZoom?: number;
    maxZoom?: number;
    minDistance?: number;
    maxDistance?: number;
}

export class CameraController {
    private camera: Camera2D | Camera3D;
    private options: CameraControllerOptions;
    
    private isEnabled: boolean = true;
    private isPanning: boolean = false;
    private isRotating: boolean = false;
    
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    
    constructor(camera: Camera2D | Camera3D, options: CameraControllerOptions = {}) {
        this.camera = camera;
        this.options = {
            enablePan: options.enablePan ?? true,
            enableRotate: options.enableRotate ?? true,
            enableZoom: options.enableZoom ?? true,
            panSpeed: options.panSpeed ?? 1,
            rotateSpeed: options.rotateSpeed ?? 1,
            zoomSpeed: options.zoomSpeed ?? 1,
            minZoom: options.minZoom ?? 0.1,
            maxZoom: options.maxZoom ?? 10,
            minDistance: options.minDistance ?? 1,
            maxDistance: options.maxDistance ?? 100
        };
    }
    
    public enable(): void {
        this.isEnabled = true;
    }
    
    public disable(): void {
        this.isEnabled = false;
    }
    
    public onMouseDown(event: MouseEvent): void {
        if (!this.isEnabled) return;
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        
        if (event.button === 0 && this.options.enableRotate) {
            this.isRotating = true;
        } else if (event.button === 2 && this.options.enablePan) {
            this.isPanning = true;
        }
        
        if (this.camera instanceof Camera3D) {
            this.camera.onMouseDown(event.button, event.clientX, event.clientY);
        } else {
            this.camera.startDrag(event.clientX, event.clientY);
        }
    }
    
    public onMouseMove(event: MouseEvent): void {
        if (!this.isEnabled) return;
        
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        
        if (this.isRotating && this.options.enableRotate) {
            this.handleRotation(deltaX, deltaY);
        } else if (this.isPanning && this.options.enablePan) {
            this.handlePan(deltaX, deltaY);
        }
        
        if (this.camera instanceof Camera3D) {
            this.camera.onMouseMove(event.clientX, event.clientY);
        } else if (this.isPanning || this.isRotating) {
            this.camera.drag(event.clientX, event.clientY);
        }
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }
    
    public onMouseUp(event: MouseEvent): void {
        this.isPanning = false;
        this.isRotating = false;
        
        if (this.camera instanceof Camera3D) {
            this.camera.onMouseUp(event.button);
        } else {
            this.camera.endDrag();
        }
    }
    
    public onWheel(event: WheelEvent): void {
        if (!this.isEnabled || !this.options.enableZoom) return;
        
        event.preventDefault();
        
        const delta = Math.sign(event.deltaY) * -0.01 * this.options.zoomSpeed;
        
        if (this.camera instanceof Camera3D) {
            this.camera.onWheel(delta);
        } else {
            this.camera.zoomAtPoint(delta, event.clientX, event.clientY);
        }
    }
    
    public onKeyDown(event: KeyboardEvent): void {
        if (this.camera instanceof Camera3D) {
            this.camera.onKeyDown(event.key);
        }
    }
    
    public onKeyUp(event: KeyboardEvent): void {
        if (this.camera instanceof Camera3D) {
            this.camera.onKeyUp(event.key);
        }
    }
    
    private handleRotation(deltaX: number, deltaY: number): void {
        if (this.camera instanceof Camera3D) {
            const speed = this.options.rotateSpeed || 1;
            this.camera.rotate(deltaX * speed, deltaY * speed, 0);
        }
    }
    
    private handlePan(deltaX: number, deltaY: number): void {
        if (this.camera instanceof Camera3D) {
            const forward = this.camera.getForwardVector();
            const right = this.camera.getRightVector();
            
            const panSpeed = this.options.panSpeed || 1;
            const panX = -deltaX * panSpeed * 0.01;
            const panY = deltaY * panSpeed * 0.01;
            
            this.camera.move(right.x * panX + forward.x * panY, 
                            right.y * panX + forward.y * panY, 
                            right.z * panX + forward.z * panY);
        }
    }
    
    public update(deltaTime: number): void {
        // 如果需要，可以在这里添加每帧更新逻辑
    }
}

// ==================== 相机管理器 ====================
export class CameraManager {
    private cameras: Map<string, Camera2D | Camera3D> = new Map();
    private controllers: Map<string, CameraController> = new Map();
    private activeCameraId: string | null = null;
    
    public registerCamera(id: string, camera: Camera2D | Camera3D): void {
        this.cameras.set(id, camera);
        if (!this.activeCameraId) {
            this.activeCameraId = id;
        }
    }
    
    public registerController(id: string, controller: CameraController): void {
        this.controllers.set(id, controller);
    }
    
    public getCamera(id: string): Camera2D | Camera3D | undefined {
        return this.cameras.get(id);
    }
    
    public getController(id: string): CameraController | undefined {
        return this.controllers.get(id);
    }
    
    public getActiveCamera(): Camera2D | Camera3D | undefined {
        return this.activeCameraId ? this.cameras.get(this.activeCameraId) : undefined;
    }
    
    public setActiveCamera(id: string): boolean {
        if (this.cameras.has(id)) {
            this.activeCameraId = id;
            return true;
        }
        return false;
    }
    
    public update(deltaTime: number): void {
        this.cameras.forEach(camera => camera.update(deltaTime));
        this.controllers.forEach(controller => controller.update(deltaTime));
    }
    
    public resizeAll(width: number, height: number): void {
        this.cameras.forEach(camera => camera.resize(width, height));
    }
    
    public handleMouseDown(event: MouseEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onMouseDown(event);
            }
        }
    }
    
    public handleMouseMove(event: MouseEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onMouseMove(event);
            }
        }
    }
    
    public handleMouseUp(event: MouseEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onMouseUp(event);
            }
        }
    }
    
    public handleWheel(event: WheelEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onWheel(event);
            }
        }
    }
    
    public handleKeyDown(event: KeyboardEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onKeyDown(event);
            }
        }
    }
    
    public handleKeyUp(event: KeyboardEvent): void {
        if (this.activeCameraId) {
            const controller = this.controllers.get(this.activeCameraId);
            if (controller) {
                controller.onKeyUp(event);
            }
        }
    }
}

// ==================== 示例用法 ====================
export function createExample2DCamera(canvas: HTMLCanvasElement): Camera2D {
    return new Camera2D({
        position: { x: 0, y: 0 },
        zoom: 1,
        viewportWidth: canvas.width,
        viewportHeight: canvas.height,
        minZoom: 0.1,
        maxZoom: 10,
        orthographic: true
    });
}

export function createExample3DCamera(canvas: HTMLCanvasElement): Camera3D {
    return new Camera3D({
        position: { x: 0, y: 0, z: 5 },
        target: { x: 0, y: 0, z: 0 },
        fov: 60,
        near: 0.1,
        far: 1000,
        viewportWidth: canvas.width,
        viewportHeight: canvas.height,
        projection: 'perspective'
    });
}
