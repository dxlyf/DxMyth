import React, { useEffect, useRef, useState,createElement,useMemo, useLayoutEffect } from 'src/react16/react';
import { render} from 'src/react16/react-dom';
import { StateMachine } from 'src/StateMachine'; // 使用之前的状态机
import './index.css'
// 动画状态类型
type AnimationState = 'enter-start' | 'enter-active' | 'enter-end' | 'leave-start' | 'leave-active' | 'leave-end' | 'none';

// 动画事件
type AnimationEvent = 'START_ENTER' | 'FINISH_ENTER' | 'START_LEAVE' | 'FINISH_LEAVE';

// 动画上下文
interface AnimationContext {
  timeout: number;
}

// 创建动画状态机配置
const createTransitionMachine = (timeout: number) => {
  return {
    initial: 'none' as AnimationState,
    context: { timeout },
    states: {
      // 初始状态
      none: {
        on: {
          START_ENTER: {
            target: 'enter-start',
            action: (ctx: AnimationContext) => ctx
          }
        }
      },
      // 进入动画
      'enter-start': {
        onEnter: (ctx,self) => {
          // 下一帧切换到 active
          setTimeout(() => {
            self.send('FINISH_ENTER');
          },0);
        },
        on: {
          FINISH_ENTER: {
            target: 'enter-active'
          }
        }
      },
      'enter-active': {
        onEnter: (ctx: AnimationContext,self) => {
          // 动画结束后切换到 end
          setTimeout(() => {
            self.send('FINISH_LEAVE');
          }, ctx.timeout);
        },
        on: {
          FINISH_LEAVE: {
            target: 'enter-end'
          }
        }
      },
      'enter-end': {
        on:{
          START_LEAVE: {
            target: 'leave-start'
          }
        },
        onEnter: () => {
          // 保持显示状态
        }
      },
      // 离开动画
      'leave-start': {
        onEnter: (ctx,self) => {
            setTimeout(() => {
              self.send('FINISH_LEAVE');
            }, 0);
        },
        on: {
          FINISH_LEAVE: {
            target: 'leave-active'
          }
        }
      },
      'leave-active': {
        onEnter: (ctx: AnimationContext,self) => {
            Promise.resolve().then(()=>{
              self.send('FINISH_LEAVE');
            })
        },
        on: {
          FINISH_LEAVE: {
            target: 'leave-end'
          }
        }
      },
      'leave-end': {
        // 最终状态，组件将被卸载
        onEnter:(ctx,self)=>{
          
        },
        on: {
          FINISH_LEAVE: {
            target: 'none'
          }
        }
      }
    }
  };
};


// Transition 组件 Props
interface TransitionProps {
  show: boolean;
  children: React.ReactNode;
  timeout?: number;
  // 自定义类名前缀
  name?: string;
  // CSS 类名（支持自定义）
  enterClass?: string;
  enterActiveClass?: string;
  enterDoneClass?: string;
  leaveClass?: string;
  leaveActiveClass?: string;
  leaveDoneClass?: string;
  // 钩子函数
  onBeforeEnter?: () => void;
  onEnter?: () => void;
  onAfterEnter?: () => void;
  onBeforeLeave?: () => void;
  onLeave?: () => void;
  onAfterLeave?: () => void;
  // 动画模式：out-in / in-out
  mode?: 'out-in' | 'in-out';
  // 是否在初始渲染时执行动画
  appear?: boolean;
}

// 获取动画类名
const getTransitionClasses = (
  state: AnimationState,
  props: TransitionProps
): string => {
  const {
    name = 'v',
    enterClass,
    enterActiveClass,
    enterDoneClass,
    leaveClass,
    leaveActiveClass,
    leaveDoneClass
  } = props;

  switch (state) {
    case 'enter-start':
      return enterClass || `${name}-enter-from`;
    case 'enter-active':
      return enterActiveClass || `${name}-enter-active`;
    case 'enter-end':
      return enterDoneClass || `${name}-enter-to`;
    case 'leave-start':
      return leaveClass || `${name}-leave ${name}-leave-from`;
    case 'leave-active':
      return leaveActiveClass || `${name}-leave-active`;
    case 'leave-end':
      return leaveDoneClass || `${name}-leave-active ${name}-leave-to`;
    default:
      return '';
  }
};

