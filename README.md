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

### Quick Start with Docker (Recommended)

The easiest way to run the entire stack (frontend, backend, and database) is using Docker Compose:

```bash
# Build and start all services (includes automatic database seeding)
docker-compose up -d

# The application will be available at http://localhost:3001
# MySQL will be available at localhost:3307
```

To stop the services:

```bash
docker-compose down
```

To rebuild after making changes:

```bash
docker-compose up -d --build
```

### Alternative: Manual Setup (Without Docker)

#### Prerequisites
- [Node.js 20+](https://nodejs.org/en/download)
- [MySQL 8.0](https://dev.mysql.com/downloads/mysql/) (local installation) OR [Docker](https://www.docker.com/products/docker-desktop/) (for MySQL only)
- [Git](https://git-scm.com/downloads)

#### Option A: Using Local MySQL Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MySQL credentials
# DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/bloodbank"

# Create database in MySQL
mysql -u root -p
CREATE DATABASE bloodbank;
EXIT;

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

#### Option B: Using Docker for MySQL Only

```bash
# Start MySQL in Docker
docker run -d --name bloodbank-mysql \
  -e MYSQL_ROOT_PASSWORD=bloodbank123 \
  -e MYSQL_DATABASE=bloodbank \
  -p 3306:3306 mysql:8.0

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

#### Quick Setup Script

Run the setup script to automate the process:

```bash
# For local MySQL
npm run setup:local

# For Docker MySQL
npm run setup:docker-mysql
```

### Environment Variables

For Docker Compose, the environment variables are already set in `docker-compose.yml`. No additional `.env` file is needed.

For manual setup, copy `.env.example` to `.env` and update:

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
