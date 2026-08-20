import { GraphicsPath } from '../path/GraphicsPath';
/** A parsed path command: the command letter followed by its numeric arguments. */
export type Command = [string, ...number[]];
/**
 * Parse an SVG path `d` attribute string into an array of commands.
 *
 * Each command is a tuple of `[letter, ...args]`. Relative commands use
 * lowercase letters; absolute commands use uppercase. An implicit `lineto`
 * is inserted after the first coordinate pair of a `moveto` with extra args,
 * per the SVG spec.
 *
 * @param path - The raw SVG path data string (e.g. `"M0,0 L10,10 Z"`).
 * @returns Array of parsed commands.
 * @throws {Error} if a command has fewer arguments than expected.
 */
export declare function parse(path: string): Command[];
/**
 * Parses an SVG path data string and builds a GraphicsPath object from the commands.
 * This function handles all standard SVG path commands including moves, lines, curves and arcs.
 * It maintains state for the current position and subpaths to properly handle relative commands
 * and path closures.
 *
 * Supported SVG commands:
 * - M/m: Move to absolute/relative
 * - L/l: Line to absolute/relative
 * - H/h: Horizontal line absolute/relative
 * - V/v: Vertical line absolute/relative
 * - C/c: Cubic bezier curve absolute/relative
 * - S/s: Smooth cubic bezier curve absolute/relative
 * - Q/q: Quadratic bezier curve absolute/relative
 * - T/t: Smooth quadratic bezier curve absolute/relative
 * - A/a: Arc absolute/relative
 * - Z/z: Close path
 * @param svgPath - The SVG path data string to parse (e.g. "M0,0 L100,100")
 * @param path - The GraphicsPath object to build the path into
 * @returns The input path object with the SVG commands applied
 * @internal
 */
export declare function parseSVGPath(svgPath: string, path: GraphicsPath): GraphicsPath;
