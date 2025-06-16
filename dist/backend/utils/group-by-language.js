export const groupByLanguage = (translations) => {
    const grouped = [];
    translations.forEach(translation => {
        translation.entries.forEach(entry => {
            const existentLanguage = grouped.find(item => item.language === entry.language.key);
            if (translation.operation === 'none')
                return;
            if (existentLanguage)
                existentLanguage.values.push({
                    entry,
                    operation: translation.operation,
                    path: translation.path
                });
            else
                grouped.push({
                    language: entry.language.key,
                    values: [{
                            operation: translation.operation,
                            path: translation.path,
                            entry
                        }]
                });
        });
    });
    return grouped;
};
