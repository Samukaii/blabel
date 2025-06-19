import { GeometryPosition } from "../../../models/geometry-position";
import { GeometryRect } from "../../../models/geometry-rect";
import { GeometrySize } from "../../../models/geometry-size";
import { GeometryOffset } from "../../../models/geometry-offset";

export interface AlignTargetToOptions {
	position: GeometryPosition;
	anchor: GeometryRect;
	targetSize: GeometrySize;
	padding?: number | GeometryOffset;
}
