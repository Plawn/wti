import type { Operation, Parameter, RequestConfig, RequestValues, Server } from '@wti/core';
import { type ResponseData, buildRequestConfig, executeRequest } from '@wti/core';
import { type Component, For, type JSX, Show, createMemo, createSignal } from 'solid-js';
import { useOperationForm } from '../../hooks';
import { useI18n } from '../../i18n';
import type { AuthStore, HistoryStore } from '../../stores';
import { Button, JsonSchemaForm, Textarea } from '../shared';
import { CodeSnippets } from './CodeSnippets';
import { OperationHeader } from './OperationHeader';
import { ParameterInput } from './ParameterInput';
import { ResponseSection } from './ResponseSection';

interface OperationPanelProps {
  operation: Operation;
  server: Server;
  authStore?: AuthStore;
  historyStore?: HistoryStore;
  /** Initial values for replay */
  initialValues?: RequestValues;
  /** Callback when replay values have been consumed */
  onInitialValuesConsumed?: () => void;
}

export const OperationPanel: Component<OperationPanelProps> = (props) => {
  const { t } = useI18n();

  // Use the form hook
  const form = useOperationForm({
    operation: () => props.operation,
    initialValues: props.initialValues,
    onInitialValuesConsumed: props.onInitialValuesConsumed,
  });

  // Response state
  const [loading, setLoading] = createSignal(false);
  const [response, setResponse] = createSignal<ResponseData | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [showCurlPreview, setShowCurlPreview] = createSignal(true);

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

  // Generate request config for code snippets
  const requestConfig = createMemo((): RequestConfig | null => {
    try {
      return buildRequestConfig(props.operation, form.getRequestValues(), {
        server: props.server,
      });
    } catch {
      return null;
    }
  });

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    let config: RequestConfig | null = null;

    try {
      const auth = await props.authStore?.actions.getActiveAuthWithAutoRefresh();
      config = buildRequestConfig(props.operation, form.getRequestValues(), {
        server: props.server,
        auth,
      });

      const result = await executeRequest(config);
      setResponse(result);

      props.historyStore?.actions.addEntry({
        operationId: props.operation.id,
        operationPath: props.operation.path,
        operationMethod: props.operation.method,
        request: config,
        requestValues: form.getRequestValues(),
        response: result,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);

      if (config) {
        props.historyStore?.actions.addEntry({
          operationId: props.operation.id,
          operationPath: props.operation.path,
          operationMethod: props.operation.method,
          request: config,
          requestValues: form.getRequestValues(),
          error: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="p-4 sm:p-5 md:p-6 lg:p-8 w-full lg:max-w-5xl mx-auto">
      <OperationHeader operation={props.operation} />

      {/* Parameters Section */}
      <Show when={props.operation.parameters.length > 0}>
        <Section title={t('operations.parameters')}>
          <div class="space-y-4">
            <For each={paramsByLocation().path}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={form.pathParams()[param.name] || ''}
                  onChange={(v) => form.setPathParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
            <For each={paramsByLocation().query}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={form.queryParams()[param.name] || ''}
                  onChange={(v) => form.setQueryParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
            <For each={paramsByLocation().header}>
              {(param) => (
                <ParameterInput
                  param={param}
                  value={form.headerParams()[param.name] || ''}
                  onChange={(v) => form.setHeaderParams((p) => ({ ...p, [param.name]: v }))}
                />
              )}
            </For>
          </div>
        </Section>
      </Show>

      {/* Request Body Section */}
      <Show when={form.hasRequestBody()}>
        <Section title={t('operations.requestBody')}>
          <Show when={form.canUseFormMode()}>
            <BodyModeToggle
              mode={form.bodyMode()}
              onJsonMode={form.switchToJsonMode}
              onFormMode={form.switchToFormMode}
            />
          </Show>

          <Show when={form.bodyMode() === 'json'}>
            <div class="relative">
              <Textarea
                value={form.body()}
                onInput={form.setBody}
                placeholder="{}"
                class="h-64 font-mono"
              />
              <div class="absolute top-3 right-3">
                <span class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  JSON
                </span>
              </div>
            </div>
          </Show>

          <Show when={form.bodyMode() === 'form' && form.bodySchema()} keyed>
            {(schema) => (
              <JsonSchemaForm
                schema={schema}
                value={form.bodyFormData()}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    form.setBodyFormData(value as unknown as Record<string, unknown>);
                  } else {
                    form.setBodyFormData((value as Record<string, unknown>) || {});
                  }
                }}
              />
            )}
          </Show>
        </Section>
      </Show>

      {/* Code Snippets Section */}
      <CodeSnippetsToggle
        show={showCurlPreview()}
        onToggle={() => setShowCurlPreview(!showCurlPreview())}
        config={requestConfig()}
      />

      {/* Actions */}
      <div class="mt-6 md:mt-10 lg:mt-12">
        <Button
          onClick={handleSend}
          loading={loading()}
          class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-base"
        >
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
      <Show when={error()} keyed>
        {(errMsg) => <ErrorDisplay message={errMsg} />}
      </Show>

      {/* Response Display */}
      <Show when={response()} keyed>
        {(res) => <ResponseSection response={res} />}
      </Show>
    </div>
  );
};

// Section component for consistent styling
const Section: Component<{ title: string; children: JSX.Element }> = (props) => (
  <div class="mt-6 md:mt-10 lg:mt-12 first:mt-2 first:md:mt-4 first:lg:mt-6">
    <h3 class="text-xs md:text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 md:mb-4 lg:mb-5 px-2 md:px-4">
      {props.title}
    </h3>
    <div class="space-y-3 md:space-y-4">{props.children}</div>
  </div>
);

// Body mode toggle component
const BodyModeToggle: Component<{
  mode: 'json' | 'form';
  onJsonMode: () => void;
  onFormMode: () => void;
}> = (props) => {
  const { t } = useI18n();
  const buttonClass = (active: boolean) =>
    `px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
      active
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`;

  return (
    <div class="flex gap-1 mb-4 p-1 glass-input rounded-xl w-fit">
      <button type="button" onClick={props.onJsonMode} class={buttonClass(props.mode === 'json')}>
        {t('operations.jsonMode')}
      </button>
      <button type="button" onClick={props.onFormMode} class={buttonClass(props.mode === 'form')}>
        {t('operations.formMode')}
      </button>
    </div>
  );
};

// Code snippets toggle section
const CodeSnippetsToggle: Component<{
  show: boolean;
  onToggle: () => void;
  config: RequestConfig | null;
}> = (props) => {
  const { t } = useI18n();

  return (
    <div class="mt-4 md:mt-6 lg:mt-8">
      <button
        type="button"
        onClick={props.onToggle}
        class="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <svg
          class={`w-4 h-4 transition-transform ${props.show ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {t('codegen.title')}
      </button>
      <Show when={props.show && props.config} keyed>
        {(config) => (
          <div class="mt-4">
            <CodeSnippets request={config} />
          </div>
        )}
      </Show>
    </div>
  );
};

// Error display component
const ErrorDisplay: Component<{ message: string }> = (props) => (
  <div class="mt-6 md:mt-10 lg:mt-12 p-4 md:p-5 lg:p-6 glass-card rounded-2xl border-red-200/30 dark:border-red-800/20 shadow-xl shadow-red-500/5">
    <div class="flex items-start gap-3 md:gap-5">
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
        <p class="text-base text-red-600 dark:text-red-400 mt-2 leading-relaxed">{props.message}</p>
      </div>
    </div>
  </div>
);
