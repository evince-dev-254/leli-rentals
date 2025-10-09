// Firebase Permissions Test Script
// Run this in your browser console after the app loads

console.log('🔍 Testing Firebase Permissions Fix...');

// Test 1: Check if environment variables are loaded
console.log('📋 Environment Variables Check:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');

// Test 2: Check Firebase initialization
if (typeof window !== 'undefined') {
  // Wait for Firebase to initialize
  setTimeout(() => {
    console.log('🔥 Firebase Initialization Check:');
    
    // Check if Firebase objects are available
    if (window.firebase) {
      console.log('✅ Firebase SDK loaded');
    } else {
      console.log('❌ Firebase SDK not loaded');
    }
    
    // Test authentication
    if (window.auth) {
      console.log('✅ Firebase Auth available');
      if (window.auth.currentUser) {
        console.log('✅ User authenticated:', window.auth.currentUser.uid);
        
        // Test Firestore permissions
        testFirestorePermissions();
      } else {
        console.log('⚠️ User not authenticated - please log in first');
      }
    } else {
      console.log('❌ Firebase Auth not available');
    }
  }, 2000);
}

// Test 3: Firestore Permissions Test
async function testFirestorePermissions() {
  console.log('🗄️ Testing Firestore Permissions...');
  
  try {
    // Test reading user document
    const userDoc = await window.db.collection('users').doc(window.auth.currentUser.uid).get();
    if (userDoc.exists) {
      console.log('✅ Can read user document');
    } else {
      console.log('⚠️ User document does not exist - creating...');
      
      // Test creating user document
      await window.db.collection('users').doc(window.auth.currentUser.uid).set({
        uid: window.auth.currentUser.uid,
        email: window.auth.currentUser.email,
        displayName: window.auth.currentUser.displayName,
        createdAt: new Date(),
        isNewUser: true,
        accountType: null
      });
      console.log('✅ Successfully created user document');
    }
    
    // Test creating a contact ticket
    const ticketData = {
      userId: window.auth.currentUser.uid,
      subject: 'Test Ticket - Permission Fix',
      description: 'Testing Firebase permissions after fix',
      category: 'general',
      priority: 'low',
      status: 'open',
      createdAt: new Date()
    };
    
    await window.db.collection('contactTickets').add(ticketData);
    console.log('✅ Successfully created contact ticket');
    
    console.log('🎉 All Firebase permissions are working correctly!');
    console.log('✅ The "Missing or insufficient permissions" error has been resolved!');
    
  } catch (error) {
    console.error('❌ Firebase permission error:', error);
    console.log('💡 Error details:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 Permission denied - checking Firestore rules...');
      console.log('💡 Try running: firebase deploy --only firestore:rules');
    }
  }
}

// Test 4: Check localStorage for user data
console.log('💾 LocalStorage Check:');
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

console.log('🎯 To test manually:');
console.log('1. Try logging in to your app');
console.log('2. Navigate to the contact page and create a ticket');
console.log('3. Check your profile page');
console.log('4. Look for any error messages in the console');
