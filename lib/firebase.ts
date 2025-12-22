import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8UISjoumvZ0LTYcH3je2e8qSiXnow5Zo",
  authDomain: "kiti-room.firebaseapp.com",
  projectId: "kiti-room",
  storageBucket: "kiti-room.firebasestorage.app",
  messagingSenderId: "642194508269",
  appId: "1:642194508269:web:c4b14f61cef8121d397fe4",
  measurementId: "G-33LDZRFX1Q"
}

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, storage, db, googleProvider }

