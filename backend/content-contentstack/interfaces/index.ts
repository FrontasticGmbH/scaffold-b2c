export interface ContentstackEntryResponse {
  _version: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  publish_details: string;
  title: string;
  uid: string;
  contentTypeUid: string;
  featured_image: { url: string };
  multi_line: string;
}
