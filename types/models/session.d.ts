import { User } from "./user";
import { Event } from "./event";

/* eslint-disable camelcase */
export interface Session {
    id: number;
    user?: User;
    event?: Event;
    started_at?: Date;
    is_submitted: boolean;
}