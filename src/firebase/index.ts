import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNmdBoMx8xfhV6TOiQ6qPNyoGVMOGjIFo",
  authDomain: "vue-project-39eb9.firebaseapp.com",
  projectId: "vue-project-39eb9",
  storageBucket: "vue-project-39eb9.firebasestorage.app",
  messagingSenderId: "186880044937",
  appId: "1:186880044937:web:f507b185bdd274762fbb58",
  measurementId: "G-PGVRL20JYN"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage, analytics } 