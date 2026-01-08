import type { Component } from 'solid-js';
import { Match, Switch, createMemo } from 'solid-js';
import {
  ArrayField,
  BooleanField,
  EnumField,
  NumberField,
  ObjectField,
  OneOfField,
  StringField,
} from './fields';
import type { JsonSchemaFormProps } from './types';

/**
 * JsonSchemaForm - A recursive JSON Schema form renderer for SolidJS
 *
 * Supports:
 * - Primitive types: string, number, integer, boolean
 * - Complex types: object, array
 * - Enums
 * - Union types (oneOf, anyOf)
 * - Required fields validation
 * - Nested objects and arrays
 *
 * @example
 * ```tsx
 * <JsonSchemaForm
 *   schema={{ type: 'object', properties: { name: { type: 'string' } } }}
 *   value={formData()}
 *   onChange={setFormData}
 * />
 * ```
 */
export const JsonSchemaForm: Component<JsonSchemaFormProps> = (props) => {
  const schemaType = createMemo(() => {
    const schema = props.schema;
    if (schema.enum && schema.enum.length > 0) {
      return 'enum';
    }
    if (schema.oneOf && schema.oneOf.length > 0) {
      return 'oneOf';
    }
    if (schema.anyOf && schema.anyOf.length > 0) {
      return 'anyOf';
    }
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
        <OneOfField schema={props.schema} value={props.value} onChange={props.onChange} />
      </Match>
    </Switch>
  );
};
