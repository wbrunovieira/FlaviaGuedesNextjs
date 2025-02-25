import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportando as funções necessárias para o Firestore
export {
  db,
  doc,
  updateDoc,
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
};
