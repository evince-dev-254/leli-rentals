"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getAffiliateData } from "@/lib/actions/dashboard-actions";
import { AffiliateSettings } from "@/components/dashboard/affiliate/affiliate-settings";
import { LoadingLogo } from "@/components/ui/loading-logo";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            const data = await getAffiliateData(user.id);
            setStats(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdate = (newStats: any) => {
        setStats(newStats);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 h-[60vh]">
            <LoadingLogo size={60} />
            <p className="mt-4 text-muted-foreground animate-pulse">Loading settings...</p>
        </div>
    );

    return (
        <AffiliateSettings
            user={user}
            stats={stats}
            onUpdate={handleUpdate}
        />
    );
}
