import { derived, writable } from 'svelte/store';

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
  startTime: number;
  endTime: number;
  timeout: number;
  currentState: 'error' | 'success' | 'other';
}

interface IntervalStore {
  timeRemaining: number;
  percentCompleted: number;
}

export const interval = <T>(
  refreshStore: Refreshable<T>,
): Readable<IntervalStore> =>
  derived(refreshStore, (refreshStore, set) => {
    set({
      ...refreshStore,
      get timeRemaining() {
        return this.endTime - Date.now();
      },
      get percentCompleted() {
        return Math.floor(
          ((refreshStore.timeout - this.timeRemaining) / refreshStore.timeout) *
            100,
        );
      },
    });
  });

export const refreshable = <T>(
  callback: () => Promise<T>,
  initialData: Promise<T> | T = callback(),
  timeout: Timeout = 10000,
): Refreshable<T> => {
  let interval: Timer;

  const heartBeatInterval = 2500;

  let isRunning = true;
  let timeLeftFromPause = 0;

  const refresh = () => {
    console.log('Refresh');
    callback()
      .then((data: T) =>
        store.set({
          data: Promise.resolve(data),
          timeout,
          startTime: Date.now(),
          endTime: Date.now() + timeout,
          currentState: 'success',
        }),
      )
      .catch(() => {
        store.set({
          data: Promise.resolve(null),
          timeout,
          startTime: Date.now(),
          endTime: Date.now() + timeout,
          currentState: 'error',
        });
      });
  };

  const tick = async () => {
    let startTime;
    let endTime;

    // This is weird but it triggers the store to update so our derived values
    // will show up in UI's
    store.update((store) => {
      startTime = store.startTime;
      endTime = store.endTime;

      if (isRunning === false) {
        startTime = Date.now();
        endTime = startTime + timeLeftFromPause;
        timeLeftFromPause = 0;
        isRunning = true;
      }

      return { ...store, startTime, endTime };
    });

    if (Date.now() >= endTime) {
      // Hit callback for
      await refresh();
    }
    interval = setTimeout(tick, heartBeatInterval);
  };

  // This restarts without taking into consideration the previous timer
  // may want to change this
  const restart = () => {
    tick();
  };

  const pause = () => {
    store.update((store) => {
      timeLeftFromPause = store.endTime - Date.now();
      console.log('Time remaining in pause', timeLeftFromPause);

      return { ...store };
    });
    isRunning = false;
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
      timeout,
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
