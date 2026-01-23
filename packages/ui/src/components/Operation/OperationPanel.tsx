import type { Operation, Parameter, RequestConfig, RequestValues, Server } from '@wti/core';
import {
  type ResponseData,
  buildRequestConfig,
  decodeMessage,
  encodeMessage,
  executeGrpcRequest,
  executeRequest,
} from '@wti/core';
import { type Component, For, Show, createMemo, createSignal } from 'solid-js';
import { useOperationForm } from '../../hooks';
import { useI18n } from '../../i18n';
import type { AuthStore, GrpcMetadata, HistoryStore } from '../../stores';
import {
  Button,
  ErrorDisplay,
  JsonSchemaForm,
  Section,
  SegmentedControl,
  Textarea,
} from '../shared';
import { CodeSnippetsToggle } from './CodeSnippetsToggle';
import { OperationHeader } from './OperationHeader';
import { ParameterInput } from './ParameterInput';
import { ResponseSection } from './ResponseSection';

interface OperationPanelProps {
  operation: Operation;
  server: Server;
  serverVariables?: Record<string, string>;
  authStore?: AuthStore;
  historyStore?: HistoryStore;
  /** Initial values for replay */
  initialValues?: RequestValues;
  /** Callback when replay values have been consumed */
  onInitialValuesConsumed?: () => void;
  /** gRPC reflection metadata for encoding/decoding */
  grpcMetadata?: GrpcMetadata | null;
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
        serverVariables: props.serverVariables,
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
        serverVariables: props.serverVariables,
        auth,
      });

      let result: ResponseData;

      // Use gRPC client for gRPC operations
      if (props.operation.method === 'GRPC') {
        // Get input/output type names directly from operation
        const inputTypeName = props.operation.grpcInputType;
        const outputTypeName = props.operation.grpcOutputType;

        // Create encoder/decoder if we have gRPC metadata and type names
        let encode: ((body: unknown) => Uint8Array) | undefined;
        let decode: ((data: Uint8Array) => unknown) | undefined;

        if (props.grpcMetadata && inputTypeName && outputTypeName) {
          const { messageTypes, enumTypes } = props.grpcMetadata;
          const inputType = messageTypes.get(inputTypeName);
          const outputType = messageTypes.get(outputTypeName);

          if (inputType) {
            encode = (body) =>
              encodeMessage(body as Record<string, unknown>, inputType, messageTypes, enumTypes);
          }
          if (outputType) {
            decode = (data) => decodeMessage(data, outputType, messageTypes, enumTypes);
          }
        }

        const grpcResult = await executeGrpcRequest(
          props.server.url,
          props.operation.path,
          config.body,
          {
            timeout: config.timeout,
            metadata: config.headers,
            encode,
            decode,
          },
        );
        result = {
          status: grpcResult.status,
          statusText: grpcResult.statusText,
          headers: grpcResult.headers,
          body: grpcResult.body,
          bodyText: grpcResult.bodyText,
          timing: grpcResult.timing,
        };
      } else {
        result = await executeRequest(config);
      }

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
    <div class="p-3 sm:p-4 md:p-5 lg:p-6 w-full lg:max-w-5xl mx-auto">
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
            <div class="mb-4">
              <SegmentedControl
                value={form.bodyMode()}
                onChange={(val) =>
                  val === 'json' ? form.switchToJsonMode() : form.switchToFormMode()
                }
                options={[
                  { value: 'json', label: t('operations.jsonMode') },
                  { value: 'form', label: t('operations.formMode') },
                ]}
              />
            </div>
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
                <span class="text-[0.625rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
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
      <div class="mt-4 md:mt-6 lg:mt-8">
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
