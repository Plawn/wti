import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
/**
 * Converts OpenAPI specification to unified ApiSpec type
 */
import type {
  ApiInfo,
  ApiSpec,
  AuthType,
  Example,
  HttpMethod,
  MediaType,
  OAuth2Flow,
  OAuth2Flows,
  Operation,
  Parameter,
  ParameterLocation,
  RequestBody,
  Response,
  Schema,
  SecurityRequirement,
  Server,
  ServerVariable,
  Tag,
} from '../types';

type OpenAPIDocument = OpenAPIV3.Document | OpenAPIV3_1.Document;
type OpenAPIOperation = OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject;
type OpenAPIParameter = OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;
type OpenAPISchema = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;
type OpenAPIRequestBody = OpenAPIV3.RequestBodyObject | OpenAPIV3_1.RequestBodyObject;
type OpenAPIResponse = OpenAPIV3.ResponseObject | OpenAPIV3_1.ResponseObject;
type OpenAPIMediaType = OpenAPIV3.MediaTypeObject | OpenAPIV3_1.MediaTypeObject;
type OpenAPISecurityScheme = OpenAPIV3.SecuritySchemeObject | OpenAPIV3_1.SecuritySchemeObject;
type OpenAPIPathItem = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

/**
 * Convert OpenAPI document to unified ApiSpec
 */
export function convertOpenApiToSpec(doc: OpenAPIDocument): ApiSpec {
  return {
    type: 'openapi',
    info: convertInfo(doc.info),
    servers: convertServers(doc.servers),
    tags: convertTags(doc.tags),
    operations: extractOperations(doc),
    schemas: convertSchemas(doc.components?.schemas),
    securitySchemes: convertSecuritySchemes(doc.components?.securitySchemes),
  };
}

function convertInfo(info: OpenAPIV3.InfoObject | OpenAPIV3_1.InfoObject): ApiInfo {
  return {
    title: info.title,
    version: info.version,
    description: info.description,
    termsOfService: info.termsOfService,
    contact: info.contact
      ? {
          name: info.contact.name,
          url: info.contact.url,
          email: info.contact.email,
        }
      : undefined,
    license: info.license
      ? {
          name: info.license.name,
          url: info.license.url,
        }
      : undefined,
  };
}

function convertServers(servers?: (OpenAPIV3.ServerObject | OpenAPIV3_1.ServerObject)[]): Server[] {
  if (!servers || servers.length === 0) {
    return [{ url: '/' }];
  }

  return servers.map((server) => ({
    url: server.url,
    description: server.description,
    variables: server.variables
      ? Object.fromEntries(
          Object.entries(server.variables).map(([key, variable]) => [
            key,
            convertServerVariable(variable),
          ]),
        )
      : undefined,
  }));
}

function convertServerVariable(
  variable: OpenAPIV3.ServerVariableObject | OpenAPIV3_1.ServerVariableObject,
): ServerVariable {
  return {
    default: variable.default,
    description: variable.description,
    enum: variable.enum,
  };
}

function convertTags(tags?: (OpenAPIV3.TagObject | OpenAPIV3_1.TagObject)[]): Tag[] {
  if (!tags) return [];

  return tags.map((tag) => ({
    name: tag.name,
    description: tag.description,
    externalDocs: tag.externalDocs
      ? {
          url: tag.externalDocs.url,
          description: tag.externalDocs.description,
        }
      : undefined,
  }));
}

function extractOperations(doc: OpenAPIDocument): Operation[] {
  const operations: Operation[] = [];
  const paths = doc.paths || {};

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue;

    const item = pathItem as OpenAPIPathItem;

    for (const method of HTTP_METHODS) {
      const methodLower = method.toLowerCase() as
        | 'get'
        | 'post'
        | 'put'
        | 'patch'
        | 'delete'
        | 'head'
        | 'options';
      const operation = item[methodLower] as OpenAPIOperation | undefined;

      if (operation) {
        const pathParams = (item.parameters || []).filter(
          (p): p is OpenAPIParameter => !isReference(p),
        );
        operations.push(convertOperation(operation, method, path, pathParams));
      }
    }
  }

  return operations;
}

