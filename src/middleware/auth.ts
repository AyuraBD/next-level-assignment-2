import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction)=>{
    try{
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload
      req.user = decoded;
      next();
    }catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

export default auth;