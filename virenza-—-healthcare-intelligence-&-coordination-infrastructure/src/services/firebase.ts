import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Cloud Firestore with provisioned custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Validate initial server connection as strictly required by Firebase integration skill
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    const testRef = doc(db, 'test', 'connection');
    await getDocFromServer(testRef);
    console.log('[Firestore] Connected to database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('[Firestore] Network warning: client is currently offline or unreachable.');
      return false;
    }
    // Any other code (e.g. document does not exist yet) means server handshake succeeded
    return true;
  }
}

// User Authentication Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          displayName: result.user.displayName || 'Virenza Member',
          email: result.user.email || '',
          photoURL: result.user.photoURL || '',
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error: any) {
    console.error('[Firebase Auth] Sign-in error:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('[Firebase Auth] Sign-out error:', error);
    throw error;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Firestore Persistence Helpers
export async function saveConsultationRecord(
  userId: string,
  data: {
    title: string;
    type: string;
    messages: any[];
    summary: string;
    metadata?: any;
  }
) {
  try {
    const colRef = collection(db, 'users', userId, 'consultations');
    const docRef = await addDoc(colRef, {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('[Firestore] Failed to save consultation:', err);
    throw err;
  }
}

export async function getUserConsultations(userId: string) {
  try {
    const colRef = collection(db, 'users', userId, 'consultations');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[Firestore] Failed to get consultations:', err);
    return [];
  }
}

export async function saveGeneratedMedia(
  userId: string,
  media: {
    mediaType: 'image' | 'music' | 'video' | 'transcription';
    url?: string;
    data?: string;
    prompt: string;
    modelUsed: string;
    metadata?: any;
  }
) {
  try {
    const colRef = collection(db, 'users', userId, 'media');
    const docRef = await addDoc(colRef, {
      ...media,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('[Firestore] Failed to save media record:', err);
    throw err;
  }
}

export async function getUserMedia(userId: string) {
  try {
    const colRef = collection(db, 'users', userId, 'media');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(30));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[Firestore] Failed to get media:', err);
    return [];
  }
}

// Run connection validation on app load
validateFirestoreConnection().catch(console.error);
