import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useAddRider = () => {
  const addRider = (forms, currentUser) => {
    const docRef = doc(db, "users", currentUser.id);

    updateDoc(docRef, { ...forms, createdAt: serverTimestamp() });
  };

  return { addRider };
};

export default useAddRider;
