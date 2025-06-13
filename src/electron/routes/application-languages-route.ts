import express from 'express';
import { applicationLanguagesController } from '../controllers/application-languages/application-languages.controller.js';

const router = express.Router();

router.get('/languages', applicationLanguagesController.get);
router.post('/languages', applicationLanguagesController.add);
router.patch('/languages/:languageKey', applicationLanguagesController.update);
router.delete('/languages/:languageKey', applicationLanguagesController.update);

export const applicationLanguagesRoute = router;