function convertOperation(
  op: OpenAPIOperation,
  method: HttpMethod,
  path: string,
  pathParameters?: OpenAPIParameter[],
): Operation {
  // Merge path-level parameters with operation-level parameters
  const allParameters = [...(pathParameters || []), ...(op.parameters || [])] as OpenAPIParameter[];

  // Deduplicate parameters (operation-level takes precedence)
  const paramMap = new Map<string, OpenAPIParameter>();
  for (const param of allParameters) {
    if (!isReference(param)) {
      const key = `${param.in}:${param.name}`;
      paramMap.set(key, param);
    }
  }

  return {
    id: op.operationId || `${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
    method,
    path,
    summary: op.summary,
    description: op.description,
    tags: op.tags || [],
    deprecated: op.deprecated,
    parameters: Array.from(paramMap.values()).map(convertParameter),
    requestBody:
      op.requestBody && !isReference(op.requestBody)
        ? convertRequestBody(op.requestBody as OpenAPIRequestBody)
        : undefined,
    responses: convertResponses(op.responses),
    security: op.security?.map(convertSecurityRequirement),
    externalDocs: op.externalDocs
      ? {
          url: op.externalDocs.url,
          description: op.externalDocs.description,
        }
      : undefined,
  };
}

function convertParameter(param: OpenAPIParameter): Parameter {
  return {
    name: param.name,
    in: param.in as ParameterLocation,
    description: param.description,
    required: param.required ?? param.in === 'path',
    deprecated: param.deprecated,
    schema:
      param.schema && !isReference(param.schema)
        ? convertSchema(param.schema as OpenAPISchema)
        : { type: 'string' },
    example: param.example,
    examples: param.examples
      ? Object.fromEntries(
          Object.entries(param.examples)
            .filter(([, ex]) => !isReference(ex))
            .map(([key, ex]) => [key, convertExample(ex as OpenAPIV3.ExampleObject)]),
        )
      : undefined,
  };
}

function convertSchema(schema: OpenAPISchema): Schema {
  const result: Schema = {};

  // Use type assertions for properties that exist on specific schema variants
  const schemaAny = schema as Record<string, unknown>;

  if (schema.type) {
    result.type = Array.isArray(schema.type) ? schema.type[0] : (schema.type as Schema['type']);
  }
  if (schema.format) result.format = schema.format;
  if (schema.title) result.title = schema.title;
  if (schema.description) result.description = schema.description;
  if (schema.default !== undefined) result.default = schema.default;
  if (schema.enum) result.enum = schema.enum;
  if ('const' in schemaAny && schemaAny.const !== undefined) result.const = schemaAny.const;
  if ('nullable' in schemaAny && schemaAny.nullable)
    result.nullable = schemaAny.nullable as boolean;

  // String constraints
  if (schema.minLength !== undefined) result.minLength = schema.minLength;
  if (schema.maxLength !== undefined) result.maxLength = schema.maxLength;
  if (schema.pattern) result.pattern = schema.pattern;

  // Number constraints
  if (schema.minimum !== undefined) result.minimum = schema.minimum;
  if (schema.maximum !== undefined) result.maximum = schema.maximum;
  if (schema.exclusiveMinimum !== undefined)
    result.exclusiveMinimum = schema.exclusiveMinimum as number;
  if (schema.exclusiveMaximum !== undefined)
    result.exclusiveMaximum = schema.exclusiveMaximum as number;
  if (schema.multipleOf !== undefined) result.multipleOf = schema.multipleOf;

  // Array constraints
  if ('items' in schemaAny && schemaAny.items && !isReference(schemaAny.items)) {
    result.items = convertSchema(schemaAny.items as OpenAPISchema);
  }
  if (schema.minItems !== undefined) result.minItems = schema.minItems;
  if (schema.maxItems !== undefined) result.maxItems = schema.maxItems;
  if (schema.uniqueItems) result.uniqueItems = schema.uniqueItems;

  // Object constraints
  if (schema.properties) {
    result.properties = Object.fromEntries(
      Object.entries(schema.properties)
        .filter(([, prop]) => !isReference(prop))
        .map(([key, prop]) => [key, convertSchema(prop as OpenAPISchema)]),
    );
  }
  if (schema.required) result.required = schema.required;
  if (schema.additionalProperties !== undefined) {
    result.additionalProperties =
      typeof schema.additionalProperties === 'boolean'
        ? schema.additionalProperties
        : schema.additionalProperties && !isReference(schema.additionalProperties)
          ? convertSchema(schema.additionalProperties as OpenAPISchema)
          : true;
  }

  // Composition
  if (schema.allOf) {
    result.allOf = schema.allOf
      .filter((s): s is OpenAPISchema => !isReference(s))
      .map((s) => convertSchema(s));
  }
  if (schema.anyOf) {
    result.anyOf = schema.anyOf
      .filter((s): s is OpenAPISchema => !isReference(s))
      .map((s) => convertSchema(s));
  }
  if (schema.oneOf) {
    result.oneOf = schema.oneOf
      .filter((s): s is OpenAPISchema => !isReference(s))
      .map((s) => convertSchema(s));
  }
  if (schema.not && !isReference(schema.not)) {
    result.not = convertSchema(schema.not as OpenAPISchema);
  }

  return result;
}

function convertRequestBody(body: OpenAPIRequestBody): RequestBody {
  return {
    description: body.description,
    required: body.required ?? false,
    content: Object.fromEntries(
      Object.entries(body.content).map(([mediaType, content]) => [
        mediaType,
        convertMediaType(content),
      ]),
    ),
  };
}

function convertMediaType(media: OpenAPIMediaType): MediaType {
  return {
    schema:
      media.schema && !isReference(media.schema)
        ? convertSchema(media.schema as OpenAPISchema)
        : undefined,
    example: media.example,
    examples: media.examples
      ? Object.fromEntries(
          Object.entries(media.examples)
            .filter(([, ex]) => !isReference(ex))
            .map(([key, ex]) => [key, convertExample(ex as OpenAPIV3.ExampleObject)]),
        )
      : undefined,
  };
}

function convertExample(example: OpenAPIV3.ExampleObject): Example {
  return {
    summary: example.summary,
    description: example.description,
    value: example.value,
    externalValue: example.externalValue,
  };
}

function convertResponses(
  responses?: OpenAPIV3.ResponsesObject | OpenAPIV3_1.ResponsesObject,
): Response[] {
  if (!responses) return [];

  return Object.entries(responses)
    .filter(([, response]) => !isReference(response))
    .map(([statusCode, response]) => convertResponse(statusCode, response as OpenAPIResponse));
}

function convertResponse(statusCode: string, response: OpenAPIResponse): Response {
  return {
    statusCode,
    description: response.description,
    headers: response.headers
      ? Object.fromEntries(
          Object.entries(response.headers)
            .filter(([, header]) => !isReference(header))
            .map(([name, header]) => [
              name,
              convertParameter({
                name,
                in: 'header',
                ...(header as OpenAPIV3.HeaderObject),
              } as OpenAPIParameter),
            ]),
        )
      : undefined,
    content: response.content
      ? Object.fromEntries(
          Object.entries(response.content).map(([mediaType, content]) => [
            mediaType,
            convertMediaType(content),
          ]),
        )
      : undefined,
  };
}

function convertSecurityRequirement(req: OpenAPIV3.SecurityRequirementObject): SecurityRequirement {
  const entries = Object.entries(req);
  const [name, scopesList] = entries[0] || ['', []];
  return {
    type: 'apiKey', // Will be resolved later with security scheme info
    name,
    scopes: scopesList as string[],
  };
}

function convertSchemas(
  schemas?: Record<
    string,
    OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject | OpenAPIV3.ReferenceObject
  >,
): Record<string, Schema> {
  if (!schemas) return {};

  return Object.fromEntries(
    Object.entries(schemas)
      .filter(([, schema]) => !isReference(schema))
      .map(([name, schema]) => [name, convertSchema(schema as OpenAPISchema)]),
  );
}

function convertSecuritySchemes(
  schemes?: Record<string, OpenAPISecurityScheme | OpenAPIV3.ReferenceObject>,
): Record<string, SecurityRequirement> {
  if (!schemes) return {};

  return Object.fromEntries(
    Object.entries(schemes)
      .filter(([, scheme]) => !isReference(scheme))
      .map(([name, scheme]) => [
        name,
        convertSecurityScheme(name, scheme as OpenAPISecurityScheme),
      ]),
  );
}

function convertSecurityScheme(name: string, scheme: OpenAPISecurityScheme): SecurityRequirement {
  const base: SecurityRequirement = {
    type: mapSecuritySchemeType(scheme.type),
    name,
  };

  if (scheme.type === 'apiKey') {
    base.in = scheme.in as 'header' | 'query' | 'cookie';
  }

  if (scheme.type === 'http') {
    base.scheme = scheme.scheme;
  }

  if (scheme.type === 'oauth2' && scheme.flows) {
    base.flows = convertOAuth2Flows(scheme.flows);
  }

  return base;
}

function mapSecuritySchemeType(type: string): AuthType {
  switch (type) {
    case 'apiKey':
      return 'apiKey';
    case 'http':
      return 'bearer'; // Could also be 'basic', determined by scheme
    case 'oauth2':
      return 'oauth2';
    default:
      return 'apiKey';
  }
}

function convertOAuth2Flows(flows: OpenAPIV3.OAuth2SecurityScheme['flows']): OAuth2Flows {
  const result: OAuth2Flows = {};

  if (flows?.implicit) {
    result.implicit = convertOAuth2Flow(flows.implicit);
  }
  if (flows?.password) {
    result.password = convertOAuth2Flow(flows.password);
  }
  if (flows?.clientCredentials) {
    result.clientCredentials = convertOAuth2Flow(flows.clientCredentials);
  }
  if (flows?.authorizationCode) {
    result.authorizationCode = convertOAuth2Flow(flows.authorizationCode);
  }

  return result;
}

function convertOAuth2Flow(
  flow: OpenAPIV3.OAuth2SecurityScheme['flows'][keyof OpenAPIV3.OAuth2SecurityScheme['flows']],
): OAuth2Flow {
  return {
    authorizationUrl: (flow as { authorizationUrl?: string }).authorizationUrl,
    tokenUrl: (flow as { tokenUrl?: string }).tokenUrl,
    refreshUrl: flow?.refreshUrl,
    scopes: flow?.scopes || {},
  };
}

function isReference(obj: unknown): obj is { $ref: string } {
  return typeof obj === 'object' && obj !== null && '$ref' in obj;
}
