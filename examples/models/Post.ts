import { Model, Table, Column, Relation } from "../../src/model";
import { User } from "./User";
import { ClickHouseEngineEnum, RelationTypeEnum, ClickHouseDataType } from "../../src/types";

@Table({
  engine: ClickHouseEngineEnum.MergeTree,
  orderBy: ["id", "user_id"],
  settings: {
    index_granularity: 8192
  },
  comment: "Table storing blog posts",
  tableName: "posts"
})
export class Post extends Model {
  @Column({ type: ClickHouseDataType.UUID, comment: "Unique identifier for the post" })
  id!: string;

  @Column({ type: ClickHouseDataType.String, required: true, comment: "Title of the post" })
  title!: string;

  @Column({ type: ClickHouseDataType.String, comment: "Content of the post" })
  content!: string;

  @Column({ type: ClickHouseDataType.UUID, required: true, comment: "ID of the user who created the post" })
  user_id!: string;

  @Column({ type: ClickHouseDataType.DateTime, comment: "Timestamp of post creation" })
  created_at!: Date;

  @Relation(RelationTypeEnum.ManyToOne, "User")
  user!: User;
}