import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials are valid and not the default placeholders
const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('your_') &&
  !firebaseConfig.projectId.includes('your_') &&
  firebaseConfig.apiKey.trim() !== '';

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, isConfigured };

export const checkFirebaseConnection = () => {
  return {
    isConfigured,
    apiKey: firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
  };
};

/**
 * Create or update a user profile in the Firestore 'profiles' collection.
 * Call this right after creating the user or updating details.
 */
export const createProfile = async (userId, profileData) => {
  if (!isConfigured || !db) return { data: null, error: new Error('Firebase not configured') };

  try {
    const userDocRef = doc(db, 'profiles', userId);
    const dataToSave = {
      username: profileData.username,
      full_name: profileData.fullName || '',
      phone: profileData.phone || '',
      email: profileData.email,
      updated_at: new Date().toISOString(),
    };
    await setDoc(userDocRef, dataToSave, { merge: true });
    return { data: dataToSave, error: null };
  } catch (error) {
    console.error('Error writing profile to Firestore:', error);
    return { data: null, error };
  }
};

/**
 * Fetch a user's profile from the Firestore 'profiles' collection.
 */
export const getProfile = async (userId) => {
  if (!isConfigured || !db) return { data: null, error: new Error('Firebase not configured') };

  try {
    const userDocRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: new Error('Profile document does not exist') };
    }
  } catch (error) {
    console.error('Error reading profile from Firestore:', error);
    return { data: null, error };
  }
};
