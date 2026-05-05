# BloodBank Management System — Local Setup Guide

This guide walks you through everything needed to run the BloodBank Management System on your local machine.

---

## Prerequisites

You need the following tools installed before getting started:

### 1. Node.js (v18 or higher)

Node.js is the JavaScript runtime required to run the application.

- **Download:** [https://nodejs.org/en/download](https://nodejs.org/en/download)
- Choose the **LTS** version (recommended).
- The installer includes **npm** (Node Package Manager), which is also required.

**Verify installation:**

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

> **Alternative (using nvm):**
> If you prefer using a version manager, install [nvm](https://github.com/nvm-sh/nvm):
>
> ```bash
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
> nvm install 18
> nvm use 18
> ```

---

### 2. MySQL 8.0

MySQL is the database used by the application. You have **two options**:

#### Option A: Install MySQL directly

- **Windows:** [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- **macOS:** [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/) or via Homebrew:
  ```bash
  brew install mysql
  brew services start mysql
  ```
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update
  sudo apt install mysql-server
  sudo systemctl start mysql
  ```

After installing, create the database:

```sql
mysql -u root -p
CREATE DATABASE bloodbank;
EXIT;
```

#### Option B: Use Docker (recommended — no installation mess)

If you don't have MySQL installed, Docker is the easiest way to get it running.

1. **Install Docker Desktop:**
   - **Windows / macOS:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - **Linux:** [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

2. **Start MySQL in a Docker container:**

   ```bash
   docker run -d --name bloodbank-mysql \
     -e MYSQL_ROOT_PASSWORD=bloodbank123 \
     -e MYSQL_DATABASE=bloodbank \
     -p 3306:3306 \
     mysql:8.0
   ```

   This creates a MySQL server running on port `3306` with:
   - Root password: `bloodbank123`
   - Database: `bloodbank` (auto-created)

**Verify MySQL is running:**

```bash
# If installed directly:
mysql -u root -p -e "SELECT 1"

# If using Docker:
docker exec bloodbank-mysql mysql -uroot -pbloodbank123 -e "SELECT 1"
```

---

### 3. Git

Git is needed to clone the repository.

- **Download:** [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Windows:** The installer includes Git Bash.
- **macOS:** Comes pre-installed, or install via `brew install git`.
- **Linux:** `sudo apt install git`

**Verify installation:**

```bash
git --version
```

---

## Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/jroxas44/bloodbanksystem.git
cd bloodbanksystem
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required Node.js packages (Nuxt.js, Prisma, Tailwind CSS, etc.).

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and update the values if needed:

```env
DATABASE_URL="mysql://root:bloodbank123@localhost:3306/bloodbank"
JWT_SECRET="your-secret-key-here"
```

| Variable       | Description                                      | Default Value                                          |
| -------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `DATABASE_URL` | MySQL connection string                          | `mysql://root:bloodbank123@localhost:3306/bloodbank`    |
| `JWT_SECRET`   | Secret key for JWT token signing                 | `bloodbank-jwt-secret-change-in-production`            |

> **Note:** If you installed MySQL directly with a different root password, update the `DATABASE_URL` accordingly.

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This generates the database client code that the application uses to interact with MySQL.

### Step 5: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all the necessary tables in your MySQL database:
- `User` — system users (admin/clerk accounts)
- `Donor` — registered blood donors
- `Donation` — blood donation records
- `BloodInventory` — blood stock levels by type
- `BloodRequest` — hospital blood requests

### Step 6: Seed the Database

```bash
npx tsx prisma/seed.ts
```

This populates the database with:
- **Admin account:** admin@bloodbank.com / admin123
- **Clerk account:** clerk@bloodbank.com / clerk123
- **Blood inventory:** Initial stock for all 8 blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)

### Step 7: Start the Development Server

```bash
npm run dev
```

The application will be available at: **[http://localhost:3000](http://localhost:3000)**

---

## Login Credentials

| Role  | Email                  | Password  | Access                                    |
| ----- | ---------------------- | --------- | ----------------------------------------- |
| Admin | admin@bloodbank.com    | admin123  | Full access + User Management             |
| Clerk | clerk@bloodbank.com    | clerk123  | Donors, Donations, Inventory, Requests    |

---

## Common Issues & Troubleshooting

### "Can't connect to MySQL server"

- Make sure MySQL is running:
  ```bash
  # Docker:
  docker ps    # Should show bloodbank-mysql container
  docker start bloodbank-mysql   # If stopped

  # Direct install:
  sudo systemctl start mysql     # Linux
  brew services start mysql      # macOS
  ```
- Verify the `DATABASE_URL` in `.env` matches your MySQL credentials.

### "Port 3306 already in use"

Another MySQL instance may already be running. Either:
- Stop the existing instance, or
- Change the Docker port mapping: `-p 3307:3306` and update `DATABASE_URL` to use port `3307`.

### "Port 3000 already in use"

Another application is using port 3000. Either stop it, or run:
```bash
npx nuxt dev --port 3001
```

### "prisma migrate dev" fails

- Ensure MySQL is running and the `bloodbank` database exists.
- Check your `DATABASE_URL` in `.env`.
- Try resetting the database: `npx prisma migrate reset`

### "npx tsx prisma/seed.ts" fails

- Make sure you ran `npx prisma generate` first.
- Make sure migrations have been applied: `npx prisma migrate dev`

---

## Useful Commands

| Command                        | Description                                  |
| ------------------------------ | -------------------------------------------- |
| `npm run dev`                  | Start development server (http://localhost:3000) |
| `npm run build`                | Build for production                         |
| `npm run preview`              | Preview production build                     |
| `npx prisma generate`         | Regenerate Prisma client                     |
| `npx prisma migrate dev`      | Run pending database migrations              |
| `npx prisma migrate reset`    | Reset database (drops all data)              |
| `npx prisma studio`           | Open Prisma Studio (visual database browser) |
| `npx tsx prisma/seed.ts`      | Seed database with initial data              |

---

## Project Structure

```
bloodbanksystem/
├── app.vue                    # Root Vue component
├── nuxt.config.ts             # Nuxt configuration
├── prisma.config.ts           # Prisma configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── assets/css/                # Global CSS styles
├── components/                # Reusable Vue components
├── composables/               # Vue composables (useAuth, useToast)
├── layouts/                   # Page layouts (default, dashboard)
├── middleware/                # Route middleware (auth)
├── pages/                     # File-based routing
│   ├── login.vue              # Login page
│   ├── dashboard.vue          # Dashboard with stats
│   ├── donors/                # Donor management pages
│   ├── donations/             # Donation tracking pages
│   ├── inventory.vue          # Blood inventory page
│   ├── requests/              # Blood request pages
│   └── users/                 # User management (admin only)
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed script
│   └── migrations/            # Database migrations
├── server/
│   ├── api/                   # API route handlers
│   └── utils/                 # Server utilities (auth, prisma)
└── public/                    # Static assets
```
