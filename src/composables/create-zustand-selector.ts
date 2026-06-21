import { createSignal, onCleanup, type Accessor } from "solid-js";
import type { StoreApi } from "zustand";

/** Bridge a Zustand store into Solid reactivity. Returns an accessor that
 *  tracks the selected slice and updates when it changes — the glue that lets
 *  Solid components read our global Zustand state fine-grained. */
export function createZustandSelector<TState, TSlice>(
  store: StoreApi<TState>,
  selector: (state: TState) => TSlice,
): Accessor<TSlice> {
  const [slice, setSlice] = createSignal<TSlice>(selector(store.getState()));

  const unsubscribe = store.subscribe(state => {
    setSlice(() => selector(state));
  });
  onCleanup(unsubscribe);

  return slice;
}
