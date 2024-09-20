export const bboxWidth = (
	bbox: number[],
	normalisationFactor: number,
	scalingFactor: number,
) => {
	return Math.floor(
		(bbox[2] * normalisationFactor - bbox[0] * normalisationFactor) *
			scalingFactor,
	);
};

export const bboxHeight = (
	bbox: number[],
	normalisationFactor: number,
	scalingFactor: number,
) => {
	return Math.floor(
		(bbox[3] * normalisationFactor - bbox[1] * normalisationFactor) *
			scalingFactor,
	);
};

export function getCentroid(pts: { x: number; y: number }[]) {
	const first = pts[0];
	const last = pts.at(-1);
	if (!last) {
		return {
			x: 0,
			y: 0,
		};
	}
	if (first.x !== last.x || first.y !== last.y) pts.push(first);
	let twicearea = 0;
	let x = 0;
	let y = 0;
	let p1: (typeof pts)[number];
	let p2: (typeof pts)[number];
	let f: number;
	const nPts = pts.length;
	for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
		p1 = pts[i];
		p2 = pts[j];
		f =
			(p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x);
		twicearea += f;
		x += (p1.x + p2.x - 2 * first.x) * f;
		y += (p1.y + p2.y - 2 * first.y) * f;
	}
	f = twicearea * 3;
	return { x: x / f + first.x, y: y / f + first.y };
}
