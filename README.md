<h1>Vehicle Rental Management System (Backend API)</h1>

**Live URL:** https://assignment-2-mu-eight.vercel.app 

---

## Project Overview

This project is a **backend REST API** for a **Vehicle Rental Management System**.  
It handles vehicle inventory, customer management, bookings, authentication, and role-based access control.

The system is designed with **scalability, security, and clean architecture** in mind, following a **modular(routes, controller, services), feature-based structure**.

---

## Key Features

### Vehicles
- Create, get, update, delete vehicles
- Track vehicle availability (`available`, `booked`)
- Prevent deletion if active bookings exist

### Customers
- User registration & authentication
- Profile update with role-based permissions
- Secure password hashing

### Bookings
- Create vehicle bookings
- Automatic total price calculation
- Cancel & return bookings
- Auto-return logic when rental period ends
- Role-based access (Admin vs Customer)

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
  - **Admin:** Full system access
  - **Customer:** Limited to own data

---

## Technology Stack

- **Node.js** – Runtime environment
- **TypeScript** – Type safety & maintainability
- **Express.js** – Web framework
- **PostgreSQL** – Relational database
- **bcrypt** – Password hashing
- **jsonwebtoken (JWT)** – Authentication
- **node-cron** – Scheduled auto-return jobs

---

## Project Structure

This project follows a **modular, feature-based architecture** with clear separation of concerns.

