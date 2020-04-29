import { RemL } from 'types/HAFAS';

interface Props {
  messages?: RemL[];
}

const Messages = ({ messages }: Props) => {
  if (!messages) return null;

  return (
    <>
      {messages.map((m) => (
        <div key={m.code}>{m.txtN}</div>
      ))}
    </>
  );
};

export default Messages;
