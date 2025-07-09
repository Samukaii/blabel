import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { isClassInstance } from '@shared/utils/is-class-instance';
import { classMethodsToPlainObject } from '@shared/utils/class-methods-to-plain-object';
import { inject } from '../src/backend/di/di';
import { allHandlers } from '../src/backend/all-handlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = resolve(__dirname, '../src/backend/preload.generated.ts');


const ipcHandlers = Object.fromEntries(
	Object.entries(allHandlers).map(([key, value]) => {
		const handler = inject(value as any);
		return [key, classMethodsToPlainObject(handler)];
	}))

const generateHandlerTree = (obj: any, path: string[] = [], depth = 0): string => {
	if (typeof obj==='function') {
		const channel = path.join(':');
		return `(...args: any[]) => invoke('${channel}', ...args)`;
	}

	const spaces = (depth: number) => '  '.repeat(depth);

	if (isClassInstance(obj)) {
		const entries = Object.entries(classMethodsToPlainObject(obj)).map(
			([key, value]) => `${spaces(depth + 1)}${key}: ${generateHandlerTree(value, [...path, key], depth + 1)}`
		);
		return `{\n${entries.join(',\n')}\n${spaces(depth)}}`;
	}

	if (typeof obj==='object' && obj!==null) {
		const entries = Object.entries(obj).map(
			([key, value]) => `${spaces(depth + 1)}${key}: ${generateHandlerTree(value, [...path, key], depth + 1)}`
		);
		return `{\n${entries.join(',\n')}\n${spaces(depth)}}`;
	}

	return 'undefined';
};

const body = generateHandlerTree(ipcHandlers);

const out = `\
// AUTO-GENERATED FILE – DO NOT EDIT
const { contextBridge, ipcRenderer } = require('electron');

const invoke = (handlerName: string, ...args: any[]) => ipcRenderer.invoke(handlerName, ...args);

contextBridge.exposeInMainWorld('electronAPI', ${body});
`;

writeFileSync(filePath, out);
console.log('✅ Preload gerado com sucesso!');
