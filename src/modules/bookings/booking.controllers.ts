import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async(req: Request, res: Response)=>{
  try{
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    })
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getBookings = async(req: Request, res: Response) =>{
  try{
    const result = await bookingServices.getBookings(req.user);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result
    })
  }catch(err:any){
    res.status(500).json({
      success: true,
      message: err.message
    })
  }
}

const updateBooking = async(req: Request, res: Response)=>{
  const id = req.params.bookingId;
  const {status} = req.body;
  const user = req?.user;
  try{
    if(user!.role === "customer"){
      if(status !== "cancelled"){
        return res.status(403).json({
          message: "Customer can only cancel booking"
        });
      }
      const result = await bookingServices.cancelBooking(id as string, user!.id as number);
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result,
      });
    }
    
    if (user!.role === "admin") {
      if (status !== "returned") {
        return res.status(400).json({
          message: "Admin can only mark booking as returned",
        });
      }
      const booking = await bookingServices.returnBooking(id as string);
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: booking,
      });
    }

    res.status(403).json({
      message: "Forbidden"
    })
  }catch(err:any){
    res.status(500).json({
      success:false,
      message: err.message
    })
  }
}

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
}