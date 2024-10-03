// Thanks to Spike for the inspiration for most of the "VehicleMap" Code

import { useMediaQuery } from '@mui/material';
import { useCallback } from 'react';
import type { DrawFunction } from './UseCanvas';
import useCanvas from './UseCanvas';

interface PropTypes {
	draw: DrawFunction;
	width?: number;
	height?: number;
}

const postDraw = (context: CanvasRenderingContext2D | null) => {
	if (!context) return;
	context.restore();
};

const Canvas: React.FC<PropTypes> = ({
	draw,
	width: outerWidth,
	height: outerHeight,
}) => {
	const preDraw = useCallback(
		(context: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement) => {
			if (!context) return;
			context.save();
			canvas.width = outerWidth || 950;
			canvas.height = outerHeight || 300;
			const { width, height } = context.canvas;
			context.clearRect(0, 0, width, height);
		},
		[outerHeight, outerWidth],
	);

	const isBigScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'));

	const canvasRef = useCanvas({
		draw,
		preDraw,
		postDraw,
	});
	return (
		<canvas
			ref={canvasRef}
			style={{
				height: isBigScreen ? '' : '500vw',
				width: isBigScreen ? '95vw' : '',
				maxWidth: '85vw',
			}}
		/>
	);
};

export default Canvas;
