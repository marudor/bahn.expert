import {
	bboxHeight,
	bboxWidth,
} from '@/client/Common/Components/VehicleMap/helpers/GeometryHelpers';

export const drawBbox = (
	ctx: CanvasRenderingContext2D,
	bbox: number[],
	normalisationFactor: number,
	strokeColor?: string,
	fillColor?: string,
) => {
	if (bbox.length !== 4) return;
	ctx.save();
	const x1 = bbox[0] * normalisationFactor;
	const y1 = bbox[1] * normalisationFactor;
	const x2 = bbox[2] * normalisationFactor;
	const y2 = bbox[3] * normalisationFactor;
	if (fillColor) {
		ctx.fillStyle = fillColor;
		ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
	}
	if (strokeColor) {
		ctx.strokeStyle = strokeColor;
		ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
	}
	ctx.restore();
};

export const drawMultiPolygon = (
	ctx: CanvasRenderingContext2D,
	geometry: GeoJSON.MultiPolygon,
	normalisationFactor: number,
	strokeColor?: string,
	fillColor?: string,
	lineWidth?: number,
) => {
	if (
		!geometry?.coordinates ||
		geometry.coordinates.length <= 0 ||
		geometry.coordinates[0].length <= 0
	) {
		return;
	}
	const coords = geometry.coordinates[0][0];
	if (!coords?.[0]) {
		return;
	}
	drawPolygon(
		ctx,
		coords,
		normalisationFactor,
		strokeColor,
		fillColor,
		lineWidth,
	);
};

export const drawMultiLineString = (
	ctx: CanvasRenderingContext2D,
	geometry: GeoJSON.MultiLineString,
	normalisationFactor: number,
	strokeColor?: string,
	fillColor?: string,
	lineWidth?: number,
) => {
	if (
		!geometry?.coordinates ||
		geometry.coordinates.length <= 0 ||
		geometry.coordinates[0].length <= 0
	) {
		return;
	}
	const coords = geometry.coordinates[0];
	if (!coords?.[0]) {
		return;
	}
	drawPolygon(
		ctx,
		coords,
		normalisationFactor,
		strokeColor,
		fillColor,
		lineWidth,
	);
};

export const drawPolygon = (
	ctx: CanvasRenderingContext2D,
	coords: GeoJSON.Position[],
	normalisationFactor: number,
	strokeColor?: string,
	fillColor?: string,
	lineWidth?: number,
) => {
	if (!coords?.[0]) {
		return;
	}

	ctx.save();
	ctx.lineWidth = lineWidth ?? 0.5;
	ctx.strokeStyle = strokeColor ?? 'white';
	ctx.fillStyle = fillColor ?? 'white';
	ctx.beginPath();
	ctx.moveTo(
		coords[0][0] * normalisationFactor,
		coords[0][1] * normalisationFactor,
	);
	for (let i = 1; i < coords.length; i++) {
		const coord = coords[i];
		ctx.lineTo(coord[0] * normalisationFactor, coord[1] * normalisationFactor);
	}

	ctx.closePath();
	if (fillColor) {
		ctx.fill();
	}
	if (strokeColor) {
		ctx.stroke();
	}
	ctx.restore();
};

export const drawTextInBbox = (
	context: CanvasRenderingContext2D,
	text: string,
	bbox: number[],
	font: string,
	fontColor: string,
	normalisationFactor: number,
	rotationDegrees: number,
) => {
	context.save();
	context.font = font;
	context.fillStyle = fontColor;
	context.textAlign = 'center';
	context.textBaseline = 'middle';

	const width = bboxWidth(bbox, normalisationFactor, 1);
	const height = bboxHeight(bbox, normalisationFactor, 1);
	context.translate(
		bbox[0] * normalisationFactor + width / 2,
		bbox[1] * normalisationFactor + height / 2,
	);
	context.rotate((rotationDegrees * Math.PI) / 180);
	context.scale(1, -1);
	context.fillText(text, 0, 0);
	context.restore();
};

export function screenToCanvasCoordinates(
	e: MouseEvent,
	canvas: HTMLCanvasElement,
) {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	return { x, y };
}

export const clickToRisMapsCoordinates = (
	x: number,
	y: number,
	canvas: HTMLCanvasElement,
	rotationDegrees: number,
) => {
	const canvasBoundingRect = canvas.getBoundingClientRect();
	let point = { x, y };
	point = translatePoint(
		point,
		-(canvasBoundingRect.width / 2),
		-(canvasBoundingRect.height / 2),
	);
	point = rotatePoint(point, 0, 0, rotationDegrees);
	point = scalePoint(
		point,
		canvas.width / canvasBoundingRect.width,
		canvas.height / canvasBoundingRect.height,
	);
	return point;
};

export const scalePoint = (
	p: { x: number; y: number },
	sX: number,
	sY: number,
) => {
	return { x: p.x * sX, y: p.y * sY };
};

export const translatePoint = (
	p: { x: number; y: number },
	transX: number,
	transY: number,
) => {
	return { x: p.x + transX, y: p.y + transY };
};

export const rotatePoint = (
	p: { x: number; y: number },
	cx: number,
	cy: number,
	angle: number,
) => {
	const radians = (Math.PI / 180) * angle;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const nx = cos * (p.x - cx) + sin * (p.y - cy) + cx;
	const ny = cos * (p.y - cy) - sin * (p.x - cx) + cy;
	return { x: nx, y: ny };
};

export const isCoordinatesWithinBbox = (
	bbox: number[],
	x: number,
	y: number,
	canvas: HTMLCanvasElement,
	normalisationFactor: number,
	rotateDegrees: number,
	isDoubleDeck: boolean,
	isDeck: (deck: 'UPPER' | 'LOWER' | 'DEFAULT') => boolean,
): boolean => {
	const seatXY1 = {
		x: bbox[0] * normalisationFactor,
		y: bbox[1] * normalisationFactor,
	};
	const seatXY2 = {
		x: bbox[2] * normalisationFactor,
		y: bbox[3] * normalisationFactor,
	};
	let clickXY = clickToRisMapsCoordinates(x, y, canvas, rotateDegrees);
	if (isDoubleDeck) {
		if (isDeck('UPPER')) {
			clickXY = translatePoint(clickXY, 0, 135);
		} else if (isDeck('LOWER')) {
			clickXY = translatePoint(clickXY, 0, -135);
		} else if (isDeck('DEFAULT')) {
			clickXY = translatePoint(clickXY, 0, -135);
		}
	}
	if (
		clickXY.x >= seatXY1.x &&
		clickXY.x <= seatXY2.x &&
		clickXY.y >= seatXY1.y &&
		clickXY.y <= seatXY2.y
	) {
		return true;
	}
	return false;
};
