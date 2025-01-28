import {
	Configuration,
	ConnectionsApi,
	TransportType,
} from '@/external/generated/risConnections';
import { axiosUpstreamInterceptor } from '@/server/admin';
import axios from 'axios';

const risConnectionsConfiguration = new Configuration({
	basePath: process.env.RIS_CONNECTIONS_URL,
	baseOptions: {
		headers: {
			'DB-Api-Key': process.env.RIS_CONNECTIONS_CLIENT_SECRET,
			'DB-Client-Id': process.env.RIS_CONNECTIONS_CLIENT_ID,
		},
	},
});

const axiosWithTimeout = axios.create({
	timeout: 10000,
});

axiosUpstreamInterceptor(axiosWithTimeout, 'ris-connections');

const connectionsClient = new ConnectionsApi(
	risConnectionsConfiguration,
	undefined,
	axiosWithTimeout,
);

export async function getRisConnections(
	journeyID: string,
	arrivalID: string,
	evaNumber: string,
) {
	const rawConnections = (
		await connectionsClient.connectionsArrival({
			journeyID,
			arrivalID,
			filterTransports: [
				TransportType.HighSpeedTrain,
				TransportType.IntercityTrain,
				TransportType.InterRegionalTrain,
				TransportType.RegionalTrain,
				TransportType.CityTrain,
				TransportType.Ferry,
			],
			includeStationGroup: true,
			onlyPossibleConnections: false,
			timeSlot: 60,
		})
	).data;

	if (rawConnections.connections) {
		for (const connection of rawConnections.connections) {
			if (
				(connection.platformHint === 'SAME_PLATFORM' ||
					connection.platformHint === 'SAME_PHYSICAL_PLATFORM') &&
				evaNumber !== connection.station.evaNumber
			) {
				connection.platformHint = 'DIFFERING_PLATFORM';
			}
			connection.transport.via = connection.transport.via
				.sort((a, b) => a.displayPriority - b.displayPriority)
				.slice(0, 3);
		}
	}

	return rawConnections;
}
