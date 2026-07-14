import { Annotation } from '../internal';
import { ClassMethodDecorator } from './decorator_fills';
export declare const override: Annotation & PropertyDecorator & ClassMethodDecorator;
export declare function isOverride(annotation: Annotation): boolean;
