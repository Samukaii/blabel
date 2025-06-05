export const removePathFromObject = (obj: Record<string, any>, path: string) => {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!(key in current)) return;

        current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    delete current[lastKey];
};
