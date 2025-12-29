import { createSignal } from 'solid-js';

export interface UseCopyToClipboardReturn {
  copied: () => boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook for copying text to clipboard with a "copied" state indicator.
 * The copied state resets to false after the specified duration.
 *
 * @param resetDelay - Time in ms before copied state resets (default: 2000)
 */
export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const copy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setCopied(false);
      timeoutId = undefined;
    }, resetDelay);
  };

  return { copied, copy };
}
