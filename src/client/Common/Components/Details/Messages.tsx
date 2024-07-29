import type { RemL } from '@/types/HAFAS';
import type { FC } from 'react';

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
