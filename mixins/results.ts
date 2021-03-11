/* eslint-disable camelcase */
import { Component, Vue } from 'nuxt-property-decorator';

import { Event } from '~/types/models/event';
import { QuestionType } from '~/types/models/question';
import { Session } from '~/types/models/session';

@Component
export class ResultsMixin extends Vue {
  calculateSubmissionImplicitMood(session: Session) {
    let total = 0;
    let count = 0;

    for (const response of session.responses || []) {
      if (!response.sentiment || !response.sentiment.sentiment) {
        continue;
      }

      const score = response.sentiment.sentiment.score;

      total += score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2;
      count++;
    }

    return Math.round((total / count) * 100);
  }

  calculateSubmissionUrgency(session: Session) {
    let total = 0;
    let count = 0;

    for (const response of session.responses || []) {
      if (!response.sentiment || !response.sentiment.urgency) {
        continue;
      }

      total += response.sentiment.urgency;
      count++;
    }

    return Math.round((total / count) * 100);
  }

  submissionsProcessing(event: Event) {
    // A submission is processing if one or more free text responses do not have a sentiment score
    return event.sessions.filter((session) =>
      session?.responses?.some((response) => {
        const question = event.questions.find((question) => question.id === response.question_id);

        if (!question) {
          return true;
        }

        if (question.type === QuestionType.MULTIPLE_CHOICE) {
          return false;
        }

        return !response.sentiment;
      }),
    );
  }

  submissionsProcessed(event: Event) {
    // A submission is processed if all free text responses have a sentiment score
    return event.sessions.filter(
      (session) =>
        !session?.responses?.some((response) => {
          const question = event.questions.find((question) => question.id === response.question_id);

          if (!question) {
            return true;
          }

          if (question.type === QuestionType.MULTIPLE_CHOICE) {
            return false;
          }

          return !response.sentiment;
        }),
    );
  }

  popularKeywords(submissions: Session[]) {
    let totalResponses = 0;
    const wordMap: Map<String, Number> = new Map();

    for (const submission of submissions) {
      for (const response of submission.responses || []) {
        if (!response.sentiment || !response.sentiment.frequent_words) {
          continue;
        }

        Object.entries(response.sentiment.frequent_words).forEach(([word, count]) => {
          wordMap.set(word.toLowerCase(), (wordMap.get(word)?.valueOf() || 0) + count);
          totalResponses++;
        });
      }
    }

    const words: any[] = [];

    for (const [word, occurrences] of wordMap.entries()) {
      words.push({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        occurrences,
        frequency: Math.round((occurrences.valueOf() / totalResponses) * 100),
      });
    }

    return words.sort((a, b) => b.occurrences - a.occurrences).slice(0, 5);
  }

  popularWordPairs(submissions: Session[]) {
    let totalResponses = 0;
    const pairMap: Map<String, Number> = new Map();

    for (const submission of submissions) {
      for (const response of submission.responses || []) {
        if (!response.sentiment || !response.sentiment.frequent_words) {
          continue;
        }

        response.sentiment?.word_pairs.forEach((pair) => {
          pairMap.set(pair.toLowerCase(), (pairMap.get(pair)?.valueOf() || 0) + 1);
          totalResponses++;
        });
      }
    }

    const pairs: any[] = [];

    for (const [pair, occurrences] of pairMap.entries()) {
      pairs.push({
        word: pair.charAt(0).toUpperCase() + pair.slice(1),
        occurrences,
        frequency: Math.round((occurrences.valueOf() / totalResponses) * 100),
      });
    }

    return pairs.sort((a, b) => b.occurrences - a.occurrences).slice(0, 5);
  }

