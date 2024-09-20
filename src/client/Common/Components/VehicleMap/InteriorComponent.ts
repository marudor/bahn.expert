import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawMultiPolygon } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import { getInteriorStyle } from '@/client/Common/Components/VehicleMap/helpers/VehicleColors';
import type {
	InteriorFeature,
	VehicleLayoutFeatureCollectionFeaturesInner,
} from '@/external/generated/risMaps';

export class InteriorComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('INTERIOR')) {
			throw new Error('Given Feature is not a Interior Feature!');
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		const feature = this.risMapsFeature as InteriorFeature;

		this.rotate(context, rotateDegrees);
		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(feature, deck),
			context,
		);

		const style = getInteriorStyle(feature.properties);
		drawMultiPolygon(
			context,
			feature.geometry as unknown as GeoJSON.MultiPolygon,
			this.normalisationFactor,
			style.strokeStyle,
			style.fillStyle,
			style.lineWidth,
		);

		context.restore();
	}
}
