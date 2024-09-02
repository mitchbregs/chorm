# chorm

A powerful and intuitive Object-Relational Mapping (ORM) library for ClickHouse, designed for TypeScript projects.

## Features

- Easy-to-use decorators for defining models
- Support for various ClickHouse data types
- Automatic schema generation
- CRUD operations with a simple API
- Relationship handling (One-to-One, One-to-Many, Many-to-One)
- Query builder with filtering, ordering, and pagination
- Eager loading of related models
- Custom table and column name mapping
- Environment-based configuration

## Installation

```bash
pnpm add chorm
```

## Configuration

Set the following environment variables in your project:

```bash
CLICKHOUSE_URL=http://localhost:8123/default
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=password
```

## Usage

### Defining Models

```typescript
import { Model, Table, Column, Relation } from "chorm";
import { ClickHouseEngineEnum, RelationTypeEnum, ClickHouseDataType } from "chorm/types";
import { Post } from "./Post";

@Table({
  engine: ClickHouseEngineEnum.MergeTree,
  orderBy: ["id"],
  tableName: "users"
})
export class User extends Model {
  @Column({ type: ClickHouseDataType.UUID, comment: "Unique identifier for the user" })
  id!: string;

  @Column({ type: ClickHouseDataType.String, required: true, comment: "User's full name", columnName: "full_name" })
  name!: string;

  @Relation(RelationTypeEnum.OneToMany, "Post")
  posts!: Post[];
}
```

```typescript
import { Model, Table, Column, Relation } from "chorm";
import { ClickHouseEngineEnum, RelationTypeEnum, ClickHouseDataType } from "chorm/types";
import { User } from "./User";

@Table({
  engine: ClickHouseEngineEnum.MergeTree,
  orderBy: ["user_id", "id"],
  tableName: "posts"
})
export class Post extends Model {
  @Column({ type: ClickHouseDataType.UUID, comment: "Unique identifier for the post" })
  id!: string;

  @Column({ type: ClickHouseDataType.String, required: true, comment: "Post title" })
  title!: string;

  @Column({ type: ClickHouseDataType.UUID, required: true, comment: "User ID" })
  user_id!: string;

  @Relation(RelationTypeEnum.ManyToOne, "User")
  user!: User;
}
```

### Generating Schema

```typescript
import { schema } from 'clickhouse-orm';

async function generateSchema() {
    await schema.generateSchema();
    console.log('Schema generated successfully');
}

generateSchema().catch(console.error);
```

### CRUD Operations

```typescript
import { User, Post } from './models';
import { v4 as uuidv4 } from 'uuid';

// Create
const user = await User.create({
    id: uuidv4(),
    name: 'John Doe',
});

// Read
const allUsers = await User.fetch();
const johnDoe = await User.fetch({ name: 'John Doe' }, { limit: 1 });

// Update
const updatedUser = await User.update({ id: user.id }, { name: 'Jane Doe' });

// Delete
await User.delete({ id: user.id });

// Create with relations
const post = await Post.create({
    id: uuidv4(),
    title: 'My First Post',
    user_id: user.id,
});

// Fetch with relations
const userWithPosts = await User.fetch(
    { id: user.id },
    {
        include: {
            posts: true
        }
    }
);
```

### Query Options

```typescript
const users = await User.fetch({}, orderBy: { name: ClickHouseOrderBy.DESC });
```

## API Reference

### Model Static Methods

- `create(data: Record<string, any>, options?: CreateOptions): Promise<T>`
- `fetch(filter?: Filter, options?: QueryOptions): Promise<T[]>`
- `update(filter: Filter, data: Record<string, any>, options?: UpdateOptions): Promise<T>`
- `delete(filter: Filter, options?: DeleteOptions): Promise<void>`

### Decorators

- `@Table(options: TableOptions)`
- `@Column(options: ColumnOptions)`
- `@Relation(type: RelationTypeEnum, model: string, options?: RelationOptions)`

### Query Options

- `limit?: number`
- `offset?: number`
- `orderBy?: Record<string, ClickHouseOrderBy>`
- `include?: Record<string, boolean | IncludeOptions>`

## Contributing

If you have any suggestions or improvements, please feel free to submit a pull request.
