import { Field } from './field';
import { Relation } from './relation';
import { ClickHouseEngine } from './engine';

export interface TableOptions {
  engine: ClickHouseEngine;
  orderBy?: string[];
  partitionBy?: string | string[];
  primaryKey?: string | string[];
  sampleBy?: string;
  settings?: Record<string, string | number | boolean>;
  comment?: string; // Add this line
  tableName?: string; // Add this line for table name mapping
}

export interface ModelDefinition {
  name: string;
  fields: Record<string, Field>;
  relations?: Record<string, Relation>;
  options: TableOptions;
}