import { Question } from './question';
import { Session } from './session';
import { User } from './user';

/* eslint-disable camelcase */
export interface Event {
  id: number;
  name: string;
  code: string;
  ends_at?: string;
  starts_at?: string;
  is_draft: boolean;
  allow_guests: boolean;
  max_sessions: number;

  hosts?: User[];
  sessions: Session[];
  questions: Question[];
}
