import { type Component, For, type JSX, Show, createSignal } from 'solid-js';

export interface TabItem {
  id: string;
  label: string;
  icon?: JSX.Element;
  content: JSX.Element;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  class?: string;
}

export const Tabs: Component<TabsProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal(props.defaultTab || props.items[0]?.id);

  return (
    <div class={`w-full ${props.class ?? ''}`}>
      {/* Tab List */}
      <div class="flex items-center gap-1 p-1 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-white/10 overflow-x-auto scrollbar-thin">
        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              onClick={() => setActiveTab(item.id)}
              class={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap outline-none focus-ring ${
                activeTab() === item.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-white/5'
              }`}
              aria-selected={activeTab() === item.id}
              role="tab"
            >
              <Show when={item.icon}>
                <span class={activeTab() === item.id ? 'text-blue-500 dark:text-blue-400' : ''}>
                  {item.icon}
                </span>
              </Show>
              {item.label}
              <Show when={item.badge}>
                <span
                  class={`ml-1 px-1.5 py-0.5 text-[10px] rounded-md ${
                    activeTab() === item.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
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
