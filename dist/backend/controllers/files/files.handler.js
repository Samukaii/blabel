import * as electron from 'electron';
const openDialog = async () => {
    const { canceled, filePaths } = await electron.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (canceled)
        return null;
    return filePaths[0];
};
export const filesHandler = {
    openDialog,
};