  popularPersons(submissions: Session[]) {
    const occurencesMap: Map<String, Number> = new Map();
    const responseCountMap: Map<String, Number> = new Map();

    const totalExplicitSentiment: Map<String, Number> = new Map();
    const totalImplicitSentimentMap: Map<String, Number> = new Map();

    for (const submission of submissions) {
      const personsCounted: Set<string> = new Set();

      for (const response of submission.responses || []) {
        if (!response.sentiment || !response.sentiment.entities) {
          continue;
        }

        response.sentiment.entities.forEach((person) => {
          const score = response.sentiment?.sentiment.score || 0;
          const scaledScore = score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2;

          // Count the implicit sentiment for the entity
          responseCountMap.set(person, (responseCountMap.get(person)?.valueOf() || 0) + 1);
          totalImplicitSentimentMap.set(
            person,
            (totalImplicitSentimentMap.get(person)?.valueOf() || 0) + scaledScore,
          );

          // Only count a person once per submission
          if (!personsCounted.has(person)) {
            personsCounted.add(person);
            occurencesMap.set(person, (occurencesMap.get(person)?.valueOf() || 0) + 1);
          }

          personsCounted.add(person);
        });
      }

      // Count the explicit sentiment for the entity
      for (const person of personsCounted.values()) {
        totalExplicitSentiment.set(
          person,
          (totalExplicitSentiment.get(person)?.valueOf() || 0) + (submission?.mood || 0),
        );
      }
    }

    const persons: any[] = [];

    for (const [person, occurrences] of occurencesMap.entries()) {
      persons.push({
        person,
        occurrences,
        frequency: Math.round((occurrences.valueOf() / submissions.length) * 100),

        explicitSentiment: Math.round(
          (totalExplicitSentiment.get(person)?.valueOf() || 0) / occurrences.valueOf(),
        ),
        implicitSentiment: Math.round(
          ((totalImplicitSentimentMap.get(person)?.valueOf() || 0) /
            (responseCountMap.get(person)?.valueOf() || 0)) *
            100,
        ),
      });
    }

    return persons.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  }

  popularSubjects(submissions: Session[]) {
    const occurencesMap: Map<String, Number> = new Map();
    const responseCountMap: Map<String, Number> = new Map();

    const totalExplicitSentiment: Map<String, Number> = new Map();
    const totalImplicitSentimentMap: Map<String, Number> = new Map();

    for (const submission of submissions) {
      const subjectsCounted: Set<string> = new Set();

      for (const response of submission.responses || []) {
        if (!response.sentiment || !response.sentiment.entities) {
          continue;
        }

        for (const [subject, count] of Object.entries(response.sentiment.subjects)) {
          const score = response.sentiment?.sentiment.score || 0;
          const scaledScore = score > 0 ? 0.5 + score / 2 : (1 - Math.abs(score)) / 2;

          // Count the implicit sentiment for the entity
          responseCountMap.set(subject, (responseCountMap.get(subject)?.valueOf() || 0) + 1);
          totalImplicitSentimentMap.set(
            subject,
            (totalImplicitSentimentMap.get(subject)?.valueOf() || 0) + scaledScore,
          );

          // Only count a person once per submission
          if (!subjectsCounted.has(subject)) {
            subjectsCounted.add(subject);
            occurencesMap.set(subject, (occurencesMap.get(subject)?.valueOf() || 0) + count);
          }

          subjectsCounted.add(subject);
        }
      }

      // Count the explicit sentiment for the entity
      for (const subject of subjectsCounted.values()) {
        totalExplicitSentiment.set(
          subject,
          (totalExplicitSentiment.get(subject)?.valueOf() || 0) + (submission?.mood || 0),
        );
      }
    }

    const subjects: any[] = [];

    for (const [subject, occurrences] of occurencesMap.entries()) {
      subjects.push({
        subject,
        occurrences,
        frequency: Math.round((occurrences.valueOf() / submissions.length) * 100),

        explicitSentiment: Math.round(
          (totalExplicitSentiment.get(subject)?.valueOf() || 0) / occurrences.valueOf(),
        ),
        implicitSentiment: Math.round(
          ((totalImplicitSentimentMap.get(subject)?.valueOf() || 0) /
            (responseCountMap.get(subject)?.valueOf() || 0)) *
            100,
        ),
      });
    }

    return subjects.sort((a, b) => b.occurrences - a.occurrences).slice(0, 5);
  }

  scaleResponses(data: any[]) {
    const scaledPairs: any[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        scaledPairs.push(data[i]);
      } else {
        const lastY = data[i - 1].y;

        scaledPairs.push({ x: data[i].x, y: lastY * 0.5 + data[i].y * (1 - 0.5) });
      }
    }

    return scaledPairs;
  }
}
