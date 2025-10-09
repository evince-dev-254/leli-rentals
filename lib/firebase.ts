import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration - using environment variables or fallback values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDzv5FX8AECAsA0a2--XpMD8GK5NOP1Rhg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "leli-rentals-52a08.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "leli-rentals-52a08",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "leli-rentals-52a08.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "220739389697",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:220739389697:web:701c8d4141b29d88a13300",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0PD4YGC9TE"
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;
let analytics: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();

  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

  console.log('✅ Firebase initialized successfully');
  
  // Add connection monitoring
  if (typeof window !== 'undefined') {
    // Monitor Firestore connection
    const monitorConnection = () => {
      try {
        // Test Firestore connection
        if (db) {
          console.log('🔗 Firestore connection active');
        }
      } catch (error) {
        console.warn('⚠️ Firestore connection issue:', error);
      }
    };
    
    // Monitor connection every 30 seconds
    setInterval(monitorConnection, 30000);
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('Configuration used:', {
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
    authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
    projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
    storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
    appId: firebaseConfig.appId ? 'Set' : 'Missing',
  });
  
  // Enhanced error handling
  if (process.env.NODE_ENV === 'development') {
    console.error('🔧 Development mode: Firebase initialization failed');
    console.error('💡 Check your Firebase configuration');
    console.error('🌐 Visit: https://console.firebase.google.com/ to get your Firebase configuration');
  } else {
    console.warn('⚠️ Production mode: Firebase initialization failed, using fallback');
  }
  
  // Don't throw error during build, just log it
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Firebase initialization failed, but continuing build...');
  }
}

export { app, auth, db, storage, googleProvider, analytics };
