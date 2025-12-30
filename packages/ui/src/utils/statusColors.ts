/**
 * HTTP status code color utilities
 */

export interface StatusColorConfig {
  bg: string;
  text: string;
}

/**
 * Get color configuration for HTTP status code (badge style).
 * Used for displaying status in response sections.
 */
export function getStatusColorConfig(status: number): StatusColorConfig {
  if (status >= 200 && status < 300) {
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
    };
  }
  if (status >= 400 && status < 500) {
    return {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
    };
  }
  return {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-300',
  };
}

/**
 * Get indicator dot color for HTTP status code.
 * Used for compact status indicators in history lists.
 */
export function getStatusIndicatorColor(status: number | undefined, hasError: boolean): string {
  if (hasError) return 'bg-rose-500';
  if (status === undefined) return 'bg-gray-400';
  if (status >= 200 && status < 300) return 'bg-emerald-500';
  if (status >= 400 && status < 500) return 'bg-amber-500';
  if (status >= 500) return 'bg-rose-500';
  return 'bg-gray-400';
}

/**
 * Get text color class for status code display.
 */
export function getStatusTextColor(status: number): string {
  if (status >= 400) return 'text-rose-500';
  return 'text-emerald-500';
}
