// 通用类型定义
type Task<T = any> = () => Promise<T>;
type TaskResult<T> = { success: true; data: T } | { success: false; error: Error };


/**
 * 串行执行任务队列
 * @param tasks 任务数组
 * @param options 配置选项
 * @returns 所有任务的结果数组
 */
async function executeSerial<T>(
  tasks: Task<T>[],
  options: {
    continueOnError?: boolean; // 出错时是否继续执行后续任务
    onProgress?: (completed: number, total: number, currentResult?: TaskResult<T>) => void;
  } = {}
): Promise<TaskResult<T>[]> {
  const { continueOnError = false, onProgress } = options;
  const results: TaskResult<T>[] = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    try {
      const data = await task();
      const result: TaskResult<T> = { success: true, data };
      results.push(result);
      
      // 进度回调
      onProgress?.(i + 1, tasks.length, result);
    } catch (error) {
      const result: TaskResult<T> = { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error))
      };
      results.push(result);
      
      // 进度回调
      onProgress?.(i + 1, tasks.length, result);
      
      // 如果配置为不继续执行，则抛出错误
      if (!continueOnError) {
        throw error;
      }
    }
  }
  
  return results;
}

/**
 * 并行执行任务队列，支持最大并行数控制
 * @param tasks 任务数组
 * @param maxConcurrent 最大并行数，默认为 5
 * @param options 配置选项
 * @returns 所有任务的结果数组（按完成顺序）
 */
async function executeParallel<T>(
  tasks: Task<T>[],
  maxConcurrent: number = 5,
  options: {
    continueOnError?: boolean;
    onProgress?: (completed: number, total: number) => void;
    onTaskComplete?: (result: TaskResult<T>, index: number) => void;
  } = {}
): Promise<TaskResult<T>[]> {
  const { continueOnError = true, onProgress, onTaskComplete } = options;
  
  if (maxConcurrent <= 0) {
    throw new Error('maxConcurrent must be greater than 0');
  }
  
  const results: TaskResult<T>[] = new Array(tasks.length);
  let completedCount = 0;
  let currentIndex = 0;
  
  // 用于控制并发的信号量
  const semaphore = {
    count: 0,
    queue: [] as (() => void)[],
    
    async acquire(): Promise<void> {
      return new Promise(resolve => {
        if (this.count < maxConcurrent) {
          this.count++;
          resolve();
        } else {
          this.queue.push(resolve);
        }
      });
    },
    
    release(): void {
      this.count--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) {
          this.count++;
          next();
        }
      }
    }
  };
  
  // 执行单个任务
  const executeTask = async (task: Task<T>, index: number): Promise<void> => {
    await semaphore.acquire();
    
    try {
      const data = await task();
      const result: TaskResult<T> = { success: true, data };
      results[index] = result;
      onTaskComplete?.(result, index);
    } catch (error) {
      const result: TaskResult<T> = { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error))
      };
      results[index] = result;
      onTaskComplete?.(result, index);
      
      if (!continueOnError) {
        throw error;
      }
    } finally {
      completedCount++;
      onProgress?.(completedCount, tasks.length);
      semaphore.release();
    }
  };
  
  // 创建所有任务的 Promise
  const taskPromises: Promise<void>[] = [];
  
  for (let i = 0; i < tasks.length; i++) {
    taskPromises.push(executeTask(tasks[i], i));
  }
  
  // 等待所有任务完成
  try {
    await Promise.all(taskPromises);
  } catch (error) {
    // 如果 continueOnError 为 false，这里会捕获到第一个错误
    if (!continueOnError) {
      throw error;
    }
  }
  
  return results;
}


interface ExecutionOptions<T = any> {
  continueOnError?: boolean;
  onProgress?: (completed: number, total: number, currentResult?: TaskResult<T>) => void;
  onTaskStart?: (index: number) => void;
  onTaskComplete?: (result: TaskResult<T>, index: number) => void;
  timeout?: number; // 单个任务超时时间（毫秒）
}

/**
 * 增强版并行执行方法
 */
async function executeParallelEnhanced<T>(
  tasks: Task<T>[],
  maxConcurrent: number = 5,
  options: ExecutionOptions<T> = {}
): Promise<TaskResult<T>[]> {
  const { 
    continueOnError = true, 
    onProgress, 
    onTaskStart, 
    onTaskComplete,
    timeout 
  } = options;
  
  const results: TaskResult<T>[] = new Array(tasks.length);
  let completedCount = 0;
  let currentIndex = 0;
  
  // 带超时的任务包装器
  const createTaskWithTimeout = (task: Task<T>, index: number): Promise<T> => {
    if (!timeout) return task();
    
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Task ${index} timeout after ${timeout}ms`));
      }, timeout);
      
      try {
        const result = await task();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  };
  
  // 执行单个任务
  const executeTask = async (index: number): Promise<void> => {
    if (index >= tasks.length) return;
    
    onTaskStart?.(index);
    
    try {
      const data = await createTaskWithTimeout(tasks[index], index);
      const result: TaskResult<T> = { success: true, data };
      results[index] = result;
      onTaskComplete?.(result, index);
    } catch (error) {
      const result: TaskResult<T> = { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error))
      };
      results[index] = result;
      onTaskComplete?.(result, index);
      
      if (!continueOnError) {
        throw error;
      }
    } finally {
      completedCount++;
      onProgress?.(completedCount, tasks.length, results[index]);
      
      // 执行下一个任务
      if (currentIndex < tasks.length) {
        await executeTask(currentIndex++);
      }
    }
  };
  
  // 启动初始批次的任务
  const initialBatchSize = Math.min(maxConcurrent, tasks.length);
  const taskPromises: Promise<void>[] = [];
  
  for (let i = 0; i < initialBatchSize; i++) {
    taskPromises.push(executeTask(currentIndex++));
  }
  
  try {
    await Promise.all(taskPromises);
  } catch (error) {
    if (!continueOnError) {
      throw error;
    }
  }
  
  return results;
}