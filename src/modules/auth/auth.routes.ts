import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

router.post('/auth/signin', authController.signinUser);

export const authRoutes = router;