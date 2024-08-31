import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type {
	TransportDestinationRef,
	TransportOriginRef,
} from '@/external/generated/risJourneysV2';
import { Stack } from '@mui/material';
import type { FC } from 'react';

interface Props {
	continuationFor?: TransportOriginRef[];
	continuationBy?: TransportDestinationRef[];
}

const ContinationBy: FC<{
	continuation?: TransportDestinationRef[];
}> = ({ continuation }) => {
	if (!continuation) {
		return null;
	}
	return (
		<Stack>
			{continuation.map((c) => {
				return (
					<div key={c.journeyID}>
						Durchbindung auf <TransportName transport={c} /> nach{' '}
						{c.destination.name}
					</div>
				);
			})}
		</Stack>
	);
};

const ContinuationFor: FC<{
	continuation?: TransportOriginRef[];
}> = ({ continuation }) => {
	if (!continuation) {
		return null;
	}
	return (
		<Stack>
			{continuation.map((c) => {
				return (
					<div key={c.journeyID}>
						Durchbindung aus <TransportName transport={c} /> von {c.origin.name}
					</div>
				);
			})}
		</Stack>
	);
};

export const Continuation: FC<Props> = ({
	continuationBy,
	continuationFor,
}) => {
	return (
		<Stack>
			<ContinationBy continuation={continuationBy} />
			<ContinuationFor continuation={continuationFor} />
		</Stack>
	);
};
