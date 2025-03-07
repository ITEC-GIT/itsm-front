type ThrottledFunction<T extends any[]> = (...args: T) => void;

export const throttle = <T extends any[]>(
  f: (...args: T) => void
): ThrottledFunction<T> & { cancel: () => void } => {
  let token: number | null = null;
  let lastArgs: T | null = null;

  const invoke = () => {
    if (lastArgs) {
      f(...lastArgs);
      token = null;
    }
  };

  const result = (...args: T) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };

  result.cancel = () => {
    if (token) {
      cancelAnimationFrame(token);
      token = null;
    }
  };

  return result;
};
