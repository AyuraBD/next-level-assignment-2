import express from 'express';
import { vehicleControllers } from './vehicle.controllers';
import auth from '../../middleware/auth';

const router = express.Router();
// router.post('/vehicles', auth("admin"), vehicleControllers.createVehicle);

router.post('/vehicles', auth('admin'), vehicleControllers.createVehicle);
// router.get('/verhicles');

export const vehicleRouter = router;



