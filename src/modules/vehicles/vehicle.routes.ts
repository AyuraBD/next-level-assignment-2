import express from 'express';
import { vehicleControllers } from './vehicle.controllers';
import authAdmin from '../../middleware/authAdmin';

const router = express.Router();

router.post('/vehicles', authAdmin('admin'), vehicleControllers.createVehicle);

router.get('/vehicles', vehicleControllers.getVehicles);

router.get('/vehicles/:vehicleId', vehicleControllers.getSingleVehicle);

router.put('/vehicles/:vehicleId', authAdmin('admin'), vehicleControllers.updateSingleVehicle);

router.delete('/vehicles/:vehicleId', authAdmin('admin'), vehicleControllers.deleteVehicle);

export const vehicleRouter = router;



