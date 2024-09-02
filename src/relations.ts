import { RelationOptions, Relation, RelationTypeEnum } from './types';

export function oneToOne(model: string, options?: RelationOptions): Relation {
  return { 
    type: RelationTypeEnum.OneToOne, 
    model, 
    foreignKey: options?.foreignKey || `${model.toLowerCase()}_id`,
    cascadeDelete: options?.cascadeDelete || false
  };
}

export function oneToMany(model: string, options?: RelationOptions): Relation {
  return { 
    type: RelationTypeEnum.OneToMany, 
    model, 
    foreignKey: options?.foreignKey || `${model.toLowerCase()}_id`,
    cascadeDelete: options?.cascadeDelete || false
  };
}

export function manyToOne(model: string, options?: RelationOptions): Relation {
  return { 
    type: RelationTypeEnum.ManyToOne, 
    model, 
    foreignKey: options?.foreignKey || `${model.toLowerCase()}_id`,
    cascadeDelete: options?.cascadeDelete || false
  };
}