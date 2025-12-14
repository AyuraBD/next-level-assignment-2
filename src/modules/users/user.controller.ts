import { Request, Response } from "express";
import { userServices } from "./user.services";

const createUser = async(req: Request, res: Response)=>{
    const {name, email, password, phone, role} = req.body;

    if((password as string).length < 6){
      return res.status(400).json({
        error: "Password must be 6 characters long."
      })
    }
    if(role !== 'admin' && role !== 'customer'){
      return res.status(400).json({
        error: "Role must be 'admin' or 'customer'"
      });
    }
    try{
      const result = await userServices.createUser(req.body);
      res.status(201).json({
        success:true,
        message: "User registered successfully.",
        data: {
          "id": result.rows[0].id,
          "name": result.rows[0].name,
          "email": result.rows[0].email,
          "phone": result.rows[0].phone,
          "role": result.rows[0].role
        }
      })
    }catch(err:any){
      res.status(500).json({
        success:false,
        message: err.message,
      })
    }
};


export const userController = {
  createUser,
}