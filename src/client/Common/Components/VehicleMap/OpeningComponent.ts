import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawMultiLineString } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import type {
	OpeningFeature,
	VehicleLayoutFeatureCollectionFeaturesInner,
} from '@/external/generated/risMaps';

export class OpeningComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('OPENING')) {
			throw new Error('Given Feature is not a Opening Feature!');
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		this.rotate(context, rotateDegrees);
		const feature = this.risMapsFeature as OpeningFeature;

		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(feature, deck),
			context,
		);

		if (feature.properties.type === 'DOOR') {
			drawMultiLineString(
				context,
				this.risMapsFeature.geometry as unknown as GeoJSON.MultiLineString,
				this.normalisationFactor,
				'#3C414B',
				'#3C414B',
				6,
			);
		}

		context.restore();
	}
}
