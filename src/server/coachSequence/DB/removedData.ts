import { CacheDatabase, type CacheType, getCache } from '@/server/cache';
import type { CoachSequenceInformation } from '@/types/coachSequence';

const removedDataCache = getCache(CacheDatabase.CoachSequenceRemovedData);
type RemovedData = CacheType<typeof removedDataCache>;

export async function fixRemovedData(
	risTransportsSequence: CoachSequenceInformation,
) {
	if (!risTransportsSequence.journeyId) {
		return;
	}

	const vehicles = risTransportsSequence.sequence.groups.flatMap(
		(g) => g.coaches,
	);
	const needsFix = vehicles.some(
		(v) => v.uic && !v.identificationNumber && v.class !== 4,
	);

	if (needsFix) {
		const removedData = await removedDataCache.get(
			risTransportsSequence.journeyId,
		);
		if (!removedData) {
			return;
		}

		for (const v of vehicles) {
			if (!v.identificationNumber && v.uic) {
				const removedForUic = removedData[v.uic];
				if (removedForUic) {
					v.identificationNumber = removedForUic.identificationNumber;
					v.features = removedForUic.features;
				}
			}
		}
	} else {
		const removedData: RemovedData = {};
		for (const v of vehicles) {
			if (v.uic && v.identificationNumber) {
				removedData[v.uic] = {
					identificationNumber: v.identificationNumber,
					features: v.features,
				};
			}
		}
		void removedDataCache.set(risTransportsSequence.journeyId, removedData);
	}
}
