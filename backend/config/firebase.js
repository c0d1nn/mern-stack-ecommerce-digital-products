// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// const firebaseConfig = {
//   apiKey: "AIzaSyBrXC2mw0Rq6WZzfJbwe-H1m6Z_UjuY2Dg",
//   authDomain: "investor-97c0e.firebaseapp.com",
//   projectId: "investor-97c0e",
//   storageBucket: "investor-97c0e.appspot.com",
//   messagingSenderId: "288127920638",
//   appId: "1:288127920638:web:f8eddbbed20c77976578af",
//   measurementId: "G-NB23T0D5FD",
//};

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// console.log("API Key:", process.env.API_KEY);
// console.log("Auth Domain:", process.env.AUTH_DOMAIN);
// console.log("Project ID:", process.env.PROJECT_ID);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage and Firestore
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, ref, uploadBytes, getDownloadURL };
