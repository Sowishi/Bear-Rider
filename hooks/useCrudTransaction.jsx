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
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useSmokeContext } from "../utils/appContext";

const useCrudTransaction = () => {
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState();
  const { currentUser } = useSmokeContext();
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

  const cancelTransaction = async (transaction, cancellationReason) => {
    const transactionDocRef = doc(db, "transaction", transaction.id);
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      // Update the transaction document
      await updateDoc(transactionDocRef, {
        ...transaction,
        status: "Cancelled",
        cancellationReason,
      });

      // Get the current user's document data
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Increment the cancelCount by 1
        const newCancelCount = (userData.cancelCount || 0) + 1;

        // Update the user's cancelCount
        await updateDoc(userDocRef, {
          cancelCount: newCancelCount,
        });

        console.log("Transaction canceled and user's cancel count updated.");
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      console.error(
        "Error canceling transaction or updating cancel count:",
        error
      );
    }
  };

  const getTransaction = (id, setSelectedTransaction) => {
    const docRef = doc(db, "transaction", id);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        doc.data();
        setSelectedTransaction({ ...doc.data(), id: doc.id });
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

  const markNearby = async (id) => {
    const docRef = doc(db, "transaction", id);
    await updateDoc(docRef, {
      status: "Nearby",
    });
  };

  const markTransit = async (id) => {
    const docRef = doc(db, "transaction", id);
    await updateDoc(docRef, {
      status: "Transit",
    });
  };
  const confirmPickup = async (id) => {
    const docRef = doc(db, "transaction", id);
    await updateDoc(docRef, {
      status: "Pickup",
    });
  };
  const confirmDropOff = async (id) => {
    const docRef = doc(db, "transaction", id);
    await updateDoc(docRef, {
      status: "DropOff",
    });
  };

  const addTip = async (transaction, tip) => {
    const docRef = doc(db, "transaction", transaction.id);
    await updateDoc(docRef, {
      tip: tip,
      totalPrice: transaction.totalPrice + tip,
    });
  };

  const addFeedback = async (transaction, feedback) => {
    const docRef = doc(db, "transaction", transaction.id);
    await updateDoc(docRef, {
      feedback,
    });
  };

  const getRiderTransaction = (id, setTransaction) => {
    const colRef = collection(db, "transaction");

    // Construct query to fetch transactions where `rider.id` matches the provided id
    const q = query(colRef, where("rider.id", "==", id));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Include document ID for reference
      }));
      setTransaction(transactions);
    });

    // Return unsubscribe function to allow cleanup
    return unsubscribe;
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
    markNearby,
    markTransit,
    cancelTransaction,
    confirmPickup,
    confirmDropOff,
    getRiderTransaction,
    addTip,
    addFeedback,
  };
};

export default useCrudTransaction;
