// 定义状态机的配置类型
export interface StateMachineConfig<S extends string, E extends string, C> {
  // 初始状态
  initial: S;
  // 状态转换表
  states: {
    [K in S]: {
      // 当前状态下，不同事件对应的转换
      on?: {
        [K in E]?: {
          target: S;
          action?: (context: C, event: { type: E; prevState: S; payload?: any },instance:StateMachine<S, E, C>) => C;
        };
      };
      // 进入状态时的钩子
      onEnter?: (context: C,instance:StateMachine<S, E, C>) => void;
      // 离开状态时的钩子
      onExit?: (context: C,instance:StateMachine<S, E, C>) => void;
    };
  };
  // 全局上下文
  context: C;
}

// 状态机类
export class StateMachine<S extends string, E extends string, C> {
  private currentState: S;
  private context: C;
  private config: StateMachineConfig<S, E, C>;
  private listeners: Array<(state: S, context: C) => void> = [];

  constructor(config: StateMachineConfig<S, E, C>) {
    this.config = config;
    this.currentState = config.initial;
    this.context = config.context;
  }

  // 获取当前状态
  getState(): S {
    return this.currentState;
  }

  // 获取当前上下文
  getContext(): C {
    return this.context;
  }

  // 发送事件
  send(eventType: E, payload?: any): boolean {
    const currentStateConfig = this.config.states[this.currentState];
    const transition = currentStateConfig.on?.[eventType];

    if (!transition) {
      console.warn(
        `事件 "${eventType}" 在当前状态 "${this.currentState}" 下无效`
      );
      return false;
    }

    // 离开当前状态前的钩子
    currentStateConfig.onExit?.(this.context,this);

    // 记录旧状态
    const oldState = this.currentState;

    // 执行转换
    if (transition.action) {
      this.context = transition.action(this.context, {
        type: eventType,
        prevState: oldState,
        payload,
      },this);
    }
    this.currentState = transition.target;

    // 进入新状态后的钩子
    this.config.states[this.currentState].onEnter?.(this.context,this);

    // 通知监听器
    this.listeners.forEach(listener => 
      listener(this.currentState, this.context)
    );

    return true;
  }

  // 监听状态变化
  subscribe(listener: (state: S, context: C) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 重置到初始状态
  reset(): void {
    this.currentState = this.config.initial;
    this.context = this.config.context;
    this.listeners.forEach(listener => 
      listener(this.currentState, this.context)
    );
  }
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