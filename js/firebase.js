import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

import { getFirestore, doc, addDoc, collection, query, where, getDocs, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSH5TdMEqmLuS17VzjIlkXU8Xn5MFAyDQ",
  authDomain: "e-commerce-ui-fcf2c.firebaseapp.com",
  projectId: "e-commerce-ui-fcf2c",
  storageBucket: "e-commerce-ui-fcf2c.appspot.com",
  messagingSenderId: "405793472626",
  appId: "1:405793472626:web:270dfc92a739c810a4c2eb",
  measurementId: "G-6SJG4C8WX9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export{
    auth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,

    storage,
    ref, 
    uploadBytesResumable, 
    getDownloadURL,

    db, 
    doc, 
    addDoc, 
    collection,
    query, 
    where, 
    getDocs,
    getDoc,
    updateDoc,
    serverTimestamp,
}