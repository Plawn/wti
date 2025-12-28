import type { Schema } from '@wti/core';
import { type Component, For, Match, Show, Switch, createMemo } from 'solid-js';
import { Checkbox, Input, Select, Textarea } from './Input';

/**
 * Props for the JsonSchemaForm component
 */
export interface JsonSchemaFormProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
  required?: boolean;
  path?: string[];
}

/**
 * JsonSchemaForm - A recursive JSON Schema form renderer for SolidJS
 *
 * Supports:
 * - Primitive types: string, number, integer, boolean
 * - Complex types: object, array
 * - Enums
 * - Required fields validation
 * - Nested objects and arrays
 */
export const JsonSchemaForm: Component<JsonSchemaFormProps> = (props) => {
  const schemaType = createMemo(() => {
    const schema = props.schema;
    if (schema.enum && schema.enum.length > 0) return 'enum';
    if (schema.oneOf && schema.oneOf.length > 0) return 'oneOf';
    if (schema.anyOf && schema.anyOf.length > 0) return 'anyOf';
    return schema.type || 'string';
  });

  return (
    <Switch
      fallback={<StringField schema={props.schema} value={props.value} onChange={props.onChange} />}
    >
      <Match when={schemaType() === 'object'}>
        <ObjectField
          schema={props.schema}
          value={props.value as Record<string, unknown> | undefined}
          onChange={props.onChange}
          path={props.path || []}
        />
      </Match>
      <Match when={schemaType() === 'array'}>
        <ArrayField
          schema={props.schema}
          value={props.value as unknown[] | undefined}
          onChange={props.onChange}
          path={props.path || []}
        />
      </Match>
      <Match when={schemaType() === 'enum'}>
        <EnumField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'boolean'}>
        <BooleanField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'number' || schemaType() === 'integer'}>
        <NumberField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'string'}>
        <StringField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
      <Match when={schemaType() === 'oneOf' || schemaType() === 'anyOf'}>
        <UnionField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
    </Switch>
  );
};

/**
 * String field renderer
 */
interface StringFieldProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const StringField: Component<StringFieldProps> = (props) => {
  const stringValue = () => {
    if (props.value === undefined || props.value === null) return '';
    return String(props.value);
  };

  const isMultiline = () => {
    const format = props.schema.format;
    return format === 'textarea' || (props.schema.maxLength && props.schema.maxLength > 200);
  };

  return (
    <Show
      when={isMultiline()}
      fallback={
        <Input
          value={stringValue()}
          onInput={(v) => props.onChange(v || undefined)}
          placeholder={props.schema.default?.toString() || ''}
        />
      }
    >
      <Textarea
        value={stringValue()}
        onInput={(v) => props.onChange(v || undefined)}
        placeholder={props.schema.default?.toString() || ''}
        class="h-24"
      />
    </Show>
  );
};

/**
 * Number/Integer field renderer
 */
interface NumberFieldProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const NumberField: Component<NumberFieldProps> = (props) => {
  const stringValue = () => {
    if (props.value === undefined || props.value === null) return '';
    return String(props.value);
  };

  const handleChange = (strValue: string) => {
    if (strValue === '') {
      props.onChange(undefined);
      return;
    }
    const num = Number(strValue);
    if (!Number.isNaN(num)) {
      props.onChange(num);
    }
  };

  return (
    <Input
      type="number"
      value={stringValue()}
      onInput={handleChange}
      placeholder={props.schema.default?.toString() || '0'}
    />
  );
};

/**
 * Boolean field renderer
 */
interface BooleanFieldProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const BooleanField: Component<BooleanFieldProps> = (props) => {
  return (
    <Checkbox
      checked={props.value === true}
      onChange={(checked) => props.onChange(checked)}
      label={props.value === true ? 'true' : 'false'}
    />
  );
};

/**
 * Enum field renderer
 */
interface EnumFieldProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const EnumField: Component<EnumFieldProps> = (props) => {
  const stringValue = () => {
    if (props.value === undefined || props.value === null) return '';
    return String(props.value);
  };

  const handleChange = (strValue: string) => {
    if (strValue === '') {
      props.onChange(undefined);
      return;
    }
    // Try to preserve original type from enum values
    const enumValues = props.schema.enum || [];
    const originalValue = enumValues.find((v) => String(v) === strValue);
    props.onChange(originalValue !== undefined ? originalValue : strValue);
  };

