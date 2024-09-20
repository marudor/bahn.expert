import { useMediaQuery } from '@mui/material';
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
	const preDraw = (
		context: CanvasRenderingContext2D | null,
		canvas: HTMLCanvasElement,
	) => {
		if (!context) return;
		context.save();
		canvas.width = outerWidth || 950;
		canvas.height = outerHeight || 300;
		const { width, height } = context.canvas;
		context.clearRect(0, 0, width, height);
	};

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
