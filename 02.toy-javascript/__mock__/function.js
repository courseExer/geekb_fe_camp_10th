module.exports = {
  demo1,
};
function demo1(object, ...sources) {
  object = Object(object);
  sources.forEach((source) => {
    if (source != null) {
      source = Object(source);
      for (const key in source) {
        const value = object[key];
        if (
          value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))
        ) {
          object[key] = source[key];
        }
      }
    }
  });
  return object;
}
