import { writable } from 'svelte/store';

import type { Readable } from 'svelte/store';

type SetIntervalType = typeof setInterval;
type Timer = ReturnType<SetIntervalType>;
type Timeout = Parameters<SetIntervalType>[1];

export interface Refreshable<T> extends Readable<RefreshableStore<T>> {
  refresh: () => void;
  pause: () => void;
  restart: () => void;
}
interface RefreshableStore<T> {
  data: Promise<T> | T;
  timeRemaining: number;
  percentCompleted: number;
  startTime: number;
  endTime: number;
  currentState: 'error' | 'success' | 'other';
}

export const refreshable = <T>(
  callback: () => Promise<T>,
  initialData: Promise<T> | T = callback(),
  timeout: Timeout = 10000,
): Refreshable<T> => {
  let interval: Timer;

  const heartBeatInterval = 75;
  let startTime = Date.now();

  const refresh = () => {
    callback()
      .then((data: T) =>
        store.set({
          data: Promise.resolve(data),
          get timeRemaining() {
            return this.endTime - Date.now();
          },
          get percentCompleted() {
            return Math.floor(((timeout - this.timeRemaining) / timeout) * 100);
          },
          startTime: Date.now(),
          endTime: Date.now() + timeout,
          currentState: 'success',
        }),
      )
      .catch(() => {
        store.set({
          data: Promise.resolve(null),
          get timeRemaining() {
            return this.endTime - Date.now();
          },
          get percentCompleted() {
            return Math.floor(((timeout - this.timeRemaining) / timeout) * 100);
          },
          startTime: Date.now(),
          endTime: Date.now() + timeout,
          currentState: 'error',
        });
      });
  };

  const tick = async () => {
    const timeSinceStart = Date.now() - startTime;

    if (timeSinceStart >= timeout) {
      // Hit callback for
      await refresh();
      startTime = Date.now();
    }
    // This is weird but it triggers the store to update so our derived values
    // will show up in UI's
    store.update((store) => {
      return store;
    });
    interval = setTimeout(tick, heartBeatInterval);
  };

  // This restarts without taking into consideration the previous timer
  // may want to change this
  const restart = () => {
    tick();
  };

  const pause = () => {
    cleanUp();
  };

  const cleanUp = () => clearInterval(interval);

  const setUp = () => {
    tick();
    return cleanUp;
  };

  const store = writable<RefreshableStore<T>>(
    {
      data: Promise.resolve(initialData),
      get timeRemaining() {
        return this.endTime - Date.now();
      },
      get percentCompleted() {
        return Math.floor(((timeout - this.timeRemaining) / timeout) * 100);
      },
      startTime: Date.now(),
      endTime: Date.now() + timeout,
      currentState: 'other',
    },
    setUp,
  );

  return {
    subscribe: store.subscribe,
    refresh,
    restart,
    pause,
  };
};
