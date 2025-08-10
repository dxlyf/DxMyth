import { Vector2Point as Vector2 } from '../math/vec2';
/**
 * Sutherland-Hodgman 多边形裁剪算法
 * @param {Array} subjectPolygon 待裁剪多边形顶点数组 [{x,y},...]
 * @param {Array} clipPolygon 裁剪多边形顶点数组 [{x,y},...]
 * @returns {Array} 裁剪后的多边形顶点数组
 */
export declare function sutherlandHodgmanClip(subjectPolygon: Vector2[], clipPolygon: Vector2[]): Vector2[];
