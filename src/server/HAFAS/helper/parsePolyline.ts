import { decode } from 'google-polyline';
import type { HafasStation, ParsedPolyline, PolyL } from '@/types/HAFAS';

export default (polyline: PolyL, locL: HafasStation[]): ParsedPolyline => {
  return {
    points: decode(polyline.crdEncYX),
    delta: polyline.delta,
    locations: polyline.ppLocRefL.map((l) => locL[l.locX]),
  };
};
