import { ClassType } from '../../backend/models/class-type';

export const isClass = (value: any): value is ClassType => {
	if (typeof value !== 'function') return false;

	const str = value.toString();

	return str.startsWith('class') || /^\s*class\s+/.test(str);
}
