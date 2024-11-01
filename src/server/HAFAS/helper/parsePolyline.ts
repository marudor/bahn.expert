import type { HafasStation, ParsedPolyline, PolyL } from '@/types/HAFAS';
import { decode } from 'google-polyline';

export default (polyline: PolyL, locL: HafasStation[]): ParsedPolyline => {
	return {
		points: decode(polyline.crdEncYX)?.map((x) => [x[1], x[0]]),
		delta: polyline.delta,
		locations: polyline.ppLocRefL.map((l) => locL[l.locX]),
	};
};
