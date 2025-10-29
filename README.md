# Leli Rentals 🏠🚗

A modern, full-featured rental platform for properties, vehicles, equipment, and more. Built with Next.js 16, Supabase, and Clerk.

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with Clerk
- 🏠 **Listings Management** - Create, edit, and manage rental listings
- 📸 **Media Upload** - Upload images with Cloudinary integration
- 💳 **Payments** - Integrated payment processing with Paystack
- 📧 **Email Notifications** - Automated emails with Resend
- 🤖 **AI Chat** - Intelligent chat support powered by OpenAI
- 🗺️ **Maps Integration** - Location search with Google Maps
- 🌓 **Dark Mode** - Beautiful dark and light themes
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live notifications with Supabase

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Authentication:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Shadcn UI
- **Payments:** Paystack
- **Media Storage:** Cloudinary
- **Email:** Resend
- **AI:** OpenAI API
- **Maps:** Google Maps API

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Accounts for:
  - [Clerk](https://clerk.dev) (Authentication)
  - [Supabase](https://supabase.com) (Database)
  - [Cloudinary](https://cloudinary.com) (Media storage)
  - [Resend](https://resend.com) (Email service)
  - [OpenAI](https://openai.com) (AI chat)
  - [Google Maps](https://console.cloud.google.com) (Maps API)
  - [Paystack](https://paystack.com) (Payments - optional)

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd leli-rentals
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Resend (Email)
RESEND_API_KEY=re_...

# OpenAI (AI Chat)
NEXT_PUBLIC_OPENAI_API_KEY=sk-...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `FRESH_START_SCHEMA.sql` in the Supabase SQL Editor
3. (Optional) Seed mock data:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with mock data
npm run seed:clear   # Clear seeded data
```

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `listings` - Rental listings
- `bookings` - Booking records
- `favorites` - User favorites
- `reviews` - User reviews
- `messages` - Chat messages
- `notifications` - User notifications
- `user_profiles` - Extended user data
- `user_verifications` - ID verification records

## 📱 Key Features

### For Renters
- Browse and search listings
- Save favorites
- Book rentals
- Message owners
- Leave reviews
- Track bookings

### For Owners
- Create listings
- Manage bookings
- View earnings
- Respond to messages
- Track analytics
- ID verification

### Admin Panel
- Verify users
- Manage listings
- View statistics
- Moderate content

## 🔒 Security

- Environment variables are protected via `.gitignore`
- API keys are never exposed in client code
- Row Level Security (RLS) can be enabled in Supabase
- Clerk handles authentication securely
- All sensitive routes are protected

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are by invitation only.

## 📧 Support

For support, email: support@leli.rentals

---

**Built with ❤️ by Leli Rentals Team**
