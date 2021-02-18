import { Answer } from './answer';
import { Event } from './event';

/* eslint-disable camelcase */
export interface Question {
  id?: number;
  order?: number;
  event?: Event;
  prompt?: string;
  type: QuestionType;
  min_responses?: number;
  max_responses?: number;

  answers: Answer[];
}

export enum QuestionType {
  FREE_TEXT = 'free_text',
  MULTIPLE_CHOICE = 'multiple_choice',
}
