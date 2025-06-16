import { ElectronFeatures } from '@shared/models/electron-features';

export {};

declare global {
	interface Window {
		electronAPI: ElectronFeatures;
	}
}
