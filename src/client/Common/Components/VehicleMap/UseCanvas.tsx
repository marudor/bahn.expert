import { useEffect, useRef } from 'react';

export type DrawFunction = (
	ctx: CanvasRenderingContext2D | null,
	frameNum?: number,
) => void;

interface Options {
	draw: DrawFunction;
	preDraw?: (
		context: CanvasRenderingContext2D | null,
		canvas: HTMLCanvasElement,
	) => void;
	postDraw?: (context: CanvasRenderingContext2D | null) => void;
	onClick?: (e: MouseEvent, canvas: HTMLCanvasElement) => void;
	onMouseMove?: (e: MouseEvent, canvas: HTMLCanvasElement) => void;
	onMouseLeave?: (e: MouseEvent, canvas: HTMLCanvasElement) => void;
}

const useCanvas = (options: Options) => {
	const { draw, preDraw, postDraw, onClick, onMouseMove, onMouseLeave } =
		options;
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current as unknown as HTMLCanvasElement;
		if (!canvas) return;
		const context = canvas.getContext('2d');
		let frameCount = 0;
		let animationFrameId: number;

		const nop = () => {};
		const innerClick = (e: MouseEvent) => (onClick ? onClick(e, canvas) : nop);
		canvas.addEventListener('click', innerClick);

		const innerMouseMove = (e: MouseEvent) =>
			onMouseMove ? onMouseMove(e, canvas) : nop;
		canvas.addEventListener('mousemove', innerMouseMove);

		const innerMouseLeave = (e: MouseEvent) =>
			onMouseLeave ? onMouseLeave(e, canvas) : nop;
		canvas.addEventListener('mouseleave', innerMouseLeave);

		const render = () => {
			frameCount++;
			preDraw?.(context, canvas);
			draw(context, frameCount);
			postDraw?.(context);
		};

		render();

		return () => {
			canvas.removeEventListener('click', innerClick);
			canvas.removeEventListener('mousemove', innerMouseMove);
			canvas.removeEventListener('mouseleave', innerMouseLeave);
		};
	}, [draw, preDraw, postDraw, onClick, onMouseMove, onMouseLeave]);

	return canvasRef;
};

export default useCanvas;
