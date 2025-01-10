import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useEffect, useMemo } from 'react';
import type { FC } from 'react';

export const Header: FC = () => {
	const { date } = useTrainRuns();

	const title = useMemo(
		() =>
			`Zugläufe (${format(date, 'eeee, dd.MM.yyyy', {
				locale: de,
			})})`,
		[date],
	);
	useEffect(() => {
		document.title = title;
	}, [title]);
	return <BaseHeader>{title}</BaseHeader>;
};
