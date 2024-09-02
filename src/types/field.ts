import { ClickHouseDataType } from './enums';

export interface Field {
  type: ClickHouseDataType;
  required?: boolean;
  precision?: number;
  scale?: number;
  itemType?: ClickHouseDataType;
  comment?: string;
  columnName?: string;
  nullable?: boolean;
}