import { createStore, produce } from 'solid-js/store';
import type { ToastStore, ToastType } from './types';

const [store, setStore] = createStore<ToastStore>({ toasts: [] });

let toastId = 0;

/** Add a toast notification */
export function toast(message: string, type: ToastType = 'info', duration = 4000) {
  const id = `toast-${++toastId}`;
  setStore(
    produce((s) => {
      s.toasts.push({ id, type, message, duration });
    }),
  );

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

/** Dismiss a toast by ID */
export function dismissToast(id: string) {
  setStore(
    produce((s) => {
      s.toasts = s.toasts.filter((t) => t.id !== id);
    }),
  );
}

/** Clear all toasts */
export function clearToasts() {
  setStore('toasts', []);
}

/** Get the toast store (read-only) */
export function getToastStore() {
  return store;
}
