import type { Component } from 'solid-js';
import { Input } from '../../Input';
import type { BaseFieldProps } from '../types';
import { toDisplayString } from '../utils';

/**
 * Number/Integer field renderer
 * Handles parsing and validation of numeric input
 */
export const NumberField: Component<BaseFieldProps> = (props) => {
  const stringValue = () => toDisplayString(props.value);

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
