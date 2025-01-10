import { Loading } from '@/client/Common/Components/Loading';
import { TrainRunFilter } from '@/client/TrainRuns/Components/TrainRunFilter';
import { TrainRunList } from '@/client/TrainRuns/Components/TrainRunList';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import type { FC } from 'react';

export const TrainRuns: FC = () => {
	const { trainRuns, date } = useTrainRuns();

	return (
		<>
			<TrainRunFilter />
			<Loading check={trainRuns}>
				{(trainRuns) => (
					<TrainRunList trainRuns={trainRuns} selectedDate={date} />
				)}
			</Loading>
		</>
	);
};
