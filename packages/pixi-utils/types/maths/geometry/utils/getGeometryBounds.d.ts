import { Bounds } from '../../misc/Bounds';
import { Geometry } from '../Geometry';
/**
 * Gets the 2D bounds of a geometry, based on a specific attribute.
 * @param geometry - Geometry to to measure
 * @param attributeId - AttributeId that contains the x,y data
 * @param bounds - Bounds to store the result in
 * @returns the bounds
 * @internal
 */
export declare function getGeometryBounds(geometry: Geometry, attributeId: string, bounds: Bounds): Bounds;
