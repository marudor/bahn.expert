import { trpc } from '@/client/RPC';
import type {
	AvailableBR,
	AvailableIdentifierOnly,
} from '@/types/coachSequence';
import type { TrainRunWithBR } from '@/types/trainRuns';
import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

const useInnerTrainRuns = (_p: PropsWithChildren<unknown>) => {
	const [trainRuns, setTrainRuns] = useState<TrainRunWithBR[]>();
	const [date, setDate] = useState(new Date());
	const [baureihen, setBaureihen] = useState<AvailableBR[]>([]);
	const [identifier, setIdentifier] = useState<AvailableIdentifierOnly[]>([]);
	const trpcUtils = trpc.useUtils();

	const fetchTrainRuns = useCallback(async () => {
		setTrainRuns(undefined);
		const trainRuns = await trpcUtils.coachSequence.trainRuns.fetch({
			date,
			baureihen,
			identifier,
		});
		setTrainRuns(trainRuns);
	}, [date, baureihen, identifier, trpcUtils]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTrainRuns();
	}, []);

	return {
		trainRuns,
		fetchTrainRuns,
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
