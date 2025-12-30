/**
 * Utilities for working with AbortSignals
 */

/**
 * Combine multiple AbortSignals into one.
 * The returned signal will abort when any of the input signals abort.
 */
export function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener('abort', () => controller.abort());
  }

  return controller.signal;
}
