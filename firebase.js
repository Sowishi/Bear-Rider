import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAiuhUXvuKJ2qbsQcdd8gzrbru6Akuib0E",
  authDomain: "bearrideexpress.firebaseapp.com",
  projectId: "bearrideexpress",
  storageBucket: "bearrideexpress.appspot.com",
  messagingSenderId: "918643505247",
  appId: "1:918643505247:web:943457d4c68f2917a303ea",
  measurementId: "G-JJ1PM485K5",
};
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const db = getFirestore();
const storage = getStorage();

export { app, database, db, storage };
