import type { RemL } from 'types/HAFAS';

interface Props {
  messages?: RemL[];
}

export const Messages = ({ messages }: Props) => {
  if (!messages) return null;

  return (
    <>
      {messages.map((m) => (
        <div key={m.code}>{m.txtN}</div>
      ))}
    </>
  );
};
