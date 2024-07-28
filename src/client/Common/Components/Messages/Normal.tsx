import type { Abfahrt, Message } from '@/types/iris';
import { styled } from '@mui/material';
import { useMemo } from 'react';
import type { FC } from 'react';

export const MessageContainer = styled('div')(({ theme }) => ({
	color: theme.vars.palette.common.red,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
}));

interface Props {
	messages: Message[];
	abfahrt: Abfahrt;
}
export const NormalMessages: FC<Props> = ({ messages }) => {
	const messagesDisplay = useMemo(
		() => messages.map((m) => ('head' in m ? m.head : m.text)).join(' +++ '),
		[messages],
	);

	return <MessageContainer>{messagesDisplay}</MessageContainer>;
};
