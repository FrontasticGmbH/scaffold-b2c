import { Attributes } from './Session';

export interface Profile {
  profileId: string;
  data?: {
    attributes?: Attributes;
  };
}
