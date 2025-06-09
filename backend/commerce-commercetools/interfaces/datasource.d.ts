import '@frontastic/extension-types';

declare module '@frontastic/extension-types' {
  interface DataSourceConfiguration {
    streamId?: string;
  }
}
