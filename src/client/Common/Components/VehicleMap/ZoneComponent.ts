import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { drawMultiPolygon } from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import { getZoneStyle } from '@/client/Common/Components/VehicleMap/helpers/VehicleColors';
import type {
	VehicleLayoutFeatureCollectionFeaturesInner,
	ZoneFeature,
} from '@/external/generated/risMaps';

export class ZoneComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('ZONE')) {
			throw new Error('Given Feature is not a Interior Feature!');
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		this.rotate(context, rotateDegrees);
		const properties = this.risMapsFeature.properties as unknown as {
			zone: string;
			space: string;
		};

		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(this.risMapsFeature as ZoneFeature, deck),
			context,
		);

		const style = getZoneStyle(properties);
		drawMultiPolygon(
			context,
			this.risMapsFeature.geometry as unknown as GeoJSON.MultiPolygon,
			this.normalisationFactor,
			style.strokeStyle,
			style.fillStyle,
			style.lineWidth,
		);

		context.restore();
	}
}
