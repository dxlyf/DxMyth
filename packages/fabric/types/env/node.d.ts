import { Canvas as NodeCanvas } from 'canvas';
import { TFabricEnv } from './types';
export declare const getNodeCanvas: (canvasEl: HTMLCanvasElement) => NodeCanvas;
export declare const dispose: (element: Element) => void;
export declare const getEnv: () => TFabricEnv;
