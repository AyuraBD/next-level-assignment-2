import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async(req: Request, res: Response)=>{
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
  
  if(type !== "car" && type !== 'bike' && type !== 'van' && type !== 'SUV'){
    return res.status(400).json({
      success: false,
      message: "Vehicle type value must be 'car', 'bike', 'van', and 'SUV'."
    });
  }
  if(availability_status !== 'available' && availability_status !== 'booked'){
    return res.status(400).json({
      success: false,
      message: "Vehicle availability status value must be 'available' or 'booked'."
    });
  }
  const price = Number(daily_rent_price);
  if(!price || Number.isNaN(price) || price <= 0){
    return res.status(400).json({
      success: false,
      message: "Daily rent price must be a positive number."
    });
  };
  
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
};

const getVehicles = async (req: Request, res: Response)=>{
  try{
    const result = await vehicleServices.getVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows
    })
    if(result.rows.length === 0){
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows
      });
    }
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: "No vehicles found",
    });
  }
};

const getSingleVehicle = async(req: Request, res: Response)=>{
  const id = req.params.vehicleId;
  try{
    const result = await vehicleServices.getSingleVehicle(id as string);
    if(result.rows.length === 0){
      res.status(200).json({
        success: true,
        message:"Vehicle couldn't found"
      })
    };
    res.status(200).json({
      success: true,
      message:"Vehicle retrieved successfully",
      data: result.rows[0]
    });
    
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: "Vehicle couldn't found",
    });
  }
};

const updateSingleVehicle = async(req: Request, res: Response)=>{
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
  const id = req.params.vehicleId;
  try{
    const result = await vehicleServices.updateSingleVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, id as string);
    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result.rows[0]
    });
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: "Vehicle couldn't update",
    });
  }
}

const deleteVehicle = async(req: Request, res: Response)=>{
  const id = req.params.vehicleId;
  try{
    const result = await vehicleServices.deleteVehicle(id as string);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    })
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: "Vehicle couldn't update",
    });
  }
}

export const vehicleControllers = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteVehicle
}