import { ElectronFeatures } from "@shared/models/electron-features";
import { ClassType } from "../../backend/models/class-type";

export type ElectronHandlers = {
	[K in keyof ElectronFeatures]: ClassType<ElectronFeatures[K]>
};
