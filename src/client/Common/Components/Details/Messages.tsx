import type { FC } from 'react';

interface Props {
	messages?: string[];
}

export const Messages: FC<Props> = ({ messages }) => {
	if (!messages) return null;

	return (
		<>
			{messages.map((m) => (
				<div key={m}>{m}</div>
			))}
		</>
	);
};
