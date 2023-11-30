export interface ContextType {
  page: {
    location: string;
    referrer: string;
    type: string;
    data: any[];
  };
  device: {
    userAgent: string;
    ip: string;
  };
  pageAttributes: string;
}
