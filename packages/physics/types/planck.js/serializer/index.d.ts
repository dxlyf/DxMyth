import { World } from '../dynamics/World';
type DataType = any;
type ObjectType = any;
type ClassName = any;
type SerializedType = object[];
type SerializerOptions = {
    rootClass: ClassName;
    preSerialize?: (obj: ObjectType) => DataType;
    postSerialize?: (data: DataType, obj: any) => DataType;
    preDeserialize?: (data: DataType) => DataType;
    postDeserialize?: (obj: ObjectType, data: DataType) => ObjectType;
};
export declare class Serializer<T> {
    private options;
    constructor(options: SerializerOptions);
    toJson: (root: T) => SerializedType;
    fromJson: (json: SerializedType) => T;
    static toJson: (root: World) => SerializedType;
    static fromJson: (json: SerializedType) => World;
}
export {};
