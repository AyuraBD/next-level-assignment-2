import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import authAdmin from "../../middleware/authAdmin";
import auth from "../../middleware/auth";
import canUpdate from "../../middleware/canUpdate";

const router = express.Router();

router.post('/auth/signup', userController.createUser);

router.get('/users', authAdmin('admin'), userController.getUsers);

router.put('/users/:userId', auth(), canUpdate(), userController.updateUser);

router.delete('/users/:userId', authAdmin('admin'), userController.deleteUser);

export const userRoutes = router;
