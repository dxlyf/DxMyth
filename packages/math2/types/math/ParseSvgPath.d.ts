import { PathBuilder } from './PathBuilder';
export declare const fromSvgPathToCmds: (svgPath: string) => {
    cmd: string;
    params: number[];
}[];
/**
    * 解析 SVG path 字符串，返回 PathBuilder 实例
    *
    * 支持所有 SVG path 命令：
    *   M/m (moveto), L/l (lineto), H/h (horizontal lineto), V/v (vertical lineto)
    *   C/c (cubic bezier), S/s (smooth cubic bezier)
    *   Q/q (quadratic bezier), T/t (smooth quadratic bezier)
    *   A/a (elliptical arc), Z/z (close path)
    *
    * @param svgPath - SVG path 字符串，如 "M10 10 L20 20 C30 30 40 40 50 50Z"
    * @returns PathBuilder 实例
    */
export declare function fromSvgPath(svgPath: string): PathBuilder;
