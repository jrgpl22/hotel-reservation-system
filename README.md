# Hotel Reservation System

A full-stack hotel reservation web application built with the MERN stack (MongoDB, Express, React, Node.js). Guests can browse rooms, check availability, and manage their own reservations. Staff and admins manage rooms, reservations, and users.

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, Bootstrap
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Authentication:** JWT, bcrypt

## Features

- Guest registration, login, and profile management
- Role-based access: guest, staff, admin
- Room browsing and booking
- Reservation management
- Admin dashboard
- Secure JWT authentication with hashed passwords
- Responsive, animated UI with a shared design system

## User Roles

| Role  | Can do |
|-------|--------|
| Guest | Browse rooms, book, view/cancel own reservations, manage own profile |
| Staff | View/manage reservations, manage own profile |
| Admin | Everything staff can do, plus manage rooms, users, and view the dashboard |
