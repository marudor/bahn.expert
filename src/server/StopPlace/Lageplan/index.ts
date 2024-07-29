import { getDBLageplan } from './DBLageplan';
import { getNAHSHLageplan } from './NAHSHLageplan';

export async function getLageplan(
	_stationName: string,
	evaNumber: string,
): Promise<string | undefined> {
	const [DBLageplan, NahSHLageplan] = await Promise.all([
		getDBLageplan(evaNumber),
		getNAHSHLageplan(evaNumber),
	]);

	return DBLageplan || NahSHLageplan;
}
