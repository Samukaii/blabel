import * as electron from 'electron';

export const isProduction = () => electron.app.isPackaged;
