import { AlignTargetToOptions } from "./align-target-to.options";
import { GeometryPosition } from "../../../models/geometry-position";
import { GeometryRect } from "../../../models/geometry-rect";

export interface SmartAlignTargetToOptions extends Omit<AlignTargetToOptions, 'position'> {
	preferredPositions?: GeometryPosition[];
	container?: GeometryRect;
}
