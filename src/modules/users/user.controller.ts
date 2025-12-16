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

const getUsers = async(req: Request, res: Response)=>{
  try{
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows
    })
  }catch(err:any){
    res.status(500).json({
      success:false,
      message: err.message,
    })
  }
}

const updateUser = async(req: Request, res: Response)=>{
  const {name, email, phone, role} = req.body;
  const id = req.params.userId;
  try{
    const result = await userServices.updateUser(name, email, phone, role, id as string);
    if(result.rows.length === 0){
      res.status(500).json({
        success: false,
        message: 'User not found',
      });
    }else{
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0]
      });
    }
  }catch(err:any){
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteUser = async(req: Request, res: Response)=>{
  const id = req.params.userId;
  try{
    const user = req.user;
    if(Number(user?.id === Number(id))){
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete own account"
      })
    }
    await userServices.deleteUser(id as string);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
  }catch(err:any){
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}


export const userController = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
}