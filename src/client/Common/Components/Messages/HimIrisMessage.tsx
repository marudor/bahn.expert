import type { HimIrisMessage as HimIrisMessageType } from '@/types/iris';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	styled,
} from '@mui/material';
import { format, formatDate, getDate } from 'date-fns';
import { useCallback, useState } from 'react';
import type { FC, SyntheticEvent } from 'react';

const Container = styled('div')<{ superseded?: boolean }>(
	{
		textDecoration: 'underline',
		cursor: 'pointer',
	},
	{
		variants: [
			{
				props: { superseded: true },
				style: ({ theme }) => theme.mixins.cancelled,
			},
		],
	},
);

const SmallSpan = styled('span')`
  font-size: 75%;
`;

interface ValidToProps {
	endTime?: Date;
}

const ValidTo: FC<ValidToProps> = ({ endTime }) => {
	if (!endTime) {
		return null;
	}

	return (
		<SmallSpan>Gültig bis: {formatDate(endTime, 'dd.MM.yyyy HH:mm')}</SmallSpan>
	);
};

interface Props {
	message: HimIrisMessageType;
	today?: number;
	withStopPlaceInfo?: boolean;
}

export const HimIrisMessage: FC<Props> = ({
	message,
	today = new Date().getDate(),
	withStopPlaceInfo,
}) => {
	const [open, setOpen] = useState(false);
	const toggleOpen = useCallback((e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setOpen((old) => !old);
	}, []);
	const formattedDate =
		message.timestamp &&
		!message.endTime &&
		format(
			message.timestamp,
			getDate(message.timestamp) === today ? 'HH:mm' : 'dd.MM HH:mm',
		);

	const headerMessage = message.head;

	const dateWithText = formattedDate
		? `${formattedDate}: ${headerMessage}`
		: headerMessage;

	let text = dateWithText;
	if (message.stopPlaceInfo && withStopPlaceInfo) {
		text += ` (${message.stopPlaceInfo})`;
	}

	return (
		<Container superseded={message.superseded}>
			<span onClick={toggleOpen}>{text}</span>
			<Dialog open={open} onClose={toggleOpen}>
				<Stack component={DialogTitle}>
					<span>{dateWithText}</span>
					<ValidTo endTime={message.endTime} />
					<SmallSpan>{message.stopPlaceInfo}</SmallSpan>
				</Stack>
				<DialogContent
					dangerouslySetInnerHTML={{
						__html: message.text,
					}}
				/>
				{message.source && (
					<DialogActions>Quelle: {message.source}</DialogActions>
				)}
			</Dialog>
		</Container>
	);
};
