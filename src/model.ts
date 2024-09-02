import 'reflect-metadata';
import { Field, Relation, TableOptions, RelationTypeEnum, ModelDefinition, QueryOptions, Filter, CreateOptions, UpdateOptions, DeleteOptions, ClickHouseDataType } from './types';
import { Schema } from './schema';
import { Query } from './query';

export class Model {
  private static _schema: Schema;
  private static models: Map<string, ModelDefinition> = new Map();

  static get schema(): Schema {
    return this._schema;
  }

  static setSchema(schema: Schema) {
    this._schema = schema;
    // Register all models that were defined before the schema was set
    this.models.forEach((modelDef, modelName) => {
      schema.addModel(modelName, modelDef);
    });
  }

  static registerModel(modelName: string, modelDefinition: ModelDefinition) {
    if (this._schema) {
      this._schema.addModel(modelName, modelDefinition);
    } else {
      this.models.set(modelName, modelDefinition);
    }
  }

  static async create(data: Record<string, any>, options?: CreateOptions) {
    return Query.create(this.name, data, options);
  }

  static async fetch(filter?: Filter, options?: QueryOptions) {
    return Query.fetch(this.name, filter, options);
  }

  static async update(filter: Filter, data: Record<string, any>, options?: UpdateOptions) {
    return Query.update(this.name, filter, data, options);
  }

  static async delete(filter: Filter, options?: DeleteOptions) {
    return Query.delete(this.name, filter, options);
  }
}

export function Table(options: TableOptions) {
  return function (constructor: Function) {
    const modelName = constructor.name;
    const fields: Record<string, Field> = Reflect.getMetadata('fields', constructor.prototype) || {};
    const relations: Record<string, Relation> = Reflect.getMetadata('relations', constructor.prototype) || {};

    const modelDefinition: ModelDefinition = {
      name: modelName,
      fields,
      relations,
      options
    };

    Model.registerModel(modelName, modelDefinition);
  };
}

export function Column(options: Omit<Field, 'type'> & { type: ClickHouseDataType }) {
  return function (target: any, propertyKey: string) {
    const fields = Reflect.getMetadata('fields', target) || {};
    fields[propertyKey] = {
      ...options,
    };
    Reflect.defineMetadata('fields', fields, target);
  };
}

export function Relation(type: RelationTypeEnum, model: string, options?: { foreignKey?: string; cascadeDelete?: boolean }) {
  return function (target: any, propertyKey: string) {
    const relations = Reflect.getMetadata('relations', target) || {};
    relations[propertyKey] = { 
      type, 
      model, 
      foreignKey: options?.foreignKey || `${model.toLowerCase()}_id`,
      cascadeDelete: options?.cascadeDelete || false
    };
    Reflect.defineMetadata('relations', relations, target);
  };
}