import { getGroups } from '@/server/StopPlace/search';
import { axiosDateTransformer } from '@/server/axiosDateTransformer';
import {
	getBRFromGroup,
	planSequenceAxios,
} from '@/server/coachSequence/DB/plannedSequence';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type { AvailableBR, AvailableIdentifier } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';
import type { TrainRun, TrainRunWithBR } from '@/types/trainRuns';

export async function getSingleTrainRun(
	initialDeparture: Date,
	trainNumber: string,
): Promise<TrainRun | undefined> {
	try {
		const runs = (
			await planSequenceAxios.get<TrainRun[]>(
				`/trains/${initialDeparture.toISOString()}/${trainNumber}`,
			)
		).data;
		if (runs?.length) {
			return runs[0];
		}
	} catch {
		// we just ignore this
	}
}

export async function getTrainRunsByDate(
	date: Date,
	baureihen?: AvailableBR[],
	brIdentifier?: AvailableIdentifier[],
	stopsAt?: EvaNumber[],
): Promise<TrainRunWithBR[]> {
	try {
		const trainRuns = (
			await planSequenceAxios.get<TrainRun[]>(`/trains/${date.toISOString()}`, {
				transformResponse: axiosDateTransformer,
			})
		).data;
		let runs = trainRuns.map(calculateRunBR);
		if (stopsAt) {
			const stopsAtWithGroups = await Promise.all(
				stopsAt.map(async (stopAtEva) => {
					const groups = await getGroups(stopAtEva);
					return groups.SALES || [stopAtEva];
				}),
			);
			runs = runs.filter((r) => {
				const depletableStopsAt = [...stopsAtWithGroups];
				let currentEvas = depletableStopsAt.shift();
				for (const via of r.via) {
					if (currentEvas?.some((e) => e === via.evaNumber)) {
						currentEvas = depletableStopsAt.shift();
						if (currentEvas === undefined) {
							return true;
						}
					}
				}
				return false;
			});
		}
		if (brIdentifier?.length) {
			runs = runs.filter((r) =>
				brIdentifier.some((i) => r.br?.identifier === i),
			);
		}
		if (baureihen?.length) {
			runs = runs.filter((r) => baureihen.some((b) => r.br?.baureihe === b));
		}

		return runs;
	} catch {
		return [];
	}
}

function calculateRunBR(run: TrainRun): TrainRunWithBR {
	const { primaryVehicleGroupName, product, ...strippedRun } = run;
	return {
		...strippedRun,
		product: {
			...product,
			line: getLineFromNumber(product.number),
		},
		br: getBRFromGroup({
			name: primaryVehicleGroupName,
			coaches: [],
		}),
	};
}
