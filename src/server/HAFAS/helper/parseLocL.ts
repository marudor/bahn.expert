import type { Crd, HafasStation, LocL, ParsedProduct } from '@/types/HAFAS';

export function parseCoordinates(crd: Crd): {
  lng: number;
  lat: number;
} {
  return {
    lng: crd.x / 1000000,
    lat: crd.y / 1000000,
  };
}

export default (locL: LocL, products: ParsedProduct[]): HafasStation => ({
  evaNumber: locL.extId,
  name: locL.name,
  coordinates: locL.crd && parseCoordinates(locL.crd),
  products: locL.pRefL && locL.pRefL.map((p) => products[p]),
});
