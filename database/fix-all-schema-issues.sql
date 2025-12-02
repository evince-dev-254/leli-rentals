-- Combined fix for all database schema issues
-- Run this single file to fix all column name issues at once

-- ============================================
-- 1. FIX BOOKINGS TABLE (renter_id issue)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'renter_id'
        ) THEN
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'bookings' AND column_name = 'user_id'
            ) THEN
                ALTER TABLE bookings RENAME COLUMN user_id TO renter_id;
                RAISE NOTICE 'Renamed user_id to renter_id in bookings table';
            ELSE
                ALTER TABLE bookings ADD COLUMN renter_id TEXT NOT NULL DEFAULT '';
                RAISE NOTICE 'Added renter_id column to bookings table';
            END IF;
        END IF;
    END IF;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Renters can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid()::text = renter_id OR auth.uid()::text = owner_id);

CREATE POLICY "Renters can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid()::text = renter_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid()::text = renter_id OR auth.uid()::text = owner_id);

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
DROP FUNCTION IF EXISTS update_bookings_updated_at();

CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

DROP FUNCTION IF EXISTS calculate_booking_fee(DECIMAL);
DROP FUNCTION IF EXISTS calculate_booking_fee(numeric);

CREATE OR REPLACE FUNCTION calculate_booking_fee(subtotal DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(subtotal * 0.10, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. FIX MESSAGES TABLE (recipient_id issue)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'recipient_id'
        ) THEN
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'messages' AND column_name = 'receiver_id'
            ) THEN
                ALTER TABLE messages RENAME COLUMN receiver_id TO recipient_id;
                RAISE NOTICE 'Renamed receiver_id to recipient_id in messages table';
            ELSE
                ALTER TABLE messages ADD COLUMN recipient_id TEXT NOT NULL DEFAULT '';
                RAISE NOTICE 'Added recipient_id column to messages table';
            END IF;
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'sender_id'
        ) THEN
            ALTER TABLE messages ADD COLUMN sender_id TEXT NOT NULL DEFAULT '';
            RAISE NOTICE 'Added sender_id column to messages table';
        END IF;

        -- Check if listing_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'listing_id'
        ) THEN
            ALTER TABLE messages ADD COLUMN listing_id UUID;
            RAISE NOTICE 'Added listing_id column to messages table';
            
            -- Add foreign key constraint if listings table exists
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listings') THEN
                ALTER TABLE messages ADD CONSTRAINT fk_messages_listing 
                FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL;
                RAISE NOTICE 'Added foreign key constraint for listing_id';
            END IF;
        END IF;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Users can update received messages" ON messages;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id);

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid()::text = recipient_id)
  WITH CHECK (auth.uid()::text = recipient_id);

DROP TRIGGER IF EXISTS messages_updated_at ON messages;
DROP FUNCTION IF EXISTS update_messages_updated_at();

CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify bookings table
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'renter_id'
    ) THEN
        RAISE NOTICE '✅ bookings.renter_id column exists';
    ELSE
        RAISE WARNING '❌ bookings.renter_id column missing';
    END IF;
END $$;

-- Verify messages table
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'recipient_id'
    ) THEN
        RAISE NOTICE '✅ messages.recipient_id column exists';
    ELSE
        RAISE WARNING '❌ messages.recipient_id column missing';
    END IF;
    
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'sender_id'
    ) THEN
        RAISE NOTICE '✅ messages.sender_id column exists';
    ELSE
        RAISE WARNING '❌ messages.sender_id column missing';
    END IF;
END $$;
