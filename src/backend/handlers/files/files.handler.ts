import * as electron from 'electron';
import { ElectronFeatures } from '@shared/models/electron-features';

type FilesHandler = ElectronFeatures['files'];

const openDialog: FilesHandler['openDialog'] = async () => {
	const {canceled, filePaths} = await electron.dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [{name: 'JSON', extensions: ['json']}],
	});
	if (canceled) return null;
	return filePaths[0];
}

const saveDialog: FilesHandler['saveDialog'] = async (suggestedName: string) => {
	const { canceled, filePath } = await electron.dialog.showSaveDialog({
		title: 'Salvar arquivo',
		defaultPath: suggestedName,
		filters: [
			{ name: 'JSON', extensions: ['json'] },
			{ name: 'Todos os arquivos', extensions: ['*'] }
		],
	});

	if (canceled) return null;

	return filePath;
}

export const filesHandler: FilesHandler = {
	openDialog,
	saveDialog,
};
