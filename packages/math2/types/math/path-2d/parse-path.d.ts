import { PathCommand } from './types';
/**
 * Parses an SVG path data string into an array of path commands.
 *
 * Each command is represented as an array where the first element is the command letter
 * and subsequent elements are the numeric arguments for that command.
 *
 * Supports all standard SVG path commands:
 *
 * @param path - The SVG path data string to parse
 * @returns Array of path commands, each as [command, ...args]
 *
 * @see {@link https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation} SVG Path Specification
 *
 * @example
 * ```typescript
 * // Simple path with move and line commands
 * parsePath("M10,10 L20,20 Z")
 * // Returns: [["M", 10, 10], ["L", 20, 20], ["Z"]]
 *
 * // Complex path with curves and arcs
 * parsePath("M10,10 C20,20 30,30 40,40 A5,5 0 0,1 50,50")
 * // Returns: [["M", 10, 10], ["C", 20, 20, 30, 30, 40, 40], ["A", 5, 5, 0, false, true, 50, 50]]
 *
 * // Relative commands
 * parsePath("m10,10 l10,0 l0,10 z")
 * // Returns: [["m", 10, 10], ["l", 10, 0], ["l", 0, 10], ["z"]]
 * ```
 */
export declare function parsePath(path: string): PathCommand[];
