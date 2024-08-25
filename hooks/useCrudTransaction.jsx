import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/database";

const useCrudTransaction = () => {
  const addTransaction = (forms) => {
    const colRef = collection(db, "transaction");
    addDoc(colRef, { ...forms, createdAt: serverTimestamp() });
  };
  return { addTransaction };
};

export default useCrudTransaction;
