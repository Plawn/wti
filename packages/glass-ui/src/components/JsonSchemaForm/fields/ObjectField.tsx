import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import type { ObjectFieldProps } from '../types';
import { SchemaField } from './SchemaField';

/**
 * Object field renderer
 * Recursively renders properties of an object schema
 */
export const ObjectField: Component<ObjectFieldProps> = (props) => {
  const currentValue = () => props.value || {};
  const properties = () => props.schema.properties || {};
  const requiredFields = () => props.schema.required || [];

  const updateField = (key: string, fieldValue: unknown) => {
    const newValue = { ...currentValue() };
    if (fieldValue === undefined) {
      delete newValue[key];
    } else {
      newValue[key] = fieldValue;
    }
    props.onChange(Object.keys(newValue).length > 0 ? newValue : undefined);
  };

  // If we're at the root level (path.length === 0), render properties directly
  // Otherwise, render as a nested card
  const isRoot = () => props.path.length === 0;

  return (
    <Show
      when={isRoot()}
      fallback={
        <div class="glass-card rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
          <For each={Object.entries(properties())}>
            {([key, propSchema]) => (
              <SchemaField
                name={key}
                schema={propSchema}
                value={currentValue()[key]}
                required={requiredFields().includes(key)}
                onChange={(v) => updateField(key, v)}
                path={[...props.path, key]}
              />
            )}
          </For>
        </div>
      }
    >
      <div class="space-y-4">
        <For each={Object.entries(properties())}>
          {([key, propSchema]) => (
            <SchemaField
              name={key}
              schema={propSchema}
              value={currentValue()[key]}
              required={requiredFields().includes(key)}
              onChange={(v) => updateField(key, v)}
              path={[...props.path, key]}
            />
          )}
        </For>
      </div>
    </Show>
  );
};
