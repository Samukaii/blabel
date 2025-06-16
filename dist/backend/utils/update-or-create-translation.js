export const updateOrCreateTranslation = (obj, entry) => {
    const keys = entry.path.split('.');
    let current = obj;
    for (let index = 0; index < keys.length - 1; index++) {
        const key = keys[index];
        if (!(key in current))
            current[key] = {};
        current = current[key];
    }
    current[keys[keys.length - 1]] = entry.value;
};
