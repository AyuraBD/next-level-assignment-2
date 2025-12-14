import config from ".";
import {Pool} from "pg";

export const pool = new Pool({
  connectionString: config.connection_str
});


const initDB = async ()=>{
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(50) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'customer'
    );
    `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(150) NOT NULL,
      type VARCHAR(50) NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price INT NOT NULL,
      availability_status VARCHAR(100) NOT NULL DEFAULT 'available'
    )
    `)
}

export default initDB;