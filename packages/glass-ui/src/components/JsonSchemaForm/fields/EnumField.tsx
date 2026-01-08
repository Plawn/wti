import type { Component } from 'solid-js';
import { For } from 'solid-js';
import { Select } from '../../Input';
import type { BaseFieldProps } from '../types';
import { toDisplayString } from '../utils';

/**
 * Enum field renderer
 * Renders a select dropdown with enum options
 */
export const EnumField: Component<BaseFieldProps> = (props) => {
  const stringValue = () => toDisplayString(props.value);

  const handleChange = (strValue: string) => {
    if (strValue === '') {
      props.onChange(undefined);
      return;
    }
    // Try to preserve original type from enum values
    const enumValues = props.schema.enum || [];
    const originalValue = enumValues.find((v: unknown) => String(v) === strValue);
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
