import { Asset } from './Asset';

export interface Attribute {
  attributeId: string;
  content: string | Asset | Object;
  type?: string;
}
