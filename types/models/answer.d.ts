import { Question } from "./question";

/* eslint-disable camelcase */
export interface Answer {
    id: number;
    value: string;
    order: number;
    question?: Question;
}
