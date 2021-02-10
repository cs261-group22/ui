import { User } from './user';

/* eslint-disable camelcase */
export interface Team {
  id: number;
  name: string;
  department?: string;
  is_leader?: boolean;
  users: User[];
}
