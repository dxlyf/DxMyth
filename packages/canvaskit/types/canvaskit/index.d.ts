import { IDisposable } from '../../../../../../../src/core/Disposable';
import { IPoolService } from '../../../../../../../src/core/PoolService';
export * from './canvaskit';
export * from './util';
declare module 'canvaskit-wasm' {
    interface Paint extends IDisposable {
        clone(): Paint;
    }
    interface PathConstructorAndFactory {
        getPool(): Path;
    }
    interface Path extends IDisposable, IPoolService<Path> {
    }
}
