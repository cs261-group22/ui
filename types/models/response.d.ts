/* eslint-disable camelcase */
export interface Response {
  value?: string;
  answer_id?: number;
  session_id?: number;
  question_id: number;
  sentiment?: ResponseSentiment;
}

export interface ResponseSentiment {
  pca_graph: any;
  urgency: number;
  entities: string[];
  word_pairs: string[];
  subjects: { [key: string]: number };
  frequent_words: { [key: string]: number };

  sentiment: {
    score: number;
    magnitude: number;
  };
}
