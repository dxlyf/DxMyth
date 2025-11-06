import { Shadow } from '../../../Shadow';
import { Canvas } from '../../../canvas/Canvas';
import { StaticCanvas } from '../../../canvas/StaticCanvas';
import { TFiller } from '../../../typedefs';
import { FabricObject } from '../Object';
import { ObjectTransformActionProps } from './ObjectTransformProps';
import { ClipPathProps, SerializedObjectProps } from './SerializedObjectProps';
export interface ObjectProps extends SerializedObjectProps, ClipPathProps, ObjectTransformActionProps {
    clipPath?: FabricObject;
    fill: TFiller | string | null;
    stroke: TFiller | string | null;
    shadow: Shadow | null;
    canvas?: StaticCanvas | Canvas;
    /**
     * Minimum allowed scale value of an object
     * @type Number
     * @default 0
     */
    minScaleLimit: number;
    /**
     * When `true`, object is cached on an additional canvas.
     * When `false`, object is not cached unless necessary ( clipPath )
     * default to true
     * @since 1.7.0
     * @type Boolean
     * @default true
     */
    objectCaching: boolean;
    /**
     * When `false`, default object's values are not included in its serialization
     * @type Boolean
     */
    includeDefaultValues: boolean;
    /**
     * When `true`, object is not exported in OBJECT/JSON
     * @since 1.6.3
     * @type Boolean
     */
    excludeFromExport: boolean;
}
