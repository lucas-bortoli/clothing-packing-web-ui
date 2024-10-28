export default function Run<T>(cb: () => T) {
  return cb();
}
