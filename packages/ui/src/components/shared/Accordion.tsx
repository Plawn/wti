import { type Component, For, type JSX, Show, createSignal } from 'solid-js';

export interface AccordionItem {
  id: string;
  title: string | JSX.Element;
  content: JSX.Element;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items to be open at once */
  multiple?: boolean;
  class?: string;
}

export const Accordion: Component<AccordionProps> = (props) => {
  const getDefaultOpen = () => {
    const defaults: string[] = [];
    for (const item of props.items) {
      if (item.defaultOpen) defaults.push(item.id);
    }
    return defaults;
  };

  const [openItems, setOpenItems] = createSignal<string[]>(getDefaultOpen());

  const isOpen = (id: string) => openItems().includes(id);

  const toggle = (id: string) => {
    if (props.multiple) {
      setOpenItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div class={`space-y-2 ${props.class ?? ''}`}>
      <For each={props.items}>
        {(item) => (
          <div class="glass-card rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              class="w-full flex items-center justify-between px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              aria-expanded={isOpen(item.id)}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div class="flex items-center gap-3 text-left">
                <svg
                  class={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen(item.id) ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {item.title}
                </span>
              </div>
              <svg
                class={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen(item.id) ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Show when={isOpen(item.id)}>
              <div
                id={`accordion-content-${item.id}`}
                class="px-5 pb-4 border-t border-white/10 dark:border-white/5 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div class="pt-4">{item.content}</div>
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export interface AccordionSingleProps {
  title: string | JSX.Element;
  children: JSX.Element;
  defaultOpen?: boolean;
  class?: string;
}

/** Single accordion panel for simple use cases */
export const AccordionPanel: Component<AccordionSingleProps> = (props) => {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false);

  return (
    <div class={`glass-card rounded-xl overflow-hidden ${props.class ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open())}
        class="w-full flex items-center justify-between px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        aria-expanded={open()}
      >
        <div class="flex items-center gap-3 text-left">
          <svg
            class={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open() ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{props.title}</span>
        </div>
        <svg
          class={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${open() ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={open()}>
        <div class="px-5 pb-4 border-t border-white/10 dark:border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div class="pt-4">{props.children}</div>
        </div>
      </Show>
    </div>
  );
};
