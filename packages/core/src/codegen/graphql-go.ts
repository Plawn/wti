/**
 * Go code generator for GraphQL requests
 */

import type { CodeGenOptions, Generator, GraphqlRequestConfig } from './types';

/**
 * Format a Go string literal
 */
function goString(s: string): string {
  // Use backticks for multiline strings, escape them otherwise
  if (s.includes('\n') && !s.includes('`')) {
    return `\`${s}\``;
  }
  return JSON.stringify(s);
}

/**
 * Generate Go code for GraphQL request
 */
function generate(request: GraphqlRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];

  // Build the request body
  const body: Record<string, unknown> = {
    query: request.query,
  };
  if (request.variables && Object.keys(request.variables).length > 0) {
    body.variables = request.variables;
  }
  if (request.operationName) {
    body.operationName = request.operationName;
  }

  lines.push('package main');
  lines.push('');
  lines.push('import (');
  lines.push('\t"bytes"');
  lines.push('\t"encoding/json"');
  lines.push('\t"fmt"');
  lines.push('\t"io"');
  lines.push('\t"net/http"');
  lines.push(')');
  lines.push('');
  lines.push('func main() {');
  lines.push(`\turl := ${goString(request.endpoint)}`);
  lines.push('');

  // Define request body struct
  lines.push('\tpayload := map[string]interface{}{');
  lines.push(`\t\t"query": ${goString(request.query)},`);
  if (request.variables && Object.keys(request.variables).length > 0) {
    lines.push(`\t\t"variables": ${formatGoValue(request.variables, 2, prettyPrint)},`);
  }
  if (request.operationName) {
    lines.push(`\t\t"operationName": ${goString(request.operationName)},`);
  }
  lines.push('\t}');
  lines.push('');

  lines.push('\tjsonPayload, err := json.Marshal(payload)');
  lines.push('\tif err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('');

  lines.push('\treq, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))');
  lines.push('\tif err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('');

  lines.push('\treq.Header.Set("Content-Type", "application/json")');
  if (request.headers) {
    for (const [key, value] of Object.entries(request.headers)) {
      lines.push(`\treq.Header.Set(${goString(key)}, ${goString(value)})`);
    }
  }
  lines.push('');

  lines.push('\tclient := &http.Client{}');
  lines.push('\tresp, err := client.Do(req)');
  lines.push('\tif err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('\tdefer resp.Body.Close()');
  lines.push('');

  lines.push('\tbody, err := io.ReadAll(resp.Body)');
  lines.push('\tif err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('');

  lines.push('\tvar result map[string]interface{}');
  lines.push('\tif err := json.Unmarshal(body, &result); err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('');

  lines.push('\tif errors, ok := result["errors"]; ok {');
  lines.push('\t\tfmt.Println("GraphQL errors:", errors)');
  lines.push('\t}');
  lines.push('');

  lines.push('\tfmt.Println(result["data"])');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Format a value as a Go literal
 */
function formatGoValue(value: unknown, indent: number, prettyPrint: boolean): string {
  const tabs = '\t'.repeat(indent);
  const nextTabs = '\t'.repeat(indent + 1);

  if (value === null || value === undefined) {
    return 'nil';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return String(value);
    }
    return `float64(${value})`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]interface{}{}';
    }
    const items = value.map((v) => formatGoValue(v, indent + 1, prettyPrint));
    if (prettyPrint) {
      return `[]interface{}{\n${nextTabs}${items.join(`,\n${nextTabs}`)},\n${tabs}}`;
    }
    return `[]interface{}{${items.join(', ')}}`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return 'map[string]interface{}{}';
    }
    const items = entries.map(
      ([k, v]) => `${JSON.stringify(k)}: ${formatGoValue(v, indent + 1, prettyPrint)}`,
    );
    if (prettyPrint) {
      return `map[string]interface{}{\n${nextTabs}${items.join(`,\n${nextTabs}`)},\n${tabs}}`;
    }
    return `map[string]interface{}{${items.join(', ')}}`;
  }
  return String(value);
}

export const graphqlGoGenerator: Generator<GraphqlRequestConfig> = {
  language: 'go',
  displayName: 'Go',
  extension: 'go',
  generate,
};
