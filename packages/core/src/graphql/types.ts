/**
 * GraphQL introspection types
 */

export interface GraphqlSchema {
  queryType: GraphqlTypeRef | null;
  mutationType: GraphqlTypeRef | null;
  subscriptionType: GraphqlTypeRef | null;
  types: GraphqlType[];
  directives: GraphqlDirective[];
}

export interface GraphqlType {
  kind: GraphqlTypeKind;
  name: string | null;
  description?: string;
  fields?: GraphqlField[];
  inputFields?: GraphqlInputValue[];
  interfaces?: GraphqlTypeRef[];
  enumValues?: GraphqlEnumValue[];
  possibleTypes?: GraphqlTypeRef[];
  ofType?: GraphqlTypeRef;
}

export type GraphqlTypeKind =
  | 'SCALAR'
  | 'OBJECT'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL';

export interface GraphqlField {
  name: string;
  description?: string;
  args: GraphqlInputValue[];
  type: GraphqlTypeRef;
  isDeprecated: boolean;
  deprecationReason?: string;
}

export interface GraphqlInputValue {
  name: string;
  description?: string;
  type: GraphqlTypeRef;
  defaultValue?: string;
}

export interface GraphqlTypeRef {
  kind: GraphqlTypeKind;
  name: string | null;
  ofType?: GraphqlTypeRef;
}

export interface GraphqlEnumValue {
  name: string;
  description?: string;
  isDeprecated: boolean;
  deprecationReason?: string;
}

export interface GraphqlDirective {
  name: string;
  description?: string;
  locations: string[];
  args: GraphqlInputValue[];
}

export interface IntrospectionResult {
  schema: GraphqlSchema;
  types: Map<string, GraphqlType>;
}
