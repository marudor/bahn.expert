import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import {
	drawMultiPolygon,
	drawTextInBbox,
} from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import type {
	SeatFeature,
	VehicleLayoutFeatureCollectionFeaturesInner,
} from '@/external/generated/risMaps';

export class SeatComponent extends RenderComponent {
	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (!risMapsFeature.id.startsWith('SEAT')) {
			throw new Error('Given Feature is not a Seat Feature!');
		}

		super(risMapsFeature, normalisationFactor, isDoubleDeck);
	}

	isDeck = (deck: 'UPPER' | 'LOWER' | 'DEFAULT') =>
		this.isDeckBase(this.risMapsFeature as SeatFeature, deck);

	render(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.save();
		this.rotate(context, rotateDegrees);

		const properties = (this.risMapsFeature as SeatFeature).properties;

		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(this.risMapsFeature as SeatFeature, deck),
			context,
		);

		drawMultiPolygon(
			context,
			this.risMapsFeature.geometry as unknown as GeoJSON.MultiPolygon,
			this.normalisationFactor,
			'#AFB4BB',
			'#f8f9fa',
			4,
		);

		// Draw seatNumber
		if (properties.number) {
			drawTextInBbox(
				context,
				properties.number,
				this.risMapsFeature.bbox,
				'bold 20px Roboto',
				'black',
				this.normalisationFactor,
				rotateDegrees,
			);
		}

		context.restore();
	}
}
