/**
 * 渲染器调试工具
 * 提供性能分析、调试信息和可视化功能
 */

export interface DebugInfo {
    drawCalls: number;
    triangles: number;
    vertices: number;
    bufferMemory: number;
    textureMemory: number;
    shaderCompiles: number;
    renderPasses: number;
    computePasses: number;
    
    // 帧时间统计（毫秒）
    frameTime: {
        current: number;
        average: number;
        min: number;
        max: number;
        history: number[];
    };
    
    // GPU时间统计
    gpuTime: {
        current: number;
        average: number;
        min: number;
        max: number;
    };
}

export interface PerformanceMarker {
    name: string;
    startTime: number;
    endTime: number;
    duration: number;
    category: string;
}

export class Debug {
    private static instance: Debug;
    private enabled: boolean = false;
    private debugInfo: DebugInfo = this.createDebugInfo();
    private performanceMarkers: PerformanceMarker[] = [];
    private frameStartTime: number = 0;
    private currentMarkers: Map<string, number> = new Map();
    private statsHistory: DebugInfo[] = [];
    private maxHistoryLength: number = 60; // 保存60帧的历史数据

    private constructor() {
        // 单例模式
    }

    static getInstance(): Debug {
        if (!Debug.instance) {
            Debug.instance = new Debug();
        }
        return Debug.instance;
    }

    enable(): void {
        this.enabled = true;
    }

    disable(): void {
        this.enabled = false;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    startFrame(): void {
        if (!this.enabled) return;
        
        this.frameStartTime = performance.now();
        
        // 重置每帧的计数器
        this.debugInfo.drawCalls = 0;
        this.debugInfo.triangles = 0;
        this.debugInfo.vertices = 0;
        this.debugInfo.renderPasses = 0;
        this.debugInfo.computePasses = 0;
    }

    endFrame(): void {
        if (!this.enabled) return;
        
        const frameTime = performance.now() - this.frameStartTime;
        
        // 更新帧时间统计
        this.debugInfo.frameTime.current = frameTime;
        this.debugInfo.frameTime.history.push(frameTime);
        
        // 限制历史记录长度
        if (this.debugInfo.frameTime.history.length > this.maxHistoryLength) {
            this.debugInfo.frameTime.history.shift();
        }
        
        // 计算平均值
        const totalTime = this.debugInfo.frameTime.history.reduce((sum, time) => sum + time, 0);
        this.debugInfo.frameTime.average = totalTime / this.debugInfo.frameTime.history.length;
        
        // 更新最小和最大时间
        this.debugInfo.frameTime.min = Math.min(...this.debugInfo.frameTime.history);
        this.debugInfo.frameTime.max = Math.max(...this.debugInfo.frameTime.history);
        
        // 保存到历史记录
        this.statsHistory.push({ ...this.debugInfo });
        if (this.statsHistory.length > this.maxHistoryLength) {
            this.statsHistory.shift();
        }
    }

    startMarker(name: string, category: string = 'general'): void {
        if (!this.enabled) return;
        
        this.currentMarkers.set(name, performance.now());
    }

    endMarker(name: string, category: string = 'general'): void {
        if (!this.enabled) return;
        
        const startTime = this.currentMarkers.get(name);
        if (startTime) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            this.performanceMarkers.push({
                name,
                startTime,
                endTime,
                duration,
                category
            });
            
            this.currentMarkers.delete(name);
        }
    }

    addDrawCall(triangles: number, vertices: number): void {
        if (!this.enabled) return;
        
        this.debugInfo.drawCalls++;
        this.debugInfo.triangles += triangles;
        this.debugInfo.vertices += vertices;
    }

    addRenderPass(): void {
        if (!this.enabled) return;
        
        this.debugInfo.renderPasses++;
    }

    addComputePass(): void {
        if (!this.enabled) return;
        
        this.debugInfo.computePasses++;
    }

    addBufferMemory(size: number): void {
        if (!this.enabled) return;
        
        this.debugInfo.bufferMemory += size;
    }

