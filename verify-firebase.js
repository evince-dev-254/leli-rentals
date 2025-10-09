// Firebase Permissions Verification Script
// Run this in your browser console after logging in

console.log('🔍 Verifying Firebase permissions...');

// Test 1: Check if user is authenticated
if (typeof window !== 'undefined' && window.auth) {
  console.log('✅ Firebase auth is available');
  
  if (window.auth.currentUser) {
    console.log('✅ User is authenticated:', window.auth.currentUser.uid);
  } else {
    console.log('❌ User is not authenticated. Please log in first.');
  }
} else {
  console.log('⚠️ Firebase auth not available. Make sure Firebase is initialized.');
}

// Test 2: Check Firestore access
if (typeof window !== 'undefined' && window.db) {
  console.log('✅ Firestore is available');
} else {
  console.log('❌ Firestore not available. Check Firebase configuration.');
}

// Test 3: Check localStorage for user data
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    console.log('✅ User data found in localStorage');
    try {
      const userData = JSON.parse(storedUser);
      console.log('User data:', userData);
    } catch (error) {
      console.log('❌ Error parsing stored user data:', error);
    }
  } else {
    console.log('⚠️ No user data in localStorage');
  }
}

console.log('🎯 To test Firestore permissions, try creating a contact ticket or updating your profile.');
