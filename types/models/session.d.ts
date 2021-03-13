import { User } from './user';
import { Event } from './event';
import { Response } from './response';

/* eslint-disable camelcase */
export interface Session {
  id: number;
  user?: User;
  mood?: number;
  event?: Event;
  responses?: Response[];
  started_at?: Date;
  updated_at?: Date;
  is_submitted: boolean;
}
