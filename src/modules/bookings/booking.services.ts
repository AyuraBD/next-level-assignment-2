import { pool } from "../../config/DB";

const createBooking = async (payload:Record<string,unknown>)=>{
  const {customer_id,vehicle_id,rent_start_date,rent_end_date} = payload;
  
  const vehicleRes = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if(vehicleRes.rowCount === 0){
    throw new Error("Vehicle not found");
  }

  const {vehicle_name, daily_rent_price, availability_status} = vehicleRes?.rows[0];
  
  if(availability_status !== "available"){
    throw new Error("Vehicle is already booked");
  }

  const days = (new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime()) / (1000 * 60 * 60 * 24);

  if(days <= 0){
    throw new Error("Invalid rental dates");
  }

  const total_price = days * daily_rent_price;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [customer_id,vehicle_id,rent_start_date,rent_end_date,total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id=$1`,
    [vehicle_id]
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

const getBookings = async (user: any) => {
  let query = `
    SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date,b.rent_end_date,
      b.total_price, b.status, u.name AS customer_name, u.email AS customer_email,
      v.vehicle_name, v.registration_number, v.type FROM bookings b JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `;
  const values: any[] = [];

  if (user.role === "customer") {
    query += ` WHERE b.customer_id = $1`;
    values.push(user.id);
  }
  const result = await pool.query(query, values);

  if(user.role === "admin"){
    return result.rows.map(row => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: new Date(row.rent_start_date).toISOString().split("T")[0],
    rent_end_date: new Date(row.rent_end_date).toISOString().split("T")[0],
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
  } else if(user.role === "customer"){
    return result.rows.map(row => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: new Date(row.rent_start_date).toISOString().split("T")[0],
      rent_end_date: new Date(row.rent_end_date).toISOString().split("T")[0],
      total_price: row.total_price,
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type
      },
    }));
  }
};

const cancelBooking = async (id: string, userId: number) => {
  const result = await pool.query(
    `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = $1 AND customer_id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date::text AS rent_start_date, rent_end_date::text AS rent_end_date, total_price, status
    `,
    [id, userId]
  );
  if (result.rows.length === 0) {
    throw new Error("Booking not found or not authorized");
  }
  const cancelResult = result.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id=$1`,
    [cancelResult.vehicle_id]
  );
  return {
    id: cancelResult.id,
    customer_id: cancelResult.customer_id,
    vehicle_id: cancelResult.vehicle_id,
    rent_start_date: cancelResult.rent_start_date,
    rent_end_date: cancelResult.rent_end_date,
    total_price: cancelResult.total_price,
    status: cancelResult.status
  }
};

const returnBooking = async (id: string) => {
  const bookingRes = await pool.query(
    `
    UPDATE bookings
    SET status = 'returned'
    WHERE id = $1
    RETURNING id, customer_id, vehicle_id, rent_start_date::text AS rent_start_date, rent_end_date::text AS rent_end_date, total_price, status
    `,
    [id]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  const vehicleRes = await pool.query(
    `
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id = $1
    RETURNING availability_status
    `,
    [booking.vehicle_id]
  );
  
  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: booking.total_price,
    status: booking.status,
    vehicle: {
      availability_status: vehicleRes.rows[0].availability_status,
    },
  };
};

const autoReturnBookings = async () => {
  const bookingRes = await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active'
    AND rent_end_date < CURRENT_DATE
    RETURNING vehicle_id
  `);
  
  const vehicleIds = bookingRes.rows.map(row => row.vehicle_id);
  await pool.query(
    `
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id = ANY($1)
    `,
    [vehicleIds]
  );
};

export const bookingServices = {
  createBooking,
  getBookings,
  cancelBooking,
  returnBooking,
  autoReturnBookings
}
