import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/database";
import { useEffect, useState } from "react";

const useCrudTransaction = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "transaction");
    onSnapshot(colRef, (snapshot) => {
      const output = [];
      snapshot.docs.forEach((doc) => {
        output.push({ ...doc.data(), id: doc.id });
      });
      setData(output);
    });
  }, []);

  const addTransaction = (forms) => {
    const colRef = collection(db, "transaction");
    addDoc(colRef, { ...forms, createdAt: serverTimestamp() });
  };
  const deleteTransaction = async (currentUser) => {
    const colRef = collection(db, "transaction");
    const transactions = await getDocs(colRef);

    transactions.docs.forEach((transaction) => {
      const transactionData = transaction.data();

      if (transactionData.currentUser.id == currentUser.id) {
        const docRef = doc(db, "transaction", transaction.id);
        deleteDoc(docRef);
      }
    });
  };

  const acceptTransaction = (transaction, currentUser) => {
    const docRef = doc(db, "transaction", transaction.id);
    updateDoc(docRef, {
      ...transaction,
      rider: currentUser,
      status: "Accepted",
    });
  };
  return { addTransaction, deleteTransaction, data, acceptTransaction };
};

export default useCrudTransaction;
