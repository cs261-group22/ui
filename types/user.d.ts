/* eslint-disable camelcase */
export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_leader?: boolean;
  email_verified_at: Date;
}
