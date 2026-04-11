# wMoney: Financial Intelligence Suite

wMoney is a full-stack financial intelligence suite engineered to solve the problem of unstructured banking data through automated normalization and real-time visualization. It serves as a unified analytical layer, translating noisy, high-volume transactional data into coherent financial metrics and interactive dashboards.

## System Architecture

The application utilizes a decoupled client-server architecture to cleanly separate presentation logic from data processing and persistence:

- **Client Application**: A single-page application (SPA) built with React and Vite, optimized for rapid rendering and state management.
- **RESTful API**: A Node.js and Express backend acting as the central controller for data ingestion, normalization, and secure database operations.
- **Object-Relational Mapping**: Prisma ORM manages data modeling and abstract database communication, ensuring type-safe transactions.

## Data Engineering & Performance

The core infrastructure of wMoney is designed to handle substantial data throughput efficiently:

- **High-Volume Data Management**: Capable of managing 10,000+ transactional records simultaneously within the embedded relational SQLite environment.
- **Optimized Compute Allocation**: Relies on strict database indexing and server-side aggregation. By computing heavy analytical metrics (such as category aggregates and cumulative balances) upstream, the system minimizes JSON payload size and ensures consistently high UI frame rates in the client rendering layer.

## Transaction Normalization Engine

Raw bank exports inherently suffer from noisy merchant definitions, containing terminal codes, gateway prefixes, and branch identification numbers. wMoney implements a pre-processing layer to strictly enforce data cleanliness before analytical consumption.

- **Pattern Matching Pipeline**: A custom regular expression and pattern matching engine structurally parses and evaluates substrings in raw transaction inputs.
- **Data Sanitization**: Automatically strips irrelevant POS identification headers (e.g., "SQ _", "TST_", "ACH DEBIT") and alphanumeric transaction IDs.
- **Standardized Visualization**: By resolving raw inputs into clean merchant entities, downstream data visualizations and category categorizations remain highly accurate and deterministic.

## Technical Stack

### Frontend

- **React (Vite)**: Core UI framework and build tooling.
- **TypeScript**: Static typing for deterministic component contracts.
- **Tailwind CSS**: Utility-first styling for responsive interface layout.
- **Recharts**: D3-based charting components for analytical rendering.

### Backend

- **Node.js / Express.js**: Asynchronous event-driven backend server.
- **TypeScript**: Shared type definitions and server-side safety boundaries.
- **Prisma**: Type-safe database client and schema management.

### Storage

- **SQLite**: Embedded relational database enabling lightweight, zero-configuration persistence.

## Installation & Deployment

Prerequisites required for execution include Node.js and npm/yarn package managers.

1. Install module dependencies for both the root environment and server daemon:

   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

2. Initialize the SQLite development database:

   ```bash
   cd server
   npx prisma db push
   cd ..
   ```

3. Launch the development servers concurrently:

   ```bash
   # In terminal 1 (Backend)
   cd server
   npm run dev

   # In terminal 2 (Frontend)
   npm run dev
   ```

The client application will be successfully bound and listening for HTTP traffic on standard local ports.
