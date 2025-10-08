# Firebase Permissions Troubleshooting Guide

## 🚨 Common Permission Errors

### Error: "Missing or insufficient permissions"

This error occurs when Firestore security rules are too restrictive or the user doesn't have proper authentication.

## 🔧 Quick Fixes

### 1. Deploy Updated Rules
```bash
# Run the fix script
fix-permissions.bat

# Or manually deploy
firebase deploy --only firestore:rules
```

### 2. Check Authentication
Make sure the user is properly authenticated:
```javascript
// Check if user is logged in
console.log('User:', user);
console.log('Auth state:', auth.currentUser);
```

### 3. Verify Firebase Project
```bash
# Check current project
firebase use --list

# Set correct project
firebase use your-project-id
```

## 🛠️ Step-by-Step Troubleshooting

### Step 1: Verify Firebase Setup
1. **Check Firebase Console**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Verify Project**: Make sure you're using the correct project
3. **Check Authentication**: Ensure Authentication is enabled
4. **Check Firestore**: Ensure Firestore is enabled

### Step 2: Check Security Rules
1. **Go to Firestore**: In Firebase Console → Firestore Database
2. **Check Rules**: Go to Rules tab
3. **Verify Rules**: Make sure rules are deployed
4. **Test Rules**: Use the Rules Playground to test

### Step 3: Check Authentication Status
```javascript
// Add this to your component to debug
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user);
    if (user) {
      console.log('User ID:', user.uid);
      console.log('User email:', user.email);
    } else {
      console.log('No user logged in');
    }
  });
  
  return () => unsubscribe();
}, []);
```

### Step 4: Test Firestore Access
```javascript
// Test basic Firestore access
import { doc, getDoc } from 'firebase/firestore';

const testFirestore = async () => {
  try {
    const userDoc = await getDoc(doc(db, 'users', 'test'));
    console.log('Firestore access successful');
  } catch (error) {
    console.error('Firestore access failed:', error);
  }
};
```

## 🔒 Security Rules Explained

### Current Rules (Updated)
```javascript
// Users can read/write their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId;
}

// Allow authenticated users to create tickets
match /contactTickets/{ticketId} {
  allow create: if request.auth != null;
  allow read, write: if request.auth != null && 
    (request.auth.uid == resource.data.userId || 
     request.auth.token.admin == true);
}

// Fallback rule for authenticated users
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

## 🚀 Development vs Production Rules

### Development Rules (More Permissive)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (More Secure)
Use the main `firestore.rules` file with specific permissions for each collection.

## 🔍 Debugging Steps

### 1. Check Browser Console
Look for these errors:
- `FirebaseError: Missing or insufficient permissions`
- `FirebaseError: Permission denied`
- `FirebaseError: User not authenticated`

### 2. Check Network Tab
- Look for failed requests to Firestore
- Check the response status codes
- Verify the request payload

### 3. Check Firebase Console
- Go to Firestore → Rules
- Check if rules are deployed
- Use Rules Playground to test

### 4. Test Authentication
```javascript
// Test if user is authenticated
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('✅ User is authenticated:', user.uid);
  } else {
    console.log('❌ User is not authenticated');
  }
});
```

## 🛠️ Common Solutions

### Solution 1: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"

### Solution 2: Sign Out and Sign Back In
```javascript
// Sign out
await signOut(auth);

// Sign back in
await signInWithEmailAndPassword(auth, email, password);
```

### Solution 3: Check Firebase Configuration
```javascript
// Verify Firebase config
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
```

### Solution 4: Deploy Rules Again
```bash
# Deploy rules
firebase deploy --only firestore:rules

# Check deployment status
firebase projects:list
```

## 📞 Getting Help

### If Still Having Issues:
1. **Check Firebase Console**: Look for error logs
2. **Test in Incognito**: Rule out browser cache issues
3. **Check Network**: Look for failed requests
4. **Verify Project**: Make sure you're using the right project

### Firebase Support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

## ✅ Success Checklist

- [ ] User is authenticated (`auth.currentUser` exists)
- [ ] Firebase project is correct
- [ ] Firestore rules are deployed
- [ ] Browser cache is cleared
- [ ] No console errors
- [ ] Network requests are successful

---

**🎯 After following these steps, your Firebase permissions should work correctly!**
