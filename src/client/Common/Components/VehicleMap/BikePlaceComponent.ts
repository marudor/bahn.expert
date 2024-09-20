import RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import {
	drawTextInBbox,
	isCoordinatesWithinBbox,
} from '@/client/Common/Components/VehicleMap/helpers/CanvasHelper';
import type {
	VehicleLayoutFeatureCollectionFeaturesInner,
	VehiclePoiFeature,
} from '@/external/generated/risMaps';

export class BikePlaceComponent extends RenderComponent {
	BIKE_PLACE_WIDTH = 25;
	BIKE_PLACE_HEIGHT = 75;
	bbox: number[] = [];

	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		if (
			!risMapsFeature.id.startsWith('POI') ||
			(risMapsFeature as VehiclePoiFeature).properties.poiName !==
				'Fahrradstellplatz'
		) {
			throw new Error(
				'Given Feature is not a POI Feature for Fahrradstellplatz!',
			);
		}
		super(risMapsFeature, normalisationFactor, isDoubleDeck);

		// build our own bbox because we only have a center point given from RIS::Maps
		const bboxPoi = this.risMapsFeature.bbox.map(
			(c) => c * this.normalisationFactor,
		);
		const x1 = bboxPoi[0] - this.BIKE_PLACE_WIDTH / 2;
		const y1 = bboxPoi[1] - this.BIKE_PLACE_HEIGHT / 2;
		const x2 = x1 + this.BIKE_PLACE_WIDTH;
		const y2 = y1 + this.BIKE_PLACE_HEIGHT;
		this.bbox = [x1, y1, x2, y2];
	}

	isDeck = (deck: 'UPPER' | 'LOWER' | 'DEFAULT') =>
		this.isDeckBase(this.risMapsFeature as VehiclePoiFeature, deck);

	onClick(
		x: number,
		y: number,
		canvas: HTMLCanvasElement,
		rotateDegrees: number,
	): VehicleLayoutFeatureCollectionFeaturesInner | null {
		const isInBbox = isCoordinatesWithinBbox(
			this.bbox,
			x,
			y,
			canvas,
			1,
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
			this.bbox,
			x,
			y,
			canvas,
			1,
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
		const feature = this.risMapsFeature as VehiclePoiFeature;
		this.rotate(context, rotateDegrees);
		this.translateIfDoubleDeck(
			(deck) => this.isDeckBase(feature, deck),
			context,
		);
		const poiFeature = this.risMapsFeature as VehiclePoiFeature;
		drawTextInBbox(
			context,
			`🚲 ${poiFeature.properties.equipmentID}`,
			this.bbox,
			'bold 20px Roboto',
			'black',
			1,
			90,
		);
		context.restore();
	}
}
