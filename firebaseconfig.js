// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBF_EEIamEevhQfgvkPbrz9wEQwqcH-pN0",
  authDomain: "votacion-f51c8.firebaseapp.com",
  projectId: "votacion-f51c8",
  storageBucket: "votacion-f51c8.appspot.com",
  messagingSenderId: "195415317932",
  appId: "1:195415317932:web:12dbe2fefc94fc6a921d9c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
