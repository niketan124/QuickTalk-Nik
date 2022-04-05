
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth, signInWithEmailAndPassword
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB3xPlo4ba7exfBxcrvh7Po6kMWfjFAvcc",
    authDomain: "quick-talk-46967.firebaseapp.com",
    projectId: "quick-talk-46967",
    storageBucket: "quick-talk-46967.appspot.com",
    messagingSenderId: "180547020303",
    appId: "1:180547020303:web:0aeae44443cacdef03657a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app,
    { experimentalForceLongPolling: true });

export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}