const uidCaches = /* @__PURE__ */ Object.create(null);
const uid = (type) => {
  if (uidCaches[type] === void 0) {
    uidCaches[type] = -1;
  }
  return ++uidCaches[type];
};
export {
  uid
};
