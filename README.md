# wMoney: Intelligent Financial Analytics

wMoney is a full-stack financial intelligence suite that turns messy bank data into clean, actionable insights. Using a custom NLP engine, it automatically categorizes thousands of raw transactions, giving users a unified view of their spending and subscription health.

## View Live Demo
- **Frontend**: https://wmoney-dashboard.onrender.com
- **Backend API**: https://wmoney-live-v2.onrender.com

## Key Technical Wins
- **Automated NLP Categorization**: Developed a backend logic layer that parses "noisy" transaction strings (e.g., "TST STARBUCKS #1234") into clean merchant entities and financial categories.
- **Big Data Performance**: Optimized the system to handle 10,000+ records with sub-second response times using Prisma batch operations (createMany).
- **Cloud Infrastructure**: Migrated from local SQLite to a production PostgreSQL (Supabase) cluster, implementing a reliable cloud-native data architecture.
- **Premium Data Viz**: Built a high-performance dashboard using Recharts to visualize asset allocation, spending trends, and subscription "burn rates."

## The Tech Stack
| Layer | Technologies |
| :--- | :--- |
| Frontend | React 18 (Vite), TypeScript, Tailwind CSS, Recharts |
| Backend | Node.js, Express, Custom NLP Logic |
| Database | PostgreSQL (Supabase), Prisma ORM |
| DevOps | Render (CI/CD), Git, Environment Security |

## Quick Start
### Clone & Install
```bash
git clone https://github.com/AnuragRawat22/wmoney-dashboard.git
npm install
```

### Environment Setup
Create a .env in the /server folder:
```env
DATABASE_URL="your_supabase_postgresql_url"
PORT=3001
```

### Sync & Seed
```bash
npx prisma db push
npx prisma db seed
```

### Run
```bash
npm run dev
```

## System Architecture
The app uses a decoupled client-server architecture. Raw data flows into the Express backend, passes through the NLP Processor for normalization, and is stored in Supabase. The React frontend then consumes these cleaned endpoints to render real-time financial metrics.
