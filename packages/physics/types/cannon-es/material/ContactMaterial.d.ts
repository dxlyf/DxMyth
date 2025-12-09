import { Material } from '../material/Material';
export type ContactMaterialOptions = ConstructorParameters<typeof ContactMaterial>[2];
/**
 * Defines what happens when two materials meet.
 * @todo Refactor materials to materialA and materialB
 */
export declare class ContactMaterial {
    /**
     * Identifier of this material.
     */
    id: number;
    /**
     * Participating materials.
     */
    materials: [Material, Material];
    /**
     * Friction coefficient.
     * @default 0.3
     */
    friction: number;
    /**
     * Restitution coefficient.
     * @default 0.3
     */
    restitution: number;
    /**
     * Stiffness of the produced contact equations.
     * @default 1e7
     */
    contactEquationStiffness: number;
    /**
     * Relaxation time of the produced contact equations.
     * @default 3
     */
    contactEquationRelaxation: number;
    /**
     * Stiffness of the produced friction equations.
     * @default 1e7
     */
    frictionEquationStiffness: number;
    /**
     * Relaxation time of the produced friction equations
     * @default 3
     */
    frictionEquationRelaxation: number;
    static idCounter: number;
    constructor(m1: Material, m2: Material, options: {
        /**
         * Friction coefficient.
         * @default 0.3
         */
        friction?: number;
        /**
         * Restitution coefficient.
         * @default 0.3
         */
        restitution?: number;
        /**
         * Stiffness of the produced contact equations.
         * @default 1e7
         */
        contactEquationStiffness?: number;
        /**
         * Relaxation time of the produced contact equations.
         * @default 3
         */
        contactEquationRelaxation?: number;
        /**
         * Stiffness of the produced friction equations.
         * @default 1e7
         */
        frictionEquationStiffness?: number;
        /**
         * Relaxation time of the produced friction equations
         * @default 3
         */
        frictionEquationRelaxation?: number;
    });
}
