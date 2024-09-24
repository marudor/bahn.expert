import { Cache, CacheDatabase } from '@/server/cache';

const cachesThatMightBeBroken = [
	// CacheDatabase.StopPlaceSearch,
	// CacheDatabase.StopPlaceSalesSearch,
	// CacheDatabase.StopPlaceByEva,
	// CacheDatabase.StopPlaceByRil,
	CacheDatabase.JourneyFind,
	CacheDatabase.JourneyFindV2,
].map((cacheNumber) => {
	return new Cache(cacheNumber);
});

async function doStuff() {
	for (const cache of cachesThatMightBeBroken) {
		const allEntries = await cache.getAll();
		const relevantEntries = allEntries.filter(
			([, value]) => !value || (Array.isArray(value) && !value.length),
		);
		// biome-ignore lint/suspicious/noConsoleLog: script
		console.log(`clearing ${relevantEntries.length}`);
		for (const [key] of relevantEntries) {
			await cache.delete(key);
		}
	}
}

doStuff().then(() => {
	process.exit(0);
});
