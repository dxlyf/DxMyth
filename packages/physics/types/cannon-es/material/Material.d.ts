export type MaterialOptions = ConstructorParameters<typeof Material>[0];
/**
 * Defines a physics material.
 */
export declare class Material {
    /**
     * Material name.
     * If options is a string, name will be set to that string.
     * @todo Deprecate this
     */
    name: string;
    /** Material id. */
    id: number;
    /**
     * Friction for this material.
     * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
     */
    friction: number;
    /**
     * Restitution for this material.
     * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
     */
    restitution: number;
    static idCounter: number;
    constructor(options?: {
        /**
         * Friction for this material.
         * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
         */
        friction?: number;
        /**
         * Restitution for this material.
         * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
         */
        restitution?: number;
    } | string);
}
