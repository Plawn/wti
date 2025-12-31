import type { Component } from 'solid-js';
import { Show } from 'solid-js';

export const LoadingScreen: Component = () => {
  return (
    <div class="flex items-center justify-center h-screen">
      <div class="glass-card rounded-3xl p-8 flex flex-col items-center gap-5">
        <div class="relative">
          <div class="w-14 h-14 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30" />
          <div class="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        </div>
        <p class="text-gray-600 dark:text-gray-300 font-medium">Loading API specification...</p>
      </div>
    </div>
  );
};

interface ErrorScreenProps {
  error: string | null;
  onRetry?: () => void;
}

export const ErrorScreen: Component<ErrorScreenProps> = (props) => {
  return (
    <div class="flex items-center justify-center h-screen p-6">
      <div class="glass-card rounded-3xl p-8 max-w-lg border-red-200/30 dark:border-red-800/20">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Failed to load API</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{props.error}</p>
            <Show when={props.onRetry}>
              <button
                type="button"
                onClick={props.onRetry}
                class="mt-4 px-4 py-2 text-sm font-medium rounded-xl glass-button text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Try again
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WelcomeScreen: Component = () => {
  return (
    <div class="flex flex-col items-center justify-center h-full min-h-screen text-center p-8">
      <div class="glass-card rounded-[2rem] p-10 max-w-md">
        {/* Logo */}
        <div class="relative inline-flex mb-8">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25 transform hover:scale-105 transition-spring">
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-15 blur-2xl -z-10" />
        </div>

        {/* Title */}
        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3">
          WTI
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mb-6 font-medium">What The Interface</p>

        {/* Divider */}
        <div class="divider-glass my-8" />

        {/* Instructions */}
        <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
          Select an operation from the sidebar to explore and test API endpoints
        </p>

        {/* Keyboard hints */}
        <div class="mt-8 flex flex-col items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div class="inline-flex items-center gap-2.5">
            <kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-gray-600 dark:text-gray-300">
              /
            </kbd>
            <span>to search</span>
          </div>
          <div class="inline-flex items-center gap-2.5">
            <kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-gray-600 dark:text-gray-300">
              <span class="text-[10px]">Cmd</span>+P
            </kbd>
            <span>command palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ErrorToastProps {
  message: string | null;
  title?: string;
}

export const ErrorToast: Component<ErrorToastProps> = (props) => {
  return (
    <Show when={props.message}>
      <div class="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 border border-red-200/30 dark:border-red-800/20 shadow-lg max-w-md animate-slide-in">
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              class="w-4 h-4 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {props.title ?? 'Error'}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{props.message}</p>
          </div>
        </div>
      </div>
    </Show>
  );
};
