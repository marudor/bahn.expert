import { compareDesc, formatISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { Abfahrt, Message } from 'types/iris';

export function useMatchedMessages(
  messages: Message[],
  abfahrt?: Abfahrt,
): Message[] {
  const [stateMessages, setStateMessages] = useState(messages);

  useEffect(() => {
    if (!abfahrt?.initialStopPlace) {
      return;
    }
    async function fetchMatchedMessages() {
      try {
        const matched = (
          await axios.post(
            `/api/iris/v2/freitext/${abfahrt!.train.number}/${formatISO(
              abfahrt!.initialDeparture,
            )}/${abfahrt!.initialStopPlace}`,
            messages,
          )
        ).data;
        if (matched) {
          setStateMessages(matched);
        }
      } catch {
        // ignore
      }
    }
    void fetchMatchedMessages();
  }, [messages, abfahrt]);

  return useMemo(() => {
    return stateMessages.sort((a, b) =>
      compareDesc(a.timestamp || 0, b.timestamp || 0),
    );
  }, [stateMessages]);
}
