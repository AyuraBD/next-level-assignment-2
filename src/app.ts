import express, { Request, Response } from "express";
import initDB from "./config/DB";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to shohoz shorol assignment 2.');
});

app.use('/api/v1', userRoutes);

app.use('/api/v1', vehicleRouter);

app.use('/api/v1', bookingRoutes);

app.use('/api/v1', authRoutes);

app.use((req: Request, res: Response)=>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});


export default app;
