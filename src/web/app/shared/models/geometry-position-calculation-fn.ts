import { GeometryRect } from "./geometry-rect";
import { GeometrySize } from "./geometry-size";
import { GeometryPoint } from "./geometry-point";

export type GeometryPositionCalculationFn = (
	anchor: GeometryRect,
	target: GeometrySize,
) => GeometryPoint;
