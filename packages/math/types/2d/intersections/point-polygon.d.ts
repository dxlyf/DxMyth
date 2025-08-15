/**
 * polygon-point collision
 * based on https://stackoverflow.com/a/17490923/1955997
 * @param {number} x1
 * @param {number} y1
 * @param {number[]} points
 * @param {number} [tolerance=1] maximum distance of point to polygon's edges that triggers collision (see pointLine)
 * @return {boolean}
 */
export default function pointPolygon(x1: number, y1: number, points: number[], tolerance?: number): boolean;
