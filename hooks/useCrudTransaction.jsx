import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/database";

const useCrudTransaction = () => {
  const addTransaction = (forms) => {
    const colRef = collection(db, "transaction");
    addDoc(colRef, { ...forms, createdAt: serverTimestamp() });
  };
  const deleteTransaction = async (currentUser) => {
    const colRef = collection(db, "transaction");
    const transactions = await getDocs(colRef);

    transactions.docs.forEach((transaction) => {
      const transactionData = transaction.data();
      console.log(
        transactionData.currentUser.id,
        currentUser.id,
        transactionData.id
      );
      if (transactionData.currentUser.id == currentUser.id) {
        const docRef = doc(db, "transaction", transaction.id);
        deleteDoc(docRef);
      }
    });
  };
  return { addTransaction, deleteTransaction };
};

export default useCrudTransaction;
