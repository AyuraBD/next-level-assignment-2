import { NextFunction, Request, Response } from "express"

const canUpdate = ()=>{
  return async(req: Request, res: Response, next: NextFunction)=>{
    try{
      const loggedInUser = req.user;
      const id = Number(req.params.userId);

      if(loggedInUser!.role === "admin"){
        return next();
      }

      if(loggedInUser!.role === "customer" && loggedInUser!.id === id){
        if(req.body.role){
          return res.status(403).json({
            message: "You cannot change role",
          });
        }
        return next();
      }

      return res.status(403).json({
        message: "Forbidden"
      });
    }catch(err:any){
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };
};

export default canUpdate;