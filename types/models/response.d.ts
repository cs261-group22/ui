import { Answer } from "./answer";
import { Session } from "./session";
import { Question } from "./question";

/* eslint-disable camelcase */
export interface Response {
    value: string;
    answer: Answer;
    session: Session;
    question: Question;
    sentiment: ResponseSentiment
}

export interface ResponseSentiment {
    // todo: populate when sentiment structure is known
}