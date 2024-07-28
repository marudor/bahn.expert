import { Loading } from '@/client/Common/Components/Loading';
import { TrainRunFilter } from '@/client/TrainRuns/Components/TrainRunFilter';
import { TrainRunList } from '@/client/TrainRuns/Components/TrainRunList';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import type { FC } from 'react';

export const TrainRunsMain: FC = () => {
	const { trainRuns, selectedDate } = useTrainRuns();

	return (
		<>
			<TrainRunFilter />
			<Loading check={trainRuns}>
				{(trainRuns) => (
					<TrainRunList trainRuns={trainRuns} selectedDate={selectedDate} />
				)}
			</Loading>
		</>
	);
};
