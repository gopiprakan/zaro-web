import express from 'express';
import { login, signup, demoLogin, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/demo-login', demoLogin);
router.get('/me', getMe);

export default router;
