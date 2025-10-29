# Sumbong2Gov
A public platform designed to empower citizens to voice, track, and resolve community issues by reporting them.

## Features

- **Public Grievance Dashboard**: A transparent view of all submitted issues and their current status.
- **Simple Submission Form**: Easily report grievances, with the option to remain anonymous.
- **Admin Management Panel**: A secure dashboard for moderators to review, update, and manage submissions.
- **Support Button**: Other citizens can “support” a report to show it affects many people.
## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Bcrypt for password hashing

---

## Getting Started


```bash
# Clone the repository
git clone https://github.com/yuichi192168/sumbong2gov.git

# Navigate into the project directory
cd sumbong2gov
```

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or newer)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Supabase](https://supabase.com/) account and a new project

### 2. Set Up Environment Variables

First, create a `.env.local` file in the root of the project. Copy the contents of `.env.example` into it:

```bash
cp .env.example .env.local
```

Next, fill in the values with your Supabase project's API URL and keys, which you can find in your Supabase project dashboard under **Project Settings > API**.

```env
# Supabase Project URL and API Keys
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

### 3. Set Up the Database

You need to run some SQL queries to set up the necessary tables and data in your Supabase database.

1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
2.  Open the `setup.sql` file from this project, copy its contents, and run it in the SQL Editor. This will create the required tables and set the default admin password to **"ikulongnayanmgakurakot"**.

### 4. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 5. Run the Development Server

You can now start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### 6. Access the Admin Dashboard

-   The admin login page is at `/admin/login`.
-   The default password is `ikulongnayanmgakurakot`.
