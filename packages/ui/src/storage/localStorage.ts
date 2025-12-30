/**
 * Simple localStorage wrapper with error handling and SSR compatibility
 */

const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Safely get a value from localStorage
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (!isClient) {
    return defaultValue;
  }

  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage
 */
export function setLocalStorageItem<T>(key: string, value: T): boolean {
  if (!isClient) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or other storage error
    return false;
  }
}

/**
 * Safely remove a value from localStorage
 */
export function removeLocalStorageItem(key: string): boolean {
  if (!isClient) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
