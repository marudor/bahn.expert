import { getDBLageplan } from './DBLageplan';
import { getNAHSHLageplan } from './NAHSHLageplan';

export async function getLageplan(evaNumber: string): Promise<string | null> {
	const [DBLageplan, NahSHLageplan] = await Promise.all([
		getDBLageplan(evaNumber),
		getNAHSHLageplan(evaNumber),
	]);

	return DBLageplan || NahSHLageplan || null;
}
