# Authentication System with Supabase

This application uses Supabase for authentication with Row Level Security (RLS).

## Features

- ✅ Email/Password authentication
- ✅ Email confirmation required for new signups
- ✅ Automatic profile creation on signup
- ✅ Protected routes with middleware
- ✅ Row Level Security (RLS) on all tables
- ✅ User profiles with metadata
- ✅ Bilingual support (English/Arabic)

## Authentication Flow

### Sign Up
1. User visits `/auth/sign-up`
2. Fills in: First Name, Last Name, Email, Password
3. Metadata (first_name, last_name) is stored in user_metadata
4. User receives confirmation email
5. After email confirmation, profile is automatically created via database trigger
6. User can now login

### Login
1. User visits `/auth/login`
2. Enters email and password
3. If credentials are valid, session is created
4. User is redirected to homepage
5. Navbar shows user menu with profile access

### Protected Routes
The following routes require authentication:
- `/profile` - User profile page
- `/booking?hotelId=X` - Booking a specific hotel

## Database Schema

### Profiles Table
\`\`\`sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
\`\`\`

### Row Level Security Policies
- `profiles_select_own`: Users can view their own profile
- `profiles_insert_own`: Users can create their own profile
- `profiles_update_own`: Users can update their own profile
- `profiles_delete_own`: Users can delete their own profile

## Running SQL Scripts

The SQL scripts in `/scripts` folder need to be executed in your Supabase database:

1. `001_create_profiles.sql` - Creates the profiles table and RLS policies
2. `002_profile_trigger.sql` - Creates trigger to auto-create profiles on signup

You can run these scripts directly from v0 - no need to go to Supabase dashboard.

## Environment Variables

All required environment variables are already set:
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for development)

## Key Files

### Client Setup
- `lib/supabase/client.ts` - Browser client for client components
- `lib/supabase/server.ts` - Server client for server components
- `lib/supabase/middleware.ts` - Session refresh middleware

### Auth Pages
- `app/auth/login/page.tsx` - Login page
- `app/auth/sign-up/page.tsx` - Sign up page
- `app/auth/sign-up-success/page.tsx` - Email confirmation notice
- `app/auth/error/page.tsx` - Error handling page
- `app/auth/signout/route.ts` - Logout route handler

### Protected Pages
- `app/profile/page.tsx` - User profile (requires auth)
- `app/booking/page.tsx` - Booking page (conditional auth)

### Middleware
- `middleware.ts` - Root middleware that handles session refresh and redirects

## Usage in Code

### Server Components
\`\`\`tsx
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // User is authenticated
  return <div>Welcome {user.email}</div>
}
\`\`\`

### Client Components
\`\`\`tsx
'use client'
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function MyComponent() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  return <div>{user ? `Hello ${user.email}` : 'Not logged in'}</div>
}
\`\`\`

## Security Notes

⚠️ **IMPORTANT**: Always use Row Level Security (RLS) on all tables that contain user data.

✅ The profiles table has RLS enabled and policies configured.
✅ Middleware refreshes sessions on every request.
✅ Protected routes redirect unauthenticated users to login.

## Testing Authentication

1. **Sign Up**: Visit `/auth/sign-up` and create an account
2. **Check Email**: Look for confirmation email
3. **Confirm**: Click the link in the email
4. **Login**: Visit `/auth/login` and sign in
5. **Profile**: Visit `/profile` to see your profile
6. **Logout**: Use the navbar user menu to logout
