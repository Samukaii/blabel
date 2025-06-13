import {translationsRoute} from './routes/translations-route.js';
import {aiHintsRoute} from './routes/ai-hints-route.js';
import {applicationLanguagesRoute} from './routes/application-languages-route.js';
import {enumerationsRoute} from './routes/enumerations-route.js';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

export const startAPI = () => {
    dotenv.config();

    const app = express();
    const port = 3000;

    app.use(cors())
    app.use(express.json());
    app.use('/translations', translationsRoute)
    app.use('/ai_hints', aiHintsRoute)
    app.use('/application_config', applicationLanguagesRoute)
    app.use('/enumerations', enumerationsRoute)


    app.listen(port, () => {
        console.log(`💬 i18n Translator API running at http://localhost:${port}`);
    });
}
