-- Fix bookings table column name issue
-- This migration handles the case where the table might exist with user_id instead of renter_id

DO $$
BEGIN
    -- Check if bookings table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
        -- Check if renter_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'renter_id'
        ) THEN
            -- Check if user_id exists (old column name)
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'bookings' AND column_name = 'user_id'
            ) THEN
                -- Rename user_id to renter_id
                ALTER TABLE bookings RENAME COLUMN user_id TO renter_id;
                RAISE NOTICE 'Renamed user_id to renter_id in bookings table';
            ELSE
                -- Add renter_id column if neither exists
                ALTER TABLE bookings ADD COLUMN renter_id TEXT NOT NULL DEFAULT '';
                RAISE NOTICE 'Added renter_id column to bookings table';
            END IF;
        ELSE
            RAISE NOTICE 'renter_id column already exists in bookings table';
        END IF;
    ELSE
        RAISE NOTICE 'bookings table does not exist yet';
    END IF;
END $$;

-- Now ensure the table is created with correct schema
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  renter_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  booking_fee DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Renters can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view bookings they're involved in
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid()::text = renter_id OR 
    auth.uid()::text = owner_id
  );

-- Policy: Renters can create bookings
CREATE POLICY "Renters can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid()::text = renter_id);

-- Policy: Owners and renters can update their bookings
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid()::text = renter_id OR 
    auth.uid()::text = owner_id
  );

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
DROP FUNCTION IF EXISTS update_bookings_updated_at();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- Drop existing function first to avoid parameter name conflicts
DROP FUNCTION IF EXISTS calculate_booking_fee(DECIMAL);
DROP FUNCTION IF EXISTS calculate_booking_fee(numeric);

-- Function to calculate booking fee (10% of subtotal)
CREATE OR REPLACE FUNCTION calculate_booking_fee(subtotal DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(subtotal * 0.10, 2);
END;
$$ LANGUAGE plpgsql;