  return (
    <Select value={stringValue()} onChange={handleChange}>
      <option value="">-- Select --</option>
      <For each={props.schema.enum as unknown[]}>
        {(enumValue) => <option value={String(enumValue)}>{String(enumValue)}</option>}
      </For>
    </Select>
  );
};

/**
 * Union field renderer (oneOf/anyOf) - renders as JSON textarea for now
 */
interface UnionFieldProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const UnionField: Component<UnionFieldProps> = (props) => {
  const stringValue = () => {
    if (props.value === undefined || props.value === null) return '';
    if (typeof props.value === 'object') return JSON.stringify(props.value, null, 2);
    return String(props.value);
  };

  const handleChange = (strValue: string) => {
    if (strValue === '') {
      props.onChange(undefined);
      return;
    }
    try {
      props.onChange(JSON.parse(strValue));
    } catch {
      props.onChange(strValue);
    }
  };

  return (
    <Textarea
      value={stringValue()}
      onInput={handleChange}
      placeholder="{}"
      class="h-24 font-mono text-sm"
    />
  );
};

/**
 * Object field renderer - recursively renders properties
 */
interface ObjectFieldProps {
  schema: Schema;
  value: Record<string, unknown> | undefined;
  onChange: (value: unknown) => void;
  path: string[];
}

const ObjectField: Component<ObjectFieldProps> = (props) => {
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
        <div class="glass-card rounded-xl p-4 space-y-4">
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

/**
 * Array field renderer with add/remove/reorder functionality
 */
interface ArrayFieldProps {
  schema: Schema;
  value: unknown[] | undefined;
  onChange: (value: unknown) => void;
  path: string[];
}

const ArrayField: Component<ArrayFieldProps> = (props) => {
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
    if (toIndex < 0 || toIndex >= currentValue().length) return;
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
          <div class="glass-card rounded-xl p-4">
            {/* Item header with controls */}
            <div class="flex items-center justify-between mb-3">
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
              <div class="flex items-center gap-1">
                {/* Move up button */}
                <button
                  type="button"
                  onClick={() => moveItem(index(), index() - 1)}
                  disabled={index() === 0}
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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

/**
 * Primitive array item renderer (inline editing for simple types)
 */
interface PrimitiveArrayItemProps {
  schema: Schema;
  value: unknown;
  onChange: (value: unknown) => void;
}

const PrimitiveArrayItem: Component<PrimitiveArrayItemProps> = (props) => {
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
 * SchemaField - Wraps JsonSchemaForm with field label and metadata
 */
interface SchemaFieldProps {
  name: string;
  schema: Schema;
  value: unknown;
  required?: boolean;
  onChange: (value: unknown) => void;
  path: string[];
}

const SchemaField: Component<SchemaFieldProps> = (props) => {
  const schemaType = () => props.schema.type || 'string';
  const isComplexType = () => schemaType() === 'object' || schemaType() === 'array';

  return (
    <div class="space-y-2">
      {/* Field label and metadata */}
      <div class="flex items-center gap-2">
        <span class="font-mono text-sm font-medium text-gray-900 dark:text-white">
          {props.name}
        </span>
        <Show when={props.required}>
          <span class="text-rose-500 text-xs font-semibold">required</span>
        </Show>
        <span class="text-xs text-gray-400 dark:text-gray-500">{schemaType()}</span>
        <Show when={props.schema.format}>
          <span class="text-xs text-gray-400 dark:text-gray-500">({props.schema.format})</span>
        </Show>
      </div>

      {/* Description */}
      <Show when={props.schema.description}>
        <p class="text-xs text-gray-400 dark:text-gray-500">{props.schema.description}</p>
      </Show>

      {/* Field input */}
      <Show
        when={isComplexType()}
        fallback={
          <div class="sm:max-w-xs">
            <JsonSchemaForm
              schema={props.schema}
              value={props.value}
              onChange={props.onChange}
              path={props.path}
            />
          </div>
        }
      >
        <JsonSchemaForm
          schema={props.schema}
          value={props.value}
          onChange={props.onChange}
          path={props.path}
        />
      </Show>
    </div>
  );
};

/**
 * Get default value for a schema type
 */
function getDefaultValue(schema: Schema): unknown {
  if (schema.default !== undefined) return schema.default;

  const type = schema.type || 'string';
  switch (type) {
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        const required = schema.required || [];
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (required.includes(key)) {
            obj[key] = getDefaultValue(propSchema);
          }
        }
        return obj;
      }
      return {};
    default:
      return undefined;
  }
}
