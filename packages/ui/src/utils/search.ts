import type { Operation } from '@wti/core';
import Fuse, { type FuseResult, type FuseResultMatch, type IFuseOptions } from 'fuse.js';

export type FuseMatch = FuseResultMatch;

export interface OperationSearchResult {
  operation: Operation;
  matches?: readonly FuseMatch[];
  score?: number;
}

const FUSE_OPTIONS: IFuseOptions<Operation> = {
  keys: [
    { name: 'path', weight: 2 },
    { name: 'id', weight: 2 },
    { name: 'summary', weight: 1 },
    { name: 'method', weight: 0.5 },
    { name: 'tags', weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
};

export function createOperationSearch(operations: Operation[]): Fuse<Operation> {
  return new Fuse(operations, FUSE_OPTIONS);
}

export function searchOperations(
  fuse: Fuse<Operation>,
  query: string,
  limit = 50,
): OperationSearchResult[] {
  return fuse
    .search(query)
    .slice(0, limit)
    .map((result: FuseResult<Operation>) => ({
      operation: result.item,
      matches: result.matches,
      score: result.score,
    }));
}
