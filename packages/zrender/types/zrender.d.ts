import { default as Handler } from './Handler';
import { default as Storage } from './Storage';
import { PainterBase } from './PainterBase';
import { default as Animation } from './animation/Animation';
import { default as Element, ElementEventCallback } from './Element';
import { ElementEventName, WithThisType } from './core/types';
import { LayerConfig } from './canvas/Layer';
import { GradientObject } from './graphic/Gradient';
import { PatternObject } from './graphic/Pattern';
import { EventCallback } from './core/Eventful';
import { default as Displayable } from './graphic/Displayable';
/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/
import * as zrUtil from './core/util';
type PainterBaseCtor = {
    new (dom: HTMLElement, storage: Storage, ...args: any[]): PainterBase;
};
declare class ZRender {
    /**
     * Not necessary if using SSR painter like svg-ssr
     */
    dom?: HTMLElement;
    id: number;
    storage: Storage;
    painter: PainterBase;
    handler: Handler;
    animation: Animation;
    private _sleepAfterStill;
    private _stillFrameAccum;
    private _needsRefresh;
    private _needsRefreshHover;
    private _disposed;
    /**
     * If theme is dark mode. It will determine the color strategy for labels.
     */
    private _darkMode;
    private _backgroundColor;
    constructor(id: number, dom?: HTMLElement, opts?: ZRenderInitOpt);
    /**
     * 添加元素
     */
    add(el: Element): void;
    /**
     * 删除元素
     */
    remove(el: Element): void;
    /**
     * Change configuration of layer
    */
    configLayer(zLevel: number, config: LayerConfig): void;
    /**
     * Set background color
     */
    setBackgroundColor(backgroundColor: string | GradientObject | PatternObject): void;
    getBackgroundColor(): string | GradientObject | PatternObject;
    /**
     * Force to set dark mode
     */
    setDarkMode(darkMode: boolean): void;
    isDarkMode(): boolean;
    /**
     * Repaint the canvas immediately
     */
    refreshImmediately(fromInside?: boolean): void;
    /**
     * Mark and repaint the canvas in the next frame of browser
     */
    refresh(): void;
    /**
     * Perform all refresh
     */
    flush(): void;
    private _flush;
    /**
     * Set sleep after still for frames.
     * Disable auto sleep when it's 0.
     */
    setSleepAfterStill(stillFramesCount: number): void;
    /**
     * Wake up animation loop. But not render.
     */
    wakeUp(): void;
    /**
     * Refresh hover in next frame
     */
    refreshHover(): void;
    /**
     * Refresh hover immediately
     */
    refreshHoverImmediately(): void;
    /**
     * Resize the canvas.
     * Should be invoked when container size is changed
     */
    resize(opts?: {
        width?: number | string;
        height?: number | string;
    }): void;
    /**
     * Stop and clear all animation immediately
     */
    clearAnimation(): void;
    /**
     * Get container width
     */
    getWidth(): number | undefined;
    /**
     * Get container height
     */
    getHeight(): number | undefined;
    /**
     * Set default cursor
     * @param cursorStyle='default' 例如 crosshair
     */
    setCursorStyle(cursorStyle: string): void;
    /**
     * Find hovered element
     * @param x
     * @param y
     * @return {target, topTarget}
     */
    findHover(x: number, y: number): {
        target: Displayable;
        topTarget: Displayable;
    } | undefined;
    on<Ctx>(eventName: ElementEventName, eventHandler: ElementEventCallback<Ctx, ZRenderType>, context?: Ctx): this;
    on<Ctx>(eventName: string, eventHandler: WithThisType<EventCallback<any[]>, unknown extends Ctx ? ZRenderType : Ctx>, context?: Ctx): this;
    /**
     * Unbind event
     * @param eventName Event name
     * @param eventHandler Handler function
     */
    off(eventName?: string, eventHandler?: EventCallback): void;
    /**
     * Trigger event manually
     *
     * @param eventName Event name
     * @param event Event object
     */
    trigger(eventName: string, event?: unknown): void;
    /**
     * Clear all objects and the canvas.
     */
    clear(): void;
    /**
     * Dispose self.
     */
    dispose(): void;
}
export interface ZRenderInitOpt {
    renderer?: string;
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
    useDirtyRect?: boolean;
    useCoarsePointer?: 'auto' | boolean;
    pointerSize?: number;
    ssr?: boolean;
}
/**
 * Initializing a zrender instance
 *
 * @param dom Not necessary if using SSR painter like svg-ssr
 */
export declare function init(dom?: HTMLElement | null, opts?: ZRenderInitOpt): ZRender;
/**
 * Dispose zrender instance
 */
export declare function dispose(zr: ZRender): void;
/**
 * Dispose all zrender instances
 */
export declare function disposeAll(): void;
/**
 * Get zrender instance by id
 */
export declare function getInstance(id: number): ZRender;
export declare function registerPainter(name: string, Ctor: PainterBaseCtor): void;
export type ElementSSRData = zrUtil.HashMap<unknown>;
export type ElementSSRDataGetter<T> = (el: Element) => zrUtil.HashMap<T>;
export declare function getElementSSRData(el: Element): ElementSSRData;
export declare function registerSSRDataGetter<T>(getter: ElementSSRDataGetter<T>): void;
/**
 * @type {string}
 */
export declare const version = "6.0.0";
export interface ZRenderType extends ZRender {
}
export {};