    addTextureMemory(size: number): void {
        if (!this.enabled) return;
        
        this.debugInfo.textureMemory += size;
    }

    addShaderCompile(): void {
        if (!this.enabled) return;
        
        this.debugInfo.shaderCompiles++;
    }

    updateGPUTime(time: number): void {
        if (!this.enabled) return;
        
        this.debugInfo.gpuTime.current = time;
        this.debugInfo.gpuTime.average = (this.debugInfo.gpuTime.average * 0.9 + time * 0.1);
        this.debugInfo.gpuTime.min = Math.min(this.debugInfo.gpuTime.min, time);
        this.debugInfo.gpuTime.max = Math.max(this.debugInfo.gpuTime.max, time);
    }

    getDebugInfo(): DebugInfo {
        return { ...this.debugInfo };
    }

    getPerformanceMarkers(): PerformanceMarker[] {
        return [...this.performanceMarkers];
    }

    clearPerformanceMarkers(): void {
        this.performanceMarkers = [];
    }

    reset(): void {
        this.debugInfo = this.createDebugInfo();
        this.performanceMarkers = [];
        this.statsHistory = [];
        this.currentMarkers.clear();
    }

    private createDebugInfo(): DebugInfo {
        return {
            drawCalls: 0,
            triangles: 0,
            vertices: 0,
            bufferMemory: 0,
            textureMemory: 0,
            shaderCompiles: 0,
            renderPasses: 0,
            computePasses: 0,
            
            frameTime: {
                current: 0,
                average: 0,
                min: Infinity,
                max: 0,
                history: []
            },
            
            gpuTime: {
                current: 0,
                average: 0,
                min: Infinity,
                max: 0
            }
        };
    }

    // 可视化调试信息
    visualize(ctx: CanvasRenderingContext2D, x: number = 10, y: number = 10, width: number = 300, height: number = 200): void {
        if (!this.enabled) return;
        
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, width, height);
        
        // 绘制边框
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        
        // 绘制标题
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Renderer Debug Info', x + 10, y + 20);
        
        // 绘制统计信息
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        
        const info = this.debugInfo;
        const lines = [
            `Draw Calls: ${info.drawCalls}`,
            `Triangles: ${info.triangles}`,
            `Vertices: ${info.vertices}`,
            `Render Passes: ${info.renderPasses}`,
            `Compute Passes: ${info.computePasses}`,
            `Frame Time: ${info.frameTime.current.toFixed(2)}ms (avg: ${info.frameTime.average.toFixed(2)}ms)`,
            `GPU Time: ${info.gpuTime.current.toFixed(2)}ms`,
            `Buffer Memory: ${this.formatBytes(info.bufferMemory)}`,
            `Texture Memory: ${this.formatBytes(info.textureMemory)}`
        ];
        
        lines.forEach((line, index) => {
            ctx.fillText(line, x + 10, y + 40 + index * 16);
        });
        
        // 绘制帧时间图表
        this.drawFrameTimeChart(ctx, x + 10, y + 160, width - 20, 30);
    }

    private drawFrameTimeChart(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        const history = this.debugInfo.frameTime.history;
        if (history.length < 2) return;
        
        // 找到最大值用于缩放
        const maxTime = Math.max(...history);
        const scale = height / maxTime;
        
        // 绘制背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, width, height);
        
        // 绘制网格
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        
        // 水平线
        for (let i = 0; i <= 4; i++) {
            const lineY = y + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(x, lineY);
            ctx.lineTo(x + width, lineY);
            ctx.stroke();
        }
        
        // 绘制曲线
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const step = width / (history.length - 1);
        
        history.forEach((time, index) => {
            const px = x + index * step;
            const py = y + height - (time * scale);
            
            if (index === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        });
        
        ctx.stroke();
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 日志功能
    log(message: string, ...args: any[]): void {
        if (this.enabled) {
            console.log(`[Renderer Debug] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.enabled) {
            console.warn(`[Renderer Debug] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.enabled) {
            console.error(`[Renderer Debug] ${message}`, ...args);
        }
    }
}
