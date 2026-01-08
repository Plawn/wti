import type { Component } from 'solid-js';
import { For, Match, Show, Switch } from 'solid-js';
import type { ArrayFieldProps, BaseFieldProps } from '../types';
import { getDefaultValue } from '../utils';
import { BooleanField } from './BooleanField';
import { EnumField } from './EnumField';
import { NumberField } from './NumberField';
import { StringField } from './StringField';

// Forward declaration - will import the main component
import { JsonSchemaForm } from '../JsonSchemaForm';

/**
 * Primitive array item renderer (inline editing for simple types)
 */
const PrimitiveArrayItem: Component<BaseFieldProps> = (props) => {
  const schemaType = () => props.schema.type || 'string';

  return (
    <Switch
      fallback={<StringField schema={props.schema} value={props.value} onChange={props.onChange} />}
    >
      <Match when={props.schema.enum && props.schema.enum.length > 0}>
        <EnumField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'boolean'}>
        <BooleanField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'number' || schemaType() === 'integer'}>
        <NumberField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
    </Switch>
  );
};

/**
 * Array field renderer with add/remove/reorder functionality
 */
export const ArrayField: Component<ArrayFieldProps> = (props) => {
  const currentValue = () => props.value || [];
  const itemSchema = () => props.schema.items || { type: 'string' };

  const addItem = () => {
    const newItem = getDefaultValue(itemSchema());
    props.onChange([...currentValue(), newItem]);
  };

  const removeItem = (index: number) => {
    const newArray = currentValue().filter((_, i) => i !== index);
    props.onChange(newArray.length > 0 ? newArray : undefined);
  };

  const updateItem = (index: number, itemValue: unknown) => {
    const newArray = [...currentValue()];
    newArray[index] = itemValue;
    props.onChange(newArray);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentValue().length) {
      return;
    }
    const newArray = [...currentValue()];
    const [item] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, item);
    props.onChange(newArray);
  };

  const isPrimitive = () => {
    const type = itemSchema().type;
    return type === 'string' || type === 'number' || type === 'integer' || type === 'boolean';
  };

  return (
    <div class="space-y-3">
      {/* Array items */}
      <For each={currentValue()}>
        {(item, index) => (
          <div class="glass-card rounded-xl p-3 sm:p-4">
            {/* Item header with controls */}
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Item {index() + 1}
                </span>
                <Show when={itemSchema().type}>
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    ({itemSchema().type})
                  </span>
                </Show>
              </div>
              <div class="flex items-center gap-1 self-end sm:self-auto">
                {/* Move up button */}
                <button
                  type="button"
                  onClick={() => moveItem(index(), index() - 1)}
                  disabled={index() === 0}
                  class="glass-icon-btn"
                  title="Move up"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                {/* Move down button */}
                <button
                  type="button"
                  onClick={() => moveItem(index(), index() + 1)}
                  disabled={index() === currentValue().length - 1}
                  class="glass-icon-btn"
                  title="Move down"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(index())}
                  class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  title="Remove item"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Item content */}
            <Show
              when={isPrimitive()}
              fallback={
                <JsonSchemaForm
                  schema={itemSchema()}
                  value={item}
                  onChange={(v) => updateItem(index(), v)}
                  path={[...props.path, String(index())]}
                />
              }
            >
              <PrimitiveArrayItem
                schema={itemSchema()}
                value={item}
                onChange={(v) => updateItem(index(), v)}
              />
            </Show>
          </div>
        )}
      </For>

      {/* Add item button */}
      <button
        type="button"
        onClick={addItem}
        class="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add item
      </button>

      {/* Constraints hint */}
      <Show when={props.schema.minItems !== undefined || props.schema.maxItems !== undefined}>
        <div class="text-xs text-gray-400 dark:text-gray-500">
          <Show when={props.schema.minItems !== undefined}>Min items: {props.schema.minItems}</Show>
          <Show when={props.schema.minItems !== undefined && props.schema.maxItems !== undefined}>
            {' | '}
          </Show>
          <Show when={props.schema.maxItems !== undefined}>Max items: {props.schema.maxItems}</Show>
        </div>
      </Show>
    </div>
  );
};
