export const deferredPromise = <T>(): [(value: T) => void, () => Promise<T>] => {
  let outside: (value: T) => void = () => {};
  const promise = new Promise<T>((resolve) => {
    outside = resolve;
  });
  return [(value: T) => outside(value), () => promise];
};
