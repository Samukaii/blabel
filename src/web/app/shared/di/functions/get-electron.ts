import { inject } from '@angular/core';
import { WINDOW } from '../tokens/window';

export const getElectron = () => {
	const window = inject(WINDOW);

	return window.electronAPI;
}
