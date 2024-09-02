import { ClickHouseDataType } from './enums';

export interface Field {
  type: ClickHouseDataType;
  required?: boolean;
  precision?: number;
  scale?: number;
  itemType?: ClickHouseDataType; // For array fields
  comment?: string;
  columnName?: string;
}