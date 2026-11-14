import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  query,
  orderBy,
} from 'firebase/firestore';
import { Transaction, MosqueSettings } from './types';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA9DQPVNX_YBNGP7roDp3--MM5N9pSa22k",
  authDomain: "mosjid-3b489.firebaseapp.com",
  projectId: "mosjid-3b489",
  storageBucket: "mosjid-3b489.firebasestorage.app",
  messagingSenderId: "819920870144",
  appId: "1:819920870144:web:4477422ad70019de3db1e5",
  measurementId: "G-X14CE4SCF3",
};

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  if (typeof window === 'undefined') return null;

  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(DEFAULT_FIREBASE_CONFIG);
    dbInstance = getFirestore(appInstance);
    return dbInstance;
  } catch (error) {
    console.warn('Firebase initialization error:', error);
    return null;
  }
}

// Real-time listener for Transactions
export function subscribeToTransactions(
  onUpdate: (transactions: Transaction[]) => void
): () => void {
  const db = getDb();
  if (!db) return () => {};

  try {
    const colRef = collection(db, 'mosque_transactions');
    const q = query(colRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Transaction[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Transaction;
            list.push({ ...data, id: docSnap.id });
          });
          onUpdate(list);
        }
      },
      (err) => {
        console.warn('Firestore subscription notice:', err.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToTransactions error:', err);
    return () => {};
  }
}

// Sync transaction to Cloud
export async function syncTransactionToCloud(tx: Transaction): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    const docRef = doc(db, 'mosque_transactions', tx.id);
    await setDoc(docRef, tx, { merge: true });
  } catch (err) {
    console.warn('Cloud sync error for tx:', err);
  }
}

// Delete transaction from Cloud
export async function deleteTransactionFromCloud(id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    const docRef = doc(db, 'mosque_transactions', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Cloud delete error:', err);
  }
}

// Real-time listener for Settings
export function subscribeToSettings(
  onUpdate: (settings: MosqueSettings) => void
): () => void {
  const db = getDb();
  if (!db) return () => {};

  try {
    const docRef = doc(db, 'mosque_meta', 'settings');
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as MosqueSettings);
        }
      },
      (err) => {
        console.warn('Firestore settings notice:', err.message);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Settings subscription error:', err);
    return () => {};
  }
}

// Save Settings to Cloud
export async function syncSettingsToCloud(settings: MosqueSettings): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    const docRef = doc(db, 'mosque_meta', 'settings');
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.warn('Settings cloud sync error:', err);
  }
}
