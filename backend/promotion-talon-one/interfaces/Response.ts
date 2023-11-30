import { Effect } from './Effects';
import { Session } from './Session';

export interface BaseResponse {
  customerSession: Session;
  effects: Effect[];
}
