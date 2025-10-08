# Firebase Setup Guide for Leli Rentals

## 🚀 Complete Firebase Configuration

This guide will help you set up Firebase for the Leli Rentals platform with all necessary indexes, security rules, and configurations.

## 📋 Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

3. **Authentication**: Login to Firebase
   ```bash
   firebase login
   ```

## 🔧 Initial Setup

### 1. Initialize Firebase in your project
```bash
firebase init
```

Select the following services:
- ✅ Firestore
- ✅ Storage
- ✅ Hosting
- ✅ Functions (optional)

### 2. Configure your project
```bash
firebase use --add
```
Select your Firebase project.

## 📊 Firestore Indexes

The `firestore.indexes.json` file contains all necessary indexes for optimal query performance:

### User Management Indexes
- Users by account type and creation date
- Users by verification status
- Users by last activity

### Support System Indexes
- Contact tickets by user and creation date
- Tickets by status and priority
- Admin notifications by read status

### Billing System Indexes
- Payment methods by user
- Invoices by user and status
- Billing history by user and date

### Security Indexes
- Login activity by user
- Security logs by user and action
- Account switches by user

## 🔒 Security Rules

### Firestore Rules (`firestore.rules`)
- **Users**: Can read/write their own data
- **Contact Tickets**: Users can manage their own tickets
- **Admin Notifications**: Admin-only access
- **Payment Methods**: Users can manage their own payments
- **Billing**: Users can access their own billing data
- **Security Logs**: Users can view their own security logs

### Storage Rules (`storage.rules`)
- **Profile Images**: Users can upload their own profile pictures
- **Listing Images**: Public read, owner write
- **Verification Documents**: Private to user
- **Ticket Attachments**: User and admin access
- **Public Assets**: Public read, admin write

## 🚀 Deployment

### Automatic Deployment
Run the deployment script:

**Windows:**
```bash
deploy-firebase.bat
```

**Linux/Mac:**
```bash
./deploy-firebase.sh
```

### Manual Deployment
```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy storage rules
firebase deploy --only storage

# Deploy hosting
firebase deploy --only hosting
```

## 📱 Authentication Flow

### New User Flow
1. User signs up → Redirected to account type selection
2. User selects account type (Renter/Owner)
3. **Renter** → Redirected to listings page
4. **Owner** → Redirected to dashboard

### Existing User Flow
1. User logs in → Check account type
2. **Renter** → Redirected to listings page
3. **Owner** → Redirected to dashboard

## 🗄️ Database Collections

### Core Collections
- `users` - User profiles and settings
- `contactTickets` - Support tickets
- `adminNotifications` - Admin alerts
- `paymentMethods` - Payment information
- `invoices` - Billing documents
- `billingHistory` - Transaction records

### Security Collections
- `loginActivity` - Login sessions
- `securityLogs` - Security events
- `accountSwitches` - Account type changes

### Business Collections
- `listings` - Property/Item listings
- `bookings` - Reservations
- `messages` - User communications
- `reviews` - User reviews
- `categories` - Listing categories

## 🔐 Security Features

### Authentication
- Email/Password authentication
- Google OAuth integration
- Account type switching
- Session management

### Authorization
- Role-based access control
- User-specific data access
- Admin-only functions
- Secure file uploads

### Monitoring
- Login activity tracking
- Security event logging
- Admin notification system
- User behavior analytics

## 📈 Performance Optimization

### Indexes
- Composite indexes for complex queries
- Single-field indexes for simple queries
- Array indexes for array fields
- Full-text search indexes

### Caching
- Client-side caching with localStorage
- Real-time data synchronization
- Optimistic updates
- Background sync

## 🛠️ Development Tools

### Firebase Emulator
```bash
firebase emulators:start
```

### Local Development
```bash
firebase emulators:start --only firestore,storage
```

### Testing
```bash
firebase emulators:exec --only firestore "npm test"
```

## 📊 Monitoring & Analytics

### Firebase Analytics
- User engagement tracking
- Feature usage analytics
- Performance monitoring
- Error reporting

### Custom Events
- User registration
- Account type selection
- Booking creation
- Payment processing
- Support ticket creation

## 🔧 Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🚨 Troubleshooting

### Common Issues

1. **Index Creation Failed**
   - Check Firestore console for index status
   - Wait for indexes to build (can take time)
   - Verify query patterns match indexes

2. **Security Rules Denied**
   - Check user authentication status
   - Verify user permissions
   - Review security rule logic

3. **Storage Upload Failed**
   - Check file size limits
   - Verify file type restrictions
   - Review storage security rules

### Debug Mode
```bash
firebase emulators:start --debug
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security/get-started)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 🎯 Next Steps

1. **Deploy to Production**: Use the deployment scripts
2. **Monitor Performance**: Set up Firebase Analytics
3. **Security Audit**: Review and test security rules
4. **Backup Strategy**: Set up automated backups
5. **Scaling**: Monitor usage and scale as needed

## 📞 Support

For issues with Firebase setup:
1. Check Firebase Console for errors
2. Review Firebase documentation
3. Test with Firebase Emulator
4. Contact Firebase support if needed

---

**🎉 Your Firebase setup is now complete and ready for production!**