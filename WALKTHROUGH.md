# Leli Rentals System Walkthrough

This document guides you through the core features of the Leli Rentals application, including recent updates to Admin Authentication, Messaging, and Renter Dashboards.

## 1. Authentication & Roles
The system supports three user roles:
- **Renter**: Default role. Can browse listings, book items, and chat with owners.
- **Owner**: Can list items, manage rentals, and receive payments.
- **Admin**: Full system access, verification management, and user oversight.
- **Affiliate**: Earns commissions (in development).

### Switching Roles
- To test different roles, you can create multiple accounts or use the SQL editor to change your role:
  ```sql
  UPDATE public.user_profiles SET role = 'admin' WHERE email = 'your@email.com';
  ```

## 2. Admin Dashboard
**URL:** `/admin`
**Access:** Restricted to users with `role = 'admin'`.

### Features:
- **Overview**: System stats (Users, Listings, Revenue).
- **Verifications**: 
  - View pending user documents.
  - **NEW**: View and Approve/Reject pending listings.
- **Users & Listings**: Manage all system data.

## 3. Renter Dashboard
**URL:** `/dashboard/renter`
**Access:** Users with `role = 'renter'`.

### Features:
- **My Bookings**: View status of rental requests (Pending, Confirmed, Completed).
- **Favorites**: Quick access to saved listings.
- **My Reviews**: History of reviews left for items.
- **Messaging**: Integrated chat with Owners (Real Data).

## 4. Messaging System
**URL:** `/messages`
**Features:**
- **Real-Time Data**: Conversations are stored in the Supabase database.
- **Context-Aware**: Chats are linked to specific Listings (`listing_id`).
- **Initiate Chat**: Click "Message Owner" on any Listing page or "Chat Owner" in Renter Dashboard bookings.

## 5. Payments (Paystack)
- **Integration**: Paystack is integrated for Subscription payments.
- **Flow**: Owners select a plan (Weekly/Monthly) -> Paystack Popup -> Verification API -> Database Update.
- **Environment**: Linked to Live Mode keys (ensure you test with small amounts or switch to Test keys for development).

## 6. Pending / Next Steps
- **Owner Subscription Flow**: Ensuring owners select a plan during onboarding.
- **Booking Fees**: Implementing calculation logic for booking fees.
- **Affiliate Dashboard**: Mirroring real data integration.
- **Verification Deadline**: Enforcing the 5-day rule logic.
