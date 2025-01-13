import { getDBLageplan } from './DBLageplan';

export async function getLageplan(evaNumber: string): Promise<string | null> {
	const [DBLageplan] = await Promise.all([getDBLageplan(evaNumber)]);

	return DBLageplan || null;
}
