import { ClickHouseOrderBy } from './enums';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: Record<string, ClickHouseOrderBy>;
  where?: Filter;
  include?: Record<string, boolean | IncludeOptions>;
}

export interface IncludeOptions {
  where?: Filter;
  limit?: number;
  offset?: number;
  orderBy?: Record<string, ClickHouseOrderBy>;
}

export interface Filter {
  [key: string]: any;
}

export interface CreateOptions {
  include?: string[];
}

export interface UpdateOptions {
  include?: string[];
}

export interface DeleteOptions {
  cascade?: boolean;
}