import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async(req: Request, res: Response)=>{
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
  
  if(type !== "car" && type !== 'bike' && type !== 'van' && type !== 'SUV'){
    return res.status(400).json({
      success: false,
      message: "Vehicle type value must be 'car', 'bike', 'van', and 'SUV'."
    })
  }
  if(availability_status !== 'available' && availability_status !== 'booked'){
    return res.status(400).json({
      success: false,
      message: "Vehicle availability status value must be 'available' or 'booked'."
    })
  }
  const price = Number(daily_rent_price);
  if(!price || Number.isNaN(price) || price <= 0){
    return res.status(400).json({
      success: false,
      message: "Daily rent price must be a positive number."
    })
  };
  console.log(daily_rent_price);
  
  try{
    const result = await vehicleServices.createVehicle(req.body);
    console.log(result.rows[0])
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    })
  }catch(err:any){
    res.status(500).json({
      success: false,
      message:err.message
    })
  }
}

export const vehicleControllers = {
  createVehicle
}