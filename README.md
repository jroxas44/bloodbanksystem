# BloodBank Management System

A full-stack Blood Bank Management System built with **Nuxt.js 3**, **Vue.js 3**, **Prisma ORM**, and **MySQL**.

## Tech Stack

- **Frontend:** Nuxt.js 3, Vue.js 3 (Composition API), Tailwind CSS
- **Backend:** Nuxt Server Routes (Nitro)
- **Database:** MySQL 8.0 via Prisma ORM
- **Authentication:** JWT with httpOnly cookies
- **Icons:** Lucide Vue Next

## Features

### Admin
- Dashboard with blood inventory overview & analytics
- Manage users (add/delete clerks and admins)
- View all donations, requests, and donor records
- Blood inventory management & low stock alerts

### Clerk
- Register donors
- Record blood donations/collections
- Process blood requests (fulfill/reject)
- View & update blood inventory

### Security
- JWT-based authentication with httpOnly cookies
- Role-based access control (ADMIN/CLERK)
- Server-side validation for all mutations
- Donation status state machine (COLLECTED → TESTED → APPROVED)
- Transactional inventory updates to prevent race conditions

## Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0 (or Docker)

### Quick Start with Docker MySQL

```bash
# Start MySQL
docker run -d --name bloodbank-mysql \
  -e MYSQL_ROOT_PASSWORD=bloodbank123 \
  -e MYSQL_DATABASE=bloodbank \
  -p 3306:3306 mysql:8.0

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and update:

```
DATABASE_URL="mysql://root:bloodbank123@localhost:3306/bloodbank"
JWT_SECRET="your-secret-key-here"
```

### Login Credentials

- **Admin:** admin@bloodbank.com / admin123
- **Clerk:** clerk@bloodbank.com / clerk123

## Development

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Database

```bash
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio
npx tsx prisma/seed.ts    # Seed database
npx prisma migrate reset  # Reset database
```
