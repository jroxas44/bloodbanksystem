# BloodBank Management System

A full-stack blood bank management system built with Next.js, featuring role-based access for administrators and clerks.

## Features

### Admin Features
- **Dashboard**: Overview of blood inventory, recent donations, and pending requests
- **User Management**: Create, view, and delete system users (admins and clerks)
- **Full Access**: All clerk features plus administrative controls

### Clerk Features
- **Donor Management**: Register new donors, view donor profiles and donation history
- **Donation Recording**: Record blood donations with donor selection and details
- **Blood Inventory**: Monitor stock levels with low-stock alerts, edit inventory
- **Blood Requests**: Create and process blood requests with urgency levels

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@bloodbank.com | admin123 |
| Clerk | clerk@bloodbank.com | clerk123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── donors/          # Donor management
│   │   ├── donations/       # Donation tracking
│   │   ├── inventory/       # Blood inventory
│   │   ├── requests/        # Blood requests
│   │   └── users/           # User management (admin only)
│   └── api/                 # API route handlers
├── components/
│   ├── shared/              # App-level components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities and database client
└── types/                   # TypeScript type definitions
```
