export const removePathFromObject = (obj: Record<string, any>, path: string) => {
	const pathKeys = path.split('.');
	let current = obj;

	for (let index = 0; index < pathKeys.length - 1; index++) {
		const key = pathKeys[index];

		if (!(key in current)) return;

		current = current[key];
	}

	const lastKey = pathKeys[pathKeys.length - 1];
	delete current[lastKey];
};
