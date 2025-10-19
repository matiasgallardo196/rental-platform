# Rental Platform - Frontend

Modern property rental platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Authentication**: Supabase Auth (@supabase/auth-helpers)
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
│ ├── supabase-browser.ts # Supabase client (browser)
│ ├── supabase-server.ts # Supabase client (server)
│ └── utils.ts # Utility functions
├── types/ # TypeScript type definitions
└── middleware.ts # Route protection middleware
\`\`\`

## Features

### Phase 1 - Authentication

- [x] Email/password authentication
- [x] Google OAuth integration
- [x] Apple OAuth integration (pendiente configuración)
- [x] Protected routes with middleware
- [x] Login page
- [x] Registration page
- [x] Forgot password page
- [x] Form validation with Zod
- [x] Toast notifications
- [x] Light/dark theme support

## Environment Variables (Frontend)

| Variable                        | Description          | Required |
| ------------------------------- | -------------------- | -------- |
| `NEXT_PUBLIC_API_URL`           | Backend API URL      | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key    | Yes      |

Example `.env` for local development:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Supabase: Configuración Dev/Prod

1. Authentication → URL configuration

- Dev: Site URL `http://localhost:3000`
- Prod: Site URL `https://<tu-dominio>`
- Agregar `http(s)://<dominio>/auth/callback` en Additional Redirect URLs

2. Providers

- Google: activa el provider y pega Client ID/Secret (desde Google Cloud)
- Apple: opcional; requiere cuenta de Apple Developer

3. Políticas y Tablas

- Tabla `profiles` con RLS (read/update/insert own).
- `user_metadata.role` establecido en el callback (guest por defecto).

4. Emails

- Configurar remitente/SMTP en Prod para verificación y reset.

## Google Cloud Console (Dev/Prod)

- Crea un OAuth 2.0 Client ID de tipo "Web".
- Autorizados:
  - Dev: Authorized JavaScript origins `http://localhost:3000`
  - Dev: Authorized redirect URIs `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
  - Prod: Authorized JavaScript origins `https://<tu-dominio>`
  - Prod: Authorized redirect URIs `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
- Pega Client ID/Secret en Supabase → Authentication → Providers → Google.

## Despliegue a Producción

- Frontend: definir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el ambiente de despliegue.
- Supabase: cambiar Site URL a tu dominio y mantener `/auth/callback` en Additional Redirect URLs.
- Google: agregar tu dominio en orígenes/redirecciones.
- Seguridad: mantener RLS activa y revisar roles/permisos.

## Checklist de Lanzamiento (Prod)

- Variables de entorno
  - Front: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
  - Back: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`
- Supabase
  - Authentication → URL configuration → Site URL = `https://<tu-dominio>`
  - Additional Redirect URLs incluye `https://<tu-dominio>/auth/callback`
  - Providers → Google con Client ID/Secret de producción
  - Emails → remitente/SMTP de producción
  - RLS activas en todas las tablas con datos de usuarios
- Google Cloud Console
  - OAuth Web Client: Origins `https://<tu-dominio>` y Redirect `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
  - Publicación del consent screen si aplica
- Backend (NestJS)
  - CORS permitir `https://<tu-dominio>`
  - Throttler activo (ajustar límites si es necesario)
  - Logs y monitoreo habilitados

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
