export const revalidateOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

export * from './lib/utils/api-hub';
export * from './lib/types';
export * from './lib/notifier';
export * from './provider';
export * from './hooks';
