import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Input, Textarea } from '../../Input';
import type { BaseFieldProps } from '../types';
import { toDisplayString } from '../utils';

/**
 * String field renderer
 * Renders either a text input or textarea based on format/maxLength
 */
export const StringField: Component<BaseFieldProps> = (props) => {
  const stringValue = () => toDisplayString(props.value);

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
