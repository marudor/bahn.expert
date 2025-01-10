import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import { getRouteApi } from '@tanstack/react-router';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useMemo } from 'react';
import type { FC } from 'react';

const route = getRouteApi('/trainRuns');

export const Header: FC = () => {
	const { date } = useTrainRuns();
	const { updateTitle } = useHeaderTagsActions();

	const title = useMemo(
		() =>
			`Beta Zugläufe (${format(date, 'eeee, dd.MM.yyyy', {
				locale: de,
			})})`,
		[date],
	);
	// useEffect(() => updateTitle(title), [title, updateTitle]);
	return <BaseHeader>{title}</BaseHeader>;
};
