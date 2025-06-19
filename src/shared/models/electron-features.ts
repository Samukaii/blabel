import { ElectronApi } from '@shared/models/electron-api';

export interface ElectronFeatures {
	api: ElectronApi;
	window: {
		close: () => void;
		minimize: () => void;
		maximize: () => void;
	};
	development: {
		openDevTools: () => void;
		isProduction: () => Promise<boolean>,
		isDebugAllowed: () => Promise<boolean>;
	}
	files: {
		openDialog: () => Promise<string | null>;
	}
	ai: {
		hasIntegratedAi: () => PromiseLike<boolean>;
	}
}
