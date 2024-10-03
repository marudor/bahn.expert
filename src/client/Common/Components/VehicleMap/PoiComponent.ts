import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawTextInBbox } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import type {
	VehicleLayoutFeatureCollectionFeaturesInner,
	VehiclePoiFeature,
} from '@/external/generated/risMaps';

export class PoiComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('POI')) {
			throw new Error('Given Feature is not a POI Feature!');
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		const feature = this.risMapsFeature as VehiclePoiFeature;
		this.rotate(context, rotateDegrees);
		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(feature, deck),
			context,
		);

		let content = '';
		switch (feature.properties.poiName) {
			case 'Gepäckregal': {
				content = '🛄';
				break;
			}
			case 'Gepäckschließfach': {
				content = '🛄';
				break;
			}
			case 'Ruhebereich': {
				content = '🤫';
				break;
			}
			case 'Handybereich': {
				content = '📱';
				break;
			}
			case 'WC': {
				content = '🚾';
				break;
			}
			case 'Information': {
				content = 'ℹ️';
				break;
			}
			case 'Bistro': {
				content = '🌭';
				break;
			}
			case 'Rollstuhlgerecht': {
				content = '♿️';
				break;
			}
			case 'Restaurant': {
				content = '🍽️';
				break;
			}
			case 'Küche': {
				content = '🧑‍🍳';
				break;
			}
			case 'Kinderwagenstellplatz': {
				content = '👶🪑';
				break;
			}
			case 'Rollstuhlstellplatz': {
				content = '♿︎';
				break;
			}
			case 'Kleinkindbereich': {
				content = '🍼';
				break;
			}
			case 'WC rollstuhlgerecht':
			case 'Rollstuhlgerechtes WC': {
				content = '🚾♿️';
				break;
			}
			case 'Wickeltisch': {
				content = '🍼🧷';
				break;
			}
			case 'Familienbereich': {
				content = '👨‍👨‍👧‍👦';
				break;
			}
			case 'Führerstand': {
				content = '⚙️';
				break;
			}
			case 'Abfallsystem':
			case 'Abfallbehälter': {
				content = '🚮';
				break;
			}
			case 'Gardrobe':
			case 'Garderobe': {
				// content = "🧥";
				break;
			}
			case 'Caterer': {
				content = '🧑‍🍳';
				break;
			}
			case 'Handyverbot': {
				content = '📵';
				break;
			}
			case 'Fahrgastraummonitor': {
				// Sieht nicht schön aus das zu rendern
				// content = "🖥️";
				break;
			}
			case 'Ausgang': {
				// Sieht nicht schön aus das zu rendern
				// content = "↕️";
				break;
			}
			case 'Treppe': {
				content = '↕️';
				break;
			}
			case 'Mittelpumk':
			case 'Mittelpunkt':
			case 'Tresen':
			case 'Servierwagen':
			case 'Zentroide':
			case 'CouplerFront':
			case 'Fahrradstellplatz': // Handled in its own RenderComponent
			case 'CouplerRear': {
				break;
			}
			default: {
				// ignore
				break;
			}
		}

		if (content) {
			drawTextInBbox(
				context,
				content,
				this.risMapsFeature.bbox,
				'50px DB Sans',
				'black',
				this.normalisationFactor,
				rotateDegrees,
			);
		}

		context.restore();
	}
}
