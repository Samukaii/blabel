import express from 'express';
import { aiHintsController } from '../controllers/translations/ai-hints.controller';

const router = express.Router();

router.post('/fill_empty_languages', aiHintsController.translateEmptyLanguages);

export const aiHintsRoute = router;
