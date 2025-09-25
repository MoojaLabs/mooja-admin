# Mooja Admin Dashboard

Next.js admin dashboard for managing NGOs, protests, and invite codes.

## Tech Stack

- Next.js 15.5.3 + TypeScript
- Supabase (Auth + Database)
- Prisma ORM + PostgreSQL
- shadcn/ui + Tailwind CSS

## Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
NODE_ENV=development
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run

```bash
npm run dev
```

## Features

- **NGOs**: View, edit, delete verified organizations
- **Requests**: Review and approve/reject verification requests
- **Protests**: CRUD operations for protest events
- **Invite Codes**: Track and manage verification codes
- **Dashboard**: Platform statistics and recent activity

## Project Structure

```
├── app/                    # Pages
│   ├── ngos/              # NGO management
│   ├── requests/           # Request processing
│   ├── protests/           # Protest management
│   ├── invite-codes/       # Invite code management
│   └── login/              # Authentication
├── components/             # UI components
├── lib/actions/           # Server actions
└── prisma/                # Database schema
```

## Development

```bash
# Linting
npm run lint

# Database
npx prisma studio
npx prisma db push --force-reset
```