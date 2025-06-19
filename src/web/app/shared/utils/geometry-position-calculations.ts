import { GeometryPositionCalculationFn } from '../models/geometry-position-calculation-fn';
import { GeometryPosition } from '../models/geometry-position';

const topStart: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x,
	y: anchor.y - target.height,
});

const topEnd: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width - target.width,
	y: anchor.y - target.height,
});

const topLeft: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x - target.width,
	y: anchor.y - target.height,
});

const topRight: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width,
	y: anchor.y - target.height,
});

const topCenter: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width / 2 - target.width / 2,
	y: anchor.y - target.height,
});

const bottomStart: GeometryPositionCalculationFn = (anchor) => ({
	x: anchor.x,
	y: anchor.y + anchor.height,
});

const bottomEnd: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width - target.width,
	y: anchor.y + anchor.height,
});

const bottomLeft: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x - target.width,
	y: anchor.y + anchor.height,
});

const bottomRight: GeometryPositionCalculationFn = (anchor) => ({
	x: anchor.x + anchor.width,
	y: anchor.y + anchor.height,
});

const bottomCenter: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width / 2 - target.width / 2,
	y: anchor.y + anchor.height,
});

const leftStart: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x - target.width,
	y: anchor.y,
});

const leftCenter: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x - target.width,
	y: anchor.y + anchor.height / 2 - target.height / 2,
});

const leftEnd: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x - target.width,
	y: anchor.y + anchor.height - target.height,
});

const rightStart: GeometryPositionCalculationFn = (anchor) => ({
	x: anchor.x + anchor.width,
	y: anchor.y,
});

const rightEnd: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width,
	y: anchor.y + anchor.height - target.height,
});

const rightCenter: GeometryPositionCalculationFn = (anchor, target) => ({
	x: anchor.x + anchor.width,
	y: anchor.y + anchor.height / 2 - target.height / 2,
});

export const geometryPositionCalculations: Record<GeometryPosition, GeometryPositionCalculationFn> = {
	'top-start': topStart,
	'bottom-start': bottomStart,
	'left-start': leftStart,
	'right-start': rightStart,
	'top-center': topCenter,
	'bottom-center': bottomCenter,
	'left-center': leftCenter,
	'right-center': rightCenter,
	'top-left': topLeft,
	'top-right': topRight,
	'bottom-left': bottomLeft,
	'bottom-right': bottomRight,
	'top-end': topEnd,
	'bottom-end': bottomEnd,
	'left-end': leftEnd,
	'right-end': rightEnd,
};
