-- Trip Planning Application Database Schema
-- This file contains the complete database structure for the trips app

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE trip_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE block_type AS ENUM ('activity', 'meal', 'transport', 'accommodation', 'free_time');

-- Trips table - main table for storing trip information
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status trip_status DEFAULT 'draft',
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Trip interests table - stores interests/tags for each trip
CREATE TABLE trip_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, interest)
);

-- Days table - represents individual days within a trip
CREATE TABLE days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255),
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, day_number)
);

-- Day blocks table - stores individual activities/events for each day
CREATE TABLE day_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    block_order INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    start_time TIME,
    end_time TIME,
    block_type block_type DEFAULT 'activity',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(day_id, block_order)
);

-- Trip versions table - tracks different versions of a trip
CREATE TABLE trip_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    UNIQUE(trip_id, version_number)
);

-- Create indexes for better query performance
CREATE INDEX idx_trips_slug ON trips(slug);
CREATE INDEX idx_trips_published ON trips(published);
CREATE INDEX idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_at ON trips(created_at);

CREATE INDEX idx_trip_interests_trip_id ON trip_interests(trip_id);
CREATE INDEX idx_trip_interests_interest ON trip_interests(interest);

CREATE INDEX idx_days_trip_id ON days(trip_id);
CREATE INDEX idx_days_trip_day ON days(trip_id, day_number);

CREATE INDEX idx_day_blocks_day_id ON day_blocks(day_id);
CREATE INDEX idx_day_blocks_order ON day_blocks(day_id, block_order);
CREATE INDEX idx_day_blocks_type ON day_blocks(block_type);

CREATE INDEX idx_trip_versions_trip_id ON trip_versions(trip_id);
CREATE INDEX idx_trip_versions_number ON trip_versions(trip_id, version_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to trips table
CREATE TRIGGER update_trips_updated_at 
    BEFORE UPDATE ON trips 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_versions ENABLE ROW LEVEL SECURITY;

-- Trips table policies
-- Public read access for published trips
CREATE POLICY "Public can view published trips" ON trips
    FOR SELECT USING (published = true);

-- Admin can do everything
CREATE POLICY "Admin full access" ON trips
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Trip interests policies
-- Public read access for published trip interests
CREATE POLICY "Public can view published trip interests" ON trip_interests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE trips.id = trip_interests.trip_id 
            AND trips.published = true
        )
    );

-- Admin can do everything
CREATE POLICY "Admin full access interests" ON trip_interests
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Days table policies
-- Public read access for published trip days
CREATE POLICY "Public can view published trip days" ON days
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE trips.id = days.trip_id 
            AND trips.published = true
        )
    );

-- Admin can do everything
CREATE POLICY "Admin full access days" ON days
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Day blocks policies
-- Public read access for published trip day blocks
CREATE POLICY "Public can view published trip day blocks" ON day_blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM days 
            JOIN trips ON days.trip_id = trips.id
            WHERE days.id = day_blocks.day_id 
            AND trips.published = true
        )
    );

-- Admin can do everything
CREATE POLICY "Admin full access day blocks" ON day_blocks
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Trip versions policies
-- Public read access for published trip versions
CREATE POLICY "Public can view published trip versions" ON trip_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE trips.id = trip_versions.trip_id 
            AND trips.published = true
        )
    );

-- Admin can do everything
CREATE POLICY "Admin full access versions" ON trip_versions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data for testing (optional)
-- Uncomment these lines if you want to add sample data during setup

/*
INSERT INTO trips (slug, title, description, published, created_by) VALUES
('sample-trip', 'Sample Trip', 'A sample trip for testing', true, '00000000-0000-0000-0000-000000000000');

INSERT INTO days (trip_id, day_number, title) VALUES
((SELECT id FROM trips WHERE slug = 'sample-trip'), 1, 'Day 1'),
((SELECT id FROM trips WHERE slug = 'sample-trip'), 2, 'Day 2');

INSERT INTO day_blocks (day_id, block_order, title, description, location, start_time, end_time) VALUES
((SELECT id FROM days WHERE day_number = 1 AND trip_id = (SELECT id FROM trips WHERE slug = 'sample-trip')), 1, 'Breakfast', 'Start the day with breakfast', 'Hotel Restaurant', '08:00', '09:00'),
((SELECT id FROM days WHERE day_number = 1 AND trip_id = (SELECT id FROM trips WHERE slug = 'sample-trip')), 2, 'City Tour', 'Explore the city highlights', 'Downtown', '10:00', '12:00');
*/
