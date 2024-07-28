import type { LageplanResponse } from '@/types/bahnhof';
import Axios from 'axios';
import { useEffect, useState } from 'react';

export const useLageplan = (
	stationName?: string,
	evaNumber?: string,
): string | undefined => {
	const [lageplan, setLageplan] = useState<string>();

	useEffect(() => {
		if (!stationName || !evaNumber) return;
		Axios.get<LageplanResponse>(
			`/api/stopPlace/v1/lageplan/${encodeURIComponent(
				stationName,
			)}/${evaNumber}`,
		)
			.then((r) => setLageplan(r.data.lageplan))
			.catch(() => {});
	}, [stationName, evaNumber]);

	return lageplan;
};
