import { Controls, Vector3 } from '../../../../../../../../../src/3d/index.core.ts';
/**
 * This class is an alternative implementation of {@link FlyControls}.
 *
 * @augments Controls
 * @three_import import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
 */
export class FirstPersonControls extends Controls<any> {
    /**
     * Constructs a new controls instance.
     *
     * @param {Object3D} object - The object that is managed by the controls.
     * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
     */
    constructor(object: Object3D, domElement?: HTMLDOMElement | null);
    /**
     * The movement speed.
     *
     * @type {number}
     * @default 1
     */
    movementSpeed: number;
    /**
     * The look around speed.
     *
     * @type {number}
     * @default 0.005
     */
    lookSpeed: number;
    /**
     * Whether it's possible to vertically look around or not.
     *
     * @type {boolean}
     * @default true
     */
    lookVertical: boolean;
    /**
     * Whether the camera is automatically moved forward or not.
     *
     * @type {boolean}
     * @default false
     */
    autoForward: boolean;
    /**
     * Whether it's possible to look around or not.
     *
     * @type {boolean}
     * @default true
     */
    activeLook: boolean;
    /**
     * Whether or not the camera's height influences the forward movement speed.
     * Use the properties `heightCoef`, `heightMin` and `heightMax` for configuration.
     *
     * @type {boolean}
     * @default false
     */
    heightSpeed: boolean;
    /**
     * Determines how much faster the camera moves when it's y-component is near `heightMax`.
     *
     * @type {number}
     * @default 1
     */
    heightCoef: number;
    /**
     * Lower camera height limit used for movement speed adjustment.
     *
     * @type {number}
     * @default 0
     */
    heightMin: number;
    /**
     * Upper camera height limit used for movement speed adjustment.
     *
     * @type {number}
     * @default 1
     */
    heightMax: number;
    /**
     * Whether or not looking around is vertically constrained by `verticalMin` and `verticalMax`.
     *
     * @type {boolean}
     * @default false
     */
    constrainVertical: boolean;
    /**
     * How far you can vertically look around, lower limit. Range is `0` to `Math.PI` in radians.
     *
     * @type {number}
     * @default 0
     */
    verticalMin: number;
    /**
     * How far you can vertically look around, upper limit. Range is `0` to `Math.PI` in radians.
     *
     * @type {number}
     * @default 0
     */
    verticalMax: number;
    /**
     * Whether the mouse is pressed down or not.
     *
     * @type {boolean}
     * @readonly
     * @default false
     */
    readonly mouseDragOn: boolean;
    _autoSpeedFactor: number;
    _pointerX: number;
    _pointerY: number;
    _moveForward: boolean;
    _moveBackward: boolean;
    _moveLeft: boolean;
    _moveRight: boolean;
    _viewHalfX: number;
    _viewHalfY: number;
    _lat: number;
    _lon: number;
    _onPointerMove: typeof onPointerMove;
    _onPointerDown: typeof onPointerDown;
    _onPointerUp: typeof onPointerUp;
    _onContextMenu: typeof onContextMenu;
    _onKeyDown: typeof onKeyDown;
    _onKeyUp: typeof onKeyUp;
    connect(element: any): void;
    /**
     * Must be called if the application window is resized.
     */
    handleResize(): void;
    /**
     * Rotates the camera towards the defined target position.
     *
     * @param {number|Vector3} x - The x coordinate of the target position or alternatively a vector representing the target position.
     * @param {number} y - The y coordinate of the target position.
     * @param {number} z - The z coordinate of the target position.
     * @return {FirstPersonControls} A reference to this controls.
     */
    lookAt(x: number | Vector3, y: number, z: number): FirstPersonControls;
    update(delta: any): void;
    _setOrientation(): void;
}
declare function onPointerMove(event: any): void;
declare class onPointerMove {
    constructor(event: any);
    _pointerX: number;
    _pointerY: number;
}
declare function onPointerDown(event: any): void;
declare class onPointerDown {
    constructor(event: any);
    _moveForward: boolean | undefined;
    _moveBackward: boolean | undefined;
    mouseDragOn: boolean;
}
declare function onPointerUp(event: any): void;
declare class onPointerUp {
    constructor(event: any);
    _moveForward: boolean | undefined;
    _moveBackward: boolean | undefined;
    mouseDragOn: boolean;
}
declare function onContextMenu(event: any): void;
declare function onKeyDown(event: any): void;
declare class onKeyDown {
    constructor(event: any);
    _moveForward: boolean | undefined;
    _moveLeft: boolean | undefined;
    _moveBackward: boolean | undefined;
    _moveRight: boolean | undefined;
    _moveUp: boolean | undefined;
    _moveDown: boolean | undefined;
}
declare function onKeyUp(event: any): void;
declare class onKeyUp {
    constructor(event: any);
    _moveForward: boolean | undefined;
    _moveLeft: boolean | undefined;
    _moveBackward: boolean | undefined;
    _moveRight: boolean | undefined;
    _moveUp: boolean | undefined;
    _moveDown: boolean | undefined;
}
export {};
