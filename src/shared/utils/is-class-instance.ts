export const isClassInstance = (obj: any): boolean => {
	if (obj===null || typeof obj!=='object') return false;

	const proto = Object.getPrototypeOf(obj);
	return !!proto && proto!==Object.prototype;
}
