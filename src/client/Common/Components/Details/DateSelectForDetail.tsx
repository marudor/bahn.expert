import { useDetails } from '@/client/Common/provider/DetailsProvider';
import { styled } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { differenceInDays, format } from 'date-fns';
import { type FC, useCallback, useState } from 'react';

const Container = styled('div')`
	cursor: pointer;
`;

interface Props {
	date: Date;
}

export const DateSelectForDetail: FC<Props> = ({ date }) => {
	const { sameTrainDaysInFuture } = useDetails();
	const [open, setOpen] = useState(false);
	const setDate = useCallback(
		(e: Date | null) => {
			if (!e) {
				return;
			}
			const difference = differenceInDays(e, date);
			sameTrainDaysInFuture(difference);
		},
		[sameTrainDaysInFuture, date],
	);

	return (
		<MobileDatePicker
			open={open}
			closeOnSelect
			onClose={() => setOpen(false)}
			slotProps={{
				actionBar: {
					actions: ['today', 'cancel', 'accept'],
				},
			}}
			slots={{
				textField: () => (
					<Container onClick={() => setOpen(true)}>
						{format(date, 'dd.MM.yyyy')}
					</Container>
				),
			}}
			label="Datum"
			value={date}
			onChange={setDate}
		/>
	);
};
