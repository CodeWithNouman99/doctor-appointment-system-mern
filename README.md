# Prescripto: Doctor Appointment Booking System

A MERN stack web app to browse doctors by speciality and book appointments.

> 🚧 In development. Frontend pages are done; backend APIs are being built.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Context API
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth & Uploads:** JWT, bcrypt, Multer, Cloudinary

## Features

**Frontend**
- [x] Home, All Doctors (speciality filter), Doctor Appointment (slot picker)
- [x] About, Contact, Login / Sign Up, My Profile pages

**Backend**
- [x] Express server with MongoDB connection
- [x] Doctor and User models
- [x] Admin login with JWT
- [x] Add doctor API (password hashing, image upload to Cloudinary)
- [ ] Connect frontend to the APIs
- [ ] User register / login
- [ ] Book and cancel appointments
- [ ] Doctor and Admin panels

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

**Backend**

```bash
cd Backend
npm install
npm run start
```

Create a `.env` file in `Backend/`:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login, returns a JWT |
| POST | `/api/admin/add-doctor` | Add a doctor (admin token + image upload) |
