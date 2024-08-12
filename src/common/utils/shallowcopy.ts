export function shallowCopy<T>(obj: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj) as T;
}
