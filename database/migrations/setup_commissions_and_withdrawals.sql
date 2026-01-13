-- Migration: Setup Affiliate Commissions and Withdrawals
-- Description: Creates tables for tracking affiliate commissions and withdrawal requests

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. AFFILIATE COMMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    referral_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Percentage
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, withdrawn
    paid_at TIMESTAMP,
    withdrawal_id UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for affiliate_commissions
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_booking_id ON affiliate_commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON affiliate_commissions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_created_at ON affiliate_commissions(created_at DESC);

-- =====================================================
-- 2. WITHDRAWALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_type VARCHAR(20) NOT NULL, -- owner, affiliate
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- mpesa, bank_transfer
    payment_details JSONB NOT NULL, -- phone number, bank details, etc.
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
    processed_by UUID REFERENCES user_profiles(id),
    processed_at TIMESTAMP,
    transaction_reference VARCHAR(255),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for withdrawals
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_type ON withdrawals(user_type);

-- =====================================================
-- 3. UPDATE PAYMENTS TABLE
-- =====================================================

-- Add new columns to payments table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payments' AND column_name='payment_type') THEN
        ALTER TABLE payments ADD COLUMN payment_type VARCHAR(50) DEFAULT 'booking';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payments' AND column_name='payer_id') THEN
        ALTER TABLE payments ADD COLUMN payer_id UUID REFERENCES user_profiles(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='payments' AND column_name='payee_id') THEN
        ALTER TABLE payments ADD COLUMN payee_id UUID REFERENCES user_profiles(id);
    END IF;
END $$;

-- Indexes for new payment columns
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON payments(payee_id);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Affiliates can view own commissions" ON affiliate_commissions;
DROP POLICY IF EXISTS "Admins can view all commissions" ON affiliate_commissions;
DROP POLICY IF EXISTS "Users can view own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can update withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can create withdrawals" ON withdrawals;

-- Affiliate Commissions Policies
CREATE POLICY "Affiliates can view own commissions"
    ON affiliate_commissions FOR SELECT
    USING (
        affiliate_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can manage commissions"
    ON affiliate_commissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Withdrawals Policies
CREATE POLICY "Users can view own withdrawals"
    ON withdrawals FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Users can create own withdrawals"
    ON withdrawals FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage withdrawals"
    ON withdrawals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 5. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for affiliate_commissions
DROP TRIGGER IF EXISTS update_affiliate_commissions_updated_at ON affiliate_commissions;
CREATE TRIGGER update_affiliate_commissions_updated_at
    BEFORE UPDATE ON affiliate_commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for withdrawals
DROP TRIGGER IF EXISTS update_withdrawals_updated_at ON withdrawals;
CREATE TRIGGER update_withdrawals_updated_at
    BEFORE UPDATE ON withdrawals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to calculate available balance for withdrawal
CREATE OR REPLACE FUNCTION get_available_balance(p_user_id UUID, p_user_type VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    v_balance DECIMAL(10,2) := 0;
BEGIN
    IF p_user_type = 'affiliate' THEN
        -- Calculate affiliate commission balance
        SELECT COALESCE(SUM(amount), 0)
        INTO v_balance
        FROM affiliate_commissions
        WHERE affiliate_id = p_user_id
        AND status = 'paid'
        AND (withdrawal_id IS NULL OR withdrawal_id NOT IN (
            SELECT id FROM withdrawals WHERE status IN ('pending', 'processing', 'completed')
        ));
    ELSIF p_user_type = 'owner' THEN
        -- Calculate owner earnings balance
        SELECT COALESCE(SUM(amount), 0)
        INTO v_balance
        FROM payments
        WHERE payee_id = p_user_id
        AND status = 'success'
        AND payment_type = 'booking'
        AND id NOT IN (
            SELECT UNNEST(ARRAY(
                SELECT jsonb_array_elements_text(payment_details->'payment_ids')::UUID
                FROM withdrawals
                WHERE user_id = p_user_id
                AND status IN ('pending', 'processing', 'completed')
            ))
        );
    END IF;
    
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
