import { differenceInSeconds, formatISO, parseISO } from 'date-fns';
import Axios from 'axios';
import type { HimIrisMessage, MatchedIrisMessage, Message } from 'types/iris';

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

export async function getFreitexte(
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

const forbiddenWords = new Set(['krank', 'personal']);

export function matchFreitexte(
  freitexte: FreitextResponse,
  messages: Message[],
): (MatchedIrisMessage | HimIrisMessage)[] {
  const internalFreitexte = freitexte.liveText
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
    if (m.value !== 98 || !m.timestamp) {
      return m;
    }
    const relevantInternalMessage = internalFreitexte.find((f) => {
      const createdAt = parseISO(f.createdAt);
      const diff = differenceInSeconds(createdAt, m.timestamp!);
      // Alles innerhalb von 45 Sekunden zählt als eine Message
      if (Math.abs(diff) < 45) {
        return f;
      }
    });
    if (relevantInternalMessage) {
      return {
        ...m,
        message: relevantInternalMessage.text,
      };
    }
    return m;
  });
}
