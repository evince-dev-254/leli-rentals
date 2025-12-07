"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAdminData } from "@/lib/actions/dashboard-actions";
import { createAffiliateInvite } from "@/lib/actions/invite-actions";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<{ users: any[]; listings: any[]; messages: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const adminData = await getAdminData();
                setData(adminData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInvite = async () => {
        if (!inviteEmail) return alert("Please enter an email.");
        setInviteLoading(true);
        try {
            await createAffiliateInvite(inviteEmail, user?.email ?? "admin");
            alert(`Invitation sent to ${inviteEmail}`);
            setInviteEmail("");
        } catch (e) {
            console.error(e);
            alert("Failed to send invitation.");
        } finally {
            setInviteLoading(false);
        }
    };

    if (!user) return <p className="text-center">Please sign in to view the admin dashboard.</p>;
    if (loading) return <p className="text-center">Loading admin data…</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>

            {/* Invite Affiliate Section */}
            <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Invite Affiliate</h3>
                <div className="flex gap-2 items-center">
                    <input
                        type="email"
                        placeholder="Affiliate email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                    />
                    <button
                        onClick={handleInvite}
                        disabled={inviteLoading}
                        className="bg-primary text-primary-foreground px-4 py-1 rounded"
                    >
                        {inviteLoading ? "Sending…" : "Send Invite"}
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold">Users</h3>
                <ul className="list-disc pl-5">
                    {data?.users.map((u) => (
                        <li key={u.id}>{u.email} – {u.role || "no role"}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h3 className="text-xl font-semibold">Listings</h3>
                <ul className="list-disc pl-5">
                    {data?.listings.map((l) => (
                        <li key={l.id}>{l.title || `Listing #${l.id}`}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h3 className="text-xl font-semibold">Messages</h3>
                <ul className="list-disc pl-5">
                    {data?.messages.map((m) => (
                        <li key={m.id}>From {m.sender_id} to {m.receiver_id}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
