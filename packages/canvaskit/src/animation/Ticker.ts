type TickHandle = (dt: number) => void
export class Ticker {
        static instance: Ticker | null = null;
        static getInstance() {
            if (this.instance === null) {
                this.instance = new Ticker();
            }
            return this.instance;
        }
        private runing = false;
        private callbacks = new Set<TickHandle>();
        start() {
            if (this.runing) {
                return
            }
            this.runing = true;
            let last = performance.now();
            const loop = (now: number) => {
                const dt = now - last;
                for (const cb of this.callbacks) {
                    cb(dt);
                }
                last = now;
                this.runing && requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
        stop() {
            if (this.runing) {
                this.runing = false;
            }
        }
        add(cb: TickHandle) {
            this.callbacks.add(cb);
        }
        remove(cb: TickHandle) {
            this.callbacks.delete(cb);
        }
        clear() {
            this.callbacks.clear();
        }
    }
