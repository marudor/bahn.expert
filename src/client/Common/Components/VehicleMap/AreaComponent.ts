import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawMultiPolygon } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import { getAreaStyle } from '@/client/Common/Components/VehicleMap/helpers/VehicleColors';
import type {
	AreaFeature,
	VehicleLayoutFeatureCollectionFeaturesInner,
} from '@/external/generated/risMaps';

export class AreaComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('AREA')) {
			throw new Error('Given Feature is not a Area Feature!');
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		this.rotate(context, rotateDegrees);
		const feature = this.risMapsFeature as AreaFeature;

		const styles = getAreaStyle(feature.properties);

		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(feature, deck),
			context,
		);

		drawMultiPolygon(
			context,
			this.risMapsFeature.geometry as unknown as GeoJSON.MultiPolygon,
			this.normalisationFactor,
			styles.strokeStyle,
			styles.fillStyle,
			styles.lineWidth,
		);

		context.restore();
	}
}
