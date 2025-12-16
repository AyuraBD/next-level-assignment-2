import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

const authAdmin = (...roles: string[])=>{
  return async (req: Request, res: Response, next: NextFunction)=>{
    try{
      const token = req.headers.authorization?.split(' ')[1];
      
      if(!token){
        return res.status(401).json({message: "Unauthorized"});
      }
      const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
      req.user = decoded;
      if(roles.length && !roles.includes(decoded.role)){
        return res.status(401).json({
          error: "Unauthorized"
        })
      }
      next();
    }catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default authAdmin;