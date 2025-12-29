import { type Component, type JSX, Show, createSignal, onCleanup } from 'solid-js';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string | JSX.Element;
  children: JSX.Element;
  position?: TooltipPosition;
  delay?: number;
  class?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-x-transparent border-b-transparent',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-y-transparent border-r-transparent',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-y-transparent border-l-transparent',
};

export const Tooltip: Component<TooltipProps> = (props) => {
  const [visible, setVisible] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const position = () => props.position ?? 'top';
  const delay = () => props.delay ?? 200;

  const showTooltip = () => {
    timeoutId = setTimeout(() => setVisible(true), delay());
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    setVisible(false);
  };

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  return (
    <div
      class={`relative inline-flex ${props.class ?? ''}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocusIn={showTooltip}
      onFocusOut={hideTooltip}
    >
      {props.children}
      <Show when={visible()}>
        <div
          class={`absolute z-50 ${positionStyles[position()]} animate-in fade-in zoom-in-95 duration-150`}
          role="tooltip"
        >
          <div class="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap">
            {props.content}
          </div>
          <div class={`absolute w-0 h-0 border-4 ${arrowStyles[position()]}`} aria-hidden="true" />
        </div>
      </Show>
    </div>
  );
};
