function wrapConstructor(OriginalConstructor, modifier) {
  return class extends OriginalConstructor {
    constructor(...args) {
      super(...args);
      modifier(this);
    }
  };
}
const ZeroArray = wrapConstructor(Array, (a) => a.fill(0));
export {
  ZeroArray
};
