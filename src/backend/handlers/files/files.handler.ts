import * as electron from 'electron';
import { ElectronFeatures } from '@shared/models/electron-features';
import { Injectable } from '../../di/di';

type Interface = ElectronFeatures['files'];

@Injectable({providedIn: 'root'})
export class FilesHandler implements Interface {
	async openDialog() {
		const {canceled, filePaths} = await electron.dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [{name: 'JSON', extensions: ['json']}],
		});
		if (canceled) return null;
		return filePaths[0];
	}

	async saveDialog(suggestedName: string) {
		const {canceled, filePath} = await electron.dialog.showSaveDialog({
			title: 'Salvar arquivo',
			defaultPath: suggestedName,
			filters: [
				{name: 'JSON', extensions: ['json']},
				{name: 'Todos os arquivos', extensions: ['*']}
			],
		});

		if (canceled) return null;

		return filePath ?? null;
	}
}
