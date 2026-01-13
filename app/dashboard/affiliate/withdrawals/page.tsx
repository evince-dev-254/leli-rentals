"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getAffiliateData } from "@/lib/actions/dashboard-actions";
import { getWithdrawalHistory } from "@/lib/actions/affiliate-actions";
import { AffiliateWithdrawals } from "@/components/dashboard/affiliate/affiliate-withdrawals";
import { LoadingLogo } from "@/components/ui/loading-logo";

export default function WithdrawalsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            const [affData, history] = await Promise.all([
                getAffiliateData(user.id),
                getWithdrawalHistory(user.id)
            ]);
            setStats(affData);
            setWithdrawals(history);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <AffiliateWithdrawals
            user={user}
            stats={stats}
            withdrawals={withdrawals}
            onRefresh={loadData}
        />
    );
}
