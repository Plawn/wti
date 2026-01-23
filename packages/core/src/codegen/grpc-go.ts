/**
 * Go gRPC code generator
 */

import type { CodeGenOptions, Generator, GrpcRequestConfig } from './types';

/**
 * Generate Go grpc code from gRPC request config
 */
function generate(request: GrpcRequestConfig, options: CodeGenOptions = {}): string {
  const { prettyPrint = true } = options;
  const lines: string[] = [];

  // Extract package and service names
  const pathParts = request.methodPath.split('/').filter(Boolean);
  const fullServiceMethod = pathParts.length >= 2 ? pathParts[0] : request.serviceName;
  const packageParts = fullServiceMethod.split('.');
  const serviceName = packageParts.pop() || request.serviceName;
  const packageName = packageParts.join('.') || 'yourpackage';

  const methodName = request.methodName;

  lines.push('package main');
  lines.push('');
  lines.push('import (');
  lines.push('\t"context"');
  lines.push('\t"fmt"');
  lines.push('\t"log"');
  lines.push('\t"time"');
  lines.push('');
  lines.push('\t"google.golang.org/grpc"');
  if (request.useTls) {
    lines.push('\t"google.golang.org/grpc/credentials"');
  } else {
    lines.push('\t"google.golang.org/grpc/credentials/insecure"');
  }
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push('\t"google.golang.org/grpc/metadata"');
  }
  lines.push('');
  lines.push(
    `\tpb "${packageName.replace(/\./g, '/')}"  // Import your generated protobuf package`,
  );
  lines.push(')');
  lines.push('');

  lines.push('func main() {');

  // Create connection options
  if (request.useTls) {
    lines.push('\t// Create TLS credentials');
    lines.push('\tcreds, err := credentials.NewClientTLSFromFile("ca.pem", "")');
    lines.push('\tif err != nil {');
    lines.push('\t\tlog.Fatalf("Failed to create TLS credentials: %v", err)');
    lines.push('\t}');
    lines.push('');
  }

  // Create connection
  lines.push('\t// Create gRPC connection');
  if (request.useTls) {
    lines.push(
      `\tconn, err := grpc.Dial("${request.endpoint}", grpc.WithTransportCredentials(creds))`,
    );
  } else {
    lines.push(
      `\tconn, err := grpc.Dial("${request.endpoint}", grpc.WithTransportCredentials(insecure.NewCredentials()))`,
    );
  }
  lines.push('\tif err != nil {');
  lines.push('\t\tlog.Fatalf("Failed to connect: %v", err)');
  lines.push('\t}');
  lines.push('\tdefer conn.Close()');
  lines.push('');

  // Create client
  lines.push('\t// Create client');
  lines.push(`\tclient := pb.New${serviceName}Client(conn)`);
  lines.push('');

  // Create context with timeout
  lines.push('\t// Create context with timeout');
  lines.push('\tctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)');
  lines.push('\tdefer cancel()');
  lines.push('');

  // Add metadata if present
  if (request.metadata && Object.keys(request.metadata).length > 0) {
    lines.push('\t// Add metadata');
    lines.push('\tmd := metadata.New(map[string]string{');
    for (const [key, value] of Object.entries(request.metadata)) {
      lines.push(`\t\t"${key}": "${value}",`);
    }
    lines.push('\t})');
    lines.push('\tctx = metadata.NewOutgoingContext(ctx, md)');
    lines.push('');
  }

  // Create request
  lines.push('\t// Create request');
  lines.push('\treq := &pb.YourRequestType{');
  if (request.message && typeof request.message === 'object') {
    const messageJson = JSON.stringify(request.message, null, prettyPrint ? '\t\t' : '');
    lines.push(`\t\t// TODO: Fill in fields from: ${messageJson}`);
  }
  lines.push('\t}');
  lines.push('');

  // Make call
  lines.push('\t// Make gRPC call');
  lines.push(`\tresp, err := client.${methodName}(ctx, req)`);
  lines.push('\tif err != nil {');
  lines.push('\t\tlog.Fatalf("gRPC error: %v", err)');
  lines.push('\t}');
  lines.push('');

  lines.push('\tfmt.Printf("Response: %+v\\n", resp)');
  lines.push('}');

  return lines.join('\n');
}

export const grpcGoGenerator: Generator<GrpcRequestConfig> = {
  language: 'go',
  displayName: 'Go',
  extension: 'go',
  generate,
};
