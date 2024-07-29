import type { GroupedStopPlace } from '@/types/stopPlace';
import Axios from 'axios';
import { useEffect, useState } from 'react';

export const useStopPlace = (
	evaNumber: string,
	skip?: boolean,
): GroupedStopPlace | undefined => {
	const [stopPlace, setStopPlace] = useState<GroupedStopPlace>();
	useEffect(() => {
		if (!skip) {
			void Axios.get<GroupedStopPlace>(`/api/stopplace/v1/${evaNumber}`).then(
				(result) => setStopPlace(result.data),
			);
		}
	}, [evaNumber, skip]);

	return stopPlace;
};
