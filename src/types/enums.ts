export enum ClickHouseEngineEnum {
  MergeTree = 'MergeTree',
  ReplacingMergeTree = 'ReplacingMergeTree',
  SummingMergeTree = 'SummingMergeTree',
  AggregatingMergeTree = 'AggregatingMergeTree',
  CollapsingMergeTree = 'CollapsingMergeTree',
  VersionedCollapsingMergeTree = 'VersionedCollapsingMergeTree',
  GraphiteMergeTree = 'GraphiteMergeTree',
  Memory = 'Memory',
  TinyLog = 'TinyLog',
  StripeLog = 'StripeLog',
  Log = 'Log',
  Distributed = 'Distributed',
  MaterializedView = 'MaterializedView',
  Live = 'Live',
  Set = 'Set',
  Join = 'Join',
  URL = 'URL',
  View = 'View',
  Buffer = 'Buffer',
  Null = 'Null',
  Dictionary = 'Dictionary',
  Merge = 'Merge',
  File = 'File',
  Kafka = 'Kafka',
  MySQL = 'MySQL',
  PostgreSQL = 'PostgreSQL',
  JDBC = 'JDBC',
  ODBC = 'ODBC',
  HDFS = 'HDFS',
  S3 = 'S3'
}

export enum RelationTypeEnum {
  OneToOne = 'oneToOne',
  OneToMany = 'oneToMany',
  ManyToOne = 'manyToOne'
}

export enum ClickHouseDataType {
  // Numeric types
  UInt8 = 'UInt8',
  UInt16 = 'UInt16',
  UInt32 = 'UInt32',
  UInt64 = 'UInt64',
  UInt256 = 'UInt256',
  Int8 = 'Int8',
  Int16 = 'Int16',
  Int32 = 'Int32',
  Int64 = 'Int64',
  Int128 = 'Int128',
  Int256 = 'Int256',
  Float32 = 'Float32',
  Float64 = 'Float64',
  Decimal = 'Decimal',

  // String types
  String = 'String',
  FixedString = 'FixedString',

  // Date and time types
  Date = 'Date',
  Date32 = 'Date32',
  DateTime = 'DateTime',
  DateTime64 = 'DateTime64',

  // Array type
  Array = 'Array',

  // Other types
  UUID = 'UUID',
  Enum8 = 'Enum8',
  Enum16 = 'Enum16',
  Bool = 'Bool',
}

export enum ClickHouseOrderBy {
  ASC = 'ASC',
  DESC = 'DESC'
}