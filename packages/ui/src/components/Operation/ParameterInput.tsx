import type { Parameter, Schema } from '@wti/core';
import { type Component, For, Show, createMemo } from 'solid-js';
import { useI18n } from '../../i18n';
import { Checkbox, Input, Markdown, Select } from '../shared';

/**
 * Validate a value against a schema and return error messages
 */
export function validateValue(value: string, schema: Schema, required: boolean): string[] {
  const errors: string[] = [];

  // Skip validation if empty and not required
  if (!value && !required) {
    return errors;
  }

  // Required validation
  if (required && !value) {
    errors.push('This field is required');
    return errors;
  }

  const type = schema.type || 'string';

  // String validations
  if (type === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`Minimum length is ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`Maximum length is ${schema.maxLength}`);
    }
    if (schema.pattern) {
      try {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          errors.push(`Must match pattern: ${schema.pattern}`);
        }
      } catch {
        // Invalid regex pattern in schema
      }
    }
  }

  // Number validations
  if (type === 'number' || type === 'integer') {
    const num = Number(value);
    if (value && Number.isNaN(num)) {
      errors.push('Must be a valid number');
      return errors;
    }

    if (type === 'integer' && !Number.isInteger(num)) {
      errors.push('Must be an integer');
    }

    if (schema.minimum !== undefined && num < schema.minimum) {
      errors.push(`Minimum value is ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && num > schema.maximum) {
      errors.push(`Maximum value is ${schema.maximum}`);
    }
    if (schema.exclusiveMinimum !== undefined && num <= schema.exclusiveMinimum) {
      errors.push(`Must be greater than ${schema.exclusiveMinimum}`);
    }
    if (schema.exclusiveMaximum !== undefined && num >= schema.exclusiveMaximum) {
      errors.push(`Must be less than ${schema.exclusiveMaximum}`);
    }
    if (schema.multipleOf !== undefined && num % schema.multipleOf !== 0) {
      errors.push(`Must be a multiple of ${schema.multipleOf}`);
    }
  }

  return errors;
}

interface ParameterInputProps {
  param: Parameter;
  value: string;
  onChange: (value: string) => void;
}

export const ParameterInput: Component<ParameterInputProps> = (props) => {
  const { t } = useI18n();

  const locationConfig: Record<string, { label: string; color: string }> = {
    path: { label: t('operations.path'), color: 'text-violet-600 dark:text-violet-400' },
    query: { label: t('operations.query'), color: 'text-blue-600 dark:text-blue-400' },
    header: { label: t('operations.headers'), color: 'text-amber-600 dark:text-amber-400' },
    cookie: { label: t('operations.cookie'), color: 'text-gray-500 dark:text-gray-400' },
  };

  const config = () => locationConfig[props.param.in] || locationConfig.cookie;
  const schemaType = () => props.param.schema.type || 'string';
  const hasEnum = () => props.param.schema.enum && props.param.schema.enum.length > 0;

  // Validation errors
  const validationErrors = createMemo(() =>
    validateValue(props.value, props.param.schema, props.param.required),
  );
  const hasErrors = () => validationErrors().length > 0;
  const errorClass = () => (hasErrors() ? 'border-rose-400 dark:border-rose-500' : '');

  const renderInput = () => {
    // Enum values - use Select dropdown
    if (hasEnum()) {
      return (
        <Select value={props.value} onChange={props.onChange} class={errorClass()}>
          <option value="">-- Select --</option>
          <For each={props.param.schema.enum as unknown[]}>
            {(enumValue) => <option value={String(enumValue)}>{String(enumValue)}</option>}
          </For>
        </Select>
      );
    }

    // Boolean - use Checkbox
    if (schemaType() === 'boolean') {
      return (
        <div class="flex items-center">
          <Checkbox
            checked={props.value === 'true'}
            onChange={(checked) => props.onChange(checked ? 'true' : 'false')}
            label={props.value === 'true' ? 'true' : 'false'}
          />
        </div>
      );
    }

    // Number/Integer - use number input
    if (schemaType() === 'number' || schemaType() === 'integer') {
      return (
        <Input
          type="number"
          value={props.value}
          onInput={props.onChange}
          placeholder={props.param.schema.default?.toString() || '0'}
          class={errorClass()}
        />
      );
    }

    // Default: string input
    return (
      <Input
        value={props.value}
        onInput={props.onChange}
        placeholder={props.param.schema.default?.toString() || props.param.name}
        class={errorClass()}
      />
    );
  };

  // Show constraints hint
  const constraintsHint = createMemo(() => {
    const hints: string[] = [];
    const s = props.param.schema;

    if (s.minLength !== undefined) {
      hints.push(`min: ${s.minLength}`);
    }
    if (s.maxLength !== undefined) {
      hints.push(`max: ${s.maxLength}`);
    }
    if (s.minimum !== undefined) {
      hints.push(`>= ${s.minimum}`);
    }
    if (s.maximum !== undefined) {
      hints.push(`<= ${s.maximum}`);
    }
    if (s.pattern) {
      hints.push('pattern');
    }

    return hints.length > 0 ? hints.join(', ') : null;
  });

  return (
    <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 p-3 sm:p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <div class="sm:w-2/5 md:w-1/3 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
            {props.param.name}
          </span>
          <Show when={props.param.required}>
            <span class="text-rose-500 text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-900/20">
              req
            </span>
          </Show>
        </div>
        <div class="flex items-center gap-2 text-xs mb-2">
          <span
            class={`font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 ${config().color}`}
          >
            {config().label}
          </span>
          <span class="text-gray-500 dark:text-gray-400 font-mono">{schemaType()}</span>
          <Show when={hasEnum()}>
            <span class="text-gray-400 dark:text-gray-500 italic">enum</span>
          </Show>
        </div>
        <Show when={props.param.description}>
          <Markdown
            content={props.param.description}
            class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
          />
        </Show>
        <Show when={constraintsHint()}>
          <div class="mt-2 text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded w-fit">
            {constraintsHint()}
          </div>
        </Show>
      </div>
      <div class="flex-1 w-full sm:w-auto">
        {renderInput()}
        <Show when={hasErrors()}>
          <div class="mt-2 flex items-start gap-1.5 text-rose-500 dark:text-rose-400">
            <svg
              class="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="text-xs space-y-0.5">
              <For each={validationErrors()}>{(error) => <p>{error}</p>}</For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
