export {};

declare global {
	interface Window {
		electronAPI?: {
			openFileDialog(): Promise<string | null>;
			windowClose: () => void;
			windowMinimize: () => void;
			windowMaximize: () => void;
		};
	}
}
