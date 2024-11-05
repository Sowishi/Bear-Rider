import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const useCrudWallet = () => {
  const [data, setData] = useState();
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Retrieve wallet data
  const getWallet = (id) => {
    const docRef = doc(db, "wallet", id);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData({ ...doc.data(), id: doc.id });
      } else {
        console.log("No such document!");
      }
    });
  };

  // Retrieve transaction history for a specific wallet
  const getTransactionHistory = async (walletId) => {
    try {
      const transactionsRef = collection(
        db,
        "wallet",
        walletId,
        "transactions"
      );
      const q = query(transactionsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactionHistory(transactions);
      return transactions;
    } catch (error) {
      console.error("Error retrieving transaction history:", error);
    }
  };

  // Handle making a payment and adding to transaction history
  const handleMakePayment = async (receiver, price, sender, serviceType) => {
    const senderRef = doc(db, "wallet", sender);
    const receiverRef = doc(db, "wallet", receiver);

    try {
      // Get the sender's current balance
      const senderDoc = await getDoc(senderRef);
      const senderBalance = senderDoc.data()?.balance;

      // Check if sender has enough balance
      if (senderBalance < price) {
        console.error("Insufficient balance");
        return { success: false, message: "Insufficient balance" };
      }

      // Calculate new balances
      const newSenderBalance = senderBalance - price;
      const receiverDoc = await getDoc(receiverRef);
      const receiverBalance = receiverDoc.data()?.balance;
      const newReceiverBalance = receiverBalance + price;

      // Update the sender's and receiver's balances
      await updateDoc(senderRef, { balance: newSenderBalance });
      await updateDoc(receiverRef, { balance: newReceiverBalance });

      // Add transaction history to both sender and receiver
      const transactionData = {
        senderId: sender,
        receiverId: receiver,
        amount: price,
        date: new Date(),
        type: "payment",
        serviceType,
      };

      // Add transaction record to the sender's wallet
      const senderTransactionsRef = collection(senderRef, "transactions");
      await addDoc(senderTransactionsRef, {
        ...transactionData,
        type: "minus",
      });

      // Add transaction record to the receiver's wallet
      const receiverTransactionsRef = collection(receiverRef, "transactions");
      await addDoc(receiverTransactionsRef, {
        ...transactionData,
        type: "plus",
      });

      return { success: true };
    } catch (error) {
      console.error("Error processing payment:", error);
      return { success: false, message: error.message };
    }
  };

  return {
    getWallet,
    data,
    handleMakePayment,
    getTransactionHistory,
    transactionHistory,
  };
};

export default useCrudWallet;
