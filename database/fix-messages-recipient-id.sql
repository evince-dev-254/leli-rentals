-- Fix messages table column name issue
-- This migration handles the case where the table might exist with different column names

DO $$
BEGIN
    -- Check if messages table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        -- Check if recipient_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'recipient_id'
        ) THEN
            -- Check if receiver_id exists (alternative column name)
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'messages' AND column_name = 'receiver_id'
            ) THEN
                -- Rename receiver_id to recipient_id
                ALTER TABLE messages RENAME COLUMN receiver_id TO recipient_id;
                RAISE NOTICE 'Renamed receiver_id to recipient_id in messages table';
            ELSE
                -- Add recipient_id column if neither exists
                ALTER TABLE messages ADD COLUMN recipient_id TEXT NOT NULL DEFAULT '';
                RAISE NOTICE 'Added recipient_id column to messages table';
            END IF;
        ELSE
            RAISE NOTICE 'recipient_id column already exists in messages table';
        END IF;

        -- Check if sender_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'sender_id'
        ) THEN
            -- Add sender_id column if it doesn't exist
            ALTER TABLE messages ADD COLUMN sender_id TEXT NOT NULL DEFAULT '';
            RAISE NOTICE 'Added sender_id column to messages table';
        END IF;

        -- Check if listing_id column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'messages' AND column_name = 'listing_id'
        ) THEN
            -- Add listing_id column (nullable, as not all messages are about listings)
            ALTER TABLE messages ADD COLUMN listing_id UUID;
            RAISE NOTICE 'Added listing_id column to messages table';
            
            -- Add foreign key constraint if listings table exists
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listings') THEN
                ALTER TABLE messages ADD CONSTRAINT fk_messages_listing 
                FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL;
                RAISE NOTICE 'Added foreign key constraint for listing_id';
            END IF;
        END IF;
    ELSE
        RAISE NOTICE 'messages table does not exist yet';
    END IF;
END $$;

-- Now ensure the table is created with correct schema
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Composite index for conversations
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Users can update received messages" ON messages;

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    auth.uid()::text = sender_id OR 
    auth.uid()::text = recipient_id
  );

-- Policy: Users can insert messages they send
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id);

-- Policy: Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (auth.uid()::text = recipient_id)
  WITH CHECK (auth.uid()::text = recipient_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS messages_updated_at ON messages;
DROP FUNCTION IF EXISTS update_messages_updated_at();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();
