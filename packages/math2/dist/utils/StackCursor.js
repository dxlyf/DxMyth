const valueStack = [];
let index = -1;
const createCursor = (defaultValue) => {
  return {
    current: defaultValue
  };
};
const push = (cursor, value) => {
  valueStack[++index] = cursor.current;
  cursor.current = value;
};
const pop = (cursor) => {
  if (index < 0) {
    return;
  }
  cursor.current = valueStack[index];
  valueStack[index] = null;
  index--;
};
export {
  createCursor,
  pop,
  push
};
