import { Vec2Value } from '../common/Vec2';
import { AABBValue } from '../collision/AABB';
import { World } from '../dynamics/World';
import { Joint } from '../dynamics/Joint';
import { Fixture } from '../dynamics/Fixture';
import { Body } from '../dynamics/Body';
export interface Style {
    stroke?: string;
    fill?: string;
    lineWidth?: number;
}
export type ActiveKeys = {
    [key in KEY]?: boolean;
};
type TestbedMountOptions = {
    [key: string]: any;
};
export declare class Testbed {
    /**
     * Mounts testbed. Call start with a world to start simulation and rendering.
     */
    static mount(options?: TestbedMountOptions): TestbedInterface;
    /**
     * Mounts testbed if needed, then starts simulation and rendering.
     *
     * If you need to customize testbed before starting, first run `const testbed = Testbed.mount()` and then `testbed.start()`.
     */
    static start(world: World): TestbedInterface;
}
export interface TestbedInterface {
    /** World viewbox width. */
    width: number;
    /** World viewbox height. */
    height: number;
    /** World viewbox center vertical offset. */
    x: number;
    /** World viewbox center horizontal offset. */
    y: number;
    /** @hidden */
    scaleY: number;
    /** World simulation step frequency */
    hz: number;
    /** World simulation speed, default is 1 */
    speed: number;
    background: string;
    mouseForce?: number;
    activeKeys: ActiveKeys;
    /** callback, to be implemented by user */
    step?: (dt: number, t: number) => void;
    /** callback, to be implemented by user */
    keydown?: (keyCode: number, label: string) => void;
    /** callback, to be implemented by user */
    keyup?: (keyCode: number, label: string) => void;
    status(name: string, value: any): void;
    status(value: object | string): void;
    info(text: string): void;
    color(r: number, g: number, b: number): string;
    drawPoint(p: Vec2Value, r: any, color: string): void;
    drawCircle(p: Vec2Value, r: number, color: string): void;
    drawEdge(a: Vec2Value, b: Vec2Value, color: string): void;
    drawSegment(a: Vec2Value, b: Vec2Value, color: string): void;
    drawPolygon(points: Array<Vec2Value>, color: string): void;
    drawChain(points: Array<Vec2Value>, color: string): void;
    drawAABB(aabb: AABBValue, color: string): void;
    start(world: World): void;
    findOne(query: string): Body | Joint | Fixture | null;
    findAll(query: string): (Body | Joint | Fixture)[];
}
type TestbedFactoryOptions = string | TestbedMountOptions;
/** @deprecated */
type TestbedCallback = (testbed: TestbedInterface) => World | undefined;
/** @deprecated */
export declare function testbed(callback: TestbedCallback): void;
/** @deprecated */
export declare function testbed(options: TestbedFactoryOptions, callback: TestbedCallback): void;
type KEY = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "right" | "left" | "up" | "down" | "fire";
export {};
