import { trpc } from '@/client/RPC';
import type {
	AvailableBR,
	AvailableIdentifierOnly,
} from '@/types/coachSequence';
import constate from 'constate';
import { useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

const useInnerTrainRuns = (_p: PropsWithChildren<unknown>) => {
	const [date, setDate] = useState(new Date());
	const [baureihen, setBaureihen] = useState<AvailableBR[]>([]);
	const [identifier, setIdentifier] = useState<AvailableIdentifierOnly[]>([]);

	const { data: trainRuns } = trpc.coachSequences.trainRuns.useQuery(
		{
			date,
			baureihen,
			identifier,
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
		},
	);

	return {
		trainRuns,
		date,
		setDate,
		baureihen,
		setBaureihen,
		identifier,
		setIdentifier,
	};
};

export const [InnerTrainRunProvider, useTrainRuns] =
	constate(useInnerTrainRuns);

export const TrainRunProvider: FC<PropsWithChildren<unknown>> = ({
	children,
}) => {
	return <InnerTrainRunProvider>{children}</InnerTrainRunProvider>;
};
