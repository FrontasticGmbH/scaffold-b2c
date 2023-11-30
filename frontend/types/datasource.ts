export interface DataSources<T = unknown> {
  [key: string]: Record<string, T>;
}

export interface DataSource<T = unknown> {
  data?: {
    dataSource?: T;
  };
}
