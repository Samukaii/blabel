export const applySearch = (translations, search) => {
    const searchLower = search.toLowerCase();
    return translations.filter(({ path, entries }) => {
        return (path.toLowerCase().includes(searchLower) ||
            entries.some(lang => lang.value?.toLowerCase().includes(searchLower)));
    });
};
