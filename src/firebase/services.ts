import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import type { OnboardingData, FirestoreSubmission, TipoUsuario } from '../types';

// Upload photo to Firebase Storage and return the download URL
export async function uploadPhoto(uid: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `fotos/${uid}/fotocheck.${ext}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Save or update onboarding data (called on each step)
export async function saveOnboardingStep(
  uid: string,
  data: Partial<OnboardingData & { completado?: boolean; completadoAt?: unknown; email?: string }>
): Promise<void> {
  const docRef = doc(db, 'onboarding', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(docRef, { ...data, createdAt: serverTimestamp(), completado: false });
  }
}

// Mark onboarding as complete
export async function completeOnboarding(uid: string): Promise<void> {
  const docRef = doc(db, 'onboarding', uid);
  await updateDoc(docRef, {
    completado: true,
    completadoAt: serverTimestamp(),
  });
}

// Fetch the current user's onboarding data
export async function getOnboardingData(uid: string): Promise<Partial<FirestoreSubmission> | null> {
  const docRef = doc(db, 'onboarding', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data() as Partial<FirestoreSubmission>;
  return null;
}

// Set user role in Firestore (used after registration)
export async function setUserRole(uid: string, email: string, role: 'admin' | 'user' = 'user'): Promise<void> {
  await setDoc(doc(db, 'users', uid), { uid, email, role }, { merge: true });
}

// Get user role
export async function getUserRole(uid: string): Promise<'admin' | 'user'> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) return (snap.data().role as 'admin' | 'user') || 'user';
  return 'user';
}

// Admin: get all submissions
export async function getAllSubmissions(): Promise<FirestoreSubmission[]> {
  const q = query(collection(db, 'onboarding'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }) as FirestoreSubmission);
}

// Save tipo usuario on selection
export async function saveTipoUsuario(uid: string, email: string, tipoUsuario: TipoUsuario): Promise<void> {
  await saveOnboardingStep(uid, { tipoUsuario, email });
}
