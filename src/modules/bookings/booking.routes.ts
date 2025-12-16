import express from 'express';
import { bookingControllers } from './booking.controllers';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/bookings', auth(), bookingControllers.createBooking);

router.get('/bookings', auth(), bookingControllers.getBookings);

router.put('/bookings/:bookingId', auth(), bookingControllers.updateBooking);

export const bookingRoutes = router;