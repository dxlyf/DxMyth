function assert(cond, message) {
  if (!cond) {
    throw message || "Assertion Failed!";
  }
}
export {
  assert
};
