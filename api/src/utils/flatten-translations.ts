export const flattenTranslations = (obj: any, prefix = ''): Record<string, string> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            Object.assign(acc, flattenTranslations(value, newKey));
        } else {
            acc[newKey] = value as string;
        }

        return acc;
    }, {} as Record<string, string>);
}
