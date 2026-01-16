import { NotificationsList } from "@/components/dashboard/notifications-list"

export const metadata = {
    title: "Notifications | Leli Rentals Dashboard",
    description: "Your latest notifications and updates",
}

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <NotificationsList />
        </div>
    )
}
