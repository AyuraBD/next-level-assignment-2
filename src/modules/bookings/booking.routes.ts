import express from 'express';
import { bookingControllers } from './booking.controllers';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/bookings', auth(), bookingControllers.createBooking);

export const bookingRoutes = router;