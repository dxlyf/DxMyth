
import {
  unstable_cancelCallback,
  unstable_shouldYield,
  unstable_now,
  unstable_scheduleCallback,
  unstable_runWithPriority,
  unstable_next,
  unstable_getFirstCallbackNode,
  unstable_pauseExecution,
  unstable_continueExecution,
  unstable_wrapCallback,
  unstable_getCurrentPriorityLevel,
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_LowPriority,
  unstable_NormalPriority,
  unstable_UserBlockingPriority,
} from '../scheduler';

import ReactCurrentDispatcher from './ReactCurrentDispatcher';
import ReactCurrentOwner from './ReactCurrentOwner';
const assign=Object.assign;

const ReactSharedInternals = {
  ReactCurrentDispatcher,
  ReactCurrentOwner,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign,
};

export default ReactSharedInternals;
