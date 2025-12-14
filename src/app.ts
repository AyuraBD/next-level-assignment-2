import express from "express";
import initDB from "./config/DB";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes";

const app = express();

app.use(express.json());

initDB();

app.get('/', (req, res) => {
  res.send('Welcome to shohoz shorol assignment.');
});

// User Creation
app.use('/api/v1', userRoutes);

// Vehicles Creation
app.use('/api/v1', vehicleRouter);

// User login
app.use('/api/v1', authRoutes);


export default app;