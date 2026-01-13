"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getAffiliateData } from "@/lib/actions/dashboard-actions";
import { AffiliateMarketing } from "@/components/dashboard/affiliate/affiliate-marketing";
import { LoadingLogo } from "@/components/ui/loading-logo";

export default function MarketingPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getAffiliateData(user.id);
                setStats(data);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 h-[60vh]">
            <LoadingLogo size={60} />
            <p className="mt-4 text-muted-foreground animate-pulse">Loading marketing tools...</p>
        </div>
    );

    return <AffiliateMarketing stats={stats} />;
}
