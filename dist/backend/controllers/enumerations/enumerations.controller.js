import { availableLanguages } from '../../../shared/constants/available-languages.js';
const getAvailableLanguages = (req, res) => {
    const { query } = req;
    let results = [];
    const search = query['search'];
    if (search)
        results = availableLanguages.filter((lang) => lang.label.toLowerCase().includes(search.toLowerCase()));
    res.json({ results });
};
export const enumerationsController = {
    getAvailableLanguages
};
