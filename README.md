# wMoney: Intelligent Financial Dashboard

**wMoney** is a premium, full-stack financial intelligence suite engineered to solve the complexity of unstructured banking data through automated NLP-driven categorization and real-time visualization. It serves as a unified analytical layer, translating noisy, high-volume transactional data into coherent financial metrics and interactive dashboards.

## 🚀 Live Deployment
- **Frontend**: [https://wmoney-dashboard.onrender.com](https://wmoney-dashboard.onrender.com)
- **Backend API**: [https://wmoney-live-v2.onrender.com](https://wmoney-live-v2.onrender.com)

---

## 🏗️ Project Architecture

The application implements a decoupled client-server architecture designed for scalability and high-performance data processing:

- **Frontend Core**: A high-performance SPA built with **React** and **Vite**, utilizing **Tailwind CSS** for a premium glassmorphic UI and **Recharts** for complex data visualization.
- **Backend Logic Layer**: A **Node.js/Express** server that acts as the central controller for data ingestion, normalization, and secure database operations. It includes a custom NLP categorization engine.
- **Data Persistence**: **PostgreSQL** hosted on **Supabase**, managed via **Prisma ORM** for type-safe database operations and efficient migrations.

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Sophisticated Fintech Emerald Theme)
- **State Management**: React Context API
- **Visualization**: Recharts (D3-based charting)

### Backend
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Intelligence**: Custom NLP logic for merchant normalization
- **Database Architecture**: PostgreSQL (Cloud-hosted via Supabase)
- **ORM**: Prisma

---

## 🌟 Key Technical Accomplishments

- **Cloud Migration**: Successfully migrated the entire data infrastructure from a local SQLite environment to a professional, cloud-hosted **PostgreSQL** cluster on Supabase, ensuring enterprise-grade persistence and reliability.
- **NLP Intelligence Implementation**: Architected an NLP logic layer (`nlpProcessor.ts`) in the backend that performs structural parsing and normalization of raw bank transaction strings. It automatically strips irrelevant POS identifiers and alphanumeric noise to resolve raw inputs into clean merchant entities.
- **Big Data Optimization**: Engineered efficient data pipelines capable of handling **10,000+ records** using Prisma batch operations (`createMany`), maintaining sub-second query performance and ensuring consistently high UI frame rates in the client rendering layer.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- A Supabase account and PostgreSQL database

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AnuragRawat22/wmoney-dashboard.git
cd wmoney-dashboard
npm install
cd server && npm install
```

### 2. Environment Configuration
Create a `.env` file in the `/server` directory:
```env
DATABASE_URL="your_supabase_postgresql_connection_string"
DIRECT_URL="your_supabase_direct_connection_string"
PORT=3001
```

### 3. Database Initialization
Use Prisma to sync the schema and seed the database with optimized records:
```bash
cd server
npx prisma db push
npx prisma db seed
```

### 4. Running Locally
```bash
# Start both frontend and backend concurrently
npm run dev
```

---

## 📊 System Overview
Raw bank exports inherently suffer from noisy merchant definitions, containing terminal codes, gateway prefixes, and branch identification numbers. wMoney implements a pre-processing layer to strictly enforce data cleanliness before analytical consumption. By computing heavy analytical metrics (such as category aggregates and cumulative balances) upstream, the system minimizes JSON payload size and ensures a fluid, responsive user experience.
