# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 hotel management application for Al-Jabri Towers in Saudi Arabia. It features a bilingual (English/Arabic) interface with RTL support, hotel booking system, blog platform, and admin dashboard.

## Development Commands

### Running the Application
```bash
pnpm dev          # Start development server on port 3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Operations
```bash
pnpm db:generate  # Generate Drizzle schema from changes
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm db:seed      # Seed database with initial data
pnpm db:seed-blogs # Seed blog data specifically
```

## Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth 5 (beta) with JWT sessions and credentials provider
- **Storage**: Supabase S3-compatible storage for images/files
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Rich Text**: TipTap editor for blog content
- **i18n**: Custom context-based solution supporting English/Arabic with RTL

### Project Structure

```
app/
├── (routes)/         # Public-facing pages
│   ├── about/
│   ├── blogs/
│   ├── booking/
│   ├── contact/
│   └── login/
├── dashboard/        # Admin protected routes
│   ├── activities/   # User activity logs
│   ├── blogs/        # Blog management
│   ├── bookings/     # Booking management
│   ├── hotels/       # Hotel management
│   └── users/        # User management
└── api/              # API routes
    ├── auth/         # NextAuth handlers
    ├── blogs/
    ├── bookings/
    ├── hotels/
    └── upload/       # S3 file upload

db/
├── schema/           # Drizzle ORM schemas (modular)
│   ├── users.ts      # Users, sessions, accounts
│   ├── blogs.ts      # Blog posts with bilingual content
│   ├── hotels.ts     # Hotels and rooms
│   ├── bookings.ts   # Hotel bookings
│   ├── offers.ts     # Special offers
│   └── activities.ts # User activity logs
├── migrations/       # Generated SQL migrations
└── index.ts          # Database connection

lib/
├── auth.ts           # NextAuth configuration
├── middleware.ts     # Auth middleware helpers
├── s3.ts             # Supabase S3 client functions
├── activity-logger.ts # User activity tracking
├── i18n-context.tsx  # Internationalization context
└── utils.ts          # Utility functions

components/
├── ui/               # Reusable Radix UI components
├── blog-blocks/      # Blog content block components
└── (feature components) # Feature-specific components
```

### Authentication & Authorization

The app uses NextAuth 5 with a three-tier role system:
- **user**: Regular users (can make bookings)
- **admin**: Can manage hotels, bookings, blogs
- **super-admin**: Full system access including user management

**Auth Middleware Helpers** (in `lib/middleware.ts`):
- `requireAuth()`: Ensures user is authenticated
- `requireAdmin()`: Requires admin or super-admin role
- `requireSuperAdmin()`: Requires super-admin role only

API routes should use these middleware functions to protect endpoints:

```typescript
import { requireAdmin } from "@/lib/middleware"

const session = await requireAdmin()
if (session instanceof NextResponse) return session // Returns 401/403 if unauthorized
```

### Database Schema

All schemas are modular in `db/schema/` and exported through `db/schema/index.ts`.

**Key Tables**:
- `users`: User accounts with role-based access
- `blogs`: Bilingual blog posts with structured content blocks (text/image)
- `hotels`: Hotel information with multiple rooms
- `bookings`: Hotel reservations linked to users and hotels
- `userActivities`: Audit trail of all user actions

**Blog Content Structure**:
Blogs use JSONB for flexible content blocks:
```typescript
type ContentBlock =
  | { type: "text", id: string, data: string } // Rich text HTML
  | { type: "image", id: string, src: string, caption?: string }
```

Blogs support bilingual content with separate fields for English (`title`, `content`, `excerpt`) and Arabic (`titleAr`, `contentAr`, `excerptAr`).

### Internationalization

The app uses a custom i18n solution via React Context (`lib/i18n-context.tsx`):
- Locale stored in localStorage
- Automatic RTL/LTR direction switching
- Translations inline in the context file
- Use `useI18n()` hook to access `locale`, `setLocale()`, and `t()` function

When modifying UI text, update both `translationsEn` and `translationsAr` objects in `i18n-context.tsx`.

### File Storage

Files are stored in Supabase S3-compatible storage. Key functions in `lib/s3.ts`:
- `uploadToS3(file, key, contentType)`: Upload file buffer
- `deleteFromS3(key)`: Delete file by key
- `getPresignedUploadUrl(key, contentType)`: Generate presigned URL for client uploads
- `extractS3Key(url)`: Extract S3 key from full URL

**Environment Variables** (see `.env.example`):
```
SUPABASE_ACCESS_KEY_ID
SUPABASE_SECRET_ACCESS_KEY
SUPABASE_BUCKET_NAME
```

Note: Despite variable names in `.env.example` referring to AWS, the actual implementation uses Supabase storage.

### Activity Logging

User actions are logged automatically using `lib/activity-logger.ts`:
```typescript
import { logActivity, ActivityActions } from "@/lib/activity-logger"

await logActivity({
  userId: session.user.id,
  action: ActivityActions.BLOG_CREATED,
  details: { blogId, title },
  request // Optional NextRequest for IP/user-agent
})
```

## Important Patterns

### Path Aliases
All imports use `@/` prefix for root-level imports (configured in `tsconfig.json`):
```typescript
import { db } from "@/db"
import { Button } from "@/components/ui/button"
```

### Database Queries
Use Drizzle ORM for type-safe queries:
```typescript
import { db } from "@/db"
import { blogs } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const posts = await db.select().from(blogs).where(eq(blogs.published, true)).orderBy(desc(blogs.createdAt))
```

### Protected Routes
Dashboard routes automatically require authentication. Use middleware helpers in API routes.

### Rich Text Editor
The blog editor (`components/wysiwyg-editor.tsx`) uses TipTap with extensions for:
- Text formatting (bold, italic, underline)
- Colors and text alignment
- Links and images
- HTML output for storage

### Bilingual Content Management
When creating/editing blogs:
1. Use `BlogFormV2` component which supports both English and Arabic content
2. Store English content in `title`, `content`, `excerpt`
3. Store Arabic content in `titleAr`, `contentAr`, `excerptAr`
4. Display content based on current locale from `useI18n()`

## Common Workflows

### Adding a New Database Table
1. Create schema file in `db/schema/[name].ts`
2. Export from `db/schema/index.ts`
3. Run `pnpm db:generate` to create migration
4. Run `pnpm db:push` or `pnpm db:migrate` to apply

### Creating Protected API Endpoints
```typescript
import { requireAdmin } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  // Your logic here with session.user
}
```

### Adding New Translations
1. Add keys to both `translationsEn` and `translationsAr` in `lib/i18n-context.tsx`
2. Use in components: `const { t } = useI18n()` then `t('your.key')`

## Environment Setup

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: JWT signing secret
- `SUPABASE_ACCESS_KEY_ID`: S3 access key
- `SUPABASE_SECRET_ACCESS_KEY`: S3 secret key
- `SUPABASE_BUCKET_NAME`: S3 bucket name

See `.env.example` for complete list.
