## Project Name: 💊 MediHub:

**Your Trusted Online Medicine Shop**

MediHub is a full-stack e-commerce platform for purchasing Over-the-Counter (OTC) medicines online. It provides a secure and user-friendly experience for customers, sellers, and administrators. Customers can browse medicines, place orders, and make secure payments using Stripe. Sellers can manage medicine inventories and fulfill customer orders, while administrators oversee users, medicines, categories, and platform activities.

---

# 🌐 Live Demo

<!-- ppp -->

### Frontend

```
https://your-frontend-url.vercel.app
```

### Backend API

```
https://your-backend-url.vercel.app
```

---

# 📂 GitHub Repository

### Frontend

```
https://github.com/your-username/medihub-frontend
```

### Backend

```
https://github.com/your-username/medihub-backend
```

---

# 📖 Project Overview

MediHub is designed to simplify online medicine purchasing while ensuring secure order management and payment processing.

The platform supports three different roles:

- Customer
- Seller
- Admin

Customers can browse medicines, add items to their cart, place orders, track deliveries, and leave reviews.

Sellers can manage medicine inventories, update stock levels, and process customer orders.

Admins can manage users, categories, medicines, orders, and monitor overall platform activities.

---

# 🚀 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Refresh Token
- Logout
- Change Password
- Update Profile
- Role-based Authorization

---

## Customer Features

- Browse Medicines
- Search Medicines
- Filter Medicines
- View Medicine Details
- Add to Cart
- Update Cart
- Remove Cart Item
- Place Order
- Secure Stripe Payment
- Track Order Status
- View Order History
- Leave Reviews
- Update Profile

---

## Seller Features

- Seller Registration
- Add Medicine
- Update Medicine
- Delete Medicine
- Manage Stock
- View Seller Orders
- Update Order Status

---

## Admin Features

- Dashboard Statistics
- Manage Users
- Ban / Unban Users
- Manage Categories
- View All Medicines
- Delete Medicines
- View All Orders
- Monitor Platform Activities

---

# 💳 Stripe Payment Integration

MediHub integrates Stripe Checkout for secure online payments.

---

# 👥 User Roles

| Role     | Permissions                     |
| -------- | ------------------------------- |
| Customer | Browse, Cart, Checkout, Reviews |
| Seller   | Manage Medicines & Orders       |
| Admin    | Manage Entire Platform          |

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- Stripe API
- Cookie Parser
- CORS

---

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- Axios
- TanStack Query

---

# 🗄 Database

---

# 🔐 Authentication

Authentication is handled using JWT.

Protected routes require:

---

# 📦 API Endpoints

## Authentication

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/login           |
| POST   | /api/auth/change-password |
| GET    | /api/auth/me              |
| PATCH  | /api/auth/profile         |

---

## Category

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /api/categories     |
| GET    | /api/categories     |
| GET    | /api/categories/:id |
| PATCH  | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Medicine

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/medicines     |
| GET    | /api/medicines     |
| GET    | /api/medicines/:id |
| PATCH  | /api/medicines/:id |
| DELETE | /api/medicines/:id |

Supports:

- Search
- Category Filter
- Manufacturer Filter
- Price Filter
- Pagination
- Sorting

---

## Cart

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /api/cart     |
| GET    | /api/cart     |
| PATCH  | /api/cart/:id |
| DELETE | /api/cart/:id |

---

## Order

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/orders        |
| GET    | /api/orders        |
| GET    | /api/orders/:id    |
| GET    | /api/orders/seller |
| PATCH  | /api/orders/:id    |

---

## Payment

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| POST   | /api/payments/create-checkout-session |
| POST   | /api/payments/webhook                 |
| GET    | /api/payments/history                 |

---

## Review

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/reviews     |
| GET    | /api/reviews     |
| PATCH  | /api/reviews/:id |
| DELETE | /api/reviews/:id |

---

## Admin

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/admin/dashboard |
| GET    | /api/admin/users     |
| PATCH  | /api/admin/users/:id |
| GET    | /api/admin/orders    |
| GET    | /api/admin/medicines |

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/medihub-backend.git
```

Move into project

```bash
cd medihub-backend
```

Install dependencies

```bash
npm install
```

Create environment

```
PORT=

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Seed Database

```bash
npm run seed
```

Run Development Server

```bash
npm run dev
```

---

## ⭐ If you found this project helpful, consider giving it a star on GitHub!

## ERD Relations Link:

<!-- ppp -->

## ERD Relations Image:
