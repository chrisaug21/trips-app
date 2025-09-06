# Database Schema and Migration Instructions

This directory contains the database schema for the Trip Planning Application.

## Files

- `schema.sql` - Complete database schema with tables, indexes, and RLS policies
- `README.md` - This file with migration instructions

## Migration Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project settings
3. Copy `env.example` to `.env.local` and fill in your values:
   ```bash
   cp env.example .env.local
   ```

### 2. Environment Variables

Fill in your `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Database Migration

#### Option A: Using Supabase Dashboard (Recommended for development)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `schema.sql`
4. Paste and execute the SQL script
5. Verify all tables, indexes, and policies are created

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Create a migration:
   ```bash
   supabase migration new initial_schema
   ```

4. Copy the schema content to the generated migration file
5. Apply the migration:
   ```bash
   supabase db push
   ```

### 4. Verify Setup

After migration, you should see:
- 5 tables: `trips`, `trip_interests`, `days`, `day_blocks`, `trip_versions`
- Custom enums: `trip_status`, `block_type`
- Indexes on all foreign keys and commonly queried fields
- RLS policies enabled on all tables
- Updated_at trigger on trips table

### 5. Test the Setup

1. Start your Next.js app: `npm run dev`
2. Check that the Supabase client connects without errors
3. Verify you can read from the database (published trips should be publicly readable)

## Schema Overview

### Tables

- **trips**: Main trip information (title, description, status, published flag)
- **trip_interests**: Tags/interests associated with trips
- **days**: Individual days within a trip
- **day_blocks**: Activities/events for each day
- **trip_versions**: Version control for trips

### Security

- Row Level Security (RLS) enabled on all tables
- Public read access for published trips only
- Admin role required for all write operations
- JWT-based authentication for admin access

### Performance

- Indexes on all foreign keys
- Composite indexes for common query patterns
- JSONB metadata fields for flexible data storage

## Troubleshooting

### Common Issues

1. **UUID extension error**: Ensure `uuid-ossp` extension is enabled
2. **RLS policy errors**: Check that JWT claims include the correct role
3. **Permission denied**: Verify service role key is correct for admin operations

### Support

For database issues, check:
- Supabase project logs
- RLS policy evaluation
- JWT token contents and claims
