import type { ApiSpec } from '@wti/core';
import { type Component, Show } from 'solid-js';
import { useTheme } from '../../context';
import { useI18n } from '../../i18n';

interface SidebarHeaderProps {
  spec: ApiSpec;
  onOpenHistory?: () => void;
  onClose?: () => void;
}

export const SidebarHeader: Component<SidebarHeaderProps> = (props) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <header class="flex-shrink-0 z-10 px-3 md:px-4 py-2 md:py-3 overflow-hidden border-t md:border-t-0 border-surface-200 dark:border-white/5 glass-surface">
      <div class="flex items-center gap-2 md:gap-2.5 flex-nowrap">
        <div class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md shadow-accent-500/20">
          <svg
            class="w-5 h-5 md:w-6 md:h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="font-semibold text-surface-900 dark:text-white truncate leading-tight text-sm md:text-base">
            {props.spec.info.title}
          </h1>
          <span class="text-[11px] md:text-xs text-surface-500 dark:text-surface-400 font-medium">
            v{props.spec.info.version}
          </span>
        </div>
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors overflow-hidden"
          aria-label={
            theme() === 'dark' ? t('sidebar.toggleThemeLight') : t('sidebar.toggleThemeDark')
          }
          title={theme() === 'dark' ? t('sidebar.toggleThemeLight') : t('sidebar.toggleThemeDark')}
        >
          <div class="relative w-4 h-4 md:w-5 md:h-5">
            {/* Sun icon - visible in dark mode */}
            <svg
              class={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${theme() === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {/* Moon icon - visible in light mode */}
            <svg
              class={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${theme() === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>
        </button>
        {/* History button */}
        <button
          type="button"
          onClick={() => props.onOpenHistory?.()}
          class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
          title="Request History"
        >
          <svg
            class="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        {/* Close button - only shown in mobile drawer */}
        <Show when={props.onClose}>
          <button
            type="button"
            onClick={() => props.onClose?.()}
            class="w-8 h-8 shrink-0 rounded-lg glass-button flex items-center justify-center text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors md:hidden"
            title={t('common.close')}
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Show>
      </div>
    </header>
  );
};