// Transition 组件
export const Transition: React.FC<TransitionProps> = ({
  show,
  children,
  timeout = 2000,
  name = 'v',
  enterClass,
  enterActiveClass,
  enterDoneClass,
  leaveClass,
  leaveActiveClass,
  leaveDoneClass,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  mode = 'out-in',
  appear = false
}) => {
  const [state, setState] = useState<AnimationState>('none');
  const [shouldRender, setShouldRender] = useState(show);
  const prevShowRef = useRef(show);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 创建状态机实例
  const [machine] = useState(() => 
    new StateMachine(createTransitionMachine(timeout))
  );

  // 监听状态机变化
  useEffect(() => {
    const unsubscribe = machine.subscribe((newState, ctx) => {
      console.log('newState',newState, ctx);
      setState(newState);
      // 根据状态触发钩子
      switch (newState) {
        case 'enter-start':
          onBeforeEnter?.();
          break;
        case 'enter-active':
          onEnter?.();
          break;
        case 'enter-end':
          onAfterEnter?.();
          break;
        case 'leave-start':
          onBeforeLeave?.();
          break;
        case 'leave-active':
          onLeave?.();
          break;
        case 'leave-end':
          onAfterLeave?.();
          break;
      }
    });

    return unsubscribe;
  }, [machine, onBeforeEnter, onEnter, onAfterEnter, onBeforeLeave, onLeave, onAfterLeave]);

  // 处理显示/隐藏变化
  useLayoutEffect(() => {
    // 清除之前的超时
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    console.log('useeefct')
    // 处理模式
    if (mode === 'out-in' && prevShowRef.current !== show) {
      if (!show) {
        // 先执行离开动画
        machine.send('START_LEAVE');
        timeoutRef.current=setTimeout(() => {
          machine.send('FINISH_LEAVE');
          setShouldRender(false);
        }, timeout);
        
      } else {
        setShouldRender(true);
        // 再执行进入动画
        machine.send('START_ENTER');
      }
    } else if(prevShowRef.current !== show){
      // 普通模式
      if (show) {
        machine.send('START_ENTER');
      } else {
        machine.send('START_LEAVE');
      }
    }

    prevShowRef.current = show;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show, machine, timeout, mode]);

  // 初始动画
  useLayoutEffect(() => {
    if (appear && show) {
      machine.send('START_ENTER');
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  const classes = getTransitionClasses(state, {
    name,
    enterClass,
    enterActiveClass,
    enterDoneClass,
    leaveClass,
    leaveActiveClass,
    leaveDoneClass
  });

  return (
    <div className={`transition-wrap ${classes}`}>
      {children}
    </div>
  );
};

// 使用示例
const fadeTransitionCSS = `
.fade-enter-start {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
.fade-enter-done {
  opacity: 1;
}
.fade-leave-start {
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 300ms ease-out;
}
.fade-leave-done {
  opacity: 0;
  display: none;
}
`;

// 示例组件
export const TransitionExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <style>{fadeTransitionCSS}</style>
      
      <button onClick={() => setShow(!show)}>
        Toggle
      </button>

      <Transition
        show={show}
        name="v"
        mode="out-in"
        onBeforeEnter={() => console.log('准备进入')}
        onEnter={() => console.log('进入中')}
        onAfterEnter={() => console.log('进入完成')}
        onBeforeLeave={() => console.log('准备离开')}
        onLeave={() => console.log('离开中')}
        onAfterLeave={() => console.log('离开完成')}
      >
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: '#42b983',
          color: 'white',
          borderRadius: '4px'
        }}>
          <h3>Transition Content</h3>
          <p>This element will fade in/out</p>
        </div>
      </Transition>
    </div>
  );
};

// 更复杂的示例：多个元素切换
export const MultiTransitionExample: React.FC = () => {
  const [current, setCurrent] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div>
      <style>{`
        .slide-left-enter-from {
          transform: translateX(100%);
          opacity: 0;
        }
        .slide-left-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: all 300ms ease;
        }
        .slide-left-leave-active {
          transform: translateX(-100%);
          opacity: 0;
          transition: all 300ms ease;
        }
      `}</style>

      <div>
        <button onClick={() => setCurrent('A')}>A</button>
        <button onClick={() => setCurrent('B')}>B</button>
        <button onClick={() => setCurrent('C')}>C</button>
      </div>

      <div style={{ position: 'relative', height: '200px' }}>
        <Transition
          show={current === 'A'}
          timeout={300}
          name="slide-left"
          mode="out-in"
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            background: '#ff6b6b'
          }}>
            <h3>Panel A</h3>
            <p>Content for A</p>
          </div>
        </Transition>

        <Transition
          show={current === 'B'}
          timeout={300}
          name="slide-left"
          mode="out-in"
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            background: '#4ecdc4'
          }}>
            <h3>Panel B</h3>
            <p>Content for B</p>
          </div>
        </Transition>

        <Transition
          show={current === 'C'}
          timeout={300}
          name="slide-left"
          mode="out-in"
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            background: '#ffe66d'
          }}>
            <h3>Panel C</h3>
            <p>Content for C</p>
          </div>
        </Transition>
      </div>
    </div>
  );
};

// 列表过渡
export const ListTransitionExample: React.FC = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <style>{`
        .list-enter-from {
          opacity: 0;
          transform: translateY(-20px);
        }
        .list-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 300ms ease;
        }
        .list-leave-active {
          opacity: 0;
          transform: translateY(20px);
          transition: all 300ms ease;
        }
      `}</style>

      <button onClick={addItem}>Add Item</button>

      <div style={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <Transition
            key={item}
            show={true}
            timeout={300}
            name="list"
            onAfterLeave={() => console.log('Item removed')}
          >
            <div
              onClick={() => removeItem(index)}
              style={{
                padding: '10px',
                margin: '5px 0',
                background: '#f0f0f0',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              {item}
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};

render(<TransitionExample></TransitionExample>,document.getElementById('app'))