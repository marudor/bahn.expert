import { getIdentifiers } from '@/server/StopPlace/search';
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

export const parseLocL = async (
  locL: LocL,
  products: ParsedProduct[],
): Promise<HafasStation> => {
  const identifiers = await getIdentifiers(locL.extId, true);
  return {
    evaNumber: locL.extId,
    name: locL.name,
    coordinates: locL.crd && parseCoordinates(locL.crd),
    products: locL.pRefL?.map((p) => products[p]),
    ril100: identifiers?.ril100,
  };
};
