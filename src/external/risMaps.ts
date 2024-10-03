import {
	Configuration,
	type VehicleLayoutFeatureCollection,
	VehicleLayoutsApi,
} from '@/external/generated/risMaps';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { Cache, CacheDatabase } from '@/server/cache';
import axios from 'axios';

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

const cache = new Cache<VehicleLayoutFeatureCollection>(
	CacheDatabase.VehicleLayoutsMaps,
);

export async function getVehicleLayout(vehicleId: string) {
	if (await cache.exists(vehicleId)) {
		const r = await cache.get(vehicleId);
		return r;
	}
	try {
		const geoJson = (await mapsClient.byVehicleID({ vehicleID: vehicleId }))
			.data;

		cache.set(vehicleId, geoJson);

		return geoJson;
	} catch {
		return null;
	}
}
