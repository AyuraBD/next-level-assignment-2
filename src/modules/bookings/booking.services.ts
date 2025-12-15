import { pool } from "../../config/DB";

const createBooking = async (payload:Record<string,unknown>)=>{
  const {customer_id, vehicle_id,rent_start_date,rent_end_date} = payload;
  
  // get vehicle name and daily rent price
  const vehicleRes = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  if(vehicleRes.rows.length === 0){
    throw new Error('vehicle not found');
  }
  const {vehicle_name, daily_rent_price} = vehicleRes.rows[0];

  const days =
    (new Date(rent_end_date as string).getTime() -
      new Date(rent_start_date as string).getTime()) /
    (1000 * 60 * 60 * 24);

  const total_price = days * daily_rent_price;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [customer_id,vehicle_id,rent_start_date,rent_end_date,total_price]
  );
  return {
    id:result.rows[0].id,
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status: result.rows[0].status,
    vehicle:{
      vehicle_name,
      daily_rent_price: Number(daily_rent_price)
    }
  };
}

export const bookingServices = {
  createBooking,
}
