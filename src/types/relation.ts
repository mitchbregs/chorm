import { RelationTypeEnum } from './enums';

export type RelationType = RelationTypeEnum;

export interface Relation {
  type: RelationType;
  model: string;
  foreignKey: string;
  cascadeDelete?: boolean;
}

export interface RelationOptions {
  foreignKey?: string;
  cascadeDelete?: boolean;
}