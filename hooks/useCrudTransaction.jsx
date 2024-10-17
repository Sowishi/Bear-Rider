import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const useCrudTransaction = () => {
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState();
  useEffect(() => {
    const colRef = collection(db, "transaction");
    const q = query(colRef, orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
      const output = [];
      snapshot.docs.forEach((doc) => {
        output.push({ ...doc.data(), id: doc.id });
      });
      setData(output.reverse());
    });
  }, []);

  const addTransaction = async (forms) => {
    const colRef = collection(db, "transaction");
    const output = await addDoc(colRef, {
      ...forms,
      createdAt: serverTimestamp(),
    });
    return { id: output.id };
  };
  const deleteTransaction = async (transaction) => {
    const docRef = doc(db, "transaction", transaction.id);
    console.log(transaction, "delete");
    deleteDoc(docRef);
    // const colRef = collection(db, "transaction");
    // const transactions = await getDocs(colRef);

    // transactions.docs.forEach((transaction) => {
    //   const transactionData = transaction.data();

    //   if (transactionData.currentUser.id == currentUser.id) {
    //     const docRef = doc(db, "transaction", transaction.id);
    //     deleteDoc(docRef);
    //   }
    // });
  };

  const acceptTransaction = (transaction, currentUser, location) => {
    const docRef = doc(db, "transaction", transaction.id);
    updateDoc(docRef, {
      ...transaction,
      rider: currentUser,
      riderLocation: location,
      status: "Accepted",
    });
  };

  const completeTransaction = (transaction) => {
    const docRef = doc(db, "transaction", transaction.id);
    updateDoc(docRef, { ...transaction, status: "Completed" });
  };

  const getTransaction = (id) => {
    const docRef = doc(db, "transaction", id);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setSingleData({ ...doc.data(), id: doc.id });
      } else {
        console.log("No such document!");
      }
    });
  };

  const confirmOrderDetails = async (
    id,
    purchaseCost,
    proof,
    totalPrice,
    deliveryFee
  ) => {
    const docRef = doc(db, "transaction", id);
    await updateDoc(docRef, {
      totalPrice,
      purchaseCost,
      status: "Transit",
      deliveryFee,
      proofOfPurchase: proof,
    });
  };

  return {
    addTransaction,
    deleteTransaction,
    data,
    acceptTransaction,
    getTransaction,
    singleData,
    setSingleData,
    completeTransaction,
    confirmOrderDetails,
  };
};

export default useCrudTransaction;
