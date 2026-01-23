/**
 * Protobuf wire types and field type constants
 * Centralized to avoid duplication across encoder, decoder, and reflection modules
 */

import type { GrpcFieldType } from './types';

// Wire types for protobuf encoding
export const WIRE_VARINT = 0;
export const WIRE_FIXED64 = 1;
export const WIRE_LENGTH_DELIMITED = 2;
export const WIRE_FIXED32 = 5;

// Proto field type constants (from google.protobuf.FieldDescriptorProto.Type)
export const PROTO_FIELD_TYPES: Record<number, GrpcFieldType> = {
  1: 'double',
  2: 'float',
  3: 'int64',
  4: 'uint64',
  5: 'int32',
  6: 'fixed64',
  7: 'fixed32',
  8: 'bool',
  9: 'string',
  10: 'message', // GROUP (deprecated, treat as message)
  11: 'message',
  12: 'bytes',
  13: 'uint32',
  14: 'enum',
  15: 'sfixed32',
  16: 'sfixed64',
  17: 'sint32',
  18: 'sint64',
};

// Proto field label constants
export const LABEL_OPTIONAL = 1;
export const LABEL_REPEATED = 3;
