/**
 * Go (net/http) code generator
 */

import type { RequestConfig } from '../types';
import type { CodeGenOptions, CodeGenerator } from './types';

/**
 * Generate Go net/http code from request config
 */
function generate(request: RequestConfig, options: CodeGenOptions = {}): string {
  const { includeComments = true } = options;
  const lines: string[] = [];

  lines.push('package main');
  lines.push('');
  lines.push('import (');
  lines.push('\t"encoding/json"');
  lines.push('\t"fmt"');
  lines.push('\t"io"');
  lines.push('\t"net/http"');

  // Add strings import if we have body
  if (request.body !== undefined && request.body !== null) {
    lines.push('\t"bytes"');
  }

  // Add net/url import if we have params
  if (request.params && Object.keys(request.params).length > 0) {
    lines.push('\t"net/url"');
  }

  lines.push(')');
  lines.push('');

  lines.push('func main() {');

  // Build URL with query params
  let urlVar = `"${request.url}"`;
  if (request.params && Object.keys(request.params).length > 0) {
    lines.push(`\t${includeComments ? '// Build URL with query parameters' : ''}`);
    lines.push(`\tbaseURL := "${request.url}"`);
    lines.push('\tparams := url.Values{}');
    for (const [key, value] of Object.entries(request.params)) {
      lines.push(`\tparams.Add("${key}", "${value}")`);
    }
    lines.push('\treqURL := baseURL + "?" + params.Encode()');
    lines.push('');
    urlVar = 'reqURL';
  }

  // Create request body
  if (request.body !== undefined && request.body !== null) {
    if (includeComments) {
      lines.push('\t// Prepare request body');
    }
    const bodyJson = JSON.stringify(request.body, null, '\t\t');
    lines.push(`\tbody := []byte(\`${bodyJson}\`)`);
    lines.push('');
  }

  // Create request
  if (includeComments) {
    lines.push('\t// Create request');
  }

  if (request.body !== undefined && request.body !== null) {
    lines.push(
      `\treq, err := http.NewRequest("${request.method}", ${urlVar}, bytes.NewBuffer(body))`,
    );
  } else {
    lines.push(`\treq, err := http.NewRequest("${request.method}", ${urlVar}, nil)`);
  }

  lines.push('\tif err != nil {');
  lines.push('\t\tfmt.Println("Error creating request:", err)');
  lines.push('\t\treturn');
  lines.push('\t}');
  lines.push('');

  // Set headers
  if (request.headers && Object.keys(request.headers).length > 0) {
    if (includeComments) {
      lines.push('\t// Set headers');
    }
    for (const [key, value] of Object.entries(request.headers)) {
      lines.push(`\treq.Header.Set("${key}", "${value}")`);
    }
    lines.push('');
  }

  // Send request
  if (includeComments) {
    lines.push('\t// Send request');
  }
  lines.push('\tclient := &http.Client{}');
  lines.push('\tresp, err := client.Do(req)');
  lines.push('\tif err != nil {');
  lines.push('\t\tfmt.Println("Error sending request:", err)');
  lines.push('\t\treturn');
  lines.push('\t}');
  lines.push('\tdefer resp.Body.Close()');
  lines.push('');

  // Read response
  if (includeComments) {
    lines.push('\t// Read response');
  }
  lines.push('\trespBody, err := io.ReadAll(resp.Body)');
  lines.push('\tif err != nil {');
  lines.push('\t\tfmt.Println("Error reading response:", err)');
  lines.push('\t\treturn');
  lines.push('\t}');
  lines.push('');

  // Parse JSON
  if (includeComments) {
    lines.push('\t// Parse JSON response');
  }
  lines.push('\tvar result map[string]interface{}');
  lines.push('\tif err := json.Unmarshal(respBody, &result); err != nil {');
  lines.push('\t\tfmt.Println("Error parsing JSON:", err)');
  lines.push('\t\treturn');
  lines.push('\t}');
  lines.push('');

  lines.push('\tfmt.Printf("Status: %s\\n", resp.Status)');
  lines.push('\tfmt.Printf("Response: %+v\\n", result)');
  lines.push('}');

  return lines.join('\n');
}

export const goGenerator: CodeGenerator = {
  language: 'go',
  displayName: 'Go',
  extension: 'go',
  generate,
};
