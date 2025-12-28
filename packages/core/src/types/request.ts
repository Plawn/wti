/**
 * HTTP request/response types
 */

import type { HttpMethod } from './api';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  bodyText: string;
  timing: ResponseTiming;
}

export interface ResponseTiming {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface RequestHistoryEntry {
  id: string;
  timestamp: number;
  operationId: string;
  request: RequestConfig;
  response?: ResponseData;
  error?: string;
}
