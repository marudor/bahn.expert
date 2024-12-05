import { Cache, CacheDatabase, disconnectRedis } from '@/server/cache';

const relevantCaches = [
	CacheDatabase.StopPlaceByEva,
	CacheDatabase.StopPlaceIdentifier,
	CacheDatabase.IrisTTSStation,
	CacheDatabase.StopPlaceByRil,
	CacheDatabase.JourneysForVehicle,
];

// async function doStuff() {
// 	for (const relevantCache of relevantCaches) {
// const localCache = new Cache(relevantCache);
// const remoteCache = new Cache(relevantCache, {
// 	host: 'localhost',
// 	port: 6380,
// });

// 		const allEntries = await remoteCache.getAll();
// 		// biome-ignore lint/suspicious/noConsoleLog: script
// 		console.log(
// 			`migrating ${allEntries.length} entries for cache ${relevantCache}`,
// 		);
// 		for (const [key, value] of allEntries) {
// 			await localCache.set(key, value);
// 		}
// 	}

// 	process.exit(0);
// }

async function doStuff() {
	for (const relevantCache of Object.values(CacheDatabase)) {
		if (!Number.isInteger(relevantCache)) {
			continue;
		}
		// @ts-expect-error workaround
		const localCache = new Cache(relevantCache);
		// @ts-expect-error workaround
		const remoteCacheNew = new Cache(relevantCache, {
			host: 'localhost',
			port: 6380,
		});
		// @ts-expect-error workaround
		const remoteCacheOld = new Cache(relevantCache, {
			host: 'localhost',
			port: 6381,
		});
		const allKeys = await remoteCacheOld.keys('*');
		// biome-ignore lint/suspicious/noConsoleLog: script
		console.log(
			// @ts-expect-error workaround
			`migrating ${allKeys.length} entries for cache ${relevantCache}, ${CacheDatabase[relevantCache]}`,
		);
		for (const key of allKeys) {
			if (!(await remoteCacheNew.exists(key))) {
				const value = await remoteCacheOld.getDelete(key);
				void remoteCacheNew.set(key, value);
				void localCache.set(key, value);
			} else {
				void remoteCacheOld.delete(key);
			}
		}
	}
}

doStuff().then(() => {
	disconnectRedis();
});
