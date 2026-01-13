"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoadingLogo } from "@/components/ui/loading-logo";

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [affiliateData, setAffiliateData] = useState<any>(null);

    useEffect(() => {
        const loadBaseData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: aff } = await supabase
                    .from('affiliates')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                setAffiliateData(aff);
            }
            setLoading(false);
        };
        loadBaseData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 h-[60vh]">
                <LoadingLogo size={60} />
                <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    if (!affiliateData) {
        return (
            <div className="flex flex-col items-center justify-center p-20 h-[60vh] text-center">
                <h2 className="text-2xl font-bold italic">Affiliate account not found</h2>
                <p className="text-muted-foreground mt-2">Please contact support if you believe this is an error.</p>
            </div>
        );
    }

    // Since we can't easily use Context across Server/Client boundaries in a complex way without more setup,
    // and we want to keep it simple, we'll let each page handle its own specific data fetching 
    // but the layout provides the unified wrapper if needed.
    // Actually, for now, let's just make it a simple wrapper.

    return (
        <div className="space-y-8">
            {children}
        </div>
    );
}
