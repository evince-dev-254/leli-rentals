// Test Firebase Permissions
// Run this in your browser console to test Firebase access

import { auth, db } from './lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Test function
async function testFirebasePermissions() {
  console.log('🧪 Testing Firebase permissions...');
  
  // Check authentication
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('✅ User is authenticated:', user.uid);
      
      try {
        // Test reading user document
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          console.log('✅ Can read user document:', userDoc.data());
        } else {
          console.log('⚠️ User document does not exist, creating...');
          
          // Test creating user document
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date(),
            isNewUser: true,
            accountType: null
          });
          console.log('✅ Successfully created user document');
        }
        
        // Test creating a contact ticket
        const ticketData = {
          userId: user.uid,
          subject: 'Test Ticket',
          description: 'Testing permissions',
          category: 'general',
          priority: 'low',
          status: 'open',
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'contactTickets', 'test-ticket'), ticketData);
        console.log('✅ Successfully created contact ticket');
        
        console.log('🎉 All Firebase permissions are working correctly!');
        
      } catch (error) {
        console.error('❌ Firebase permission error:', error);
        console.log('💡 Try running: firebase deploy --only firestore:rules');
      }
    } else {
      console.log('❌ User is not authenticated. Please log in first.');
    }
  });
}

// Run the test
testFirebasePermissions();
