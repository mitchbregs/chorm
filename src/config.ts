import { createClient } from '@clickhouse/client';
import { Schema } from './schema';
import { Query } from './query';
import { Model } from './model';

// Load environment variables
const {
  CLICKHOUSE_URL = 'http://localhost:8123/default',
  CLICKHOUSE_USER = 'default',
  CLICKHOUSE_PASSWORD = '',
} = process.env;

// Create ClickHouse client
const client = createClient({
  host: CLICKHOUSE_URL,
  username: CLICKHOUSE_USER,
  password: CLICKHOUSE_PASSWORD,
});

// Create schema
const schema = new Schema(client);

// Set up Model and Query with the schema and client
Model.setSchema(schema);
Query.setClient(client);

export { client, schema };