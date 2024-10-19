import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useAddUser = () => {
  const addUser = async (forms) => {
    const colRef = collection(db, "users");
    addDoc(colRef, {
      ...forms,
      createdAt: serverTimestamp(),
    }).then((docRef) => {
      const walletDoc = doc(db, "wallet", docRef.id);
      setDoc(walletDoc, { balance: 0, transaction: [] });
    });
  };

  return { addUser };
};

export default useAddUser;
