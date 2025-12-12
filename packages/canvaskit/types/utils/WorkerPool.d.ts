/**
 * A simple pool for managing Web Workers.
 *
 * @three_import import { WorkerPool } from 'three/addons/utils/WorkerPool.js';
 */
export declare class WorkerPool {
    pool: number;
    queue: Array<{
        resolve: (e: any) => void;
        msg: any;
        transfer: Array<Transferable>;
    }>;
    workers: Array<Worker>;
    workersResolve: Array<(e: any) => void>;
    workerStatus: number;
    workerCreator: () => Worker;
    /**
     * Constructs a new Worker pool.
     *
     * @param {number} [pool=4] - The size of the pool.
     */
    constructor(pool?: number);
    _initWorker(workerId: number): void;
    _getIdleWorker(): number;
    _onMessage(workerId: number, msg: any): void;
    /**
     * Sets a function that is responsible for creating Workers.
     *
     * @param {Function} workerCreator - The worker creator function.
     */
    setWorkerCreator(workerCreator: () => Worker): void;
    /**
     * Sets the Worker limit
     *
     * @param {number} pool - The size of the pool.
     */
    setWorkerLimit(pool: number): void;
    /**
     * Post a message to an idle Worker. If no Worker is available,
     * the message is pushed into a message queue for later processing.
     *
     * @param {Object} msg - The message.
     * @param {Array<ArrayBuffer>} transfer - An array with array buffers for data transfer.
     * @return {Promise} A Promise that resolves when the message has been processed.
     */
    postMessage(msg: any, transfer: Array<Transferable>): Promise<unknown>;
    /**
     * Terminates all Workers of this pool. Call this  method whenever this
     * Worker pool is no longer used in your app.
     */
    dispose(): void;
}
