/**
 * Python gRPC (grpcio) code generator
 */

import { formatPythonValue } from './formatValue';
import type { CodeGenOptions, Generator, GrpcRequestConfig } from './types';

/**
 * Convert method name from camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Generate Python grpcio code from gRPC request config
 */
function generate(request: GrpcRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];

  // Extract package and service names
  const pathParts = request.methodPath.split('/').filter(Boolean);
  const fullServiceMethod = pathParts.length >= 2 ? pathParts[0] : request.serviceName;
  const packageParts = fullServiceMethod.split('.');
  const serviceName = packageParts.pop() || request.serviceName;
  const packageName = packageParts.join('.') || 'your_package';

  const methodName = toSnakeCase(request.methodName);

  lines.push('import grpc');
  lines.push('');
  lines.push('# Import generated protobuf modules');
  lines.push(`# from ${packageName.replace(/\./g, '_')}_pb2 import *`);
  lines.push(`# from ${packageName.replace(/\./g, '_')}_pb2_grpc import ${serviceName}Stub`);
  lines.push('');

  // Request message
  lines.push('# Request message');
  lines.push(`request_data = ${formatPythonValue(request.message, 0, prettyPrint)}`);
  lines.push('');

  // Create channel
  lines.push('# Create gRPC channel');
  if (request.useTls) {
    lines.push('credentials = grpc.ssl_channel_credentials()');
    lines.push(`channel = grpc.secure_channel('${request.endpoint}', credentials)`);
  } else {
    lines.push(`channel = grpc.insecure_channel('${request.endpoint}')`);
  }
  lines.push('');

  // Add metadata if present
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push('# Metadata');
    lines.push('metadata = [');
    for (const [key, value] of Object.entries(request.metadata)) {
      lines.push(`    ('${key}', '${value}'),`);
    }
    lines.push(']');
    lines.push('');
  }

  // Create stub and make call
  lines.push('# Create stub and make call');
  lines.push(`stub = ${serviceName}Stub(channel)`);
  lines.push('');
  lines.push('try:');
  lines.push('    # Create request message from dict');
  lines.push('    # request = YourRequestMessage(**request_data)');
  lines.push(
    `    # response = stub.${methodName}(request${request.metadata && Object.keys(request.metadata).length > 0 ? ', metadata=metadata' : ''})`,
  );
  lines.push('    ');
  lines.push('    # Or use generic invocation:');
  lines.push(`    response = stub.${request.methodName}(`);
  lines.push('        request_data,');
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push('        metadata=metadata,');
  }
  lines.push('    )');
  lines.push('    print("Response:", response)');
  lines.push('except grpc.RpcError as e:');
  lines.push('    print(f"gRPC error: {e.code()}: {e.details()}")');
  lines.push('finally:');
  lines.push('    channel.close()');

  return lines.join('\n');
}

export const grpcPythonGenerator: Generator<GrpcRequestConfig> = {
  language: 'python',
  displayName: 'Python',
  extension: 'py',
  generate,
};
