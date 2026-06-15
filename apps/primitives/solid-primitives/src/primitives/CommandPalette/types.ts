/** One searchable file result shown in the palette list. */
export interface FileHit {
  /** Stable unique id, typically the absolute path. */
  readonly id: string;
  /** Base file name; providers should weight this highest when ranking. */
  readonly name: string;
  /** Display path, typically workspace-relative. */
  readonly path: string;
  /** Provider-specific extras (size, mtime, score, ...). */
  readonly meta?: Record<string, unknown>;
}

/**
 * Async search abstraction the palette UI depends on. Implementations decide
 * how matching works (Fuse, Meilisearch, a user-supplied backend); the palette
 * never imports a search library directly.
 */
export interface FileSearchProvider {
  /** Resolve ranked hits for a query. An empty query may return a default listing. */
  search(query: string): Promise<FileHit[]>;
}
