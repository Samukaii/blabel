export const classToPlainObject = <T>(instance: T): T => {
	const result: Record<string, any> = {};
	const instanceToUse = instance as any;

	for (const key in instance) {
		result[key] = instance[key];
	}

	const proto = Object.getPrototypeOf(instanceToUse);
	const methodNames = Object.getOwnPropertyNames(proto).filter(
		(name) => typeof instanceToUse[name]==='function' && name!=='constructor'
	);

	for (const name of methodNames) {
		result[name] = instanceToUse[name];
	}

	return result as T;
}
