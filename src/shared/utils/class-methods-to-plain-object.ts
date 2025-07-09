export const classMethodsToPlainObject = <T>(instance: T): T => {
	const result: Record<string, any> = {};
	const instanceToUse = instance as any;

	const proto = Object.getPrototypeOf(instanceToUse);
	const methodNames = Object.getOwnPropertyNames(proto).filter(
		(name) => typeof instanceToUse[name]==='function' && name!=='constructor'
	);

	for (const name of methodNames) {
		result[name] = instanceToUse[name];
	}

	return result as T;
}
