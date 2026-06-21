/** Trailing-edge debounce. Returns a wrapped function that delays calling
 *  `callback` until `waitMs` has passed since the last invocation. */
export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  waitMs: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => callback(...args), waitMs);
  };
}
