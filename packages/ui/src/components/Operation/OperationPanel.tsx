import type { Operation, Parameter, Schema, Server } from '@wti/core';
import {
  type RequestValues,
  type ResponseData,
  buildRequestConfig,
  executeRequest,
  generateCurlCommand,
  getDefaultValues,
  getPreferredContentType,
} from '@wti/core';
import { type Component, For, type JSX, Show, createMemo, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import type { AuthStore } from '../../stores';
import {
  Button,
  Checkbox,
  CodeBlock,
  Input,
  JsonSchemaForm,
  JsonViewer,
  Markdown,
  Select,
  Tabs,
  Textarea,
} from '../shared';
import { OperationHeader } from './OperationHeader';
import { ResponseHeaders } from './ResponseHeaders';

interface OperationPanelProps {
  operation: Operation;
  server: Server;
  authStore?: AuthStore;
}

export const OperationPanel: Component<OperationPanelProps> = (props) => {
  const { t } = useI18n();

  // Form state
  const [pathParams, setPathParams] = createSignal<Record<string, string>>({});
  const [queryParams, setQueryParams] = createSignal<Record<string, string>>({});
  const [headerParams, setHeaderParams] = createSignal<Record<string, string>>({});
  const [body, setBody] = createSignal<string>('');
  const [bodyMode, setBodyMode] = createSignal<'json' | 'form'>('form');
  const [bodyFormData, setBodyFormData] = createSignal<Record<string, unknown>>({});

  // Response state
  const [loading, setLoading] = createSignal(false);
  const [response, setResponse] = createSignal<ResponseData | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [showCurlPreview, setShowCurlPreview] = createSignal(true);

  // Helper to get body data based on current mode
  const getBodyData = (): unknown => {
    if (bodyMode() === 'form') {
      return bodyFormData();
    }
    return body() ? JSON.parse(body()) : undefined;
  };

  // Helper to build request values from current form state
  const getRequestValues = (): RequestValues => ({
    path: pathParams(),
    query: queryParams(),
    headers: headerParams(),
    body: getBodyData(),
    contentType: contentType(),
  });

  const copyResponse = async (res: ResponseData) => {
    const text = typeof res.body === 'object' ? JSON.stringify(res.body, null, 2) : res.bodyText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group parameters by location
  const paramsByLocation = createMemo(() => {
    const groups: Record<string, Parameter[]> = {
      path: [],
      query: [],
      header: [],
      cookie: [],
    };
    for (const param of props.operation.parameters) {
      groups[param.in].push(param);
    }
    return groups;
  });

  const hasRequestBody = () =>
    props.operation.requestBody && Object.keys(props.operation.requestBody.content).length > 0;

  const contentType = createMemo(() => getPreferredContentType(props.operation));

  // Generate curl command preview reactively
  const curlCommand = createMemo(() => {
    try {
      const config = buildRequestConfig(props.operation, getRequestValues(), {
        server: props.server,
      });
      return generateCurlCommand(config);
    } catch {
      return '# Invalid request configuration';
    }
  });

  // Get request body schema
  const bodySchema = createMemo(() => {
    const ct = contentType();
    if (!ct || !props.operation.requestBody?.content[ct]?.schema) {
      return null;
    }
    return props.operation.requestBody.content[ct].schema;
  });

  // Check if schema is suitable for form mode (has a schema with properties or is an array)
  const canUseFormMode = createMemo(() => {
    const schema = bodySchema();
    if (!schema) {
      return false;
    }
    // Show form mode if schema has properties (even without explicit type: object)
    if (schema.properties && Object.keys(schema.properties).length > 0) return true;
    // Also show for explicit object type
    if (schema.type === 'object') {
      return true;
    }
    // Support array type with items schema
    if (schema.type === 'array' && schema.items) {
      return true;
    }
    return false;
  });

  // Switch to JSON mode and sync from form data
  const switchToJsonMode = () => {
    if (bodyMode() === 'form') {
      setBody(JSON.stringify(bodyFormData(), null, 2));
    }
    setBodyMode('json');
  };

  // Switch to form mode and sync from JSON
  const switchToFormMode = () => {
    if (bodyMode() === 'json') {
      try {
        const parsed = body() ? JSON.parse(body()) : {};
        setBodyFormData(parsed);
      } catch {
        // If JSON is invalid, start with empty form
        setBodyFormData({});
      }
    }
    setBodyMode('form');
  };

  // Initialize default values
  const initDefaults = () => {
    const defaults = getDefaultValues(props.operation);
    if (defaults.path) setPathParams(defaults.path);
    if (defaults.query) setQueryParams(defaults.query);
    if (defaults.headers) setHeaderParams(defaults.headers);

    const ct = contentType();
    if (hasRequestBody() && ct) {
      const mediaType = props.operation.requestBody?.content[ct];
      let exampleData: unknown = null;

      if (mediaType?.example) {
        exampleData = mediaType.example;
      } else if (mediaType?.schema) {
        exampleData = generateSchemaExample(mediaType.schema);
      }

      if (exampleData) {
        setBody(JSON.stringify(exampleData, null, 2));
        if (typeof exampleData === 'object' && exampleData !== null) {
          setBodyFormData(exampleData as Record<string, unknown>);
        }
      }
    }
  };

  initDefaults();

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const auth = await props.authStore?.actions.getActiveAuthWithAutoRefresh();
      const config = buildRequestConfig(props.operation, getRequestValues(), {
        server: props.server,
        auth,
      });

      const result = await executeRequest(config);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: number) => {
    if (status >= 200 && status < 300)
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-300',
      };
    if (status >= 400 && status < 500)
      return {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
      };
    return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' };
  };

  return (
    <div class="p-12 max-w-5xl mx-auto">
      <OperationHeader operation={props.operation} />

      {/* Parameters Section */}
      <Show when={props.operation.parameters.length > 0}>
        <Section title={t('operations.parameters')}>
          <div class="space-y-4">
            <For each={paramsByLocation().path}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={pathParams()[param.name] || ''}
                  onChange={(v) => setPathParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
            <For each={paramsByLocation().query}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={queryParams()[param.name] || ''}
                  onChange={(v) => setQueryParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
            <For each={paramsByLocation().header}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={headerParams()[param.name] || ''}
                  onChange={(v) => setHeaderParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
          </div>
        </Section>
      </Show>

      {/* Request Body Section */}
      <Show when={hasRequestBody()}>
        <Section title={t('operations.requestBody')}>
          {/* Mode Toggle */}
          <Show when={canUseFormMode()}>
            <div class="flex gap-1 mb-6 p-1 glass-input rounded-xl w-fit">
              <button
                type="button"
                onClick={switchToJsonMode}
                class={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  bodyMode() === 'json'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t('operations.jsonMode')}
              </button>
              <button
                type="button"
                onClick={switchToFormMode}
                class={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  bodyMode() === 'form'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t('operations.formMode')}
              </button>
            </div>
          </Show>

          {/* JSON Editor */}
          <Show when={bodyMode() === 'json'}>
            <div class="relative">
              <Textarea value={body()} onInput={setBody} placeholder="{}" class="h-64 font-mono" />
              <div class="absolute top-3 right-3">
                <span class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  JSON
                </span>
              </div>
            </div>
          </Show>

          {/* Form Editor */}
          <Show when={bodyMode() === 'form' && bodySchema()} keyed>
            {(schema) => (
              <JsonSchemaForm
                schema={schema}
                value={bodyFormData()}
                onChange={(value) => {
                  // Handle both object and array body types
                  if (Array.isArray(value)) {
                    setBodyFormData(value as unknown as Record<string, unknown>);
                  } else {
                    setBodyFormData((value as Record<string, unknown>) || {});
                  }
                }}
              />
            )}
          </Show>
        </Section>
      </Show>

      {/* cURL Preview Section */}
      <div class="mt-12">
        <button
          type="button"
          onClick={() => setShowCurlPreview(!showCurlPreview())}
          class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg
            class={`w-4 h-4 transition-transform ${showCurlPreview() ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {t('codegen.curlPreview')}
        </button>
        <Show when={showCurlPreview()}>
          <div class="mt-4">
            <CodeBlock code={curlCommand()} language="bash" wrap />
          </div>
        </Show>
      </div>

      {/* Actions */}
      <div class="mt-24">
        <Button onClick={handleSend} loading={loading()} class="px-8 py-3.5 text-base">
          {t('common.send')}
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Button>
      </div>

      {/* Error Display */}
      <Show when={error()}>
        <div class="mt-24 p-8 glass-card rounded-2xl border-red-200/30 dark:border-red-800/20 shadow-xl shadow-red-500/5">
          <div class="flex items-start gap-5">
            <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-bold text-red-800 dark:text-red-200">Request Failed</h4>
              <p class="text-base text-red-600 dark:text-red-400 mt-2 leading-relaxed">{error()}</p>
            </div>
          </div>
        </div>
      </Show>

      {/* Response Display */}
      <Show when={response()} keyed>
        {(res) => {
          const statusConfig = getStatusConfig(res.status);
          const isJsonResponse = typeof res.body === 'object' && res.body !== null;
          const tabItems = [
            {
              id: 'body',
              label: 'Response Body',
              content: (
                <div class="glass-card rounded-2xl overflow-hidden mt-2">
                  {isJsonResponse ? (
                    <JsonViewer data={res.body} initialExpandDepth={3} />
                  ) : (
                    <CodeBlock code={res.bodyText} language="json" />
                  )}
                </div>
              ),
            },
            {
              id: 'headers',
              label: 'Headers',
              badge: Object.keys(res.headers).length,
              content: (
                <div class="mt-2">
                  <ResponseHeaders headers={res.headers} />
                </div>
              ),
            },
          ];

          return (
            <div class="mt-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                  <span
                    class={`px-4 py-2 rounded-2xl text-base font-bold shadow-sm ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {res.status} {res.statusText}
                  </span>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100/50 dark:bg-white/5 px-3 py-1.5 rounded-xl">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {Math.round(res.timing.duration)}ms
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyResponse(res)}
                  class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100/80 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                >
                  <Show
                    when={copied()}
                    fallback={
                      <>
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        {t('common.copy')}
                      </>
                    }
                  >
                    <svg
                      class="w-4 h-4 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-emerald-600 dark:text-emerald-400">{t('common.copied')}</span>
                  </Show>
                </button>
              </div>

              <Tabs items={tabItems} />
            </div>
          );
        }}
      </Show>
    </div>
  );
};

