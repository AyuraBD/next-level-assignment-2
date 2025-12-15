import express from "express";
import initDB from "./config/DB";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

initDB();

app.get('/', (req, res) => {
  res.send('Welcome to shohoz shorol assignment.');
});

// User CRUD
app.use('/api/v1', userRoutes);

// Vehicles CRUD
app.use('/api/v1', vehicleRouter);

// Bookings CRUD
app.use('/api/v1', bookingRoutes);

// User login
app.use('/api/v1', authRoutes);


export default app;