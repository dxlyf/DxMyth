export interface StateMachineConfig<S extends string, E extends string, C> {
    initial: S;
    states: {
        [K in S]: {
            on?: {
                [K in E]?: {
                    target: S;
                    action?: (context: C, event: {
                        type: E;
                        prevState: S;
                        payload?: any;
                    }, instance: StateMachine<S, E, C>) => C;
                };
            };
            onEnter?: (context: C, instance: StateMachine<S, E, C>) => void;
            onExit?: (context: C, instance: StateMachine<S, E, C>) => void;
        };
    };
    context: C;
}
export declare class StateMachine<S extends string, E extends string, C> {
    private currentState;
    private context;
    private config;
    private listeners;
    constructor(config: StateMachineConfig<S, E, C>);
    getState(): S;
    getContext(): C;
    send(eventType: E, payload?: any): boolean;
    subscribe(listener: (state: S, context: C) => void): () => void;
    reset(): void;
}
/***
 * // 定义状态
type LightState = 'off' | 'low' | 'medium' | 'high';

// 定义事件
type LightEvent = 'TURN_ON' | 'TURN_OFF' | 'INCREASE' | 'DECREASE';

// 定义上下文（附加数据）
interface LightContext {
  brightness: number;
  powerUsage: number;
}

// 创建配置
const lightConfig: StateMachineConfig<LightState, LightEvent, LightContext> = {
  initial: 'off',
  context: {
    brightness: 0,
    powerUsage: 0
  },
  states: {
    off: {
      on: {
        TURN_ON: {
          target: 'low',
          action: (ctx) => ({
            ...ctx,
            brightness: 10,
            powerUsage: ctx.powerUsage + 5
          })
        }
      },
      onEnter: (ctx) => {
        console.log('💡 灯已关闭，当前功耗:', ctx.powerUsage);
      }
    },
    low: {
      on: {
        TURN_OFF: {
          target: 'off',
          action: (ctx) => ({
            ...ctx,
            brightness: 0,
            powerUsage: ctx.powerUsage - 5
          })
        },
        INCREASE: {
          target: 'medium',
          action: (ctx) => ({
            ...ctx,
            brightness: 50,
            powerUsage: ctx.powerUsage + 10
          })
        }
      },
      onEnter: (ctx) => {
        console.log('💡 低亮度模式，亮度:', ctx.brightness);
      }
    },
    medium: {
      on: {
        DECREASE: {
          target: 'low',
          action: (ctx) => ({
            ...ctx,
            brightness: 10,
            powerUsage: ctx.powerUsage - 10
          })
        },
        INCREASE: {
          target: 'high',
          action: (ctx) => ({
            ...ctx,
            brightness: 100,
            powerUsage: ctx.powerUsage + 15
          })
        }
      },
      onEnter: (ctx) => {
        console.log('💡 中等亮度模式，亮度:', ctx.brightness);
      }
    },
    high: {
      on: {
        DECREASE: {
          target: 'medium',
          action: (ctx) => ({
            ...ctx,
            brightness: 50,
            powerUsage: ctx.powerUsage - 15
          })
        }
      },
      onEnter: (ctx) => {
        console.log('💡 高亮度模式，亮度:', ctx.brightness);
      }
    }
  }
};

// 使用状态机
const lightMachine = new StateMachine(lightConfig);

// 监听状态变化
const unsubscribe = lightMachine.subscribe((state, context) => {
  console.log(`状态变更为: ${state}, 亮度: ${context.brightness}`);
});

// 发送事件
lightMachine.send('TURN_ON');   // off -> low
lightMachine.send('INCREASE');  // low -> medium
lightMachine.send('INCREASE');  // medium -> high
lightMachine.send('DECREASE');  // high -> medium
lightMachine.send('TURN_OFF');  // medium -> off

unsubscribe();
 */ 
