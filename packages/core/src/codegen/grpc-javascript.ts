/**
 * JavaScript gRPC (grpc-web) code generator
 */

import { formatJsValue } from './formatValue';
import type { CodeGenOptions, Generator, GrpcRequestConfig } from './types';

/**
 * Generate JavaScript grpc-web code from gRPC request config
 */
function generate(request: GrpcRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const indent = prettyPrint ? '  ' : '';
  const lines: string[] = [];

  // Extract service and method names
  const serviceName = request.serviceName.split('.').pop() || request.serviceName;
  const methodName = request.methodName;

  // Protocol (http or https)
  const protocol = request.useTls ? 'https' : 'http';
  const serverUrl = `${protocol}://${request.endpoint}`;

  lines.push('// Using grpc-web');
  lines.push("import { grpc } from '@improbable-eng/grpc-web';");
  lines.push('');

  // Define request message
  lines.push(`const request = ${formatJsValue(request.message, 0, prettyPrint)};`);
  lines.push('');

  // Define metadata if present
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push('const metadata = new grpc.Metadata();');
    for (const [key, value] of Object.entries(request.metadata)) {
      lines.push(`metadata.set('${key}', '${value}');`);
    }
    lines.push('');
  }

  // Make the gRPC call
  lines.push('// Make unary gRPC call');
  lines.push('grpc.unary({');
  lines.push(`${indent}methodName: '${request.methodPath}',`);
  lines.push(`${indent}host: '${serverUrl}',`);
  lines.push(`${indent}request: request,`);
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push(`${indent}metadata: metadata,`);
  }
  lines.push(`${indent}onEnd: (response) => {`);
  lines.push(`${indent}${indent}if (response.status !== grpc.Code.OK) {`);
  lines.push(`${indent}${indent}${indent}console.error('gRPC error:', response.statusMessage);`);
  lines.push(`${indent}${indent}${indent}return;`);
  lines.push(`${indent}${indent}}`);
  lines.push(`${indent}${indent}console.log('Response:', response.message);`);
  lines.push(`${indent}},`);
  lines.push('});');

  lines.push('');
  lines.push('// Alternative: Using @grpc/grpc-js (Node.js)');
  lines.push('/*');
  lines.push("const grpc = require('@grpc/grpc-js');");
  lines.push("const protoLoader = require('@grpc/proto-loader');");
  lines.push('');
  lines.push("const packageDefinition = protoLoader.loadSync('your_service.proto');");
  lines.push('const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);');
  lines.push('');

  const credentials = request.useTls
    ? 'grpc.credentials.createSsl()'
    : 'grpc.credentials.createInsecure()';
  lines.push(
    `const client = new protoDescriptor.${serviceName}('${request.endpoint}', ${credentials});`,
  );
  lines.push('');
  lines.push(`client.${methodName}(request, (error, response) => {`);
  lines.push(`${indent}if (error) {`);
  lines.push(`${indent}${indent}console.error('Error:', error);`);
  lines.push(`${indent}${indent}return;`);
  lines.push(`${indent}}`);
  lines.push(`${indent}console.log('Response:', response);`);
  lines.push('});');
  lines.push('*/');

  return lines.join('\n');
}

export const grpcJavascriptGenerator: Generator<GrpcRequestConfig> = {
  language: 'javascript',
  displayName: 'JavaScript',
  extension: 'js',
  generate,
};
