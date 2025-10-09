# Firestore Troubleshooting Guide

This guide helps diagnose and fix common Firestore connection and configuration issues in the Leli Rentals project.

## Common Issues and Solutions

### 1. Firebase Configuration Missing

#### Symptoms
- Console errors: "Missing Firebase environment variables"
- App fails to initialize
- Authentication not working

#### Solutions

**Check Environment Variables**
```bash
# Verify your .env.local file contains:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Get Firebase Configuration**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the configuration values

### 2. Firestore Connection Issues

#### Symptoms
- "Firestore connection issue" warnings in console
- Data not loading
- Real-time updates not working

#### Solutions

**Check Firestore Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Verify Firestore is Enabled**
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Ensure it's created and enabled
4. Check if you're in the correct region

**Test Connection**
```typescript
// Test Firestore connection
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('Firestore connection successful');
  } catch (error) {
    console.error('Firestore connection failed:', error);
  }
}
```

### 3. Authentication Issues

#### Symptoms
- Users can't sign in
- Authentication state not persisting
- Redirect loops

#### Solutions

**Check Authentication Providers**
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable the providers you're using (Email/Password, Google, etc.)
3. Verify domain is authorized

**Check Authentication Rules**
```javascript
// Ensure your Firestore rules allow authenticated users
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

**Debug Authentication State**
```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
});
```

### 4. Network and CORS Issues

#### Symptoms
- "CORS error" in browser console
- Network requests failing
- Timeout errors

#### Solutions

**Check Network Connectivity**
```typescript
// Test Firebase connectivity
async function testConnectivity() {
  try {
    const response = await fetch('https://firestore.googleapis.com/v1/projects/your-project-id/databases/(default)/documents');
    console.log('Firebase connectivity:', response.ok);
  } catch (error) {
    console.error('Connectivity issue:', error);
  }
}
```

**Configure CORS (if using custom domain)**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### 5. Permission Denied Errors

#### Symptoms
- "Permission denied" errors
- Data not loading for authenticated users
- Write operations failing

#### Solutions

**Update Firestore Rules**
```javascript
// firestore.rules - More permissive for development
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all access for development (NOT for production)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Production Rules**
```javascript
// firestore.rules - Secure rules for production
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public listings can be read by anyone
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // AI chat sessions are private to users
    match /ai_chat_sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 6. Performance Issues

#### Symptoms
- Slow data loading
- High latency
- Timeout errors

#### Solutions

**Optimize Queries**
```typescript
// Use indexes for better performance
import { query, where, orderBy, limit } from 'firebase/firestore';

// Create composite indexes in Firebase Console
const listingsQuery = query(
  collection(db, 'listings'),
  where('category', '==', 'vehicles'),
  where('available', '==', true),
  orderBy('createdAt', 'desc'),
  limit(10)
);
```

**Implement Caching**
```typescript
// Cache frequently accessed data
const cache = new Map();

export async function getCachedListings() {
  const cacheKey = 'listings';
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const listings = await getListings();
  cache.set(cacheKey, listings);
  return listings;
}
```

### 7. Development vs Production Issues

#### Symptoms
- Works in development but not production
- Different behavior between environments
- Environment-specific errors

#### Solutions

**Check Environment Variables**
```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project

# Production
NODE_ENV=production
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project
```

**Verify Firebase Project Settings**
1. Check if you're using the correct Firebase project
2. Verify environment variables are set in production
3. Ensure Firestore is enabled in the correct project

### 8. Debugging Tools

#### Firebase Emulator Suite
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start --only firestore,auth
```

#### Debug Mode
```typescript
// Enable debug mode
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

#### Logging
```typescript
// Add comprehensive logging
import { enableLogging } from 'firebase/firestore';

if (process.env.NODE_ENV === 'development') {
  enableLogging(true);
}
```

### 9. Common Error Messages

#### "Firebase: Error (auth/invalid-api-key)"
- **Cause**: Invalid or missing API key
- **Solution**: Check your Firebase configuration

#### "Firebase: Error (auth/network-request-failed)"
- **Cause**: Network connectivity issues
- **Solution**: Check internet connection and Firebase status

#### "Firebase: Error (firestore/permission-denied)"
- **Cause**: Insufficient permissions
- **Solution**: Update Firestore rules

#### "Firebase: Error (firestore/unavailable)"
- **Cause**: Firestore service unavailable
- **Solution**: Check Firebase status page

### 10. Monitoring and Alerts

#### Set Up Monitoring
```typescript
// Monitor Firestore usage
import { onSnapshot } from 'firebase/firestore';

const unsubscribe = onSnapshot(collection(db, 'listings'), (snapshot) => {
  console.log('Listings updated:', snapshot.size);
}, (error) => {
  console.error('Firestore error:', error);
  // Send alert to monitoring service
});
```

#### Error Tracking
```typescript
// Track errors for debugging
export function trackError(error: Error, context: string) {
  console.error(`Error in ${context}:`, error);
  
  // Send to error tracking service
  if (typeof window !== 'undefined') {
    // Example: Sentry, LogRocket, etc.
    // errorTrackingService.captureException(error, { context });
  }
}
```

## Quick Fixes Checklist

- [ ] Verify Firebase configuration in `.env.local`
- [ ] Check Firestore rules and permissions
- [ ] Ensure authentication providers are enabled
- [ ] Test network connectivity
- [ ] Verify Firebase project settings
- [ ] Check for CORS issues
- [ ] Review error logs in browser console
- [ ] Test with Firebase emulator
- [ ] Verify environment variables in production
- [ ] Check Firebase service status

## Getting Help

1. **Firebase Console**: Check the Firebase Console for error logs
2. **Browser Console**: Look for JavaScript errors
3. **Network Tab**: Check for failed requests
4. **Firebase Status**: Visit [Firebase Status Page](https://status.firebase.google.com/)
5. **Documentation**: Refer to [Firebase Documentation](https://firebase.google.com/docs)

## Prevention

1. **Regular Testing**: Test Firebase integration regularly
2. **Environment Management**: Use separate Firebase projects for dev/staging/prod
3. **Monitoring**: Set up error tracking and monitoring
4. **Documentation**: Keep configuration documentation up to date
5. **Backup**: Regular backups of Firestore data

For additional support, contact the development team or refer to the Firebase community forums.
