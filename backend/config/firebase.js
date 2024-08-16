// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
  apiKey: "AIzaSyA0-sw34D5K6zuCVcyxCJMrmSdaASk5rS0",
  authDomain: "investor-57946.firebaseapp.com",
  projectId: "investor-57946",
  storageBucket: "investor-57946.appspot.com",
  messagingSenderId: "787789281350",
  appId: "1:787789281350:web:d2307022eb68c7310fb247",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage and Firestore
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, ref, uploadBytes, getDownloadURL };
