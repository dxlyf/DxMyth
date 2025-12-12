import { Vec2Value } from '../common/Vec2';
import { AABB, RayCastInput, RayCastOutput } from '../collision/AABB';
import { Shape, ShapeType } from '../collision/Shape';
import { Body, MassData } from './Body';
import { BroadPhase } from '../collision/BroadPhase';
import { TransformValue } from '../common/Transform';
import { Style } from '../util/Testbed';
/**
 * A fixture definition is used to create a fixture. This class defines an
 * abstract fixture definition. You can reuse fixture definitions safely.
 */
export interface FixtureOpt {
    userData?: unknown;
    /**
     * The friction coefficient, usually in the range [0,1]
     */
    friction?: number;
    /**
     * The restitution (elasticity) usually in the range [0,1]
     */
    restitution?: number;
    /**
     * The density, usually in kg/m^2
     */
    density?: number;
    /**
     * A sensor shape collects contact information but never generates a collision response.
     */
    isSensor?: boolean;
    /**
     * Zero, positive or negative collision group.
     * Fixtures with same positive groupIndex always collide and fixtures with same negative groupIndex never collide.
     */
    filterGroupIndex?: number;
    /**
     * Collision category bit or bits that this fixture belongs to.
     * If groupIndex is zero or not matching, then at least one bit in this fixture categoryBits should match other fixture maskBits and vice versa.
     */
    filterCategoryBits?: number;
    /**
     * Collision category bit or bits that this fixture accept for collision.
     */
    filterMaskBits?: number;
    /** Styling for dev-tools. */
    style?: Style;
}
export interface FixtureDef extends FixtureOpt {
    shape: Shape;
}
/**
 * This proxy is used internally to connect shape children to the broad-phase.
 */
export declare class FixtureProxy {
    aabb: AABB;
    fixture: Fixture;
    childIndex: number;
    proxyId: number;
    constructor(fixture: Fixture, childIndex: number);
}
/**
 * A fixture is used to attach a shape to a body for collision detection. A
 * fixture inherits its transform from its parent. Fixtures hold additional
 * non-geometric data such as friction, collision filters, etc.
 *
 * To create a new Fixture use {@link Body.createFixture}.
 */
export declare class Fixture {
    /** @internal */ m_body: Body;
    /** @internal */ m_friction: number;
    /** @internal */ m_restitution: number;
    /** @internal */ m_density: number;
    /** @internal */ m_isSensor: boolean;
    /** @internal */ m_filterGroupIndex: number;
    /** @internal */ m_filterCategoryBits: number;
    /** @internal */ m_filterMaskBits: number;
    /** @internal */ m_shape: Shape;
    /** @internal */ m_next: Fixture | null;
    /** @internal */ m_proxies: FixtureProxy[];
    /** @internal */ m_proxyCount: number;
    /** @internal */ m_userData: unknown;
    /** Styling for dev-tools. */
    style: Style;
    /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
    appData: Record<string, any>;
    constructor(body: Body, def: FixtureDef);
    constructor(body: Body, shape: Shape, def?: FixtureOpt);
    constructor(body: Body, shape: Shape, density?: number);
    /** @hidden Re-setup fixture. */
    _reset(): void;
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, body: any, restore: any): Fixture;
    /**
     * Get the type of the child shape. You can use this to down cast to the
     * concrete shape.
     */
    getType(): ShapeType;
    /**
     * Get the child shape. You can modify the child shape, however you should not
     * change the number of vertices because this will crash some collision caching
     * mechanisms. Manipulating the shape may lead to non-physical behavior.
     */
    getShape(): Shape;
    /**
     * A sensor shape collects contact information but never generates a collision
     * response.
     */
    isSensor(): boolean;
    /**
     * Set if this fixture is a sensor.
     */
    setSensor(sensor: boolean): void;
    /**
     * Get the user data that was assigned in the fixture definition. Use this to
     * store your application specific data.
     */
    getUserData(): unknown;
    /**
     * Set the user data. Use this to store your application specific data.
     */
    setUserData(data: unknown): void;
    /**
     * Get the parent body of this fixture. This is null if the fixture is not
     * attached.
     */
    getBody(): Body;
    /**
     * Get the next fixture in the parent body's fixture list.
     */
    getNext(): Fixture | null;
    /**
     * Get the density of this fixture.
     */
    getDensity(): number;
    /**
     * Set the density of this fixture. This will _not_ automatically adjust the
     * mass of the body. You must call Body.resetMassData to update the body's mass.
     */
    setDensity(density: number): void;
    /**
     * Get the coefficient of friction, usually in the range [0,1].
     */
    getFriction(): number;
    /**
     * Set the coefficient of friction. This will not change the friction of
     * existing contacts.
     */
    setFriction(friction: number): void;
    /**
     * Get the coefficient of restitution.
     */
    getRestitution(): number;
    /**
     * Set the coefficient of restitution. This will not change the restitution of
     * existing contacts.
     */
    setRestitution(restitution: number): void;
    /**
     * Test a point in world coordinates for containment in this fixture.
     */
    testPoint(p: Vec2Value): boolean;
    /**
     * Cast a ray against this shape.
     */
    rayCast(output: RayCastOutput, input: RayCastInput, childIndex: number): boolean;
    /**
     * Get the mass data for this fixture. The mass data is based on the density and
     * the shape. The rotational inertia is about the shape's origin. This operation
     * may be expensive.
     */
    getMassData(massData: MassData): void;
    /**
     * Get the fixture's AABB. This AABB may be enlarge and/or stale. If you need a
     * more accurate AABB, compute it using the shape and the body transform.
     */
    getAABB(childIndex: number): AABB;
    /**
     * These support body activation/deactivation.
     */
    createProxies(broadPhase: BroadPhase, xf: TransformValue): void;
    destroyProxies(broadPhase: BroadPhase): void;
    /**
     * Updates this fixture proxy in broad-phase (with combined AABB of current and
     * next transformation).
     */
    synchronize(broadPhase: BroadPhase, xf1: TransformValue, xf2: TransformValue): void;
    /**
     * Set the contact filtering data. This will not update contacts until the next
     * time step when either parent body is active and awake. This automatically
     * calls refilter.
     */
    setFilterData(filter: {
        groupIndex: number;
        categoryBits: number;
        maskBits: number;
    }): void;
    getFilterGroupIndex(): number;
    setFilterGroupIndex(groupIndex: number): void;
    getFilterCategoryBits(): number;
    setFilterCategoryBits(categoryBits: number): void;
    getFilterMaskBits(): number;
    setFilterMaskBits(maskBits: number): void;
    /**
     * Call this if you want to establish collision that was previously disabled by
     * ContactFilter.
     */
    refilter(): void;
    /**
     * Implement this method to provide collision filtering, if you want finer
     * control over contact creation.
     *
     * Return true if contact calculations should be performed between these two
     * fixtures.
     *
     * Warning: for performance reasons this is only called when the AABBs begin to
     * overlap.
     */
    shouldCollide(that: Fixture): boolean;
}
