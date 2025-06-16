import express from 'express';
import { applicationLanguagesHandler } from '../handlers/application-languages/application-languages.handler.js';
const router = express.Router();
router.get('/languages', applicationLanguagesHandler.get);
router.post('/languages', applicationLanguagesHandler.add);
router.patch('/languages/:languageKey', applicationLanguagesHandler.update);
router.delete('/languages/:languageKey', applicationLanguagesHandler.update);
export const applicationLanguagesRoute = router;
