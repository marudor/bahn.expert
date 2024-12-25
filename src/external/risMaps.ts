import {
	Configuration,
	type VehicleLayoutFeatureCollection,
	VehicleLayoutsApi,
} from '@/external/generated/risMaps';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import axios, { isAxiosError } from 'axios';

const risConnectionsConfiguration = new Configuration({
	basePath: process.env.RIS_MAPS_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.RIS_MAPS_CLIENT_SECRET,
			'DB-Client-Id': process.env.RIS_MAPS_CLIENT_ID,
		},
	},
});

const axiosWithTimeout = axios.create({
	timeout: 10000,
});

axiosUpstreamInterceptor(axiosWithTimeout, 'ris-maps');

const mapsClient = new VehicleLayoutsApi(
	risConnectionsConfiguration,
	undefined,
	axiosWithTimeout,
);

const cache = new Cache<VehicleLayoutFeatureCollection | null>(
	CacheDatabase.VehicleLayoutsMaps,
);

export async function getVehicleLayout(vehicleId: string) {
	if (await cache.exists(vehicleId)) {
		return await cache.get(vehicleId);
	}
	try {
		const geoJson = (await mapsClient.byVehicleID({ vehicleID: vehicleId }))
			.data;

		cache.set(vehicleId, geoJson);

		return geoJson;
	} catch (e) {
		if (isAxiosError(e) && e.status === 404) {
			void cache.set(vehicleId, null);
		}
		return null;
	}
}
