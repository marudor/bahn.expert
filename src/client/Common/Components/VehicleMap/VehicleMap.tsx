import { AreaComponent } from '@/client/Common/Components/VehicleMap/AreaComponent';
import { BikePlaceComponent } from '@/client/Common/Components/VehicleMap/BikePlaceComponent';
import Canvas from '@/client/Common/Components/VehicleMap/Canvas';
import { InteriorComponent } from '@/client/Common/Components/VehicleMap/InteriorComponent';
import { OpeningComponent } from '@/client/Common/Components/VehicleMap/OpeningComponent';
import { PoiComponent } from '@/client/Common/Components/VehicleMap/PoiComponent';
import type RenderComponent from '@/client/Common/Components/VehicleMap/RenderComponent';
import { SeatComponent } from '@/client/Common/Components/VehicleMap/SeatComponent';
import { VehicleComponent } from '@/client/Common/Components/VehicleMap/VehicleComponent';
import { ZoneComponent } from '@/client/Common/Components/VehicleMap/ZoneComponent';
import {
	bboxHeight,
	bboxWidth,
} from '@/client/Common/Components/VehicleMap/helpers/GeometryHelpers';
import type {
	SeatFeature,
	VehicleFeature,
	VehicleLayoutFeatureCollection,
	VehiclePoiFeature,
} from '@/external/generated/risMaps';
import { useTheme } from '@mui/material';
import { styled, useMediaQuery } from '@mui/system';
import { type FC, useCallback, useMemo } from 'react';

interface Props {
	layout: VehicleLayoutFeatureCollection;
	orientation: string;
}

const NORMALISATION = 10000000;
const SCALING = 1;

function isDoubleDeck(layout?: VehicleLayoutFeatureCollection) {
	if (!layout) return false;
	return layout.features
		.filter((f) => f.id.startsWith('VEHICLE'))
		.map((f) => (f as VehicleFeature).properties.vehicleType.category)
		.some((category) => category.includes('DOUBLEDECK'));
}

function buildVehicleRenderComponents(
	layout: VehicleLayoutFeatureCollection,
	vehicleOutlineColor: string,
) {
	const renderComponents: RenderComponent[] = [];
	const doubleDeck = isDoubleDeck(layout);

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('VEHICLE'),
	)) {
		renderComponents.push(
			new VehicleComponent(
				feature,
				NORMALISATION,
				doubleDeck,
				vehicleOutlineColor,
			),
		);
	}

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('ZONE'),
	)) {
		renderComponents.push(
			new ZoneComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('AREA'),
	)) {
		renderComponents.push(
			new AreaComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('INTERIOR'),
	)) {
		renderComponents.push(
			new InteriorComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('SEAT'),
	)) {
		const seatFeature = feature as SeatFeature;
		const seatNumber = seatFeature.properties.number;

		renderComponents.push(
			new SeatComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	for (const feature of layout.features.filter((f) =>
		f.id.startsWith('OPENING'),
	)) {
		renderComponents.push(
			new OpeningComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	for (const feature of layout.features.filter(
		(f) =>
			f.id.startsWith('POI') &&
			(f as VehiclePoiFeature).properties.poiName !== 'Fahrradstellplatz',
	)) {
		renderComponents.push(new PoiComponent(feature, NORMALISATION, doubleDeck));
	}

	for (const feature of layout.features.filter(
		(f) =>
			f.id.startsWith('POI') &&
			(f as VehiclePoiFeature).properties.poiName === 'Fahrradstellplatz',
	)) {
		renderComponents.push(
			new BikePlaceComponent(feature, NORMALISATION, doubleDeck),
		);
	}

	return renderComponents;
}

function computeActualRotationDegrees(
	originalRotateDegrees: number,
	orientation: string,
	vehicleComponents: RenderComponent[],
) {
	// Find digitalization orientation for the whole vehicle
	const mustFlip = vehicleComponents
		.filter((component) => component.risMapsFeature.id.startsWith('VEHICLE'))
		.map((component) => component.risMapsFeature as VehicleFeature)
		.map((vehicleFeature) => vehicleFeature.properties.digitizedOrientation)
		.at(0);

	// compensate for incorrect orientation
	// if digitization orientation and orientation within multiple unit disagree
	const mustCompensateDrawDirection = mustFlip
		? orientation === 'BACKWARDS'
		: orientation === 'FORWARDS';
	return (
		(originalRotateDegrees + (mustCompensateDrawDirection ? 180 : 0)) % 360
	);
}

function drawVehicle(
	ctx: CanvasRenderingContext2D | null,
	orientation: string,
	vehicleComponents: RenderComponent[],
	rotateDegrees: number,
) {
	if (!ctx) return;

	// Reset Canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.save();

	// RIS::Maps coordniates are carthesian with the origin being in the center
	const halfCanvasWidth = ctx.canvas.width / 2;
	const halfCanvasHeight = ctx.canvas.height / 2;
	ctx.translate(halfCanvasWidth, halfCanvasHeight);
	ctx.scale(SCALING, SCALING);

	for (const component of vehicleComponents) {
		component.render(
			ctx,
			computeActualRotationDegrees(
				rotateDegrees,
				orientation,
				vehicleComponents,
			),
		);
	}

	ctx.restore();
}

function getDimensionsAfterRotation(
	width: number,
	height: number,
	rotateDegrees: number,
) {
	const rotationRadians = (rotateDegrees * Math.PI) / 180;
	const h =
		height * Math.abs(Math.cos(rotationRadians)) +
		width * Math.abs(Math.sin(rotationRadians));
	const w =
		width * Math.abs(Math.cos(rotationRadians)) +
		height * Math.abs(Math.sin(rotationRadians));
	return { width: w, height: h };
}

const VehicleContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	flexFlow: 'column',
	alignItems: 'center',
	width: '85vw',
	[theme.breakpoints.up('sm')]: {
		alignItems: 'flex-start',
	},
}));

