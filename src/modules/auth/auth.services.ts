import bcrypt from 'bcrypt';
import { pool } from "../../config/DB";
import jwt from 'jsonwebtoken';
import config from '../../config';

const signinUser = async(email:string, password:string)=>{
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if(result.rows.length === 0){
    return null;
  }
  const user = result.rows[0];
  const userData = {id: user.id, name:user.name, email: user.email, phone:user.phone, role: user.role}
  const isMatched = await bcrypt.compare(password, user.password);
  if(!isMatched){
    return false;
  }
  const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, config.jwt_secret as string, {
    expiresIn: "5d"
  } );
  return {token, user:userData}
};

export const authServices = {
  signinUser,
}