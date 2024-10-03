import { getCentroid } from '@/client/Common/Components/VehicleMap/helpers/GeometryHelpers';
import type {
	AreaFeature,
	InteriorFeature,
	OpeningFeature,
	SeatFeature,
	VehicleLayoutFeatureCollectionFeaturesInner,
	VehiclePoiFeature,
	ZoneFeature,
} from '@/external/generated/risMaps';

export abstract class RenderComponent {
	risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner;
	normalisationFactor: number;
	isDoubleDeck: boolean;

	constructor(
		risMapsFeature: VehicleLayoutFeatureCollectionFeaturesInner,
		normalisationFactor: number,
		isDoubleDeck: boolean,
	) {
		this.risMapsFeature = risMapsFeature;
		this.normalisationFactor = normalisationFactor;
		this.isDoubleDeck = isDoubleDeck;
	}

	calculateCentroid() {
		if (!this.risMapsFeature.geometry) {
			return;
		}
		const coords = this.risMapsFeature.geometry
			.coordinates[0][0] as unknown as number[][];
		const pts = coords.map((c) => ({
			x: c[0] * this.normalisationFactor,
			y: c[1] * this.normalisationFactor,
		}));
		return getCentroid(pts);
	}

	rotate(context: CanvasRenderingContext2D, rotateDegrees: number) {
		context.rotate((rotateDegrees * Math.PI) / 180);
		context.scale(1, -1);
	}

	isDeckBase(
		feature:
			| AreaFeature
			| SeatFeature
			| VehiclePoiFeature
			| InteriorFeature
			| ZoneFeature
			| OpeningFeature,
		deck: 'UPPER' | 'LOWER' | 'DEFAULT',
	) {
		feature.properties.level;
		return feature.properties.level.includes(deck);
	}

	translateIfDoubleDeck(
		isDeck: (deck: 'UPPER' | 'LOWER' | 'DEFAULT') => boolean,
		context: CanvasRenderingContext2D,
	) {
		if (!this.isDoubleDeck) return;
		if (isDeck('UPPER')) {
			context.translate(0, -135);
		} else if (isDeck('LOWER')) {
			context.translate(0, 135);
		} else if (isDeck('DEFAULT')) {
			context.translate(0, 135);
		}
	}

	/**
	 * Returns the RenderComponents RIS::Maps VehicleFeature Component if the component was clicked
	 * @param _x Mouse X Position as a canvas-relative screen position
	 * @param _y Mouse Y Position as a canvas-relative screen position
	 * @param _canvas reference to the HTML canvas
	 * @param _rotateDegrees rotation of the render component
	 * @returns the RIS::Maps VehicleFeature component if it was clicked, null otherwise
	 */
	onClick(
		_x: number,
		_y: number,
		_canvas: HTMLCanvasElement,
		_rotateDegrees: number,
	): VehicleLayoutFeatureCollectionFeaturesInner | null {
		return null;
	}

	/**
	 * Returns the RenderComponents RIS::Maps VehicleFeature Component if mouse is within this component
	 * @param _x Mouse X Position as a canvas-relative screen position
	 * @param _y Mouse Y Position as a canvas-relative screen position
	 * @param _canvas reference to the HTML canvas
	 * @param _rotateDegrees rotation of the render component
	 * @returns the RIS::Maps VehicleFeature component the mouse is within this component, null otherwise
	 */
	onMouseMove(
		_x: number,
		_y: number,
		_canvas: HTMLCanvasElement,
		_rotateDegrees: number,
	): VehicleLayoutFeatureCollectionFeaturesInner | null {
		return null;
	}

	abstract render(
		context: CanvasRenderingContext2D,
		rotateDegrees: number,
	): void;
}

export default RenderComponent;
