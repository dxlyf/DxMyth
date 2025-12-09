import { Settings } from './Settings';
import { Sweep } from './common/Sweep';
import { DynamicTree } from './collision/DynamicTree';
import { Manifold } from './collision/Manifold';
/** @hidden @deprecated Merged with main namespace */
export declare const internal: {
    CollidePolygons: (manifold: Manifold, polyA: import('.').PolygonShape, xfA: import('.').TransformValue, polyB: import('.').PolygonShape, xfB: import('.').TransformValue) => void;
    Settings: typeof Settings;
    Sweep: typeof Sweep;
    Manifold: typeof Manifold;
    Distance: {
        (output: import('.').DistanceOutput, cache: import('.').SimplexCache, input: import('.').DistanceInput): void;
        testOverlap: (shapeA: import('.').Shape, indexA: number, shapeB: import('.').Shape, indexB: number, xfA: import('.').TransformValue, xfB: import('.').TransformValue) => boolean;
        Input: typeof import('.').DistanceInput;
        Output: typeof import('.').DistanceOutput;
        Proxy: typeof import('.').DistanceProxy;
        Cache: typeof import('.').SimplexCache;
    };
    TimeOfImpact: {
        (output: import('.').TOIOutput, input: import('.').TOIInput): void;
        Input: typeof import('.').TOIInput;
        Output: typeof import('.').TOIOutput;
    };
    DynamicTree: typeof DynamicTree;
    stats: {
        gjkCalls: number;
        gjkIters: number;
        gjkMaxIters: number;
        toiTime: number;
        toiMaxTime: number;
        toiCalls: number;
        toiIters: number;
        toiMaxIters: number;
        toiRootIters: number;
        toiMaxRootIters: number;
        toString(newline?: string): string;
    };
};
