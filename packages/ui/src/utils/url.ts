/**
 * URL utilities for deep linking to operations
 *
 * Uses hash-based routing to avoid page reloads:
 * - #op=operationId
 * - #op=operationId&server=1
 */

export interface UrlParams {
  operationId?: string;
  serverIndex?: number;
}

/**
 * Parse the URL hash and extract operation parameters
 */
export function getParamsFromUrl(): UrlParams {
  const hash = window.location.hash.slice(1); // Remove leading #
  if (!hash) return {};

  const params = new URLSearchParams(hash);
  const operationId = params.get('op') || undefined;
  const serverIndexStr = params.get('server');
  const serverIndex = serverIndexStr ? Number.parseInt(serverIndexStr, 10) : undefined;

  return {
    operationId,
    serverIndex: Number.isNaN(serverIndex) ? undefined : serverIndex,
  };
}

/**
 * Update the URL hash with the given operation parameters
 * Uses replaceState to avoid polluting browser history
 */
export function updateUrlWithParams(params: UrlParams): void {
  const hashParams = new URLSearchParams();

  if (params.operationId) {
    hashParams.set('op', params.operationId);
  }

  if (params.serverIndex !== undefined && params.serverIndex > 0) {
    hashParams.set('server', params.serverIndex.toString());
  }

  const newHash = hashParams.toString();
  const newUrl = newHash
    ? `${window.location.pathname}${window.location.search}#${newHash}`
    : window.location.pathname + window.location.search;

  window.history.replaceState(null, '', newUrl);
}

/**
 * Clear the URL hash (when deselecting an operation)
 */
export function clearUrlParams(): void {
  const newUrl = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', newUrl);
}

/**
 * Get a shareable URL for the given operation
 */
export function getShareableUrl(operationId: string, serverIndex?: number): string {
  const url = new URL(window.location.href);
  url.hash = '';

  const hashParams = new URLSearchParams();
  hashParams.set('op', operationId);

  if (serverIndex !== undefined && serverIndex > 0) {
    hashParams.set('server', serverIndex.toString());
  }

  url.hash = hashParams.toString();
  return url.toString();
}

/**
 * Copy the shareable URL to clipboard
 */
export async function copyShareableUrl(operationId: string, serverIndex?: number): Promise<void> {
  const url = getShareableUrl(operationId, serverIndex);
  await navigator.clipboard.writeText(url);
}
