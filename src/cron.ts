import cron from 'node-cron';
import { bookingServices } from './modules/bookings/booking.services';

cron.schedule("* * * * *", async()=>{
  await bookingServices.autoReturnBookings();
})