export const flattenTranslations = (obj, prefix = '') => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            Object.assign(acc, flattenTranslations(value, newKey));
        }
        else {
            acc[newKey] = value;
        }
        return acc;
    }, {});
};
