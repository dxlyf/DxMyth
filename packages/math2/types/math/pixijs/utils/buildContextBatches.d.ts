import { ShapeBuildCommand } from '../buildCommands/ShapeBuildCommand';
import { ShapePath, ShapePrimitiveWithHoles } from '../path/ShapePath';
/**
 * A record of shape builders, keyed by shape type.
 * @category scene
 * @advanced
 */
export declare const shapeBuilders: Record<string, ShapeBuildCommand>;
/**
 * @param context
 * @param gpuContext
 * @internal
 */
export declare function buildContextBatches(context: any, gpuContext: any): void;
export declare function addTextureToGeometryData(data: any, batches: any[], geometryData: {
    vertices: number[];
    uvs: number[];
    indices: number[];
}): void;
export declare function addShapePathToGeometryData(shapePath: ShapePath, style: any, isStroke: boolean, batches: any[], geometryData: {
    vertices: number[];
    uvs: number[];
    indices: number[];
}): void;
export declare function getHoleArrays(holePrimitives: ShapePrimitiveWithHoles[]): number[][];
