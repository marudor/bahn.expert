import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import {
	drawMultiPolygon,
	drawTextInBbox,
	isCoordinatesWithinBbox,
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

	onClick(
		x: number,
		y: number,
		canvas: HTMLCanvasElement,
		rotateDegrees: number,
	): VehicleLayoutFeatureCollectionFeaturesInner | null {
		const isInBbox = isCoordinatesWithinBbox(
			this.risMapsFeature.bbox,
			x,
			y,
			canvas,
			this.normalisationFactor,
			rotateDegrees,
			this.isDoubleDeck,
			this.isDeck,
		);
		if (isInBbox) {
			return this.risMapsFeature;
		}
		return null;
	}

	onMouseMove(
		x: number,
		y: number,
		canvas: HTMLCanvasElement,
		rotateDegrees: number,
	): VehicleLayoutFeatureCollectionFeaturesInner | null {
		const isInBbox = isCoordinatesWithinBbox(
			this.risMapsFeature.bbox,
			x,
			y,
			canvas,
			this.normalisationFactor,
			rotateDegrees,
			this.isDoubleDeck,
			this.isDeck,
		);
		if (isInBbox) {
			return this.risMapsFeature;
		}
		return null;
	}

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
				-rotateDegrees,
			);
		}

		context.restore();
	}
}
