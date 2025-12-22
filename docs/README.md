# Leli Rentals - Premium Rental Marketplace Platform

<div align="center">

![Leli Rentals](public/logo.png)

**A Modern, Full-Stack Rental Marketplace Built with Next.js 16**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE.md)

[Live Demo](https://leli.rentals) • [Documentation](./WALKTHROUGH.md) • [Report Bug](https://github.com/evince-dev-254/leli-rentals/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**Leli Rentals** is a comprehensive, production-ready rental marketplace platform that connects property owners with renters across Kenya. The platform supports multiple rental categories including vehicles, homes, equipment, electronics, and more.

### Key Highlights

- 🚀 **Modern Tech Stack**: Built with Next.js 16, React 19, and TypeScript
- 🔐 **Secure Authentication**: Supabase Auth with Google OAuth integration
- 💳 **Payment Integration**: Paystack for seamless transactions
- 📱 **Responsive Design**: Mobile-first, glassmorphism UI
- 🌍 **Location Services**: Google Maps integration for listings
- 📧 **Email Notifications**: Automated emails via Resend
- 🖼️ **Image Management**: ImageKit CDN for optimized media delivery
- 💰 **Affiliate Program**: Built-in referral and commission system
- 👨‍💼 **Multi-Role Support**: Renters, Owners, Affiliates, and Admins

---

## ✨ Features

### For Renters
- 🔍 **Advanced Search & Filters**: Find exactly what you need
- ⭐ **Favorites & Wishlists**: Save listings for later
- 💬 **Real-Time Messaging**: Chat with property owners
- 📅 **Booking Management**: Track your rental requests
- ⭐ **Reviews & Ratings**: Share your experiences

### For Property Owners
- 📝 **Easy Listing Creation**: Upload properties with images
- 📊 **Analytics Dashboard**: Track views, bookings, and earnings
- 💰 **Subscription Plans**: Weekly and monthly options
- ✅ **Verification System**: ID verification for trust
- 📈 **Revenue Tracking**: Monitor your income

### For Affiliates
- 🔗 **Referral System**: Unique referral codes
- 💵 **Commission Tracking**: 10% on all bookings
- 📊 **Performance Dashboard**: Monitor referrals and earnings
- 💳 **Payout Management**: Monthly payouts via bank transfer

### For Administrators
- 👥 **User Management**: Manage all platform users
- ✅ **Verification Review**: Approve/reject documents
- 📋 **Listing Moderation**: Review and approve listings
- 📊 **System Analytics**: Platform-wide statistics
- 🎫 **Support Tickets**: Help desk management

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router, Turbopack)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: ImageKit CDN
- **Email**: Resend
- **Payments**: Paystack
- **Maps**: Google Maps API

### DevOps
- **Hosting**: Vercel (recommended)
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint 8

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Supabase Account**: [Sign up here](https://supabase.com)
- **Paystack Account**: [Sign up here](https://paystack.com)
- **ImageKit Account**: [Sign up here](https://imagekit.io)
- **Resend Account**: [Sign up here](https://resend.com)
- **Google Cloud Account**: For Maps API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/evince-dev-254/leli-rentals.git
   cd leli-rentals
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials (see [Configuration](#configuration))

4. **Set up the database**
   - Go to your Supabase Dashboard
   - Run the SQL scripts in order:
     ```
     database/schema.sql
     database/seed_categories.sql
     database/fix_affiliate_rls.sql
     database/add_missing_policies.sql
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
leli-rentals/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin dashboard
│   ├── dashboard/                # User dashboards
│   ├── categories/               # Category pages
│   ├── listings/                 # Listing pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard components
│   ├── admin/                    # Admin components
│   └── ...                       # Other components
├── lib/                          # Utilities and helpers
│   ├── actions/                  # Server actions
│   ├── supabase.ts               # Supabase client
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── database/                     # SQL scripts
│   ├── schema.sql                # Database schema
│   ├── seed_categories.sql       # Category seed data
│   └── *.sql                     # Migration scripts
├── email-templates/              # Email templates
├── public/                       # Static assets
├── utils/                        # Middleware utilities
├── proxy.ts                      # Next.js proxy (middleware)
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://leli.rentals
```

**⚠️ IMPORTANT**: Never commit `.env.local` to version control!

---

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Copy your project URL and keys

### 2. Run SQL Scripts

Execute these scripts in order in the Supabase SQL Editor:

```sql
-- 1. Core schema
database/schema.sql

-- 2. Seed categories
database/seed_categories.sql

-- 3. RLS policies
database/fix_affiliate_rls.sql
database/add_missing_policies.sql
database/fix_admin_permissions.sql
```

### 3. Verify Tables

Ensure these tables exist:
- `user_profiles`
- `categories`
- `listings`
- `bookings`
- `affiliates`
- `transactions`
- `messages`
- `reviews`
- And more...

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Configure Domain**
   - Add your custom domain in Vercel settings
   - Update `NEXT_PUBLIC_SITE_URL` in environment variables

### Build for Production

```bash
npm run build
npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/callback` - OAuth callback

### Payment Endpoints

- `POST /api/paystack/verify` - Verify payment
- `POST /api/paystack/webhook` - Payment webhook

### Image Endpoints

- `GET /api/imagekit/auth` - Get ImageKit auth token

### Server Actions

Located in `lib/actions/`:
- `dashboard-actions.ts` - Dashboard operations
- `affiliate-actions.ts` - Affiliate operations
- `email-actions.ts` - Email operations

---

## 🤝 Contributing

We welcome contributions! However, please note:

1. **Read the License**: This is proprietary software with restrictions
2. **Contact First**: Reach out before making significant changes
3. **Follow Guidelines**: Adhere to our coding standards
4. **Test Thoroughly**: Ensure all tests pass

### Development Workflow

1. Fork the repository (with permission)
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

**Copyright © 2025 Evince Dev. All Rights Reserved.**

This software is proprietary and confidential. Unauthorized copying, distribution, modification, or use of this software, via any medium, is strictly prohibited without explicit written permission from the copyright holder.

See [LICENSE.md](./LICENSE.md) for full terms and conditions.

**⚠️ WARNING**: Violation of this license may result in legal action and substantial financial penalties.

---

## 📞 Contact

### Project Maintainer
- **Name**: Evince Dev
- **Email**: support@leli.rentals
- **Website**: [https://leli.rentals](https://leli.rentals)
- **GitHub**: [@evince-dev-254](https://github.com/evince-dev-254)

### Support
- **Documentation**: [WALKTHROUGH.md](./WALKTHROUGH.md)
- **Issues**: [GitHub Issues](https://github.com/evince-dev-254/leli-rentals/issues)
- **Email**: support@leli.rentals

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment
- **Supabase** - For backend infrastructure
- **shadcn/ui** - For beautiful UI components
- **All Contributors** - For making this project better

---

## 📊 Project Status

- ✅ **Core Features**: Complete
- ✅ **Authentication**: Implemented
- ✅ **Payment Integration**: Live
- ✅ **Admin Dashboard**: Functional
- ✅ **Affiliate System**: Active
- 🚧 **Mobile App**: Planned
- 🚧 **Advanced Analytics**: In Progress

---

## 🔒 Security

If you discover a security vulnerability, please email security@leli.rentals. Do not create a public issue.

---

<div align="center">

**Built with ❤️ by Evince Dev**

[Website](https://leli.rentals) • [GitHub](https://github.com/evince-dev-254) • [Support](mailto:support@leli.rentals)

</div>