// Section component for consistent styling
const Section: Component<{ title: string; children: JSX.Element }> = (props) => {
  return (
    <div class="mt-24 first:mt-12">
      <h3 class="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-10 px-4">
        {props.title}
      </h3>
      <div class="space-y-6">{props.children}</div>
    </div>
  );
};

/**
 * Validate a value against a schema and return error messages
 */
function validateValue(value: string, schema: Schema, required: boolean): string[] {
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

const ParameterInput: Component<ParameterInputProps> = (props) => {
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

    if (s.minLength !== undefined) hints.push(`min: ${s.minLength}`);
    if (s.maxLength !== undefined) hints.push(`max: ${s.maxLength}`);
    if (s.minimum !== undefined) hints.push(`>= ${s.minimum}`);
    if (s.maximum !== undefined) hints.push(`<= ${s.maximum}`);
    if (s.pattern) hints.push('pattern');

    return hints.length > 0 ? hints.join(', ') : null;
  });

  return (
    <div class="flex flex-col sm:flex-row sm:items-start gap-8 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <div class="sm:w-1/3 min-w-0">
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

function generateSchemaExample(schema: {
  type?: string;
  properties?: Record<string, unknown>;
  items?: unknown;
}): unknown {
  if (!schema.type) return {};

  switch (schema.type) {
    case 'object':
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = generateSchemaExample(
            prop as { type?: string; properties?: Record<string, unknown> },
          );
        }
        return obj;
      }
      return {};
    case 'array':
      if (schema.items) {
        return [generateSchemaExample(schema.items as { type?: string })];
      }
      return [];
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return true;
    default:
      return null;
  }
}
