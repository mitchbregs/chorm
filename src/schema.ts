import { ClickHouseClient } from '@clickhouse/client';
import { Field, ModelDefinition, ClickHouseDataType, TableOptions, Relation } from './types';

export class Schema {
  private models: Record<string, ModelDefinition> = {};
  private client: ClickHouseClient;

  constructor(client: ClickHouseClient) {
    this.client = client;
  }

  registerModel(modelClass: any) {
    const modelName = modelClass.name;
    const fields: Record<string, Field> = Reflect.getMetadata('fields', modelClass.prototype) || {};
    const relations: Record<string, Relation> = Reflect.getMetadata('relations', modelClass.prototype) || {};
    const options: TableOptions = Reflect.getMetadata('tableOptions', modelClass) || {};

    const modelDefinition: ModelDefinition = {
      name: modelName,
      fields,
      relations,
      options
    };

    this.addModel(modelName, modelDefinition);
  }

  addModel(name: string, modelDefinition: ModelDefinition) {
    this.models[name] = modelDefinition;
  }

  getModel(name: string) {
    return this.models[name];
  }

  async generateSchema() {
    for (const [name, model] of Object.entries(this.models)) {
      const tableName = model.options.tableName || name;
      const fields = Object.entries(model.fields)
        .map(([fieldName, field]) => {
          const columnName = field.columnName || fieldName;
          let fieldDef = `${columnName} ${this.getClickHouseType(field)}`;
          if (field.comment) {
            fieldDef += ` COMMENT '${field.comment.replace(/'/g, "''")}'`;
          }
          return fieldDef;
        })
        .join(', ');

      const engineOptions = this.getEngineOptions(model.options);
      const comment = model.options.comment ? `COMMENT '${model.options.comment.replace(/'/g, "''")}'` : '';

      const query = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          ${fields}
        ) ENGINE = ${engineOptions}
        ${comment}
      `;

      await this.client.query({ query });
    }
  }

  private getClickHouseType(field: Field): string {
    let type: string = field.type;
    if (field.type === ClickHouseDataType.Array && field.itemType) {
      type = `Array(${field.itemType})`;
    } else if (field.type === ClickHouseDataType.Decimal && field.precision && field.scale) {
      type = `Decimal(${field.precision}, ${field.scale})`;
    } else if (field.type === ClickHouseDataType.FixedString && field.precision) {
      type = `FixedString(${field.precision})`;
    }

    return type;
  }

  private getEngineOptions(options: TableOptions): string {
    const engine = options.engine || 'MergeTree()';
    const orderBy = options.orderBy ? `ORDER BY (${options.orderBy.join(', ')})` : '';
    const partitionBy = options.partitionBy ? `PARTITION BY ${Array.isArray(options.partitionBy) ? options.partitionBy.join(', ') : options.partitionBy}` : '';
    const primaryKey = options.primaryKey ? `PRIMARY KEY (${Array.isArray(options.primaryKey) ? options.primaryKey.join(', ') : options.primaryKey})` : '';
    const sampleBy = options.sampleBy ? `SAMPLE BY ${options.sampleBy}` : '';

    return `${engine} ${partitionBy} ${orderBy} ${primaryKey} ${sampleBy}`.trim();
  }
}