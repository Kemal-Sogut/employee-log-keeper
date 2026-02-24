# Employee Log Keeper

A web application for tracking and managing employee activity logs. Built and used during the summer job period at **PLAY (Platform for Leisure and Achievement of Youth)** — serving 30+ employees and handling 1,000+ log entries.

---

## Overview

Employee Log Keeper provides a simple, account-based interface where employees can log their daily actions and supervisors can review activity across the organization. The application was built to replace manual tracking and centralize records in a reliable, queryable format.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend & Database | Supabase (PostgreSQL) |
| Package Manager | Bun |

---

## Project Structure

```
employee-log-keeper/
├── public/              # Static assets
├── src/                 # Application source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Supabase client & utilities
├── supabase/            # Database migrations (PLpgSQL)
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Features

- User account creation and authentication via Supabase Auth
- Create, view, and manage employee activity logs
- Persistent storage backed by a PostgreSQL database
- Clean, responsive UI built with Tailwind CSS and shadcn/ui components
- Real-world scale: tested with 30+ employees and 1,000+ log entries

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kemal-Sogut/employee-log-keeper.git
   cd employee-log-keeper
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Apply database migrations**

   Run the SQL migration files found in the `supabase/` folder against your Supabase project, either via the Supabase dashboard SQL editor or the Supabase CLI:
   ```bash
   supabase db push
   ```

5. **Start the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Deployment

To build for production:

```bash
bun run build
# or
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting provider (Vercel, Netlify, etc.).

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Built by [Kemal Sogut](https://github.com/Kemal-Sogut)*
