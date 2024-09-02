import { QueryOptions, Filter, CreateOptions, UpdateOptions, DeleteOptions, IncludeOptions } from './types';
import { Model } from './model';
import { ClickHouseClient, ResponseJSON } from '@clickhouse/client';
import { ClickHouseOrderBy, ClickHouseDataType } from './types/enums';

export class Query {
  private static client: ClickHouseClient;

  static setClient(client: ClickHouseClient) {
    this.client = client;
  }

  private static getTableName(model: string): string {
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);
    return modelDef.options.tableName || model;
  }

  private static getColumnName(model: string, field: string): string {
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);
    return modelDef.fields[field]?.columnName || field;
  }

  private static buildOrderByClause(model: string, orderBy?: Record<string, ClickHouseOrderBy>): string {
    if (!orderBy) return '';
    const orderClauses = Object.entries(orderBy).map(([field, direction]) => 
      `${this.getColumnName(model, field)} ${direction}`
    );
    return `ORDER BY ${orderClauses.join(', ')}`;
  }

  static async fetch(model: string, filter?: Filter, options?: QueryOptions) {
    const tableName = this.getTableName(model);
    let query = `SELECT * FROM ${tableName}`;
    
    if (filter) {
      const whereClause = this.buildWhereClause(model, filter);
      query += ` WHERE ${whereClause}`;
    }
    
    if (options?.orderBy) {
      query += ` ${this.buildOrderByClause(model, options.orderBy)}`;
    }
    if (options?.limit) query += ` LIMIT ${options.limit}`;
    if (options?.offset) query += ` OFFSET ${options.offset}`;

    const result = await this.client.query({ query });
    const jsonResult: ResponseJSON<unknown> = await result.json();
    let data: any[] = Array.isArray(jsonResult) ? jsonResult : jsonResult.data || [];

    if (options?.include) {
      data = await this.includeRelations(model, data, options.include);
    }

    return options?.limit === 1 ? data[0] || null : data;
  }

  static async create(model: string, data: Record<string, any>, options?: CreateOptions) {
    const tableName = this.getTableName(model);
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);

    const fields: string[] = [];
    const values: Record<string, any> = {};

    for (const [key, field] of Object.entries(modelDef.fields)) {
      const columnName = this.getColumnName(model, key);
      if (data[key] !== undefined) {
        fields.push(columnName);
        values[columnName] = this.formatValue(data[key], field.type);
      }
    }

    await this.client.insert({
      table: tableName,
      values: [values],
      format: 'JSONEachRow',
    });

    return this.fetch(model, data, { limit: 1 });
  }

  static async update(model: string, filter: Filter, data: Record<string, any>, options?: UpdateOptions) {
    const tableName = this.getTableName(model);
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);

    const setClause = Object.entries(data)
      .map(([key, value]) => `${this.getColumnName(model, key)} = ${this.formatValue(value, modelDef.fields[key].type)}`)
      .join(', ');
    const whereClause = this.buildWhereClause(model, filter);

    const query = `ALTER TABLE ${tableName} UPDATE ${setClause} WHERE ${whereClause}`;
    await this.client.query({ query });

    return this.fetch(model, filter, { limit: 1 });
  }

  static async delete(model: string, filter: Filter, options?: DeleteOptions) {
    const tableName = this.getTableName(model);
    const whereClause = this.buildWhereClause(model, filter);
    const query = `ALTER TABLE ${tableName} DELETE WHERE ${whereClause}`;
    await this.client.query({ query });
  }

  private static buildWhereClause(model: string, filter: Filter): string {
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);

    return Object.entries(filter)
      .map(([key, value]) => `${this.getColumnName(model, key)} = ${this.formatWhereValue(value, modelDef.fields[key].type)}`)
      .join(' AND ');
  }

  private static formatWhereValue(value: any, type: ClickHouseDataType): string {
    if (type === ClickHouseDataType.UUID) {
      return `'${value}'`;
    }
    if (type === ClickHouseDataType.DateTime) {
      return `'${value}'`;
    }
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (value instanceof Date) return `'${value.toISOString()}'`;
    return String(value);
  }

  private static formatValue(value: any, type: ClickHouseDataType): string {
    if (type === ClickHouseDataType.UUID) {
      return `toUUID('${value}')`;
    }
    if (type === ClickHouseDataType.DateTime) {
      return `toDateTime('${value}')`;
    }
    if (typeof value === 'string') return `${value.replace(/'/g, "''")}`;
    if (value instanceof Date) return `${value.toISOString()}`;
    return String(value);
  }

  private static async includeRelations(model: string, data: any[], include: Record<string, boolean | IncludeOptions>) {
    const modelDef = Model.schema.getModel(model);
    if (!modelDef) throw new Error(`Model ${model} not found`);

    for (const [relationName, includeOptions] of Object.entries(include)) {
      const relation = modelDef.relations?.[relationName];
      if (!relation) throw new Error(`Relation ${relationName} not found in model ${model}`);

      const relatedModel = relation.model;
      const foreignKey = relation.foreignKey;

      for (const item of data) {
        const relatedOptions: QueryOptions = {
          where: { [foreignKey]: item.id },
          ...(typeof includeOptions === 'object' ? includeOptions : {})
        };

        item[relationName] = await this.fetch(relatedModel, relatedOptions.where, relatedOptions);
      }
    }

    return data;
  }
}