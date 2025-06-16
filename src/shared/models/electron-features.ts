import { ElectronApi } from '@shared/models/electron-api';

export interface ElectronFeatures {
	api: ElectronApi;
	window: {
		close: () => void;
		minimize: () => void;
		maximize: () => void;
	};
	files: {
		openDialog: () => Promise<string | null>;
	}
}
