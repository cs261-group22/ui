import { User } from './user';

/* eslint-disable camelcase */
export interface Event {
  id: number;
  name: string;
  code: string;
  starts_at?: string;
  ends_at?: string;
  host?: User;
  allow_guests: boolean;
  is_draft: boolean;
}
