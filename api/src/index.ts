import cors from 'cors';
import express from 'express';
import { translationsRoute } from './routes/translations-route';

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use('/translations', translationsRoute)


app.listen(port, () => {
  console.log(`💬 i18n Translator API running at http://localhost:${port}`);
});
