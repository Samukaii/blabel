import { aiHintsRoute } from './routes/ai-hints-route.js';
import { enumerationsRoute } from './routes/enumerations-route.js';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
export const startAPI = () => {
    dotenv.config();
    const app = express();
    const port = 3000;
    app.use(cors());
    app.use(express.json());
    app.use('/ai_hints', aiHintsRoute);
    app.use('/enumerations', enumerationsRoute);
    app.listen(port, () => {
        console.log(`💬 i18n Translator API running at http://localhost:${port}`);
    });
};
