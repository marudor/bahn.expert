import { useDetails } from '@/client/Common/provider/DetailsProvider';
import { type FC, useMemo } from 'react';
import Map, {
	Layer,
	type MapStyle,
	Marker,
	NavigationControl,
	Source,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationOff, LocationOn } from '@mui/icons-material';
import { Fab, styled } from '@mui/material';
import { Popup } from 'maplibre-gl';

const MarkerFab = styled(Fab)`
 position: absolute;
  top: 16px;
  left: 16px;
`;

const osmMapStyle = {
	version: 8,
	sources: {
		osm: {
			type: 'raster',
			tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
			tileSize: 256,
			attribution: '&copy; OpenStreetMap Contributors',
			maxzoom: 19,
		},
	},
	layers: [
		{
			id: 'osm',
			type: 'raster',
			source: 'osm',
		},
	],
} satisfies MapStyle;

const initialViewState = {
	longitude: 10.107,
	latitude: 50.878,
	zoom: 6,
};

const MapDisplay: FC = () => {
	const { polyline, showMarkers, toggleShowMarkers } = useDetails();
	const polylineLocations = useMemo(() => {
		if (!polyline) {
			return undefined;
		}
		if (showMarkers) {
			return polyline.locations;
		}
		return [polyline.locations.at(-1)!, polyline.locations[0]];
	}, [polyline, showMarkers]);
	const markers = useMemo(
		() =>
			polylineLocations?.map((location, i) => {
				const popup = new Popup().setText(location.name);
				return (
					<Marker
						key={i}
						longitude={location.coordinates.lng}
						latitude={location.coordinates.lat}
						popup={popup}
					/>
				);
			}),
		[polylineLocations],
	);
	if (!polyline) return null;

	return (
		<Map initialViewState={initialViewState} mapStyle={osmMapStyle}>
			<NavigationControl />
			{polyline && (
				<Source
					type="geojson"
					data={{
						type: 'LineString',
						coordinates: polyline.points,
					}}
				>
					<Layer
						type="line"
						paint={{
							'line-color': 'blue',
							'line-width': 2,
						}}
					/>
				</Source>
			)}
			{markers}
			<MarkerFab size="small" onClick={toggleShowMarkers}>
				{showMarkers ? <LocationOn /> : <LocationOff />}
			</MarkerFab>
		</Map>
	);
};

export default MapDisplay;
