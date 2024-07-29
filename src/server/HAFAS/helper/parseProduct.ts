import { TransportType } from '@/external/types';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type { Common, ParsedProduct, ProdL } from '@/types/HAFAS';

function mapTransportType(catCode?: string, catIn?: string): TransportType {
	// SEV is categorized wrong
	if (catIn === 'BSV' || catIn === 'Bsv') {
		return TransportType.Bus;
	}
	// Flights are categorized wrong (There is no HAFAS flight catCode)
	if (catIn === 'AIR') {
		return TransportType.Flight;
	}
	switch (catCode) {
		case '0': {
			return TransportType.HighSpeedTrain;
		}
		case '1': {
			return TransportType.IntercityTrain;
		}
		case '2': {
			return TransportType.InterRegionalTrain;
		}
		case '3': {
			return TransportType.RegionalTrain;
		}
		case '4': {
			return TransportType.CityTrain;
		}
		case '5': {
			return TransportType.Bus;
		}
		case '6': {
			return TransportType.Ferry;
		}
		case '7': {
			return TransportType.Subway;
		}
		case '8': {
			return TransportType.Tram;
		}
		case '9': {
			return TransportType.Shuttle;
		}
		default: {
			return TransportType.Unknown;
		}
	}
}

export default (product: ProdL, common: Common): ParsedProduct => {
	const operator =
		product.oprX === undefined ? undefined : common.opL[product.oprX];
	const number = product.prodCtx?.num ?? product.number;

	return {
		name: product.addName || product.name,
		line:
			product.prodCtx?.line ||
			product.prodCtx?.lineId ||
			product.prodCtx?.matchId ||
			product.matchId ||
			product.nameS ||
			getLineFromNumber(number),
		admin: product.prodCtx?.admin?.replaceAll('_', ''),
		number,
		type:
			product.prodCtx && (product.prodCtx.catOut || product.prodCtx.catOutL),
		transportType: mapTransportType(product.prodCtx?.catCode),
		operator,
	};
};
