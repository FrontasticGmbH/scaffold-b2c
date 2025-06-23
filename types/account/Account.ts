import { Address } from './Address';
import { AccountToken } from './AccountToken';

export interface Account {
  accountId?: string;
  accountVersion?: number;
  email: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  password?: string; // TODO: should we use hash the password or use plain password?
  confirmationToken?: AccountToken;
  confirmed?: boolean;
  addresses?: Address[];
  apiToken?: string;
  accountGroupIds?: string[];
}

export interface AccountGroup {
  accountGroupId?: string;
  key?: string;
  name?: string;
}
