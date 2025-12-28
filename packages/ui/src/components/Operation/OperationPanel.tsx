import type { Operation, Parameter, Server } from '@wti/core';
import {
  type RequestValues,
  type ResponseData,
  buildRequestConfig,
  executeRequest,
  getDefaultValues,
  getPreferredContentType,
} from '@wti/core';
import { type Component, For, type JSX, Show, createMemo, createSignal } from 'solid-js';
import { useI18n } from '../../i18n';
import { OperationHeader } from './OperationHeader';

interface OperationPanelProps {
  operation: Operation;
  server: Server;
}

export const OperationPanel: Component<OperationPanelProps> = (props) => {
  const { t } = useI18n();

  // Form state
  const [pathParams, setPathParams] = createSignal<Record<string, string>>({});
  const [queryParams, setQueryParams] = createSignal<Record<string, string>>({});
  const [headerParams, setHeaderParams] = createSignal<Record<string, string>>({});
  const [body, setBody] = createSignal<string>('');

  // Response state
  const [loading, setLoading] = createSignal(false);
  const [response, setResponse] = createSignal<ResponseData | null>(null);
  const [error, setError] = createSignal<string | null>(null);

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

  // Initialize default values
  const initDefaults = () => {
    const defaults = getDefaultValues(props.operation);
    if (defaults.path) setPathParams(defaults.path);
    if (defaults.query) setQueryParams(defaults.query);
    if (defaults.headers) setHeaderParams(defaults.headers);

    const ct = contentType();
    if (hasRequestBody() && ct) {
      const mediaType = props.operation.requestBody?.content[ct];
      if (mediaType?.example) {
        setBody(JSON.stringify(mediaType.example, null, 2));
      } else if (mediaType?.schema) {
        const example = generateSchemaExample(mediaType.schema);
        if (example) {
          setBody(JSON.stringify(example, null, 2));
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
      const values: RequestValues = {
        path: pathParams(),
        query: queryParams(),
        headers: headerParams(),
        body: body() ? JSON.parse(body()) : undefined,
        contentType: contentType(),
      };

      const config = buildRequestConfig(props.operation, values, {
        server: props.server,
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
    <div class="p-8 max-w-4xl">
      <OperationHeader operation={props.operation} />

      {/* Parameters Section */}
      <Show when={props.operation.parameters.length > 0}>
        <Section title={t('operations.parameters')}>
          <div class="space-y-3">
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
          <div class="relative">
            <textarea
              class="w-full h-56 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-800 dark:text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              value={body()}
              onInput={(e) => setBody(e.currentTarget.value)}
              placeholder="{}"
            />
            <div class="absolute top-3 right-3">
              <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                JSON
              </span>
            </div>
          </div>
        </Section>
      </Show>

      {/* Send Button */}
      <div class="mt-8">
        <button
          type="button"
          class="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={handleSend}
          disabled={loading()}
        >
          {loading() ? (
            <>
              <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('common.loading')}
            </>
          ) : (
            <>
              <svg
                class="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              {t('common.send')}
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      <Show when={error()}>
        <div class="mt-8 p-5 glass border border-red-200/50 dark:border-red-800/50 rounded-xl">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                class="w-4 h-4 text-red-600 dark:text-red-400"
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
              <h4 class="font-medium text-red-800 dark:text-red-200">Request Failed</h4>
              <p class="text-sm text-red-600 dark:text-red-400 mt-1">{error()}</p>
            </div>
          </div>
        </div>
      </Show>

      {/* Response Display */}
      <Show when={response()} keyed>
        {(res) => {
          const statusConfig = getStatusConfig(res.status);
          return (
            <div class="mt-8 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
              {/* Response header */}
              <div class="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div class="flex items-center gap-3">
                  <span
                    class={`px-3 py-1.5 rounded-lg text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    {res.status} {res.statusText}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {res.headers['content-type']}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
              {/* Response body */}
              <pre class="p-5 text-sm font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 overflow-x-auto max-h-[500px] scrollbar-thin">
                {typeof res.body === 'object' ? JSON.stringify(res.body, null, 2) : res.bodyText}
              </pre>
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
    <div class="mt-8">
      <h3 class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
        {props.title}
      </h3>
      {props.children}
    </div>
  );
};

interface ParameterInputProps {
  param: Parameter;
  value: string;
  onChange: (value: string) => void;
}

const ParameterInput: Component<ParameterInputProps> = (props) => {
  const { t } = useI18n();

  const locationConfig: Record<string, { label: string; color: string }> = {
    path: {
      label: t('operations.path'),
      color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    },
    query: {
      label: t('operations.query'),
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
    header: {
      label: t('operations.headers'),
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    },
    cookie: {
      label: t('operations.cookie'),
      color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    },
  };

  const config = () => locationConfig[props.param.in] || locationConfig.cookie;

  return (
    <div class="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/50">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {props.param.name}
          </span>
          <Show when={props.param.required}>
            <span class="text-rose-500 text-sm">*</span>
          </Show>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class={`px-2 py-0.5 rounded-md font-medium ${config().color}`}>
            {config().label}
          </span>
          <span class="text-gray-400 dark:text-gray-500">
            {props.param.schema.type || 'string'}
          </span>
        </div>
        <Show when={props.param.description}>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            {props.param.description}
          </p>
        </Show>
      </div>
      <input
        type="text"
        class="w-full sm:w-72 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
        value={props.value}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        placeholder={props.param.schema.default?.toString() || `Enter ${props.param.name}`}
      />
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
