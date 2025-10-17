# Rental Platform - Frontend

Modern property rental platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Copy `.env.example` to `.env.local` and fill in your environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/
│ ├── (auth)/ # Authentication pages (login, register, forgot-password)
│ ├── api/ # API routes
│ ├── dashboard/ # Protected dashboard pages
│ └── page.tsx # Home page
├── components/
│ ├── auth/ # Authentication components
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── auth.ts # NextAuth configuration
│ └── utils.ts # Utility functions
├── types/ # TypeScript type definitions
└── middleware.ts # Route protection middleware
\`\`\`

## Features

### Phase 1 - Authentication (Week 1)

- [x] Email/password authentication
- [x] Google OAuth integration
- [x] Apple OAuth integration (UI ready)
- [x] Protected routes with middleware
- [x] Login page
- [x] Registration page
- [x] Forgot password page
- [x] Form validation with Zod
- [x] Toast notifications
- [x] Light/dark theme support

## Environment Variables

| Variable               | Description            | Required         |
| ---------------------- | ---------------------- | ---------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API URL        | Yes              |
| `NEXTAUTH_URL`         | App URL for NextAuth   | Yes              |
| `NEXTAUTH_SECRET`      | Secret for NextAuth    | Yes              |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID | For Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret    | For Google login |

Example `.env` for local development:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# NEXT_PUBLIC_MAPBOX_TOKEN=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-please-change-in-production

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Development Roadmap

- **Month 1**: Auth, Profiles, Property CRUD, Catalog
- **Month 2**: Detail pages, Calendar, Checkout, Messaging
- **Month 3**: Reviews, Maps, Admin, Analytics
- **Month 4**: Mobile app (Guest)
- **Month 5**: Mobile app (Host)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Please follow the established patterns and conventions in the codebase.
