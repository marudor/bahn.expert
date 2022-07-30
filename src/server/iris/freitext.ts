import { differenceInSeconds, formatISO, parseISO } from 'date-fns';
import Axios from 'axios';
import type {
  HimIrisMessage,
  IrisMessage,
  MatchedIrisMessage,
  Message,
} from 'types/iris';

export interface FreitextResponse {
  // UUID
  textId: string;
  // UUID
  tripId: string;
  liveText: LiveText[];
}

interface LiveText {
  type: 'Intern' | 'Extern';
  trainNumber: string;
  // ISO Date
  createdAt: string;
  // ISO Date
  deletedAt: string;
  text: string;
  code?: string;
}

const apiUrl = process.env.FREITEXT_API_URL;
const apiKey = process.env.FREITEXT_API_KEY;

const freitextAxios = Axios.create({
  baseURL: apiUrl,
  headers: {
    'x-api-key': apiKey || '',
  },
});

async function getFreitexte(
  initialDepartureDate: Date,
  initialDepartureEvaNumber: string,
  trainNumber: string,
): Promise<FreitextResponse | undefined> {
  try {
    const data = await freitextAxios.get(
      `/${trainNumber}/${formatISO(
        initialDepartureDate,
      )}/${initialDepartureEvaNumber}`,
    );

    return data.data;
  } catch {
    return undefined;
  }
}

const forbiddenWords = new Set([
  'krank',
  ' personal',
  ' kin',
  'kin ',
  'prognose ',
]);
const allowedTextCodes = new Set([39, 70, 71, 82, 85, 93, 95, 98]);

function matchFreitexte(
  freitexte: LiveText[],
  messages: Message[],
): (MatchedIrisMessage | HimIrisMessage)[] {
  const internalFreitexte = freitexte
    .filter((t) => t.type === 'Intern')
    .filter((t) => {
      const lowercaseText = t.text.toLowerCase();
      for (const forbiddenWord of forbiddenWords) {
        if (lowercaseText.includes(forbiddenWord)) {
          return false;
        }
      }
      return true;
    });
  return messages.map((m) => {
    if (!allowedTextCodes.has(m.value!) || !m.timestamp) {
      return m;
    }
    const relevantInternalMessages = internalFreitexte
      .map((f) => {
        const createdAt = parseISO(f.createdAt);
        const diff = Math.abs(differenceInSeconds(createdAt, m.timestamp!));
        if (diff < 25) {
          return {
            diff,
            f,
          };
        }
        return undefined;
      })
      .filter(Boolean)
      .sort((a, b) => (a.diff > b.diff ? 1 : -1));

    if (relevantInternalMessages.length) {
      return {
        ...m,
        message: relevantInternalMessages[0].f.text,
      };
    }
    return m;
  });
}

export async function findAndMatchFreitexte(
  initialDepartureDate: Date,
  initialDepartureEvaNumber: string,
  trainNumber: string,
  messages: IrisMessage[],
): Promise<MatchedIrisMessage[] | undefined> {
  const freitexte = await getFreitexte(
    initialDepartureDate,
    initialDepartureEvaNumber,
    trainNumber,
  );
  if (!freitexte?.liveText) {
    return undefined;
  }

  return matchFreitexte(freitexte.liveText, messages);
}
