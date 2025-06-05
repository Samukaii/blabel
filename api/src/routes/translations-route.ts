import express from 'express';
import { translationsController } from '../controllers/translations/translations.controller';

const router = express.Router();

router.get('/', translationsController.getAll);
router.post('/register_change', translationsController.registerChange);
router.post('/save_all', translationsController.saveAll);
router.patch('/reset_change', translationsController.resetChange);

export const translationsRoute = router;
