import type { IrisMessage as IrisMessageType } from '@/types/iris';
import { styled } from '@mui/material';
import { format } from 'date-fns';
import type { FC } from 'react';

const Container = styled('div')<{ superseded?: boolean }>({
	variants: [
		{
			props: { superseded: true },
			style: ({ theme }) => theme.mixins.cancelled,
		},
	],
});

interface Props {
	message: IrisMessageType;
	today?: number;
}

export const IrisMessage: FC<Props> = ({
	message,
	today = new Date().getDate(),
}) => {
	const ts = message.timestamp;

	return (
		<Container superseded={message.superseded}>
			{ts && format(ts, ts.getDate() === today ? 'HH:mm' : 'dd.MM HH:mm')}:{' '}
			{message.text}
		</Container>
	);
};
