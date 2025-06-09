import express from 'express';
import { enumerationsController } from '../controllers/enumerations/enumerations.controller';

const router = express.Router();

router.get('/available_languages', enumerationsController.getAvailableLanguages);

export const enumerationsRoute = router;
