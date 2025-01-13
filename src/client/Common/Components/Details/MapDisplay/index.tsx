import { Fab, styled } from '@mui/material';
import type { FC } from 'react';
import type { MapStyle } from 'react-map-gl/dist/es5/exports-maplibre';

if (typeof window !== 'undefined') {
	import('maplibre-gl/dist/maplibre-gl.css');
}

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
	return null;

	// const { polyline, showMarkers, toggleShowMarkers } = useDetails();
	// const polylineLocations = useMemo(() => {
	// 	if (!polyline) {
	// 		return undefined;
	// 	}
	// 	if (showMarkers) {
	// 		return polyline.locations;
	// 	}
	// 	return [polyline.locations.at(-1)!, polyline.locations[0]];
	// }, [polyline, showMarkers]);
	// const markers = useMemo(
	// 	() =>
	// 		polylineLocations?.map((location, i) => {
	// 			const popup = new MapLibre.Popup().setText(location.name);
	// 			return (
	// 				<Marker
	// 					key={i}
	// 					longitude={location.coordinates.lng}
	// 					latitude={location.coordinates.lat}
	// 					popup={popup}
	// 				/>
	// 			);
	// 		}),
	// 	[polylineLocations],
	// );
	// if (!polyline) return null;

	// return (
	// 	<Map initialViewState={initialViewState} mapStyle={osmMapStyle}>
	// 		<NavigationControl />
	// 		{polyline && (
	// 			<Source
	// 				type="geojson"
	// 				data={{
	// 					type: 'LineString',
	// 					coordinates: polyline.points,
	// 				}}
	// 			>
	// 				<Layer
	// 					type="line"
	// 					paint={{
	// 						'line-color': 'blue',
	// 						'line-width': 2,
	// 					}}
	// 				/>
	// 			</Source>
	// 		)}
	// 		{markers}
	// 		<MarkerFab size="small" onClick={toggleShowMarkers}>
	// 			{showMarkers ? <LocationOn /> : <LocationOff />}
	// 		</MarkerFab>
	// 	</Map>
	// );
};

export default MapDisplay;
