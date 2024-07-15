// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrXC2mw0Rq6WZzfJbwe-H1m6Z_UjuY2Dg",
  authDomain: "investor-97c0e.firebaseapp.com",
  projectId: "investor-97c0e",
  storageBucket: "investor-97c0e.appspot.com",
  messagingSenderId: "288127920638",
  appId: "1:288127920638:web:f8eddbbed20c77976578af",
  measurementId: "G-NB23T0D5FD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage and Firestore
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, ref, uploadBytes, getDownloadURL };
