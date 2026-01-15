import { describe, expect, it } from 'bun:test';
import { parseOpenApi } from './parser';

describe('parseOpenApi', () => {
  describe('dereference', () => {
    it('should handle specs with many shared refs without hanging', async () => {
      // This test ensures we don't regress on the O(n²) bug where
      // refs were re-resolved on every use instead of being cached
      const spec = {
        openapi: '3.1.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {} as Record<string, object>,
        components: {
          schemas: {
            SharedSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nested: { $ref: '#/components/schemas/NestedSchema' },
              },
            },
            NestedSchema: {
              type: 'object',
              properties: {
                value: { type: 'string' },
              },
            },
          },
        },
      };

      // Create 100 endpoints all referencing the same schema
      for (let i = 0; i < 100; i++) {
        spec.paths[`/endpoint-${i}`] = {
          get: {
            operationId: `getEndpoint${i}`,
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/SharedSchema' },
                  },
                },
              },
            },
          },
        };
      }

      const start = Date.now();
      const result = await parseOpenApi({ type: 'openapi', spec }, { dereference: true });
      const elapsed = Date.now() - start;

      // Should complete in under 1 second (was infinite before fix)
      expect(elapsed).toBeLessThan(1000);
      expect(result.spec.operations).toHaveLength(100);
    });

    it('should handle circular refs without infinite loop', async () => {
      const spec = {
        openapi: '3.1.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {
          '/user': {
            get: {
              operationId: 'getUser',
              responses: {
                200: {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                manager: { $ref: '#/components/schemas/User' }, // Circular!
              },
            },
          },
        },
      };

      const start = Date.now();
      const result = await parseOpenApi({ type: 'openapi', spec }, { dereference: true });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(1000);
      expect(result.spec.operations).toHaveLength(1);
    });

    it('should work without dereference option', async () => {
      const spec = {
        openapi: '3.1.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: {
                200: {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: { $ref: '#/components/schemas/TestSchema' },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: { id: { type: 'string' } },
            },
          },
        },
      };

      const result = await parseOpenApi({ type: 'openapi', spec }, { dereference: false });
      expect(result.spec.operations).toHaveLength(1);
    });
  });
});
