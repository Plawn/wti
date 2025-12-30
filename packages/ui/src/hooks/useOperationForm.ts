import type { Operation, RequestValues, Schema } from '@wti/core';
import { getDefaultValues, getPreferredContentType } from '@wti/core';
import { type Accessor, createMemo, createSignal } from 'solid-js';
import { generateSchemaExample } from '../components/Operation/schemaUtils';
import { parseJson } from '../utils';

export interface UseOperationFormOptions {
  operation: Accessor<Operation>;
  initialValues?: RequestValues;
  onInitialValuesConsumed?: () => void;
}

export interface UseOperationFormReturn {
  // State accessors
  pathParams: Accessor<Record<string, string>>;
  queryParams: Accessor<Record<string, string>>;
  headerParams: Accessor<Record<string, string>>;
  body: Accessor<string>;
  bodyMode: Accessor<'json' | 'form'>;
  bodyFormData: Accessor<Record<string, unknown>>;

  // State setters
  setPathParams: (
    update: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setQueryParams: (
    update: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setHeaderParams: (
    update: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setBody: (value: string) => void;
  setBodyFormData: (
    update: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>),
  ) => void;

  // Computed values
  contentType: Accessor<string | undefined>;
  bodySchema: Accessor<Schema | null>;
  canUseFormMode: Accessor<boolean>;
  hasRequestBody: Accessor<boolean>;

  // Actions
  getRequestValues: () => RequestValues;
  switchToJsonMode: () => void;
  switchToFormMode: () => void;
}

export function useOperationForm(options: UseOperationFormOptions): UseOperationFormReturn {
  const { operation, initialValues, onInitialValuesConsumed } = options;

  // Form state signals
  const [pathParams, setPathParams] = createSignal<Record<string, string>>({});
  const [queryParams, setQueryParams] = createSignal<Record<string, string>>({});
  const [headerParams, setHeaderParams] = createSignal<Record<string, string>>({});
  const [body, setBody] = createSignal<string>('');
  const [bodyMode, setBodyMode] = createSignal<'json' | 'form'>('form');
  const [bodyFormData, setBodyFormData] = createSignal<Record<string, unknown>>({});

  // Computed values
  const contentType = createMemo(() => getPreferredContentType(operation()));

  const hasRequestBody = createMemo(() => {
    const requestBody = operation().requestBody;
    return !!requestBody && Object.keys(requestBody.content).length > 0;
  });

  const bodySchema = createMemo(() => {
    const ct = contentType();
    const op = operation();
    if (!ct || !op.requestBody?.content[ct]?.schema) {
      return null;
    }
    return op.requestBody.content[ct].schema;
  });

  const canUseFormMode = createMemo(() => {
    const schema = bodySchema();
    if (!schema) {
      return false;
    }
    if (schema.properties && Object.keys(schema.properties).length > 0) {
      return true;
    }
    if (schema.type === 'object') {
      return true;
    }
    if (schema.type === 'array' && schema.items) {
      return true;
    }
    return false;
  });

  // Helper to get body data based on current mode
  const getBodyData = (): unknown => {
    if (bodyMode() === 'form') {
      return bodyFormData();
    }
    return parseJson(body());
  };

  // Build request values from current form state
  const getRequestValues = (): RequestValues => ({
    path: pathParams(),
    query: queryParams(),
    headers: headerParams(),
    body: getBodyData(),
    contentType: contentType(),
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
      const parsed = parseJson<Record<string, unknown>>(body());
      setBodyFormData(parsed ?? {});
    }
    setBodyMode('form');
  };

  // Initialize with replay values or defaults
  const initDefaults = (replayValues?: RequestValues) => {
    const op = operation();

    if (replayValues) {
      if (replayValues.path) {
        setPathParams(replayValues.path);
      }
      if (replayValues.query) {
        setQueryParams(replayValues.query);
      }
      if (replayValues.headers) {
        setHeaderParams(replayValues.headers);
      }
      if (replayValues.body !== undefined) {
        const bodyData = replayValues.body;
        if (typeof bodyData === 'object' && bodyData !== null) {
          setBody(JSON.stringify(bodyData, null, 2));
          setBodyFormData(bodyData as Record<string, unknown>);
        } else if (typeof bodyData === 'string') {
          setBody(bodyData);
        }
      }
      return;
    }

    // Use schema defaults
    const defaults = getDefaultValues(op);
    if (defaults.path) {
      setPathParams(defaults.path);
    }
    if (defaults.query) {
      setQueryParams(defaults.query);
    }
    if (defaults.headers) {
      setHeaderParams(defaults.headers);
    }

    const ct = contentType();
    if (hasRequestBody() && ct) {
      const mediaType = op.requestBody?.content[ct];
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

  // Initialize on creation
  initDefaults(initialValues);
  if (initialValues) {
    onInitialValuesConsumed?.();
  }

  return {
    // State accessors
    pathParams,
    queryParams,
    headerParams,
    body,
    bodyMode,
    bodyFormData,

    // State setters
    setPathParams,
    setQueryParams,
    setHeaderParams,
    setBody,
    setBodyFormData,

    // Computed values
    contentType,
    bodySchema,
    canUseFormMode,
    hasRequestBody,

    // Actions
    getRequestValues,
    switchToJsonMode,
    switchToFormMode,
  };
}
