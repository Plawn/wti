import { type Component, For, Show, createMemo, createSignal } from 'solid-js';
import type { TabsProps } from './types';

export const Tabs: Component<TabsProps> = (props) => {
  // Internal state for uncontrolled mode
  const [internalTab, setInternalTab] = createSignal(props.defaultTab || props.items[0]?.id);

  // Determine if we're in controlled mode
  const isControlled = createMemo(() => props.activeTab !== undefined);

  // Get the current active tab (controlled or uncontrolled)
  const activeTab = createMemo(() =>
    isControlled() ? (props.activeTab as string) : internalTab(),
  );

  const handleTabChange = (tabId: string) => {
    if (!isControlled()) {
      setInternalTab(tabId);
    }
    props.onTabChange?.(tabId);
  };

  return (
    <div class={`w-full ${props.class ?? ''}`}>
      {/* Tab List */}
      <div class="flex items-center gap-1 p-1 rounded-xl glass-input overflow-x-auto scrollbar-thin">
        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              onClick={() => handleTabChange(item.id)}
              class={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap outline-none focus-ring ${
                activeTab() === item.id
                  ? 'glass-active text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
              }`}
              aria-selected={activeTab() === item.id}
              role="tab"
            >
              <Show when={item.icon}>
                <span class={activeTab() === item.id ? 'text-accent-500 dark:text-accent-500' : ''}>
                  {item.icon}
                </span>
              </Show>
              {item.label}
              <Show when={item.badge}>
                <span
                  class={`ml-1 px-1.5 py-0.5 text-[0.625rem] rounded-md ${
                    activeTab() === item.id
                      ? 'glass-button text-gray-700 dark:text-gray-200'
                      : 'glass-button text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.badge}
                </span>
              </Show>
            </button>
          )}
        </For>
      </div>

      {/* Tab Content */}
      <div class="mt-4">
        <For each={props.items}>
          {(item) => (
            <Show when={activeTab() === item.id}>
              <div role="tabpanel" class="animate-in fade-in slide-in-from-bottom-2 duration-200">
                {item.content}
              </div>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
};
