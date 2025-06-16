import * as electron from 'electron';
const close = () => {
    electron.BrowserWindow.getFocusedWindow()?.close();
};
const minimize = () => {
    electron.BrowserWindow.getFocusedWindow()?.minimize();
};
const maximize = () => {
    const window = electron.BrowserWindow.getFocusedWindow();
    if (!window)
        return;
    if (window.isMaximized()) {
        window.unmaximize();
    }
    else {
        window.maximize();
    }
};
export const windowHandler = {
    minimize,
    maximize,
    close,
};
