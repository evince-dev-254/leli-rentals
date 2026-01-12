import { TeamManagement } from "@/components/staff/team-management"

export default function StaffTeamPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Our Team</h1>
                <p className="text-muted-foreground text-lg">Sales team members and internal staff management.</p>
            </div>

            <TeamManagement />
        </div>
    )
}
