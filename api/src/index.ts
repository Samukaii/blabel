import cors from 'cors';
import express from 'express';
import { translationsRoute } from './routes/translations-route';
import dotenv from 'dotenv';
import { aiHintsRoute } from './routes/ai-hints-route';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use('/translations', translationsRoute)
app.use('/ai_hints', aiHintsRoute)


app.listen(port, () => {
  console.log(`💬 i18n Translator API running at http://localhost:${port}`);
});
