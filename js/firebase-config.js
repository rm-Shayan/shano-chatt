// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  doc,
  getFirestore,
  collection,
  serverTimestamp,   // ✅ Keep this one only
  addDoc,
  collectionGroup,
  orderBy,
  onSnapshot,
  setDoc,getDoc,updateDoc,where,query,getDocs,  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { getStorage, ref, 
    uploadBytes, 
    getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider ,signInWithPopup,signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
   
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  doc,
  setDoc,
  db,
  storage,
  auth,
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  getDoc,
  updateDoc,
  serverTimestamp,
    arrayUnion,
    collectionGroup,
  where,
  query,
  getDocs,
  uploadBytes,
  getDownloadURL,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
signOut
};
