declare class Mat4 {
    private data;
    constructor();
    identity(): Mat4;
    perspective(fov: number, aspect: number, near: number, far: number): Mat4;
    orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    lookAt(eye: [number, number, number], center: [number, number, number], up: [number, number, number]): Mat4;
    translate(x: number, y: number, z: number): Mat4;
    rotateX(rad: number): Mat4;
    rotateY(rad: number): Mat4;
    rotateZ(rad: number): Mat4;
    scale(x: number, y: number, z: number): Mat4;
    multiply(other: Mat4): Mat4;
    copy(): Mat4;
    getData(): Float32Array;
    static create(): Mat4;
}
declare class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    length(): number;
    normalize(): Vec3;
    cross(other: Vec3): Vec3;
    dot(other: Vec3): number;
    add(other: Vec3): Vec3;
    subtract(other: Vec3): Vec3;
    multiplyScalar(scalar: number): Vec3;
    copy(): Vec3;
    toArray(): [number, number, number];
    static fromArray(arr: [number, number, number]): Vec3;
    static create(x?: number, y?: number, z?: number): Vec3;
}
export interface CameraOptions {
    position?: {
        x: number;
        y: number;
        z?: number;
    };
    target?: {
        x: number;
        y: number;
        z?: number;
    };
    zoom?: number;
    rotation?: {
        x?: number;
        y?: number;
        z?: number;
    };
    near?: number;
    far?: number;
    fov?: number;
}
export interface CameraUpdate {
    position?: {
        x: number;
        y: number;
        z?: number;
    };
    target?: {
        x: number;
        y: number;
        z?: number;
    };
    zoom?: number;
    rotation?: {
        x?: number;
        y?: number;
        z?: number;
    };
}
declare abstract class BaseCamera {
    protected position: Vec3;
    protected target: Vec3 | null;
    protected up: Vec3;
    protected zoom: number;
    protected rotation: {
        x: number;
        y: number;
        z: number;
    };
    protected near: number;
    protected far: number;
    protected fov: number;
    protected aspectRatio: number;
    constructor(options?: CameraOptions);
    abstract update(deltaTime: number): void;
    abstract resize(width: number, height: number): void;
    getPosition(): Vec3;
    getTarget(): Vec3 | null;
    getZoom(): number;
    getRotation(): {
        x: number;
        y: number;
        z: number;
    };
    setPosition(x: number, y: number, z: number): void;
    setTarget(x: number, y: number, z: number): void;
    setZoom(zoom: number): void;
    setRotation(x: number, y: number, z: number): void;
    move(x: number, y: number, z: number): void;
    rotate(x: number, y: number, z: number): void;
}
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
export declare class Camera2D extends BaseCamera {
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
    protected isDragging: boolean;
    protected dragStart: {
        x: number;
        y: number;
    };
    protected dragStartPosition: Vec3;
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
    constructor(options: Camera2DOptions);
    update(deltaTime: number): void;
    resize(width: number, height: number): void;
    protected updateAspectRatio(): void;
    protected updateMatrices(): void;
    protected updateInverseMatrix(): void;
    applyTransform(context: CanvasRenderingContext2D): void;
    resetTransform(context: CanvasRenderingContext2D): void;
    screenToWorld(screenX: number, screenY: number): Vec3;
    worldToScreen(worldX: number, worldY: number, worldZ?: number): {
        x: number;
        y: number;
    };
    zoomAtPoint(delta: number, screenX: number, screenY: number): void;
    startDrag(screenX: number, screenY: number): void;
    drag(screenX: number, screenY: number): void;
    endDrag(): void;
    panTo(x: number, y: number, zoom?: number, duration?: number): void;
    protected applyBounds(): void;
    getViewportBounds(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    getProjectionMatrix(): Float32Array;
    getViewMatrix(): Float32Array;
    getViewProjectionMatrix(): Float32Array;
    isOrthographic(): boolean;
    setOrthographic(orthographic: boolean): void;
}
export interface Camera3DOptions extends CameraOptions {
    viewportWidth: number;
    viewportHeight: number;
    mode?: 'perspective' | 'orthographic';
    projection?: 'perspective' | 'orthographic';
}
export declare class Camera3D extends BaseCamera {
    protected viewportWidth: number;
    protected viewportHeight: number;
    protected mode: 'orbit' | 'first-person' | 'fly';
    protected projection: 'perspective' | 'orthographic';
    protected projectionMatrix: Mat4;
    protected viewMatrix: Mat4;
    protected viewProjectionMatrix: Mat4;
    protected invViewProjectionMatrix: Mat4;
    protected orbitDistance: number;
    protected minOrbitDistance: number;
    protected maxOrbitDistance: number;
    protected orbitTarget: Vec3;
    protected moveSpeed: number;
    protected rotationSpeed: number;
    protected zoomSpeed: number;
    protected keys: Set<string>;
    protected mouseButtons: Set<number>;
    protected mouseX: number;
    protected mouseY: number;
    protected lastMouseX: number;
    protected lastMouseY: number;
    constructor(options: Camera3DOptions);
    update(deltaTime: number): void;
    resize(width: number, height: number): void;
    protected updateAspectRatio(): void;
    protected updateMatrices(): void;
    protected updateInverseMatrix(): void;
    protected updateOrbitPosition(): void;
    protected handleInput(deltaTime: number): void;
    moveForward(amount: number): void;
    moveRight(amount: number): void;
    moveUp(amount: number): void;
    rotate(deltaX: number, deltaY: number, deltaZ?: number): void;
    rotateOrbit(deltaX: number, deltaY: number): void;
    updateZoom(amount: number): void;
    getForwardVector(): Vec3;
    getRightVector(): Vec3;
    getUpVector(): Vec3;
    lookAt(targetX: number, targetY: number, targetZ: number): void;
    setMode(mode: 'orbit' | 'first-person' | 'fly'): void;
    setProjection(projection: 'perspective' | 'orthographic'): void;
    screenToWorld(screenX: number, screenY: number, depth?: number): Vec3;
    worldToScreen(worldX: number, worldY: number, worldZ: number): {
        x: number;
        y: number;
        depth: number;
    };
    protected project(point: Vec3): Vec3;
    protected unproject(ndcX: number, ndcY: number, depth: number): Vec3;
    onKeyDown(key: string): void;
    onKeyUp(key: string): void;
    onMouseDown(button: number, x: number, y: number): void;
    onMouseUp(button: number): void;
    onMouseMove(x: number, y: number): void;
    onWheel(delta: number): void;
    getProjectionMatrix(): Float32Array;
    getViewMatrix(): Float32Array;
    getViewProjectionMatrix(): Float32Array;
}
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
export declare class CameraController {
    private camera;
    private options;
    private isEnabled;
    private isPanning;
    private isRotating;
    private lastMouseX;
    private lastMouseY;
    constructor(camera: Camera2D | Camera3D, options?: CameraControllerOptions);
    enable(): void;
    disable(): void;
    onMouseDown(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    onWheel(event: WheelEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    onKeyUp(event: KeyboardEvent): void;
    private handleRotation;
    private handlePan;
    update(deltaTime: number): void;
}
export declare class CameraManager {
    private cameras;
    private controllers;
    private activeCameraId;
    registerCamera(id: string, camera: Camera2D | Camera3D): void;
    registerController(id: string, controller: CameraController): void;
    getCamera(id: string): Camera2D | Camera3D | undefined;
    getController(id: string): CameraController | undefined;
    getActiveCamera(): Camera2D | Camera3D | undefined;
    setActiveCamera(id: string): boolean;
    update(deltaTime: number): void;
    resizeAll(width: number, height: number): void;
    handleMouseDown(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
    handleMouseUp(event: MouseEvent): void;
    handleWheel(event: WheelEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
}
export declare function createExample2DCamera(canvas: HTMLCanvasElement): Camera2D;
export declare function createExample3DCamera(canvas: HTMLCanvasElement): Camera3D;
export {};
