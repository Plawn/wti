/**
 * Check if dark mode is active.
 * Needed for Portal which renders outside the dark class container.
 *
 * Returns a function that checks the current state each time it's called,
 * ensuring correct detection even when dark mode changes.
 */
export function useIsDark() {
  return () =>
    document.documentElement.classList.contains('dark') || document.querySelector('.dark') !== null;
}
