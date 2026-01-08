import type { Component } from 'solid-js';
import { Textarea } from '../../Input';
import type { BaseFieldProps } from '../types';
import { toDisplayStringJson } from '../utils';

/**
 * Union field renderer (oneOf/anyOf)
 * Renders as JSON textarea for complex union types
 */
export const OneOfField: Component<BaseFieldProps> = (props) => {
  const stringValue = () => toDisplayStringJson(props.value);

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
