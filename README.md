# Battery-as-Credit — React + Node.js + MySQL

This is the fully connected Battery-as-Credit prototype. The frontend is React/Vite and the backend is Node.js/Express with MySQL.

## 1. Create MySQL database

Run `backend/schema.sql` in MySQL Workbench, or:

```sql
CREATE DATABASE battery_credit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Configure backend

```bash
cd backend
copy .env.example .env
```

Edit `.env`:

```env
PORT=8000
DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/battery_credit
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRE=1d
CORS_ORIGINS=http://localhost:5173
```

Install and start:

```bash
npm install
npm run dev
```

## 3. Configure React

At the project root:

```bash
copy .env.example .env
npm install
npm run dev
```

The frontend uses `VITE_API_URL=http://localhost:8000`.

## 4. Seed demo data

With the backend running, open:

```text
POST http://localhost:8000/api/dev/seed
```

or in PowerShell:

```powershell
Invoke-RestMethod -Method Post http://localhost:8000/api/dev/seed
```

Demo rider: `+919876543210` / `sahana123`
Demo lender: `+919000000000` / `admin123`

## 5. Main API flow

- Auth: register/login/me
- KYC: submit/get
- WorkScore: calculated from MySQL work metrics
- Rider dashboard: live applications and score
- Financing: create/list/view applications
- Lender: summary, riders, applications, approve/reject
- Repayments: generated after approval and marked paid from the rider UI
- Ownership: calculated from paid repayments
