import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { DetailMessages } from '@/client/Common/Components/Messages/Detail';
import { NormalMessages } from '@/client/Common/Components/Messages/Normal';
import { styled } from '@mui/material';
import { compareDesc } from 'date-fns';
import { useMemo } from 'react';
import type { FC } from 'react';
import { DetailVia } from './Via/Detail';
import { NormalVia } from './Via/Normal';

const Container = styled('div')`
  font-size: 2.1em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Info: FC = () => {
	const { abfahrt, detail } = useAbfahrt();
	const messages = useMemo(() => {
		const messages = [
			...abfahrt.messages.delay,
			...abfahrt.messages.qos,
			...abfahrt.messages.him,
		];

		if (!detail) {
			return messages.filter((m) => !m.superseded);
		}

		return messages.sort((m1, m2) => compareDesc(m1.timestamp!, m2.timestamp!));
	}, [abfahrt.messages, detail]);
	const MessagesComp = detail ? DetailMessages : NormalMessages;
	const ViaComp = detail ? DetailVia : NormalVia;

	const info = messages.length > 0 && (
		<MessagesComp abfahrt={abfahrt} messages={messages} />
	);
	const via = (detail || !info) && <ViaComp stops={abfahrt.route} />;

	if (!info && !via) return null;

	return (
		<Container>
			{info}
			{via}
		</Container>
	);
};