export const VehicleMap: FC<Props> = ({ layout, orientation }) => {
	const theme = useTheme();
	const isBigScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'));
	const rotateDegrees = isBigScreen ? 0 : 90;

	// create rendering components
	const vehicleComponents = useMemo(() => {
		return buildVehicleRenderComponents(
			layout,
			theme.vars.palette.text.primary,
		);
	}, [layout, theme.vars.palette.text.primary]);

	const vehicleWidth = bboxWidth(layout.bbox, NORMALISATION, SCALING);
	const vehicleHeight = bboxHeight(layout.bbox, NORMALISATION, SCALING);

	const canvasDimensions = getDimensionsAfterRotation(
		vehicleWidth,
		vehicleHeight,
		rotateDegrees,
	);

	if (isDoubleDeck(layout)) {
		canvasDimensions.height *= 2;
		canvasDimensions.height += 30;
	}

	// const onClick = (e: MouseEvent, canvas: HTMLCanvasElement) => {
	// 	if (!onVehicleComponentClick) return;
	// 	const { x, y } = screenToCanvasCoordinates(e, canvas);

	// 	const actualRotation = computeActualRotationDegrees(
	// 		rotateDegrees,
	// 		vehicle,
	// 		vehicleComponents,
	// 	);

	// 	// Ask every component if it was clicked
	// 	for (const vehicleComponent of vehicleComponents) {
	// 		const clickedComponent = vehicleComponent.onClick(
	// 			x,
	// 			y,
	// 			canvas,
	// 			actualRotation,
	// 		);
	// 		if (clickedComponent) {
	// 			onVehicleComponentClick(clickedComponent);
	// 			return;
	// 		}
	// 	}
	// };

	const draw = useCallback(
		(ctx: CanvasRenderingContext2D | null) => {
			drawVehicle(ctx, orientation, vehicleComponents, rotateDegrees);
		},
		[orientation, vehicleComponents, rotateDegrees],
	);

	return (
		<VehicleContainer>
			<Canvas
				draw={draw}
				width={canvasDimensions.width + 10}
				height={canvasDimensions.height + 10}
			/>
		</VehicleContainer>
	);
};
