# 📝 MERN Todo App Backend

A secure and scalable backend for a Todo application built using **Node.js, Express, MongoDB, and JWT authentication**.
This project implements user authentication and task management with clean architecture (Controller → Service → Model).

---

## 🚀 Features

* 🔐 User Registration & Login (JWT Authentication)
* 🔑 Secure password hashing using bcrypt
* 🛡️ Protected routes using middleware
* 📋 Task CRUD operations (Create, Read, Update, Delete)
* 👤 User-specific task management
* ⚡ Clean architecture (Controller → Service → Model)
* 🌐 RESTful API design

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (jsonwebtoken)
* **Security:** bcryptjs
* **Environment Management:** dotenv

---

## 📂 Folder Structure

```
todo-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   └── task.controller.js
│
├── middleware/
│   └── auth.middleware.js
│
├── models/
│   ├── user.model.js
│   └── task.model.js
│
├── routes/
│   ├── auth.routes.js
│   └── task.routes.js
│
├── services/
│   ├── auth.service.js
│   └── task.service.js
│
├── utils/
│   └── generateToken.js
│
├── app.js
├── server.js
├── .env.example
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone <your-repo-link>
cd todo-backend
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create `.env` file

Copy from `.env.example` and add your values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 4️⃣ Run the server

```
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers → stored in DB with hashed password
2. User logs in → receives JWT token
3. Token is sent in headers for protected routes
4. Middleware verifies token → allows access

---

## 📌 API Endpoints

### 🔑 Auth Routes

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | Register new user |
| POST   | /auth/login    | Login user        |

---

### 📋 Task Routes (Protected)

| Method | Endpoint   | Description                   |
| ------ | ---------- | ----------------------------- |
| GET    | /tasks     | Get all tasks (user-specific) |
| POST   | /tasks     | Create new task               |
| PUT    | /tasks/:id | Update task                   |
| DELETE | /tasks/:id | Delete task                   |

---

## 🧪 Testing (Postman)

1. Register user
2. Login → copy token
3. Add header:

```
Authorization: Bearer <token>
```

4. Test all task APIs

---

## 🧠 Key Concepts Used

* REST API Design
* MVC Architecture
* JWT Authentication
* Middleware Authorization
* MongoDB Relations (User ↔ Tasks)
* Error Handling

---

## 📌 Future Improvements

* Input validation (express-validator / yup)
* Pagination & filtering
* Rate limiting & security enhancements
* Deployment (Render / AWS)

---

## 👨‍💻 Author

**Aditya**
Full Stack Developer

---

## ⭐ Acknowledgement

This project was built as part of a MERN stack assignment to demonstrate backend development skills including authentication, API design, and clean architecture.

---
