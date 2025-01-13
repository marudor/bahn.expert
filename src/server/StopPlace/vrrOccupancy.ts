import { axiosUpstreamInterceptor } from '@/server/admin';
import { CacheDatabase, getCache } from '@/server/cache';
import { AuslastungsValue } from '@/types/routing';
import type {
	TrainOccupancy,
	TrainOccupancyList,
	VRRTrainOccupancy,
	VRRTrainOccupancyValues,
} from '@/types/stopPlace';
import axios from 'axios';

const occupancyAxios = axios.create();
axiosUpstreamInterceptor(occupancyAxios, 'vrrf-occupancy');

const vrrOccupancyCache = getCache(CacheDatabase.VRROccupancy);

function mapVrrOccupancy(
	vrrOccupancy: VRRTrainOccupancyValues,
): AuslastungsValue {
	switch (vrrOccupancy) {
		case 1: {
			return AuslastungsValue.Gering;
		}
		case 2: {
			return AuslastungsValue.Hoch;
		}
		case 3: {
			return AuslastungsValue.SehrHoch;
		}
	}
}

export async function vrrOccupancy(evaNumber: string, trainNumber: string) {
	if (await vrrOccupancyCache.exists(evaNumber)) {
		return (await vrrOccupancyCache.get(evaNumber))?.[trainNumber];
	}

	try {
		const vrrResultForEva = (
			await occupancyAxios.get<TrainOccupancy<VRRTrainOccupancy>>(
				`https://vrrf.finalrewind.org/_eva/occupancy-by-eva/${evaNumber}.json`,
			)
		).data;
		const normalizedResult: TrainOccupancyList = {};
		for (const [trainNumber, vrrOccupancy] of Object.entries(
			vrrResultForEva.train,
		)) {
			normalizedResult[trainNumber] = vrrOccupancy?.occupancy
				? {
						first: mapVrrOccupancy(vrrOccupancy.occupancy),
						second: mapVrrOccupancy(vrrOccupancy.occupancy),
					}
				: null;
		}
		await vrrOccupancyCache.set(evaNumber, normalizedResult);
	} catch {
		await vrrOccupancyCache.set(evaNumber, null);
	}
}
