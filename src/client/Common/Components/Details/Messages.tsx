import type { FC } from 'react';
import type { RemL } from '@/types/HAFAS';

interface Props {
  messages?: RemL[];
}

export const Messages: FC<Props> = ({ messages }) => {
  if (!messages) return null;

  return (
    <>
      {messages.map((m) => (
        <div key={m.code}>{m.txtN}</div>
      ))}
    </>
  );
};
