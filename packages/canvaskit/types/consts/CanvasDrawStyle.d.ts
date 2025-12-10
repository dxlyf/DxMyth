import { CanvasDrawStyle } from '../../../../../../../src/types/Renderer';
declare const defaultCanvasDrawStyle: CanvasDrawStyle;
declare const DrawStylePropertiesMap: {
    readonly globalAlpha: "opacity";
};
type DrawStylePropertiesMapType = typeof defaultCanvasDrawStyle;
declare const DrawStylePropertiesSet: Set<string>;
declare const FontPropertiesSet: Set<string>;
declare const HasDrawStylePropertiesMap: Set<string>;
export { FontPropertiesSet, defaultCanvasDrawStyle, DrawStylePropertiesSet, DrawStylePropertiesMap, HasDrawStylePropertiesMap, type DrawStylePropertiesMapType, };
