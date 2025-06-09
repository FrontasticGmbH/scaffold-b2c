export interface ContextType<T = never> {
  page: {
    location: string;
    referrer: string;
    type: string;
    data: T[];
  };
  device: {
    userAgent: string;
    ip: string;
  };
  pageAttributes: string;
}
