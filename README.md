# Mooja Admin Dashboard

## Overview
Next.js admin dashboard for managing NGOs, protests, and invite codes. Provides a complete administrative interface for organization verification, protest management, and invite code generation.

## Features
- **NGO Management**: Full CRUD operations for organizations with verification status tracking
- **Request Processing**: Review and approve/reject NGO verification requests with invite code generation
- **Protest Management**: Create, update, and manage protest events
- **Invite Code System**: Generate, track, and manage verification codes
- **Dashboard Analytics**: Key metrics and statistics overview

## Tech Stack
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Supabase Storage

## Getting Started

### Prerequisites
- Node.js (version 18+ recommended)
- npm or yarn
- PostgreSQL database
- Supabase account

### Installation
```bash
# Clone the repository
git clone https://github.com/[username]/mooja-admin.git
cd mooja-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up the database
npx prisma db push
npx prisma generate

# Run the development server
npm run dev
```

### Environment Variables
Create a `.env` file with the following:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Environment
NODE_ENV=development
```

### Running the Application
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Core Functionality

### NGO Management
- **CRUD Operations**: Create, read, update, and delete NGO records
- **Verification Status**: Track pending, under_review, approved, and verified statuses
- **Profile Management**: Handle organization details, social media, and country information
- **File Uploads**: Upload and manage organization profile pictures via Supabase Storage

### Request Processing
- **Status Workflow**: Review pending requests → under_review → approve/reject
- **Invite Code Generation**: Automatically generate unique 8-character codes when approving
- **Bulk Actions**: Process multiple requests efficiently
- **Status Tracking**: Visual status badges and workflow indicators

### Protest Management
- **Event Creation**: Create new protest events with organizer assignment
- **CRUD Operations**: Full management of protest events
- **Organizer Linking**: Connect protests to verified NGOs
- **Location Management**: Handle city and country information

### Invite Code System
- **Code Generation**: Create unique verification codes for approved NGOs
- **Status Tracking**: Monitor used, active, and expired codes
- **Expiration Management**: 30-day expiration with automatic cleanup
- **Usage Analytics**: Track code redemption and success rates

## User Interface

### Dashboard Layout
```
├── Sidebar Navigation
│   ├── Dashboard Overview
│   ├── NGOs
│   ├── Requests
│   ├── Protests
│   ├── Invite Codes
│   └── Guide
├── Main Content Area
└── Header (User profile, logout)
```

### Key Components
- **Data Tables**: Sortable, filterable NGO and protest lists with action buttons
- **Status Badges**: Visual status tracking for verification states
- **Modal Dialogs**: Create, update, view, and delete operations
- **Cards**: Compact protest event cards with key information
- **Stats Cards**: Dashboard metrics and analytics

## Security & Access Control

### Authentication
- Supabase Auth integration with email/password login
- Session management with automatic logout
- Protected routes with authentication guards

### Role-Based Access Control
- Admin: Full access to all features
- Moderator: Read/write access (no delete permissions)
- Viewer: Read-only access
- Permission guards on sensitive operations

## Database Schema

### Models
- **Org**: Organizations with verification status, social media, and profile information
- **Protest**: Protest events linked to organizing NGOs
- **InviteCode**: Verification codes with expiration and usage tracking
- **app_permission**: Granular permission system
- **app_role**: Role-based access control

### Key Relationships
- NGOs can organize multiple protests
- NGOs can use invite codes for verification
- Protests are linked to organizing NGOs
- Role-based permissions control access levels

## Development

### Project Structure
```
├── app/                    # Next.js App Router pages
│   ├── ngos/              # NGO management pages
│   ├── requests/          # Request processing pages
│   ├── protests/          # Protest management pages
│   ├── invite-codes/      # Invite code management
│   ├── guide/             # User guide
│   └── login/             # Authentication
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── [feature]-modal.tsx # Feature-specific modals
├── lib/                  # Utility functions and actions
│   ├── actions/          # Server actions for CRUD operations
│   ├── auth-context.tsx  # Authentication context
│   └── supabase.ts       # Supabase client
├── prisma/               # Database schema and migrations
└── scripts/              # Utility scripts
```

### Available Scripts
```bash
# Development
npm run dev               # Start development server with Turbopack

# Production
npm run build             # Build for production
npm run start             # Start production server

# Database
npx prisma db push        # Push schema changes to database
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio

# Code Quality
npm run lint              # ESLint
```

## Deployment

### Production Build
```bash
# Build the application
npm run build

# Test production build locally
npm run start
```

### Environment Configuration
Ensure all environment variables are properly configured for production:
- Set production database URL
- Configure Supabase production credentials
- Set NODE_ENV=production

### Database Setup
```bash
# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Usage

### NGO Management
1. **View NGOs**: Navigate to NGOs page to see all organizations
2. **Create NGO**: Click "Add NGO" to create new organization
3. **Update NGO**: Click edit button to modify organization details
4. **Delete NGO**: Click delete button to remove organization (also removes associated invite codes)

### Request Processing
1. **Review Requests**: Go to Requests page to see pending applications
2. **Review**: Click "Review" to move from pending to under_review
3. **Approve**: Click "Approve" to generate invite code and approve organization
4. **Reject**: Click "Reject" to deny the application

### Protest Management
1. **View Protests**: Navigate to Protests page to see all events
2. **Create Protest**: Click "Add Protest" to create new event
3. **Assign Organizer**: Select verified NGO as organizer
4. **Manage Events**: Update or delete protest events as needed

### Invite Code Management
1. **View Codes**: Navigate to Invite Codes page
2. **Track Usage**: Monitor which codes are used, active, or expired
3. **Copy Codes**: Click to copy invite codes for distribution