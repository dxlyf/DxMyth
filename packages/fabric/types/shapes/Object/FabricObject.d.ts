import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { FabricObjectProps } from './types/FabricObjectProps';
import { TFabricObjectProps, SerializedObjectProps } from './types';
export interface FabricObject<Props extends TFabricObjectProps = Partial<FabricObjectProps>, SProps extends SerializedObjectProps = SerializedObjectProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObjectSVGExportMixin {
}
export declare class FabricObject<Props extends TFabricObjectProps = Partial<FabricObjectProps>, SProps extends SerializedObjectProps = SerializedObjectProps, EventSpec extends ObjectEvents = ObjectEvents> extends InteractiveFabricObject<Props, SProps, EventSpec> {
}
export { cacheProperties } from './defaultValues';
