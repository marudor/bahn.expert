import { RenderComponent } from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawMultiPolygon } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import type { VehicleLayoutFeatureCollectionFeaturesInner } from '@/external/generated/risMaps';

export class VehicleComponent extends RenderComponent {
	outlineColor = 'black';
	fillColor = '#f8f9fa';

	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
		outlineColor: string,
	) {
		if (!risMapsFeature.id.startsWith('VEHICLE')) {
			throw new Error('Given Feature is not a Vehicle Feature!');
		}

		super(risMapsFeature, normalisationFactor, isDoubleDeck);
		this.outlineColor = outlineColor;
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		this.rotate(context, rotateDegrees);

		if (this.isDoubleDeck) {
			context.translate(0, 135);
		}

		drawMultiPolygon(
			context,
			this.risMapsFeature.geometry as unknown as GeoJSON.MultiPolygon,
			this.normalisationFactor,
			this.outlineColor,
			this.fillColor,
			3,
		);

		context.restore();
	}
}
