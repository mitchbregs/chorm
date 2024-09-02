import { Model, Table, Column, Relation } from "../../src/model";
import { Post } from "./Post";
import { ClickHouseEngineEnum, RelationTypeEnum, ClickHouseDataType } from "../../src/types";

@Table({
  engine: ClickHouseEngineEnum.MergeTree,
  orderBy: ["id"],
  settings: {
    index_granularity: 8192
  },
  comment: "Table storing user information",
  tableName: "users"
})
export class User extends Model {
  @Column({ type: ClickHouseDataType.UUID, comment: "Unique identifier for the user" })
  id!: string;

  @Column({ type: ClickHouseDataType.String, required: true, comment: "User's full name" })
  name!: string;

  @Column({ type: ClickHouseDataType.String, required: true, comment: "User's email address" })
  email!: string;

  @Column({ type: ClickHouseDataType.UInt8, comment: "User's age" })
  age!: number;

  @Column({ type: ClickHouseDataType.DateTime, comment: "Timestamp of user creation" })
  created_at!: Date;

  @Relation(RelationTypeEnum.OneToMany, "Post")
  posts!: Post[];
}
