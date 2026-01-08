import type { Component } from 'solid-js';
import { Checkbox } from '../../Input';
import type { BaseFieldProps } from '../types';

/**
 * Boolean field renderer
 * Renders a checkbox with true/false label
 */
export const BooleanField: Component<BaseFieldProps> = (props) => {
  return (
    <Checkbox
      checked={props.value === true}
      onChange={(checked) => props.onChange(checked)}
      label={props.value === true ? 'true' : 'false'}
    />
  );
};
