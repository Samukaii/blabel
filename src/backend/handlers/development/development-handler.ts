import { ElectronFeatures } from '@shared/models/electron-features';
import { inject, Injectable } from '../../di/di';
import { CurrentWindowService } from '../../services/current-window/current-window.service';
import { isProduction } from '../../utils/is-production';
import { isDebugAllowed } from '../../utils/is-debug-allowed';

type Interface = ElectronFeatures['development'];

@Injectable({providedIn: 'root'})
export class DevelopmentHandler implements Interface {
	private currentWindowService = inject(CurrentWindowService);

	async openDevTools() {
		const window = this.currentWindowService.get();

		const debugAllowed = await this.isDebugAllowed();

		if(!debugAllowed) return;

		window.webContents.openDevTools({
			mode: 'detach',
		});
	}
	async isProduction() {
		return isProduction();
	}

	async isDebugAllowed() {
		return isDebugAllowed();
	}
}
